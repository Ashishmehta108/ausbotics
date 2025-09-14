/*
  Warnings:

  - Added the required column `executionId` to the `WorkflowExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."WorkflowExecutionStatus" ADD VALUE 'Success';

-- AlterTable
ALTER TABLE "public"."Workflow" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."WorkflowExecution" ADD COLUMN     "executionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Execution" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "status" "public"."WorkflowExecutionStatus" NOT NULL DEFAULT 'None',
    "totalCalls" INTEGER,
    "successfulCalls" INTEGER,
    "failedCalls" INTEGER,
    "leads" JSONB,
    "tickets" JSONB,
    "appointments" JSONB,
    "summary" JSONB,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "public"."Execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Execution" ADD CONSTRAINT "Execution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
