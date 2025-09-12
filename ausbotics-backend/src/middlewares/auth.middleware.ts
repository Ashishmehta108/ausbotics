import { Request, Response, NextFunction } from 'express';
import { prisma } from '../models/client';
import { Role } from '@prisma/client';
import {
  verifyAccessToken,
  verifyRefreshToken,
  signAccessToken,
} from '../utils/jwt';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}


export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies?.refreshToken;

    if (!authHeader && !refreshToken) {
      return next(new AppError('Please log in to access this route', 401));
    }

    const accessToken = authHeader?.split(' ')[1];

    // Try to verify access token first
    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        req.user = { id: decoded.id, role: decoded.role as Role };
        return next();
      } catch (err: any) {
        // If token is just expired, try to refresh it
        if (err.message !== 'Token has expired') {
          return next(new AppError('Invalid access token', 401));
        }
      }
    }

    // If access token is expired or not provided, try to refresh it
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        
        // Find user and verify refresh token
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, role: true, refreshToken: true },
        });

        if (!user || user.refreshToken !== refreshToken) {
          return next(new AppError('Invalid refresh token', 401));
        }

        // Generate new access token
        const newAccessToken = signAccessToken({ 
          id: user.id, 
          role: user.role 
        });

        // Set new access token in response header
        res.setHeader('x-access-token', newAccessToken);
        
        // Attach user to request object
        req.user = { id: user.id, role: user.role };
        
        return next();
      } catch (err: any) {
        return next(new AppError('Invalid or expired refresh token', 401));
      }
    }

    return next(new AppError('Not authorized to access this route', 401));
  } catch (error: any) {
    return next(new AppError('Authentication failed', 401));
  }
};

// Role-based access control middleware
export const restrictTo = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};
