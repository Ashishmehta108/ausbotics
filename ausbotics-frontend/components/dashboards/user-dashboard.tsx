"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyDashboard } from "@/components/dashboards/emptyDashboard"
import {
  Bot,
  LogOut,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Home,
  Eye,
  Loader2,
} from "lucide-react";
import { WorkflowDetailModal } from "@/components/workflow-detail-modal";
import Link from "next/link";
import { WorkflowDto } from "@/lib/types";
import UserDashboardHeader from "./user/user-dashboard-header";
import { UserDashboardSkeleton } from "./user/user-dashboard.skeleton";

interface DashboardStats {
  totalWorkflows: number;
  activeWorkflows: number;
  averageProgress: number;
}

export function UserDashboard() {
  const { user, signOut, getUserWorkflows } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    averageProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDto | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateStats = (workflows: WorkflowDto[]): DashboardStats => {
    const total = workflows.length;
    const active = workflows.filter((w) => w.status === "Active").length;
    const avgProgress =
      total > 0
        ? Math.round(
          workflows.reduce((sum, w) => sum + (w.progress || 0), 0) / total
        )
        : 0;

    return {
      totalWorkflows: total,
      activeWorkflows: active,
      averageProgress: avgProgress,
    };
  };

  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        setIsLoading(true);
        const workflows = await getUserWorkflows();
        setWorkflows(workflows);
        setStats(calculateStats(workflows));
      } catch (error) {
        console.error("Failed to load workflows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkflows();
  }, [getUserWorkflows]);

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

  const handleViewWorkflow = (workflow: WorkflowDto) => {
    setSelectedWorkflow(workflow);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <UserDashboardHeader />
        <UserDashboardSkeleton />
      </div>
    );
  }
  if (!isLoading && stats.totalWorkflows === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="bg-primary rounded-lg p-2">
                    <Bot className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">Ausbotics</span>
                </Link>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.fullName || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage workflows and user assignments</p>

          <EmptyDashboard />
        </main>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background">

      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-primary rounded-lg p-2">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Ausbotics</span>
              </Link>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.fullName || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your AI calling workflows
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Workflows
                  </p>
                  <p className="text-2xl font-bold">{workflows.length}</p>
                </div>
                <Bot className="h-8 w-8 text-muted-foreground" />
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
                    {workflows.filter((w) => w.status === "Active").length}
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
                    {workflows.filter((w) => w.status === "Done").length}
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
                    Avg Progress
                  </p>
                  <p className="text-2xl font-bold">{stats.averageProgress}%</p>
                </div>
                <Progress value={stats.averageProgress} className="h-2 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Workflows</h2>
            <Badge variant="secondary">
              {stats.totalWorkflows}{" "}
              {stats.totalWorkflows === 1 ? "workflow" : "workflows"}
            </Badge>
          </div>

          {workflows.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Workflows Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You're not subscribed to any workflows. Contact us to get
                  started with AI calling workflows.
                </p>
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {workflows.map((workflow) => (
                <Card
                  key={workflow.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {workflow.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {workflow.description || "No description available"}
                        </p>
                      </div>
                      <Badge
                        className={getStatusColor(workflow.status)}
                        variant="outline"
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(workflow.status)}
                          <span>{workflow.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">
                            {workflow.progress || 0}%
                          </span>
                        </div>
                        <Progress
                          value={workflow.progress || 0}
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">
                          {new Date(workflow.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleViewWorkflow(workflow)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <WorkflowDetailModal
        workflow={selectedWorkflow}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
