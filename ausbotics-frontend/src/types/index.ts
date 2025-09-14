import { Role } from "@/lib/types";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: Role;
  refreshToken?: string;
  createdAt: string;
  updatedAt: string;
  workflows?: Workflow[];
  workflowExecutions?: any[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  subscribedUsers?: User[];
}

export type WorkflowStatus = 'New' | 'Active' | 'Paused' | 'Done';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  purpose: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
