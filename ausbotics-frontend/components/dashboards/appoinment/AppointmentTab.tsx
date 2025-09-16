"use client";

import { useState, useRef } from "react";
import { Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { AppointmentDto } from "@/lib/types";
import { updateAppointmentStatus } from "@/lib/super-admin/appoinment";

interface AppointmentsTabProps {
  appointments: AppointmentDto[];
  setAppointments: React.Dispatch<React.SetStateAction<AppointmentDto[]>>;
  loading?: boolean;
}

export function AppointmentsTab({
  appointments,
  setAppointments,
  loading = false,
}: AppointmentsTabProps) {
  const updateTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    setAppointments((prev: any[]) =>
      prev.map((a) =>
        a.id === appointmentId ? { ...a, status: newStatus } : a
      )
    );

    if (updateTimeoutRef.current[appointmentId]) {
      clearTimeout(updateTimeoutRef.current[appointmentId]);
    }
    updateTimeoutRef.current[appointmentId] = setTimeout(async () => {
      try {
        await updateAppointmentStatus(appointmentId, newStatus);
      } catch (err) {
        console.error("Failed to update appointment:", err);
      }
    }, 200);
  };

  const renderLoadingRows = () => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <TableRow key={idx} className="animate-pulse">
        {Array.from({ length: 8 }).map((__, i) => (
          <TableCell key={i}>
            <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-full">
              &nbsp;
            </div>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <TabsContent value="appointments">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>System-Wide Appointments</span>
            <Badge variant="secondary">{appointments.length} total</Badge>
          </CardTitle>
          <CardDescription>
            Complete overview of all appointments booked through the demo page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderLoadingRows()}</TableBody>
            </Table>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-zinc-600 dark:text-zinc-300">
                No Appointments Yet
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Appointments booked through the demo page will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {appointment.name}
                    </TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>
                      {new Date(appointment.preferredDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{appointment.preferredTime}</TableCell>
                    <TableCell>{appointment.purpose}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {appointment.description || ""}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={appointment.status}
                        onValueChange={(value) =>
                          handleStatusChange(appointment.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px] focus:ring-transparent focus:ring-offset-0 border-foreground bg-muted/50 hover:bg-muted">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow> 
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
