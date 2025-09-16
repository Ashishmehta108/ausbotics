import { Router } from "express";
import {
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUserbyId,
  updateMe,
  updateUserRole,
} from "../controllers/users.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import { restrictTo } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, authorize(["ADMIN", "SUPERADMIN"]), getAllUsers);

router.use(authenticate);

router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

router.use(restrictTo(Role.ADMIN, Role.SUPERADMIN));

router.get("/", getAllUsers);

router.get("/:id", getUserbyId);

router.patch("/:id/role", restrictTo(Role.SUPERADMIN), updateUserRole);

router.delete("/:id", deleteUser);

export default router;
