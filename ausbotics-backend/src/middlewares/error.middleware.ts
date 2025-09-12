import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 Error caught:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  // JWT-specific errors
  if (err.message === "Token has expired") {
    statusCode = 401;
    message = "Access token expired";
  } else if (err.message === "Invalid token") {
    statusCode = 401;
    message = "Invalid access token";
  } else if (err.message === "Failed to verify token") {
    statusCode = 401;
    message = "Authentication failed";
  }

  // Prisma errors
  if (typeof err.code === "string" && err.code.startsWith("P")) {
    statusCode = 400;
    message = err.meta?.cause || err.message || "Database error";
  }

  // Custom AppError
  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
