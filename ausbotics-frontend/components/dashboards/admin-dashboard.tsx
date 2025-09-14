"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, LogOut, Play, Pause, CheckCircle, Clock, Home, Loader2, Workflow as WorkflowIcon } from "lucide-react"
import Link from "next/link"
import { WorkflowDto } from "@/lib/types"

interface WorkflowStatusCounts {
  Active: number
  New: number
  Paused: number
  Done: number
  [key: string]: number
}

interface DashboardStats {
  totalWorkflows: number
  workflowsByStatus: WorkflowStatusCounts
}

export function AdminDashboard() {
  const { user, signOut, getAllWorkflows } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkflows: 0,
    workflowsByStatus: {
      Active: 0,
      New: 0,
      Paused: 0,
      Done: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch workflows
        const workflows = await getAllWorkflows()
        setWorkflows(workflows)

        // Calculate workflow stats
        const workflowsByStatus = workflows.reduce<WorkflowStatusCounts>(
          (acc, workflow) => {
            acc[workflow.status] = (acc[workflow.status] || 0) + 1
            return acc
          },
          { Active: 0, New: 0, Paused: 0, Done: 0 }
        )
        
        setStats({
          totalWorkflows: workflows.length,
          workflowsByStatus: {
            Active: workflowsByStatus.Active || 0,
            New: workflowsByStatus.New || 0,
            Paused: workflowsByStatus.Paused || 0,
            Done: workflowsByStatus.Done || 0,
          }
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [getAllWorkflows])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "New":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Play className="h-4 w-4 text-green-500" />
      case "Paused":
        return <Pause className="h-4 w-4 text-yellow-500" />
      case "Done":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "New":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Badge variant="secondary">Admin</Badge>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage workflows and user assignments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Workflows */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                  <p className="text-2xl font-bold">{stats.totalWorkflows}</p>
                </div>
                <WorkflowIcon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.workflowsByStatus.Active}
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Paused Workflows */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paused</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.workflowsByStatus.Paused}
                  </p>
                </div>
                <Pause className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          {/* Completed Workflows */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.workflowsByStatus.Done}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
              <CardDescription>Distribution of workflows by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.workflowsByStatus).map(([status, count]) => (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className={`h-2 w-2 rounded-full ${
                            status === 'Active' ? 'bg-green-500' : 
                            status === 'Paused' ? 'bg-yellow-500' : 
                            status === 'Done' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} 
                        />
                        <span className="text-sm font-medium">{status}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {count} ({stats.totalWorkflows > 0 ? Math.round((count / stats.totalWorkflows) * 100) : 0}%)
                      </span>
                    </div>
                    <Progress 
                      value={stats.totalWorkflows > 0 ? (count / stats.totalWorkflows) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Workflows</CardTitle>
              <CardDescription>Most recently updated workflows</CardDescription>
            </CardHeader>
            <CardContent>
              {workflows.length > 0 ? (
                <div className="space-y-4">
                  {workflows.slice(0, 5).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{workflow.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {workflow.status} • {workflow.progress}% complete
                        </p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(workflow.status).split(' ')[0]}>
                        {workflow.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No workflows found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
