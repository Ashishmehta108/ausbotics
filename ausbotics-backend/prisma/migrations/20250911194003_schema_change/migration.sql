/*
  Warnings:

  - The `status` column on the `WorkflowExecution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."WorkflowExecutionStatus" AS ENUM ('ToolCall', 'LeadBooked', 'None');

-- AlterTable
ALTER TABLE "public"."WorkflowExecution" DROP COLUMN "status",
ADD COLUMN     "status" "public"."WorkflowExecutionStatus" NOT NULL DEFAULT 'None';
