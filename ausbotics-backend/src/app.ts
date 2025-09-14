import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import workflowsRoutes from "./routes/workflows.routes";
import resultsRoutes from "./routes/results.routes";
import dummyRouter from "./routes/dummy.routes";
import { errorHandler } from "./middlewares/error.middleware";
import appointmentRouter from "./routes/appointments.routes";
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/workflows", workflowsRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/dummy", dummyRouter);
app.use("/api/appointments", appointmentRouter)
app.use("/api/health", (req, res) => {
  res.status(200).json({ message: "ok" });
});

app.use(errorHandler);

export default app;
