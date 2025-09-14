import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { prisma } from "../models/client";
import { WorkflowStatus, Role } from "@prisma/client";
import { AppError } from "../middlewares/error.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

const N8N_BASE = process.env.N8N_BASE_URL || "http://localhost:5678";

export const activateWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    console.log(`Activating workflow ${id}`)
    await axios.post(`${N8N_BASE}/workflows/${id}/activate`)

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: { workflowExecutions: { orderBy: { createdAt: "desc" }, take: 1 } }
    })

    res.status(200).json({
      status: "success",
      data: { workflow, latestExecutionProgress: workflow?.workflowExecutions[0]?.progress ?? 0 }
    })
  } catch (err: any) {
    console.error(`Error activating workflow ${req.params.id}:`, err.message)
    next(new AppError(err.message, 500))
  }
}

export const deactivateWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    console.log(`Deactivating workflow ${id}`)
    await axios.post(`${N8N_BASE}/workflows/${id}/deactivate`)

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: { workflowExecutions: { orderBy: { createdAt: "desc" }, take: 1 } }
    })

    res.status(200).json({
      status: "success",
      data: { workflow, latestExecutionProgress: workflow?.workflowExecutions[0]?.progress ?? 0 }
    })
  } catch (err: any) {
    console.error(`Error deactivating workflow ${req.params.id}:`, err.message)
    next(new AppError(err.message, 500))
  }
}

export const updateWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, description, status } = req.body

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: { name, description, status },
      include: { workflowExecutions: { orderBy: { createdAt: "desc" }, take: 1 } }
    })

    res.status(200).json({
      status: "success",
      data: { workflow: updatedWorkflow, latestExecutionProgress: updatedWorkflow.workflowExecutions[0]?.progress ?? 0 }
    })
  } catch (err: any) {
    console.error(`Error updating workflow ${req.params.id}:`, err.message)
    next(new AppError(err.message, 400))
  }
}


export const createWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, status = "New" as WorkflowStatus, userId } = req.body;
    console.log(`Creating workflow ${name}`);
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        status,
        progress: 0,
        subscribedUser: { connect: { id: userId } },
      },
      include: {
        subscribedUser: { select: { id: true, email: true, fullName: true, role: true } },
      },
    });

    console.log(`Workflow created: ${workflow.id}`);
    res.status(201).json({ status: "success", data: { workflow } });
  } catch (err: any) {
    console.error("Error creating workflow:", err.message);
    next(new AppError(err.message, 400));
  }
};

export const getAllWorkflows = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Fetching all workflows...");
    const workflows = await prisma.workflow.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        progress: true,
        subscribedUser: { select: { id: true, email: true, fullName: true, role: true } },
        workflowExecutions: {
          select: { progress: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        result: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Map latest execution progress
    const workflowsWithProgress = workflows.map(w => ({
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
      const user = wf.subscribedUser
      const exec = wf.result
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

export const getWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`Fetching workflow ${id}`);
    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        subscribedUser: { select: { id: true, email: true, fullName: true, role: true } },
        result: true,
        workflowExecutions: true
      },
    });

    if (!workflow) return next(new AppError("No workflow found with that ID", 404));

    const latestExecutionProgress = workflow.workflowExecutions[0]?.progress ?? 0;
    console.log(`Workflow fetched: ${workflow.id}, latest execution progress: ${latestExecutionProgress}`);

    res.status(200).json({ status: "success", data: { workflow, latestExecutionProgress } });
  } catch (err: any) {
    console.error(`Error fetching workflow ${req.params.id}:`, err.message);
    next(new AppError(err.message, 500));
  }
};


export const deleteWorkflow = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    console.log(`Deleting workflow ${id}`);

    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return next(new AppError("No workflow found with that ID", 404));

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


export const updateWorkflowStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: WorkflowStatus };

    console.log(`Updating workflow ${id} to status ${status}`);

    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) return next(new AppError("No workflow found with that ID", 404));

    // Prevent updating completed workflows
    if (workflow.status === "Done") {
      return next(new AppError("Cannot update a completed workflow", 400));
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: { status },
      include: {
        subscribedUser: { select: { id: true, email: true, fullName: true, role: true } },
      },
    });

    console.log(`Workflow ${id} updated to ${status}`);
    res.status(200).json({ status: "success", data: { workflow: updatedWorkflow } });
  } catch (err: any) {
    console.error(`Error updating workflow status for ${req.params.id}:`, err.message);
    next(new AppError(err.message, 400));
  }
};
