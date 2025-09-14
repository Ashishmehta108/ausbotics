"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  authApi,
  workflowApi,
  appointmentApi,
  userApi,
  fetchApi,
} from "@/lib/api";
import {
  AppointmentDto,
  Role,
  UserDto,
  WorkflowDto,
  WorkflowStatus,
} from "@/lib/types";

// ---------- Context Type ----------
interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<boolean>;
  signOut: () => Promise<void>;
  promoteUser: (userId: string, newRole: Role) => Promise<boolean>;
  getUserWorkflows: () => Promise<WorkflowDto[]>;
  getAllWorkflows: () => Promise<WorkflowDto[]>;
  getAllAppointments: () => Promise<{
    data: {
      appointments: AppointmentDto[];
    };
  }>;
  bookAppointment: (
    appointment: Omit<AppointmentDto, "id" | "status" | "createdAt">
  ) => Promise<boolean>;
  hasWorkflowSubscriptions: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------- Helpers ----------
function parseUser(user: any): UserDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName ?? undefined,
    role: user.role as Role,
    refreshToken: user.refreshToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    workflows: user.workflows ?? [],
    workflowExecutions: user.workflowExecutions ?? [],
  };
}

async function loginUser(
  email: string,
  password: string
): Promise<UserDto | null> {
  const response = await authApi.login({ email, password });
  return response.data?.user ? parseUser(response.data.user) : null;
}

async function signupUser(
  email: string,
  password: string,
  fullName?: string
): Promise<UserDto | null> {
  const response = await authApi.signup({ email, password, fullName });
  return response.data?.user ? parseUser(response.data.user) : null;
}

async function fetchCurrentUser(): Promise<UserDto | null> {
  const response = await authApi.getCurrentUser();
  return response.data ? parseUser(response.data) : null;
}

// ---------- Provider ----------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed: UserDto = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        console.error("Failed to parse stored user, clearing it");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await loginUser(email, password);
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<boolean> => {
    try {
      const userData = await signupUser(email, password, fullName);
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const promoteUser = async (
    userId: string,
    newRole: Role
  ): Promise<boolean> => {
    try {
      // if (user && user.id === userId) {
      //@ts-ignore
      const updatedUser: UserDto = { ...user, role: newRole };
      console.log(userId);
      const token = localStorage.getItem("accessToken");
      const isSuccess = await fetch(
        `http://localhost:5000/api/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
          credentials: "include",
        }
      );

      console.log(await isSuccess.json());
      // setUser(updatedUser);
      // localStorage.setItem("user", JSON.stringify(updatedUser));
      return true;
      // }
      // return false;.
    } catch (error) {
      console.error("Failed to promote user:", error);
      return false;
    }
  };

  // ---------- Workflows ----------
  const getUserWorkflows = async (): Promise<WorkflowDto[]> => {
    const response = await workflowApi.getAll();
    return response ?? [];
  };

  const getAllWorkflows = async (): Promise<WorkflowDto[]> => {
    const response = await workflowApi.getAll();

    return response ?? [];
  };

  const getAllAppointments = async (): Promise<{
    data: {
      appointments: AppointmentDto[];
    };
  }> => {
    const response = await appointmentApi.getAll();

    if (!response.data) {
      return { data: { appointments: [] } };
    }

    return response.data;
  };

  const bookAppointment = async (
    appointment: Omit<AppointmentDto, "id" | "status" | "createdAt">
  ): Promise<boolean> => {
    const response = await appointmentApi.book(appointment);
    return !!response.data;
  };

  const hasWorkflowSubscriptions = async (): Promise<boolean> => {
    const workflows = await getUserWorkflows();
    return workflows.length > 0;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        promoteUser,
        getUserWorkflows,
        getAllWorkflows,
        getAllAppointments,
        bookAppointment,
        hasWorkflowSubscriptions,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------- Hook ----------
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
