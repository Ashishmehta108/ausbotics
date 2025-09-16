"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragMoveEvent,
} from "@dnd-kit/core";
import { AppointmentsTab } from "./appoinment/AppointmentTab";
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
  Home,
  Users,
  Workflow as Wrkflw,
} from "lucide-react";
import { UserViewModal } from "@/components/user-view-modal";
import Link from "next/link";
import { authApi, Role } from "@/lib/api";
import { AppointmentDto, WorkflowDto, WorkflowStatus } from "@/lib/types";
import { ModeToggle } from "../Modetoggle";
import { EditWorkflowDialog } from "../workflow/updateWorkflow";
import { handleSaveWorkflow } from "@/lib/super-admin/workflowUpdates";
import { CreateWorkflowDialog } from "./createworkflows/createworkflowDialog";
import { updateWorkflowProgress } from "../../lib/super-admin/workflowUpdates";
import { GoogleSheetDialog } from "../googleSheet/GoogleSheetDialog";

export function SuperAdminDashboard() {
  const { user, signOut, promoteUser, getAllWorkflows, getAllAppointments } =
    useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDto | null>(
    null
  );
  const [isGoogleSheetOpen, setIsGoogleSheetOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [appointments, setappointments] = useState<AppointmentDto[]>([]);
  useEffect(() => {
    const LoadAppointmentandworkflow = async () => {
      const [wrkfls, appntmnts] = await Promise.all([
        getAllWorkflows(),
        getAllAppointments(),
      ]);
      console.log(await getAllAppointments(), await getAllAppointments());
      console.log(wrkfls, appntmnts);
      setWorkflows(wrkfls);
      setappointments(appntmnts.data.appointments);
    };
    LoadAppointmentandworkflow();
  }, []);

  const updateWorkflowStatus = async (
    workflowId: string,
    status: WorkflowStatus
  ) => {
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
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update workflow status");
      const data = await res.json();

      setWorkflows((prev) =>
        prev.map((wf) => (wf.id === workflowId ? data.data.workflow : wf))
      );
      return true;
    } catch (err) {
      console.error("Error updating workflow status:", err);
    }
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

    const updated = await updateWorkflowStatus(
      workflowId,
      targetStatus as WorkflowStatus
    );

    if (!updated) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === workflowId
            ? { ...w, status: oldStatus, progress: oldProgress }
            : w
        )
      );
    }
  };
  const progressTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    const getAllusers = async () => {
      //@ts-ignore
      setUsers((await authApi.getAlluser()).data?.data.users);
    };
    getAllusers();
  }, []);

  const workflowsByStatus = {
    Active: workflows.filter((w) => w.status === "Active"),
    New: workflows.filter((w) => w.status === "New"),
    Paused: workflows.filter((w) => w.status === "Paused"),
    Done: workflows.filter((w) => w.status === "Done"),
  };

  const handleViewUser = (userData: any) => {
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const success = await promoteUser(userId, newRole as Role);
    console.log(success);
    if (success) {
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    }
  };
  const handleEditWorkflow = (workflow: WorkflowDto) => {
    setSelectedWorkflow(workflow);
    setIsWorkflowModalOpen(true);
  };

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
            {/* Left side - Logo & Nav */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-primary rounded-xl p-2 transition-transform group-hover:scale-105">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Ausbotics
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="transition-colors"
                >
                  <Link href="/" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </nav>
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
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 py-8">
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Workflows
                  </p>
                  <p className="text-2xl font-bold">{workflows.length}</p>
                </div>
                <Wrkflw className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {workflowsByStatus.Active.length}
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {workflowsByStatus.Done.length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Appointments
                  </p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex  justify-between">
          <Tabs defaultValue="users" className="space-y-6 w-full">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="workflows">All Workflows</TabsTrigger>
              <TabsTrigger value="appointments">All Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              {/* Users Section with Role Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>User Management & Role Promotion</span>
                    <Badge variant="secondary">{users.length} users</Badge>
                  </CardTitle>
                  <CardDescription>
                    View, manage users and promote roles across the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        {/* <TableHead>Last Active</TableHead> */}
                        <TableHead>Actions</TableHead>
                        <TableHead>Promote Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((userData) => (
                        <TableRow key={userData.id}>
                          <TableCell className="font-medium">
                            {userData.email.split("@")[0]}
                          </TableCell>
                          <TableCell>{userData.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                userData.role === "superAdmin"
                                  ? "destructive"
                                  : userData.role === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {userData.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewUser(userData)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={userData.role}
                              onValueChange={(value) =>
                                handleRoleChange(userData.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USER">USER</SelectItem>
                                <SelectItem value="ADMIN">ADMIN</SelectItem>
                                <SelectItem value="SUPERADMIN">
                                  SUPERADMIN
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-6">
              <div className="space-y-6">
                <DndContext onDragEnd={handleDragEnd}>
                  {Object.entries(workflowsByStatus).map(
                    ([status, workflows]) => (
                      <Droppable key={status} id={status}>
                        <Card key={status}>
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              {getStatusIcon(status)}
                              <span>{status} Workflows</span>
                              <Badge variant="secondary">
                                {workflows.length}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {status === "Active" &&
                                "Currently running workflows across the system"}
                              {status === "New" &&
                                "Newly created workflows waiting to start"}
                              {status === "Paused" &&
                                "Temporarily paused workflows"}
                              {status === "Done" && "Completed workflows"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            {workflows.length === 0 ? (
                              <p className="text-muted-foreground text-center py-4">
                                No {status.toLowerCase()} workflows
                              </p>
                            ) : (
                              <div className="space-y-4">
                                {workflows.map((workflow) => (
                                  <Draggable key={workflow.id} id={workflow.id}>
                                    <div
                                      key={workflow.id}
                                      className="border rounded-lg p-4 space-y-3"
                                    >
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
                                          <div className="relative w-full">
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
                                                ) {
                                                  clearTimeout(
                                                    progressTimeoutRef.current[
                                                      workflow.id
                                                    ]
                                                  );
                                                }

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
                                            onClick={() => {
                                              setSelectedWorkflow(workflow);
                                              setIsGoogleSheetOpen(true);
                                            }}
                                          >
                                            Google Sheet
                                          </Button>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                          Created:{" "}
                                          {new Date(
                                            workflow.createdAt
                                          ).toLocaleDateString()}
                                        </span>
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
              </div>
            </TabsContent>
            <AppointmentsTab
              appointments={appointments}
              setAppointments={setappointments}
            />
          </Tabs>
          <div className="relative flex-1">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 absolute right-5"
            >
              Create Workspace
            </Button>

            <CreateWorkflowDialog
              open={isModalOpen}
              setOpen={setIsModalOpen}
              setWorkflows={setWorkflows}
            />
          </div>
        </div>
      </main>
      {/* <WorkflowDetailModal
        workflow={selectedWorkflow}
        isOpen={!!selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
      /> */}
      {selectedWorkflow && (
        <EditWorkflowDialog
          workflow={selectedWorkflow}
          setWorkflows={setWorkflows}
          isOpen={isWorkflowModalOpen}
          setIsOpen={setIsWorkflowModalOpen}
        />
      )}

      {selectedWorkflow && (
        <GoogleSheetDialog
          workflowId={selectedWorkflow.id}
          sheetUrl={selectedWorkflow.googleSheetUrl || undefined}
          open={isGoogleSheetOpen}
          setOpen={setIsGoogleSheetOpen}
        />
      )}

      <UserViewModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
