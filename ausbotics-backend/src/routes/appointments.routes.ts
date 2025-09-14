import { Router } from "express";
import {
    bookAppointment,
    getAllAppointments,
    getAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getUserAppointments,
} from "../controllers/appointment.controller";
import { authenticate, restrictTo } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const appointmentRouter = Router();

appointmentRouter.post("/", bookAppointment);

appointmentRouter.use(authenticate);

appointmentRouter.get("/user/:email", getUserAppointments);

appointmentRouter.use(restrictTo(Role.SUPERADMIN));
appointmentRouter.get("/", getAllAppointments);
appointmentRouter.get("/:id", getAppointment);
appointmentRouter.patch("/:id/status", updateAppointmentStatus);
appointmentRouter.delete("/:id", deleteAppointment);

export default appointmentRouter;
