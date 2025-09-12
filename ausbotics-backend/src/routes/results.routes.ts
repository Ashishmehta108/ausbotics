import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import {
  createWorkflowExecution,
  getWorkflowExecutionById,
  getWorkflowExecutions,
  updateWorkflowExecution,
} from "../controllers/results.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(["USER", "ADMIN", "SUPERADMIN"]),
  getWorkflowExecutions
);
router.post("/", authenticate, authorize(["USER"]), createWorkflowExecution);
router.get(
  "/:id",
  authenticate,
  authorize(["USER", "ADMIN", "SUPERADMIN"]),
  getWorkflowExecutionById
);
router.put(
  "/:id",
  authenticate,
  authorize(["SUPERADMIN"]),
  updateWorkflowExecution
);
// router.delete("/:id", authenticate, authorize(["SUPERADMIN"]), dele);

export default router;
