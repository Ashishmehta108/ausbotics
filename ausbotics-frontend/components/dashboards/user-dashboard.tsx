"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Bot, LogOut, Play, Pause, CheckCircle, Clock, Home, Eye } from "lucide-react"
import { WorkflowDetailModal } from "@/components/workflow-detail-modal"
import Link from "next/link"

export function UserDashboard() {
  const { user, signOut, getUserWorkflows } = useAuth()
  const userWorkflows = getUserWorkflows()
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleViewWorkflow = (workflow: any) => {
    setSelectedWorkflow(workflow)
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
          <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your AI calling workflows</p>
        </div>

        {/* Workflow Statistics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Workflows</p>
                  <p className="text-2xl font-bold">{userWorkflows.length}</p>
                </div>
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {userWorkflows.filter((w) => w.status === "Active").length}
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
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {userWorkflows.filter((w) => w.status === "Done").length}
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
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">
                    {userWorkflows.length > 0
                      ? Math.round(userWorkflows.reduce((acc, w) => acc + w.progress, 0) / userWorkflows.length)
                      : 0}
                    %
                  </p>
                </div>
                <Progress
                  value={
                    userWorkflows.length > 0
                      ? userWorkflows.reduce((acc, w) => acc + w.progress, 0) / userWorkflows.length
                      : 0
                  }
                  className="h-2 w-8"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscribed Workflows */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Workflows</h2>
            <Badge variant="secondary">{userWorkflows.length} subscribed</Badge>
          </div>

          {userWorkflows.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Workflows Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You're not subscribed to any workflows. Contact us to get started with AI calling workflows.
                </p>
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userWorkflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                      <Badge className={getStatusColor(workflow.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(workflow.status)}
                          <span className="text-xs">{workflow.status}</span>
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{workflow.progress}%</span>
                        </div>
                        <Progress value={workflow.progress} className="h-2" />
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(workflow.createdAt).toLocaleDateString()}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleViewWorkflow(workflow)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {workflow.status === "Active" && (
                          <Button size="sm" variant="outline">
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {workflow.status === "Paused" && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <WorkflowDetailModal workflow={selectedWorkflow} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
