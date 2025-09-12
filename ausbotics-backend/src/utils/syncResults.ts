import { AppError } from "../middlewares/error.middleware";
import { prisma } from "../models/client";
import { fetchSheetData } from "./sheets.api";

export const syncResultsFromSheet = async (workflowId: string, userId: string) => {
    if (!workflowId) throw new AppError("workflowId is required", 400);

    const workflow = await prisma.workflow.findUnique({ where: { id: workflowId } });
    if (!workflow) throw new AppError("Workflow not found", 404);

    const sheetData = await fetchSheetData(workflow.name.replace(/\s+/g, "_"));
    const savedResults = [];

    for (const row of sheetData) {
        const existing = await prisma.workflowExecution.findFirst({
            where: {
                workflowId,
                data: JSON.stringify(row),
            },
        });


        if (!existing) {
            const result = await prisma.workflowExecution.create({
                data: {
                    workflowId,
                    userId,
                    data: JSON.stringify(row),
                    agentMessages: JSON.stringify(row.agentMessages || []),
                    callbackBooked: row.callbackBooked || false,
                    leadName: row.leadName,
                    leadPhone: row.leadPhone,
                    leadEmail: row.leadEmail,
                    progress: 0,
                },
            });
            savedResults.push(result);
        }
    }

    return {
        message: "Sheet data synced",
        count: savedResults.length,
        results: savedResults,
    };
};