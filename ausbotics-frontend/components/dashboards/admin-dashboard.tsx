"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { Bot, LogOut, Play, Home, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { WorkflowDto } from "@/lib/types";
import { ModeToggle } from "../Modetoggle";

// 🔹 Droppable container
function Droppable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

// 🔹 Draggable workflow card
function Draggable({
  id,
  children,
  dragDisabled = false,
}: {
  id: string;
  children: React.ReactNode;
  dragDisabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: dragDisabled,
  });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!dragDisabled ? listeners : {})}
      {...attributes}
    >
      {children}
    </div>
  );
}

export function AdminDashboard() {
  const { user, signOut, getAllWorkflows, getAllAppointments } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const wrkfls = await getAllWorkflows();
        setWorkflows(wrkfls.filter((w: WorkflowDto) => w.status === "Active"));

        const appts = await getAllAppointments();
        console.log(appts.data.appointments);
        setAppointments(appts.data.appointments || []);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [getAllWorkflows]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-primary rounded-xl p-2 group-hover:scale-105 transition-transform">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Ausbotics
                </span>
              </Link>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="default" className="rounded-md text-xs">
                Admin
              </Badge>
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[150px]">
                Welcome, {user?.fullName || user?.email}
              </span>
              <ModeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor active workflows and appointments
          </p>
        </div>

        <Tabs defaultValue="workflows">
          <TabsList>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          {/* Workflows */}
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-green-500" />
                  <span>Active Workflows</span>
                  <Badge variant="secondary">{workflows.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Currently running workflows in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflows.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No active workflows
                  </p>
                ) : (
                  <DndContext>
                    <Droppable id="Active">
                      <div className="space-y-4">
                        {workflows.map((workflow) => (
                          <Draggable key={workflow.id} id={workflow.id}>
                            <div className="border rounded-lg p-4 space-y-2 bg-card hover:shadow-md transition">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                  {workflow.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                >
                                  Active
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {workflow.progress}% complete
                              </p>
                            </div>
                          </Draggable>
                        ))}
                      </div>
                    </Droppable>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>System-Wide Appointments</span>
                    <Badge variant="secondary">{appointments.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    View and track all scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No appointments scheduled
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appt) => (
                          <TableRow key={appt.id}>
                            <TableCell className="font-medium">
                              {appt.name}
                            </TableCell>
                            <TableCell>{appt.email}</TableCell>
                            <TableCell>
                              {new Date(
                                appt.preferredDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{appt.preferredTime}</TableCell>
                            <TableCell>{appt.purpose}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  appt.status === "Confirmed"
                                    ? "default"
                                    : appt.status === "Pending"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {appt.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
