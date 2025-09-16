import { SetStateAction } from "react";
import { WorkflowDto, WorkflowStatus } from "../types";

import { useRef } from "react";
// Updated handleSaveWorkflow
export async function handleSaveWorkflow(
  updatedWorkflow: {
    id: string;
    name: string;
    description: string;
    status: WorkflowStatus;
  },
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowDto[]>>
) {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(
      `http://localhost:5000/api/workflows/${updatedWorkflow.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedWorkflow.name,
          description: updatedWorkflow.description,
          status: updatedWorkflow.status,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === updatedWorkflow.id ? { ...w, ...data.workflow } : w
        )
      );
    } else {
      console.error("Failed to update workflow", data);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function saveWorkflow(
  id: string,
  name: string,
  description: string,
  status: WorkflowStatus,
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowDto[]>>
) {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:5000/api/workflows/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, status }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update workflow");

    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              ...data.workflow,
              status: status,
            }
          : w
      )
    );
  } catch (err) {
    console.error(err);
    alert("Error updating workflow: " + (err as Error).message);
  }
}

interface CreateWorkflowPayload {
  name: string;
  description: string;
  status: WorkflowStatus;
  subscribedUserIds: string[];
}

export async function createWorkflow(
  payload: CreateWorkflowPayload,
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowDto[]>>
) {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:5000/api/workflows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create workflow");

    setWorkflows((prev) => [
      ...prev,
      { ...data.data.workflow, latestExecutionProgress: 0 },
    ]);
  } catch (err) {
    console.error(err);
    alert("Error creating workflow: " + (err as Error).message);
  }
}
export const updateWorkflowProgress = async (
  workflowId: string,
  progress: number,
  setWorkflows: React.Dispatch<SetStateAction<WorkflowDto[]>>
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(
      `http://localhost:5000/api/workflows/${workflowId}/progress`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      }
    );
    if (!res.ok) throw new Error("Failed to update progress");
    const data = await res.json();
  } catch (err) {
    console.error("Error updating progress:", err);
  }
};
