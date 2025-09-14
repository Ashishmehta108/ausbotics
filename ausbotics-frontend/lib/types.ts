export type WorkflowStatus =
    "Active" |
    "Paused" |
    "Done" |
    "New";


export enum WorkflowExecutionStatus {
    ToolCall = "ToolCall",
    LeadBooked = "LeadBooked",
    None = "None",
}

export enum AppointmentStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
}

export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export interface UserDto {
    id: string;
    email: string;
    fullName?: string;
    role: Role;
    refreshToken?: string;
    createdAt: string;
    updatedAt: string;
    workflows?: WorkflowDto[];
    workflowExecutions?: WorkflowExecutionDto[];
}

export interface WorkflowDto {
    id: string;
    name: string;
    description: string;
    status: WorkflowStatus;
    progress: number;
    createdAt: string;
    subscribedUsers?: UserDto[];
    workflowExecutions?: WorkflowExecutionDto[];

}

export interface WorkflowExecutionDto {
    id: string;
    workflowId: string;
    userId: string;
    agentMessages?: string;
    callbackBooked: boolean;
    leadName?: string;
    leadPhone?: string;
    leadEmail?: string;
    data?: string;
    status: WorkflowExecutionStatus;
    progress: number;
    createdAt: string;
    user?: UserDto;
    workflow?: WorkflowDto;
}

export interface AppointmentDto {
    id: string;
    name: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    purpose: string;
    status: AppointmentStatus;
    createdAt: string;
}
