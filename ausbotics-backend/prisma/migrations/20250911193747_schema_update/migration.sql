-- AlterTable
ALTER TABLE "public"."WorkflowExecution" ADD COLUMN     "status" "public"."WorkflowStatus" NOT NULL DEFAULT 'New';
