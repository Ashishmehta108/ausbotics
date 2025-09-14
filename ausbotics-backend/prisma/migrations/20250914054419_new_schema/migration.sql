/*
  Warnings:

  - You are about to drop the `Execution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_WorkflowUsers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `googleSheet` to the `Workflow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscribedUserId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Execution" DROP CONSTRAINT "Execution_workflowId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkflowExecution" DROP CONSTRAINT "WorkflowExecution_executionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_WorkflowUsers" DROP CONSTRAINT "_WorkflowUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_WorkflowUsers" DROP CONSTRAINT "_WorkflowUsers_B_fkey";

-- AlterTable
ALTER TABLE "public"."Workflow" ADD COLUMN     "googleSheet" TEXT NOT NULL,
ADD COLUMN     "subscribedUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Execution";

-- DropTable
DROP TABLE "public"."_WorkflowUsers";

-- CreateTable
CREATE TABLE "public"."ExecutionResult" (
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

    CONSTRAINT "ExecutionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExecutionResult_workflowId_key" ON "public"."ExecutionResult"("workflowId");

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_subscribedUserId_fkey" FOREIGN KEY ("subscribedUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkflowExecution" ADD CONSTRAINT "WorkflowExecution_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "public"."ExecutionResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExecutionResult" ADD CONSTRAINT "ExecutionResult_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
