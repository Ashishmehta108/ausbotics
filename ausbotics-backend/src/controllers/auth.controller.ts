import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../models/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { AppError } from "../middlewares/error.middleware";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const userexists = await prisma.user.findUnique({ where: { email } });
    if (userexists) {
      return next(new AppError("User already exists", 409));
    }

    const user = await prisma.user.create({
      data: { email, password: hash },
    });
    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id, role: user.role });

    const newuser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 21 * 24 * 60 * 60 * 1000,
      });

    res.status(201).json({ accessToken, newuser });
  } catch (err: any) {
    next(new AppError(err.message, 400));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new AppError("User not found", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid password", 401));

    const accessToken = signAccessToken({ id: user.id, role: user.role });
    const refreshToken = signRefreshToken({ id: user.id, role: user.role });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, user });
  } catch (err: any) {
    next(new AppError(err.message, 500));
  }
};
