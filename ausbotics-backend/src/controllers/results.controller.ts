import { Response, NextFunction } from "express";
import { prisma } from "../models/client";
import { AppError } from "../middlewares/error.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createWorkflowExecution = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workflowId, data, summary, leads, tickets, appointments } =
      req.body;
    if (!workflowId) return next(new AppError("workflowId is required", 400));

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });
    if (!workflow) return next(new AppError("Workflow not found", 404));

    const execution = await prisma.executionResult.create({
      data: {
        workflowId,
        status: "None",
        startTime: new Date(),
        leads,
        tickets,
        appointments,
        summary,
      },
    });

    const workflowExecution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        executionId: execution.id,
        userId: req.user!.id,
        data: data ? JSON.stringify(data) : null,
        agentMessages: data?.agentMessages
          ? JSON.stringify(data.agentMessages)
          : null,
        callbackBooked: data?.callbackBooked ?? false,
        leadName: data?.leadName ?? null,
        leadPhone: data?.leadPhone ?? null,
        leadEmail: data?.leadEmail ?? null,
      },
      include: { result: true },
    });

    res.status(201).json(workflowExecution);
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
    const where = req.user!.role === "USER" ? { userId: req.user!.id } : {};

    const results = await prisma.workflowExecution.findMany({
      where,
      include: {
        result: true,
      },
    });
    console.log(results);
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
    const result = await prisma.workflowExecution.findUnique({
      where: { id },
      include: { result: true },
    });

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
    const { data, summary, leads, tickets, appointments } = req.body;

    const workflowExecution = await prisma.workflowExecution.findUnique({
      where: { id },
    });
    if (!workflowExecution)
      return next(new AppError("Execution not found", 404));

    await prisma.executionResult.update({
      where: { id: workflowExecution.executionId },
      data: {
        summary,
        leads,
        tickets,
        appointments,
      },
    });

    const updated = await prisma.workflowExecution.update({
      where: { id },
      data: {
        data: data ? JSON.stringify(data) : undefined,
      },
      include: { result: true },
    });

    res.json(updated);
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};
