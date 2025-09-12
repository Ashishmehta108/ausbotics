import { Request, Response, NextFunction } from "express";
import { prisma } from "../models/client";
import { AppError } from "../middlewares/error.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";
import { fetchSheetData } from "../utils/sheets.api";
import { syncResultsFromSheet } from "../utils/syncResults";

export const createWorkflowExecution = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workflowId, data } = req.body;
    if (!workflowId || !data)
      return next(new AppError("workflowId and data are required", 400));

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });
    if (!workflow) return next(new AppError("Workflow not found", 404));

    const result = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: req.user!.id,
        data: JSON.stringify(data),
        agentMessages: JSON.stringify(data.agentMessages || []),
        callbackBooked: data.callbackBooked || false,
        leadName: data.leadName,
        leadPhone: data.leadPhone,
        leadEmail: data.leadEmail,
        progress: 0,
      },
    });

    syncResultsFromSheet(workflow.id, req.user!.id!).catch((sheetErr) =>
      console.error("Failed to sync to Google Sheets:", sheetErr.message)
    );

    res.status(201).json(result);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const getWorkflowExecutions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user!.role;
    let results;

    if (userRole === "USER") {
      results = await prisma.workflowExecution.findMany({
        where: { userId: req.user!.id },
      });
    } else {
      results = await prisma.workflowExecution.findMany();
    }

    res.json(results);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const getWorkflowExecutionById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await prisma.workflowExecution.findUnique({ where: { id } });
    if (!result) return next(new AppError("Result not found", 404));

    if (req.user!.role === "USER" && result.userId !== req.user!.id)
      return next(new AppError("Forbidden", 403));

    res.json(result);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};

export const updateWorkflowExecution = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      data,
      progress,
      agentMessages,
      callbackBooked,
      leadName,
      leadPhone,
      leadEmail,
    } = req.body;

    const result = await prisma.workflowExecution.update({
      where: { id },
      data: {
        data: data ? JSON.stringify(data) : undefined,
        agentMessages: agentMessages
          ? JSON.stringify(agentMessages)
          : undefined,
        callbackBooked,
        leadName,
        leadPhone,
        leadEmail,
        progress,
      },
    });

    res.json(result);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};
