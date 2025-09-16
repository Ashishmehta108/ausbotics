import { Request, Response, NextFunction } from "express";
import { prisma } from "../models/client";
import { WorkflowStatus } from "@prisma/client";
import { AppError } from "../middlewares/error.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";
import { fetchSheetData } from "../utils/sheets.api";
export const updateWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, status, googleSheetUrl } = req.body;

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: { name, description, status, googleSheet: googleSheetUrl },
      include: {
        workflowExecutions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        workflow: updatedWorkflow,
        latestExecutionProgress:
          updatedWorkflow.workflowExecutions[0]?.progress ?? 0,
      },
    });
  } catch (err: any) {
    console.error(`Error updating workflow ${req.params.id}:`, err.message);
    next(new AppError(err.message, 400));
  }
};

export const createWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      status = "New" as WorkflowStatus,
      userId,
    } = req.body;
    console.log(`Creating workflow ${name}`);
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        status,
        progress: 0,
        subscribedUser: { connect: { id: userId } },
        googleSheet: "",
      },
      include: {
        subscribedUser: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });

    console.log(`Workflow created: ${workflow.id}`);
    res.status(201).json({ status: "success", data: { workflow } });
  } catch (err: any) {
    console.error("Error creating workflow:", err.message);
    next(new AppError(err.message, 400));
  }
};

export const getAllWorkflows = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Fetching all workflows...");
    const workflows = await prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        progress: true,
        createdAt: true,
        subscribedUser: {
          select: { id: true, email: true, fullName: true, role: true },
        },
        workflowExecutions: {
          select: { progress: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        result: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const workflowsWithProgress = workflows.map((w) => ({
      ...w,
      latestExecutionProgress: w.workflowExecutions[0]?.progress ?? 0,
    }));
    console.log("🔹 Logging workflows with progress:");

    workflowsWithProgress.forEach((wf, index) => {
      console.log(`\n📌 Workflow #${index + 1}: ${wf.name}`);
      console.log(`ID: ${wf.id}`);
      console.log(`Description: ${wf.description}`);
      console.log(`Status: ${wf.status}`);
      console.log(`Progress: ${wf.progress}%`);
      console.log(`Latest Execution Progress: ${wf.latestExecutionProgress}%`);
      const user = wf.subscribedUser;
      const exec = wf.result;
      console.log("👥 Subscribed Users:");
      console.log(`  - ${user.fullName || user.email} (${user.role})`);

      console.log("⚡ Executions:");

      console.log(`  - Execution ID: ${exec?.id}, Status: ${exec?.status}`);

      console.log("🚀 Workflow Executions Progress:");
      wf.workflowExecutions.forEach((we, i) => {
        console.log(`  - WorkflowExecution #${i + 1}: ${we.progress}%`);
      });
    });

    res.status(200).json({
      status: "success",
      results: workflowsWithProgress.length,
      data: { workflows: workflowsWithProgress },
    });
  } catch (err: any) {
    console.error("Error fetching workflows:", err.message);
    next(new AppError(err.message, 500));
  }
};

export const getWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log(`Fetching workflow ${id}`);
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        subscribedUser: {
          select: { id: true, email: true, fullName: true, role: true },
        },
        result: true,
        workflowExecutions: true,
      },
    });

    if (!workflow)
      return next(new AppError("No workflow found with that ID", 404));

    const latestExecutionProgress =
      workflow.workflowExecutions[0]?.progress ?? 0;
    console.log(
      `Workflow fetched: ${workflow.id}, latest execution progress: ${latestExecutionProgress}`
    );

    res
      .status(200)
      .json({ status: "success", data: { workflow, latestExecutionProgress } });
  } catch (err: any) {
    console.error(`Error fetching workflow ${req.params.id}:`, err.message);
    next(new AppError(err.message, 500));
  }
};

export const deleteWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log(`Deleting workflow ${id}`);

    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow)
      return next(new AppError("No workflow found with that ID", 404));

    if (!["ADMIN", "SUPERADMIN"].includes(req.user!.role)) {
      return next(new AppError("Not authorized to delete workflows", 403));
    }

    await prisma.workflow.delete({ where: { id } });
    console.log(`Workflow deleted: ${id}`);
    res.status(204).json({ status: "success", data: null });
  } catch (err: any) {
    console.error(`Error deleting workflow ${req.params.id}:`, err.message);
    next(new AppError(err.message, 500));
  }
};

export const updateWorkflowStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: WorkflowStatus };

    console.log(`Updating workflow ${id} to status ${status}`);

    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow)
      return next(new AppError("No workflow found with that ID", 404));

    if (workflow.status === "Done") {
      return next(new AppError("Cannot update a completed workflow", 400));
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: { status },
      include: {
        subscribedUser: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });

    console.log(`Workflow ${id} updated to ${status}`);
    res
      .status(200)
      .json({ status: "success", data: { workflow: updatedWorkflow } });
  } catch (err: any) {
    console.error(
      `Error updating workflow status for ${req.params.id}:`,
      err.message
    );
    next(new AppError(err.message, 400));
  }
};

export const getActiveWorkflows = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const getWorkflows = await prisma.workflow.findMany({
      where: {
        status: {
          in: ["Active"],
        },
      },
    });
    return res.status(200).json({ status: "success", data: { getWorkflows } });
  } catch (error) {
    console.error("Error fetching active workflows:", error);
    next(new AppError("Error fetching active workflows", 500));
  }
};

export const getMyWorkflows = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError("No user Id", 404));
    }
    const isUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!isUser?.id) {
      return next(new AppError("Could'nt get workflows", 404));
    }
    const myWorkflows = await prisma.workflow.findMany({
      where: { subscribedUserId: userId },
      include: {
        subscribedUser: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });
    const worklowSend = {
      myWorkflows,
    };
    return res.status(200).json({ myWorkflows });
  } catch (error) {}
};

export const updateProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { progress } = req.body;
  console.log(typeof progress);
  if (progress === undefined || typeof progress !== "number") {
    return next(new AppError("Invalid or missing progress value", 400));
  }
  const { id } = req.params;
  if (!id) {
    return next(new AppError("No workflow Id", 404));
  }
  if (progress < 0) {
    await prisma.workflow.update({
      where: { id },
      data: { status: "Active" },
    });
  }
  if (progress >= 100) {
    await prisma.workflow.update({
      where: { id },
      data: {
        status: "Done",
      },
    });
  }

  try {
    const updateProgress = await prisma.workflow.update({
      where: { id },
      data: { progress },
    });
    return res
      .status(200)
      .json({ status: "success", data: { updateProgress } });
  } catch (error) {
    console.error(
      `Error updating workflow progress for ${req.params.id}:`,
      error
    );
    next(new AppError("Error updating workflow progress", 500));
  }
};
export const getSheetData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError("No workflow Id", 404));
    }

    const workflow = await prisma.workflow.findUnique({ where: { id } });

    if (!workflow) {
      console.warn(`[getSheetData] No workflow found for id: ${id}`);
      return next(new AppError("No workflow found with that ID", 404));
    }

    const fetchGooglesheetData = await fetchSheetData(
      workflow.googleSheetName!,
      workflow.googleSheet!
    );

    return res.status(200).json({
      status: "success",
      data: { fetchGooglesheetData, sheetUrl: workflow.googleSheet },
    });
  } catch (error: any) {
    console.error("[getSheetData] Error occurred:", error.message, error.stack);
    return next(new AppError("Failed to fetch sheet data", 500));
  }
};

export const updateGoogleSheet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { googleSheetUrl, googleSheetName } = req.body;
    const { id } = req.params;
    if (!id) {
      return next(new AppError("No workflow Id", 404));
    }
    const updateSheet = await prisma.workflow.update({
      where: { id },
      data: { googleSheet: googleSheetUrl, googleSheetName },
    });
    return res.status(200).json({ status: "success", data: { updateSheet } });
  } catch (error) {
    console.error(
      `Error updating Google Sheet for workflow ${req.params.id}:`,
      error
    );
    next(new AppError("Error updating Google Sheet", 500));
  }
};
