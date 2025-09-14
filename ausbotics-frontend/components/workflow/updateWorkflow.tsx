"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { WorkflowDto, WorkflowStatus } from "@/lib/types";

interface EditWorkflowDialogProps {
  workflow: WorkflowDto & { latestExecutionProgress?: number } | null;
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowDto[]>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave?: (
    workflow: WorkflowDto,
    setWorkflows: React.Dispatch<React.SetStateAction<WorkflowDto[]>>
  ) => void;
  onActivate?: (workflowId: string) => void;
  onDeactivate?: (workflowId: string) => void;
}

export function EditWorkflowDialog({
  workflow,
  setWorkflows,
  isOpen,
  setIsOpen,
  onSave,
  onActivate,
  onDeactivate,
}: EditWorkflowDialogProps) {
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [status, setStatus] = useState<WorkflowStatus>(
    workflow?.status || "New"
  );

  // Update local state when workflow changes
  useEffect(() => {
    setName(workflow?.name || "");
    setDescription(workflow?.description || "");
    setStatus(workflow?.status || "New");
  }, [workflow]);

  const handleSave = () => {
    if (!workflow) return;
    if (!name.trim()) return alert("Workflow name cannot be empty");
    const updated: WorkflowDto = { ...workflow, name, description, status };
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflow.id ? updated : w))
    );
    onSave?.(updated, setWorkflows);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Workflow</DialogTitle>
        </DialogHeader>

        {workflow ? (
          <div className="flex flex-col gap-4 mt-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workflow name"
              autoFocus
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Workflow description"
              className="min-h-[120px]"
            />

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as WorkflowStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Latest Execution Progress:
              </p>
              <Progress value={workflow.latestExecutionProgress || 0} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No workflow selected.</p>
        )}

        <DialogFooter className="flex justify-between gap-2 mt-4">
          {workflow && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => workflow && onActivate?.(workflow.id)}
              >
                Activate
              </Button>
              <Button
                variant="outline"
                onClick={() => workflow && onDeactivate?.(workflow.id)}
              >
                Deactivate
              </Button>
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
