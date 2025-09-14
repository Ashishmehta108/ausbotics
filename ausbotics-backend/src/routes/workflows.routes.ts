import { Router } from "express";
import {
  createWorkflow,
  getAllWorkflows,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
} from "../controllers/workflows.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";

import { updateWorkflowStatus } from "../controllers/workflows.controller";
import { Role } from "@prisma/client";
import {
  createWorkflowExecution,
  getWorkflowExecutions,
} from "../controllers/results.controller";
const router = Router();

router.use(authenticate);

router
  .route("/")
  .get(getAllWorkflows)
  .post(restrictTo(Role.ADMIN, Role.SUPERADMIN), createWorkflow);

router
  .route("/:id")
  .get(getWorkflow)
  .patch(restrictTo(Role.ADMIN, Role.SUPERADMIN), updateWorkflow)
  .delete(restrictTo(Role.ADMIN, Role.SUPERADMIN), deleteWorkflow);

router.post("/:id/execute", createWorkflowExecution);
router.get("/:workflowId/executions", getWorkflowExecutions);


router.patch(
  "/:id/status",
  restrictTo(Role.ADMIN, Role.SUPERADMIN),
  updateWorkflowStatus
);



export default router;
