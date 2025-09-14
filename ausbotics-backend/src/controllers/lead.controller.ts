import { Request, Response, NextFunction } from "express";
import { prisma } from "../models/client";
import { AppError } from "../middlewares/error.middleware";
import { syncResultsFromSheet } from "../utils/syncResults";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { workflowId, userId } = req.query;

        if (workflowId && userId) {
            await syncResultsFromSheet(workflowId as string, userId as string);
        }

        const leads = await prisma.workflowExecution.findMany({
            where: {
                leadPhone: { not: null },
            },
            select: {
                leadName: true,
                leadPhone: true,
                leadEmail: true,
                workflowId: true,
                agentMessages: true,
                callbackBooked: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(leads);
    } catch (err: any) {
        next(new AppError(err.message, 500));
    }
};
