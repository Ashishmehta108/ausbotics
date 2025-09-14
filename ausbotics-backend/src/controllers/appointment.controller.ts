import { Request, Response, NextFunction } from 'express';
import { prisma } from '../models/client';
import { AppointmentStatus, Role } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

export const bookAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, preferredDate, preferredTime, purpose } = req.body;

    if (!name || !email || !preferredDate || !preferredTime || !purpose) {
      return next(new AppError('Please provide all required fields', 400));
    }

    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        preferredDate: new Date(preferredDate),
        preferredTime,
        purpose,
        status: 'Pending',
      },
    });
    res.status(201).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

export const getAllAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status as AppointmentStatus;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

export const getAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return next(new AppError('No appointment found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        appointment,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

// Update appointment status (admin only)
export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!Object.values(AppointmentStatus).includes(status)) {
      return next(new AppError('Invalid appointment status', 400));
    }

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return next(new AppError('No appointment found with that ID', 404));
    }

    // Update status
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointment: updatedAppointment,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Delete an appointment (admin only)
export const deleteAppointment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      return next(new AppError('No appointment found with that ID', 404));
    }

    // Delete appointment
    await prisma.appointment.delete({
      where: { id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};

// Get user's appointments
export const getUserAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: { email },
      orderBy: {
        preferredDate: 'asc',
      },
    });

    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 500));
  }
};
