import { Request, Response, NextFunction } from "express";
import { prisma } from "../models/client";
import { AppError } from "../middlewares/error.middleware";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const leads = await prisma.result.findMany({
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
        });
        res.json(leads);
    } catch (err: any) {
        next(new AppError(err.message, 500));
    }
};
