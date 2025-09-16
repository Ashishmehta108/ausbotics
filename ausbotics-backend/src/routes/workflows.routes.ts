import { Router } from "express";
import {
  createWorkflow,
  getAllWorkflows,
  getWorkflow,
  updateWorkflow,
  deleteWorkflow,
  updateProgress,
  getSheetData,
  updateGoogleSheet,
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

router.get("/myworkflows", getAllWorkflows);

router.get("/:id/sheet", restrictTo(Role.USER, Role.SUPERADMIN), getSheetData);
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

router.patch("/:id/status", restrictTo(Role.SUPERADMIN), updateWorkflowStatus);

router.patch("/:id/progress", restrictTo(Role.SUPERADMIN), updateProgress);

router.patch("/:id/sheet", restrictTo(Role.SUPERADMIN), updateGoogleSheet);

export default router;
