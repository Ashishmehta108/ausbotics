"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  BarChart3,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react"

interface WorkflowDetailModalProps {
  workflow: any
  isOpen: boolean
  onClose: () => void
}

// Mock n8n workflow output data
const generateMockOutput = (workflowName: string) => {
  const baseData = {
    executionId: `exec_${Math.random().toString(36).substr(2, 9)}`,
    startTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    endTime: new Date().toISOString(),
    status: "success",
    totalCalls: Math.floor(Math.random() * 50) + 10,
    successfulCalls: Math.floor(Math.random() * 40) + 8,
    failedCalls: Math.floor(Math.random() * 5) + 1,
  }

  const mockOutputs = {
    "Lead Generation Calls": {
      ...baseData,
      leads: [
        { name: "John Smith", phone: "+1-555-0123", status: "Interested", score: 8.5 },
        { name: "Sarah Johnson", phone: "+1-555-0124", status: "Callback Requested", score: 7.2 },
        { name: "Mike Davis", phone: "+1-555-0125", status: "Not Interested", score: 2.1 },
        { name: "Emily Brown", phone: "+1-555-0126", status: "Qualified", score: 9.1 },
      ],
      summary: {
        qualifiedLeads: 2,
        callbacksScheduled: 1,
        averageCallDuration: "3m 24s",
        conversionRate: "32%",
      },
    },
    "Customer Support Automation": {
      ...baseData,
      tickets: [
        { id: "TK-001", issue: "Billing Question", resolution: "Resolved", duration: "2m 15s" },
        { id: "TK-002", issue: "Technical Support", resolution: "Escalated", duration: "5m 42s" },
        { id: "TK-003", issue: "Account Access", resolution: "Resolved", duration: "1m 33s" },
      ],
      summary: {
        resolvedTickets: 2,
        escalatedTickets: 1,
        averageResolutionTime: "3m 10s",
        customerSatisfaction: "4.2/5",
      },
    },
    "Appointment Scheduling": {
      ...baseData,
      appointments: [
        { name: "Alex Wilson", date: "2024-01-20", time: "10:00 AM", status: "Confirmed" },
        { name: "Lisa Chen", date: "2024-01-20", time: "2:30 PM", status: "Confirmed" },
        { name: "Robert Taylor", date: "2024-01-21", time: "9:15 AM", status: "Pending" },
      ],
      summary: {
        scheduledAppointments: 3,
        confirmedAppointments: 2,
        pendingConfirmation: 1,
        bookingRate: "78%",
      },
    },
  }

  return (
    mockOutputs[workflowName as keyof typeof mockOutputs] || {
      ...baseData,
      data: { message: "Workflow execution completed successfully", processed: baseData.totalCalls },
      summary: {
        totalProcessed: baseData.totalCalls,
        successRate: "85%",
        averageDuration: "2m 45s",
      },
    }
  )
}

export function WorkflowDetailModal({ workflow, isOpen, onClose }: WorkflowDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)

  if (!workflow) return null

  const mockOutput = generateMockOutput(workflow.name)

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

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStatusIcon(workflow.status)}
            <span>{workflow.name}</span>
            <Badge variant="secondary">{workflow.status}</Badge>
          </DialogTitle>
          <DialogDescription>{workflow.description}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="output">Live Output</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workflow Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Run:</span>
                      <span>{new Date(mockOutput.endTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Execution ID:</span>
                      <span className="font-mono text-xs">{mockOutput.executionId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{mockOutput.successfulCalls}</div>
                      <div className="text-xs text-muted-foreground">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{mockOutput.failedCalls}</div>
                      <div className="text-xs text-muted-foreground">Failed</div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-lg font-semibold">{mockOutput.totalCalls}</div>
                    <div className="text-xs text-muted-foreground">Total Executions</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="output" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Live Workflow Output</h3>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-4">
                {/* Execution Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Execution Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      {JSON.stringify(
                        {
                          executionId: mockOutput.executionId,
                          status: mockOutput.status,
                          startTime: mockOutput.startTime,
                          endTime: mockOutput.endTime,
                          summary: mockOutput.summary,
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </CardContent>
                </Card>

                {/* Detailed Output */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Detailed Results</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
                      {JSON.stringify(mockOutput, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Call Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate:</span>
                    <span className="font-semibold text-green-600">
                      {Math.round((mockOutput.successfulCalls / mockOutput.totalCalls) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Duration:</span>
                    <span className="font-semibold">{mockOutput.summary?.averageCallDuration || "2m 45s"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Runtime:</span>
                    <span className="font-semibold">
                      {Math.round(
                        (new Date(mockOutput.endTime).getTime() - new Date(mockOutput.startTime).getTime()) / 60000,
                      )}
                      m
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Workflow Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate:</span>
                    <span className="font-semibold text-blue-600">{mockOutput.summary?.conversionRate || "85%"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quality Score:</span>
                    <span className="font-semibold">{mockOutput.summary?.customerSatisfaction || "4.2/5"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Efficiency:</span>
                    <span className="font-semibold text-green-600">High</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
