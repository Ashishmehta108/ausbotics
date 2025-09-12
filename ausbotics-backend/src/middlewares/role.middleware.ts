import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppError } from "./error.middleware";
import { Role } from "@prisma/client";

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized: no user info found", 401));
    }

    const userRole = req.user.role as Role;

    if (!roles.includes(userRole)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }

    return next();
  };
};
