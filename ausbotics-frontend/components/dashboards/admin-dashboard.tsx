"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Bot, LogOut, Workflow, Play, Pause, CheckCircle, Clock, Home } from "lucide-react"
import { UserViewModal } from "@/components/user-view-modal"
import Link from "next/link"

// Mock users data with names for display
const USER_NAMES: { [key: string]: string } = {
  demo_user: "Demo User",
  demo_admin: "Demo Admin",
  demo_super: "Demo Super Admin",
}

export function AdminDashboard() {
  const { user, signOut, getAllWorkflows } = useAuth()
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allWorkflows = getAllWorkflows()

  // Group workflows by status
  const workflowsByStatus = {
    Active: allWorkflows.filter((w) => w.status === "Active"),
    New: allWorkflows.filter((w) => w.status === "New"),
    Paused: allWorkflows.filter((w) => w.status === "Paused"),
    Done: allWorkflows.filter((w) => w.status === "Done"),
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

  const handleViewUser = (userData: any) => {
    setSelectedUser(userData)
    setIsModalOpen(true)
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
              <Badge variant="default">Admin</Badge>
              <span className="text-sm text-muted-foreground">Welcome, {user?.fullName || user?.email}</span>
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
          <p className="text-muted-foreground mt-2">Manage company workflows and user assignments</p>
        </div>

        {/* Workflow Statistics */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                  <p className="text-2xl font-bold">{allWorkflows.length}</p>
                </div>
                <Workflow className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{workflowsByStatus.Active.length}</p>
                </div>
                <Play className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{workflowsByStatus.Done.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Workflows by Status */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Company Workflows</h2>
            <Badge variant="secondary">{allWorkflows.length} total workflows</Badge>
          </div>

          {Object.entries(workflowsByStatus).map(([status, workflows]) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getStatusIcon(status)}
                  <span>{status} Workflows</span>
                  <Badge variant="secondary">{workflows.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {status === "Active" && "Currently running workflows with user assignments"}
                  {status === "New" && "Newly created workflows waiting to start"}
                  {status === "Paused" && "Temporarily paused workflows"}
                  {status === "Done" && "Completed workflows"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workflows.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No {status.toLowerCase()} workflows</p>
                ) : (
                  <div className="space-y-4">
                    {workflows.map((workflow) => (
                      <div key={workflow.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">{workflow.name}</h4>
                            <p className="text-sm text-muted-foreground">{workflow.description}</p>
                          </div>
                          <Badge className={getStatusColor(workflow.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(workflow.status)}
                              <span className="text-xs">{workflow.status}</span>
                            </div>
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{workflow.progress}%</span>
                            </div>
                            <Progress value={workflow.progress} className="h-2" />
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Assigned Users:</p>
                            <div className="flex flex-wrap gap-1">
                              {workflow.assignedUsers.length === 0 ? (
                                <Badge variant="outline">No users assigned</Badge>
                              ) : (
                                workflow.assignedUsers.map((userId) => (
                                  <Badge key={userId} variant="secondary">
                                    {USER_NAMES[userId] || userId}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                          <span>ID: {workflow.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* User View Modal */}
      <UserViewModal user={selectedUser} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
