"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

import { AppointmentsTab } from "./appoinment/AppointmentTab";
import {
  Bot,
  LogOut,
  Eye,
  Calendar,
  Shield,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  Workflow as Wrkflw,
} from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../Modetoggle";
import { EditWorkflowDialog } from "../workflow/updateWorkflow";
import { CreateWorkflowDialog } from "./createworkflows/createworkflowDialog";
import { updateWorkflowProgress } from "@/lib/super-admin/workflowUpdates";
import { authApi, Role } from "@/lib/api";
import { AppointmentDto, WorkflowDto } from "@/lib/types";
import { UserViewModal } from "@/components/user-view-modal";

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

export function SuperAdminDashboard() {
  const { user, signOut, promoteUser, getAllWorkflows, getAllAppointments } =
    useAuth();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDto | null>(
    null
  );
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [loadingSheet, setLoadingSheet] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<{
    workflow: WorkflowDto;
    data: any[];
    url: string;
  } | null>(null);

  const progressTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    const loadData = async () => {
      const [wrkfls, appnts] = await Promise.all([
        getAllWorkflows(),
        getAllAppointments(),
      ]);
      setWorkflows(wrkfls);
      setAppointments(appnts.data.appointments || []);
    };
    loadData();

    const fetchUsers = async () => {
      //@ts-ignore
      const usersResp = (await authApi.getAlluser())?.data?.data.users;
      setUsers(usersResp || []);
    };
    fetchUsers();
  }, []);

  const workflowsByStatus = {
    Active: workflows.filter((w) => w.status === "Active"),
    New: workflows.filter((w) => w.status === "New"),
    Paused: workflows.filter((w) => w.status === "Paused"),
    Done: workflows.filter((w) => w.status === "Done"),
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const success = await promoteUser(userId, newRole as Role);
    if (success) {
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  };

  const handleViewUser = (userData: any) => setSelectedUser(userData);
  const handleEditWorkflow = (workflow: WorkflowDto) => {
    setSelectedWorkflow(workflow);
    setIsWorkflowModalOpen(true);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;
    const workflowId = active.id;
    const targetStatus = over.id;
    const oldWorkflow = workflows.find((w) => w.id === workflowId);
    if (!oldWorkflow) return;
    const oldStatus = oldWorkflow.status;
    const oldProgress = oldWorkflow.progress;

    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === workflowId
          ? {
              ...w,
              status: targetStatus,
              progress: targetStatus === "Done" ? 100 : w.progress,
            }
          : w
      )
    );

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/workflows/${workflowId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: targetStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();
      setWorkflows((prev) =>
        prev.map((w) => (w.id === workflowId ? data.data.workflow : w))
      );
    } catch {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflowId
            ? { ...w, status: oldStatus, progress: oldProgress }
            : w
        )
      );
    }
  };

  const openSheetView = async (workflow: WorkflowDto) => {
    setLoadingSheet(workflow.id);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/workflows/${workflow.id}/sheet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setSheetView({
        workflow,
        data: data.data.fetchGooglesheetData || [],
        url: data.data.sheetUrl || "#",
      });
    } catch (err) {
      console.error(err);
      setSheetView({ workflow, data: [], url: "#" });
    } finally {
      setLoadingSheet(null);
    }
  };

  const closeSheetView = () => setSheetView(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Play className="h-4 w-4 text-green-500" />;
      case "Paused":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case "Done":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "New":
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "New":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-primary rounded-xl p-2 transition-transform group-hover:scale-105">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Ausbotics
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="destructive" className="rounded-md text-xs">
                Super Admin
              </Badge>
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[150px]">
                Welcome, {user?.fullName || user?.email}
              </span>
              <ModeToggle />
              <Button
                variant="default"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Full system administration, user management, and workflow oversight
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Workflows
                </p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <Wrkflw className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {workflowsByStatus.Active.length}
                </p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {workflowsByStatus.Done.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Appointments
                </p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Sheet View */}
        {sheetView ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button onClick={closeSheetView} variant="outline">
                &larr; Back
              </Button>
              <h2 className="text-xl font-bold">{sheetView.workflow.name}</h2>
              <a
                href={sheetView.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Open Sheet in Google
              </a>
            </div>

            {loadingSheet ? (
              <p className="text-muted-foreground">Loading sheet...</p>
            ) : sheetView.data.length ? (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(sheetView.data[0]).map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetView.data.map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.values(row).map((val, i) => (
                            <TableCell key={i}>{val}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        ) : (
          // --- Normal Tabs ---
          <Tabs defaultValue="users" className="space-y-6 w-full">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="workflows">All Workflows</TabsTrigger>
              <TabsTrigger value="appointments">All Appointments</TabsTrigger>
            </TabsList>

            {/* Users */}
            <TabsContent value="users">
              {" "}
              <Card>
                {" "}
                <CardHeader>
                  {" "}
                  <CardTitle className="flex items-center space-x-2">
                    {" "}
                    <Shield className="h-5 w-5" />{" "}
                    <span>User Management & Role Promotion</span>{" "}
                    <Badge variant="secondary">{users.length} users</Badge>{" "}
                  </CardTitle>{" "}
                  <CardDescription>
                    {" "}
                    View, manage users and promote roles across the system{" "}
                  </CardDescription>{" "}
                </CardHeader>{" "}
                <CardContent>
                  {" "}
                  <Table>
                    {" "}
                    <TableHeader>
                      {" "}
                      <TableRow>
                        {" "}
                        <TableHead>Name</TableHead> <TableHead>Email</TableHead>{" "}
                        <TableHead>Current Role</TableHead>{" "}
                        <TableHead>Actions</TableHead>{" "}
                        <TableHead>Promote Role</TableHead>{" "}
                      </TableRow>{" "}
                    </TableHeader>{" "}
                    <TableBody>
                      {" "}
                      {users.map((userData) => (
                        <TableRow key={userData.id}>
                          {" "}
                          <TableCell className="font-medium">
                            {" "}
                            {userData.email.split("@")[0]}{" "}
                          </TableCell>{" "}
                          <TableCell>{userData.email}</TableCell>{" "}
                          <TableCell>
                            {" "}
                            <Badge
                              variant={
                                userData.role === "superAdmin"
                                  ? "destructive"
                                  : userData.role === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {" "}
                              {userData.role}{" "}
                            </Badge>{" "}
                          </TableCell>{" "}
                          <TableCell>
                            {" "}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(userData)}
                            >
                              {" "}
                              <Eye className="h-4 w-4 mr-1" /> View{" "}
                            </Button>{" "}
                          </TableCell>{" "}
                          <TableCell>
                            {" "}
                            <Select
                              value={userData.role}
                              onValueChange={(value) =>
                                handleRoleChange(userData.id, value)
                              }
                            >
                              {" "}
                              <SelectTrigger className="w-32">
                                {" "}
                                <SelectValue />{" "}
                              </SelectTrigger>{" "}
                              <SelectContent>
                                {" "}
                                <SelectItem value="USER">USER</SelectItem>{" "}
                                <SelectItem value="ADMIN">ADMIN</SelectItem>{" "}
                                <SelectItem value="SUPERADMIN">
                                  {" "}
                                  SUPERADMIN{" "}
                                </SelectItem>{" "}
                              </SelectContent>{" "}
                            </Select>{" "}
                          </TableCell>{" "}
                        </TableRow>
                      ))}{" "}
                    </TableBody>{" "}
                  </Table>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </TabsContent>
            {/* Workflows */}
            <TabsContent value="workflows" className="space-y-6">
              <DndContext onDragEnd={handleDragEnd}>
                {Object.entries(workflowsByStatus).map(
                  ([status, workflowsList]) => (
                    <Droppable key={status} id={status}>
                      <Card className="mb-4">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            <span>{status} Workflows</span>
                            <Badge variant="secondary">
                              {workflowsList.length}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {status === "Active"
                              ? "Currently running workflows"
                              : status === "New"
                              ? "Newly created workflows"
                              : status === "Paused"
                              ? "Paused workflows"
                              : "Completed workflows"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {workflowsList.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">
                              No {status.toLowerCase()} workflows
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {workflowsList.map((workflow) => (
                                <Draggable key={workflow.id} id={workflow.id}>
                                  <div className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h4 className="font-semibold">
                                          {workflow.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {workflow.description}
                                        </p>
                                      </div>
                                      <Badge
                                        className={getStatusColor(
                                          workflow.status
                                        )}
                                      >
                                        <div className="flex items-center space-x-1">
                                          {getStatusIcon(workflow.status)}
                                          <span className="text-xs">
                                            {workflow.status}
                                          </span>
                                        </div>
                                      </Badge>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                      <div>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>Progress</span>
                                          <span>{workflow.progress}%</span>
                                        </div>
                                        <Slider
                                          value={[workflow.progress]}
                                          max={100}
                                          step={1}
                                          className="w-full h-2 cursor-pointer"
                                          onValueChange={(value) => {
                                            const newProgress = value[0];
                                            setWorkflows((prev) =>
                                              prev.map((w) =>
                                                w.id === workflow.id
                                                  ? {
                                                      ...w,
                                                      progress: newProgress,
                                                    }
                                                  : w
                                              )
                                            );
                                            if (
                                              progressTimeoutRef.current[
                                                workflow.id
                                              ]
                                            )
                                              clearTimeout(
                                                progressTimeoutRef.current[
                                                  workflow.id
                                                ]
                                              );
                                            progressTimeoutRef.current[
                                              workflow.id
                                            ] = setTimeout(() => {
                                              updateWorkflowProgress(
                                                workflow.id,
                                                newProgress,
                                                setWorkflows
                                              );
                                            }, 200);
                                          }}
                                        />
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Button
                                          onPointerDown={(e) =>
                                            e.stopPropagation()
                                          }
                                          onClick={() =>
                                            handleEditWorkflow(workflow)
                                          }
                                        >
                                          Edit workflow
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onPointerDown={(e) =>
                                            e.stopPropagation()
                                          }
                                          onClick={() =>
                                            openSheetView(workflow)
                                          }
                                        >
                                          Workspace
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                      Created:{" "}
                                      {new Date(
                                        workflow.createdAt
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </Draggable>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Droppable>
                  )
                )}
              </DndContext>
            </TabsContent>

            {/* Appointments */}
            <TabsContent value="appointments">
              <AppointmentsTab appointments={appointments} />
            </TabsContent>
          </Tabs>
        )}

        {selectedWorkflow && (
          <EditWorkflowDialog
            workflow={selectedWorkflow}
            open={isWorkflowModalOpen}
            setOpen={setIsWorkflowModalOpen}
            onSave={(updatedWorkflow) => {
              setWorkflows((prev) =>
                prev.map((w) =>
                  w.id === updatedWorkflow.id ? updatedWorkflow : w
                )
              );
              setIsWorkflowModalOpen(false);
            }}
          />
        )}

        {showCreateDialog && (
          <CreateWorkflowDialog
            open={showCreateDialog}
            setOpen={setShowCreateDialog}
            onCreate={(newWorkflow) =>
              setWorkflows((prev) => [...prev, newWorkflow])
            }
          />
        )}

        {selectedUser && (
          <UserViewModal
            user={selectedUser}
            open={!!selectedUser}
            setOpen={setSelectedUser}
          />
        )}
      </main>
    </div>
  );
}
