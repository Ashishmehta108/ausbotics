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
import { Label } from "@/components/ui/label";
import { WorkflowDto, WorkflowStatus } from "@/lib/types";
// import { saveWorkflow, updateWorkflowProgress } from "@/lib/api/
// i;
import {
  saveWorkflow,
  updateWorkflowProgress,
} from "../../lib/super-admin/workflowUpdates";
interface EditWorkflowDialogProps {
  workflow:
    | (WorkflowDto & {
        latestExecutionProgress?: number;
        googleSheetUrl?: string;
      })
    | null;
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowDto[]>>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function EditWorkflowDialog({
  workflow,
  setWorkflows,
  isOpen,
  setIsOpen,
}: EditWorkflowDialogProps) {
  const [name, setName] = useState(workflow?.name || "");
  const [description, setDescription] = useState(workflow?.description || "");
  const [status, setStatus] = useState<WorkflowStatus>(
    workflow?.status || "New"
  );
  const [progress, setProgress] = useState(
    workflow?.latestExecutionProgress || 0
  );
  const [googleSheetUrl, setGoogleSheetUrl] = useState(
    workflow?.googleSheetUrl || ""
  );

  useEffect(() => {
    setName(workflow?.name || "");
    setDescription(workflow?.description || "");
    setStatus(workflow?.status || "New");
    setProgress(workflow?.progress || 0);
    setGoogleSheetUrl(workflow?.googleSheetUrl || "");
  }, [workflow]);

  const handleSave = async () => {
    if (!workflow) return;
    if (!name.trim()) return alert("Workflow name cannot be empty");

    await saveWorkflow(workflow.id, name, description, status, setWorkflows);

    await updateWorkflowProgress(workflow.id, progress, setWorkflows);

    setIsOpen(false);
  };

  const inputStyle = `
  rounded-xl 
  border border-zinc-300 dark:border-zinc-700 
  bg-transparent 
  focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!outline-none 
  hover:border-zinc-400 dark:hover:border-zinc-600 
  transition-colors
`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg w-full sm:rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            ✨ Edit Workflow
          </DialogTitle>
        </DialogHeader>

        {workflow ? (
          <div className="flex flex-col gap-4 mt-3">
            {/* Workflow Name */}
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workflow name"
                autoFocus
                className={inputStyle}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Workflow description"
                className={`${inputStyle} min-h-[100px]`}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as WorkflowStatus)}
              >
                <SelectTrigger className={inputStyle}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Execution Progress */}
            <div className="flex flex-col gap-1">
              <Label>Execution Progress</Label>
              <Input
                type="number"
                value={progress}
                onChange={(e) => {
                  const val = Math.min(
                    100,
                    Math.max(0, Number(e.target.value))
                  );
                  setProgress(val);
                }}
                min={0}
                max={100}
                step={1}
                className={inputStyle}
              />
              <Progress value={progress} className="h-2 rounded-full mt-1" />
              <p className="text-xs text-muted-foreground text-right">
                {progress}%
              </p>
            </div>

            {/* Google Sheet Link */}
            <div className="flex flex-col gap-1">
              <Label>Google Sheet Link</Label>
              <Input
                type="url"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/..."
                className={inputStyle}
              />
              {googleSheetUrl && (
                <a
                  href={googleSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Open Google Sheet ↗
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No workflow selected.</p>
        )}

        {/* Footer */}
        <DialogFooter className="flex justify-between gap-3 mt-5">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border border-zinc-300 dark:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none border border-zinc-300 dark:border-zinc-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
