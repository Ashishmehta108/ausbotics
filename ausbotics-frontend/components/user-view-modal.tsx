"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, CheckCircle } from "lucide-react";
import { workflowApi } from "@/lib/api";
import type { WorkflowDto } from "@/lib/types";

interface UserViewModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UserViewModal({ user, isOpen, onClose }: UserViewModalProps) {
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !isOpen) return;

    const fetchWorkflows = async () => {
      setLoading(true);
      setError(null);
      try {
        const allWorkflows = await workflowApi.getAll();
        // Filter workflows assigned to this user
        console.log(allWorkflows)
        const userWorkflows = allWorkflows?.filter(wf =>
          wf.assignedUsers?.some(u => u.id === user.id)
        );
        setWorkflows(userWorkflows || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load workflows");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [user, isOpen]);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>User Dashboard View: {user.fullName || user.email}</span>
            <Badge
              variant={user.role === "SUPERADMIN" ? "destructive" : user.role === "ADMIN" ? "default" : "secondary"}
            >
              {user.role}
            </Badge>
          </DialogTitle>
          <DialogDescription>Viewing {user.email}'s dashboard as they would see it</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{user.fullName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Active</p>
                  <p className="text-sm text-muted-foreground">{user.lastActive || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Workflows */}
          <Card>
            <CardHeader>
              <CardTitle>User's Subscribed Workflows</CardTitle>
              <CardDescription>Workflows as seen by this user</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading workflows...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : workflows.length === 0 ? (
                <p>No workflows assigned to this user.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {workflows.map((workflow) => (
                    <Card key={workflow.id} className="border-muted">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{workflow.name}</CardTitle>
                          <div className="flex items-center space-x-1">
                            {workflow.status === "Active" && <Play className="h-4 w-4 text-green-500" />}
                            {workflow.status === "Paused" && <Pause className="h-4 w-4 text-yellow-500" />}
                            {workflow.status === "Done" && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            <span className="text-xs capitalize text-muted-foreground">{workflow.status}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{workflow.progress}%</span>
                          </div>
                          <Progress value={workflow.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
