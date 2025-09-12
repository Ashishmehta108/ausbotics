import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { prisma } from "../models/client";
import { WorkflowStatus, Role } from "@prisma/client";
import { AppError } from "../middlewares/error.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

const N8N_BASE = process.env.N8N_BASE_URL || "http://localhost:5678";

export const activateWorkflow = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await axios.post(`${N8N_BASE}/workflows/${id}/activate`);
    res.json({ message: "Workflow activated" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deactivateWorkflow = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await axios.post(`${N8N_BASE}/workflows/${id}/deactivate`);
    res.json({ message: "Workflow deactivated" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, status = "New" as WorkflowStatus } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        status,
        progress: 0,
        assignedUsers: {
          connect: { id: userId },
        },
      },
      include: {
        assignedUsers: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        workflow,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get all workflows
export const getAllWorkflows = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workflows = await prisma.workflow.findMany({
      include: {
        assignedUsers: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
        results: {
          select: {
            id: true,
            status: true,
            progress: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      results: workflows.length,
      data: {
        workflows,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getWorkflow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      include: {
        assignedUsers: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
        results: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!workflow) {
      return next(new AppError("No workflow found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        workflow,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const updateWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!existingWorkflow) {
      return next(new AppError("No workflow found with that ID", 404));
    }

    if (
      status &&
      req.user?.role !== Role.ADMIN &&
      req.user?.role !== Role.SUPERADMIN
    ) {
      return next(
        new AppError("Not authorized to update workflow status", 403)
      );
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        name,
        description,
        status,
      },
      include: {
        assignedUsers: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        workflow: updatedWorkflow,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const deleteWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!existingWorkflow) {
      return next(new AppError("No workflow found with that ID", 404));
    }

    if (req.user?.role !== Role.ADMIN && req.user?.role !== Role.SUPERADMIN) {
      return next(new AppError("Not authorized to delete workflows", 403));
    }

    await prisma.workflow.delete({
      where: { id },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

