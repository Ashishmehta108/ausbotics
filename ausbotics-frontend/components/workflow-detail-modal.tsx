"use client"

import { useState, useEffect } from "react"
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

export function WorkflowDetailModal({ workflow, isOpen, onClose }: WorkflowDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [executions, setExecutions] = useState<any[]>([])
  const [latestExecution, setLatestExecution] = useState<any | null>(null)
  useEffect(() => {
    if (isOpen && workflow?.id) {
      fetchExecutions()
    }
  }, [isOpen, workflow?.id])

  if (!workflow) return null

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

  const fetchExecutions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows/${workflow.id}/executions`, {
        credentials: "include",
      })
      const data = await res.json()
      setExecutions(data || [])
      setLatestExecution(data?.[0] || null)
    } catch (err) {
      console.error("Failed to fetch executions", err)
    }
  }


  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchExecutions()
    setTimeout(() => setIsRefreshing(false), 1000)
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
                    <span className="text-sm">{workflow.progress ?? 0}%</span>
                  </div>
                  <Progress value={workflow.progress ?? 0} className="h-2" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Run:</span>
                      <span>
                        {latestExecution?.execution?.endTime
                          ? new Date(latestExecution.execution.endTime).toLocaleString()
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Execution ID:</span>
                      <span className="font-mono text-xs">
                        {latestExecution?.execution?.id || "—"}
                      </span>
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
                      <div className="text-2xl font-bold text-green-600">
                        {latestExecution?.execution?.leads?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {latestExecution?.execution?.tickets?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Tickets</div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <div className="text-lg font-semibold">
                      {executions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Runs</div>
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
              {latestExecution ? (
                <div className="space-y-4">
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
                            id: latestExecution.execution.id,
                            status: latestExecution.execution.status,
                            startTime: latestExecution.execution.startTime,
                            endTime: latestExecution.execution.endTime,
                            summary: latestExecution.execution.summary,
                          },
                          null,
                          2
                        )}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Detailed Results</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(latestExecution, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No executions found</p>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(latestExecution?.execution?.summary || {}, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
