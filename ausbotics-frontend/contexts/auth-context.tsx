"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  fullName?: string
  role: "user" | "admin" | "superAdmin"
}

interface Workflow {
  id: string
  name: string
  description: string
  status: "Active" | "Paused" | "Done" | "New"
  assignedUsers: string[]
  createdAt: string
  progress: number
}

interface Appointment {
  id: string
  name: string
  email: string
  preferredDate: string
  preferredTime: string
  purpose: string
  status: "Pending" | "Confirmed" | "Cancelled"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, fullName?: string) => Promise<boolean>
  signOut: () => void
  promoteUser: (userId: string, newRole: "user" | "admin" | "superAdmin") => boolean
  getUserWorkflows: () => Workflow[]
  getAllWorkflows: () => Workflow[]
  getAllAppointments: () => Appointment[]
  bookAppointment: (appointment: Omit<Appointment, "id" | "status" | "createdAt">) => boolean
  hasWorkflowSubscriptions: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS = [
  {
    id: "demo_user",
    email: "demo_user@example.com",
    password: "password",
    fullName: "Demo User",
    role: "user" as const,
  },
  {
    id: "demo_admin",
    email: "demo_admin@example.com",
    password: "password",
    fullName: "Demo Admin",
    role: "admin" as const,
  },
  {
    id: "demo_super",
    email: "demo_super@example.com",
    password: "password",
    fullName: "Demo Super Admin",
    role: "superAdmin" as const,
  },
]

const DEMO_WORKFLOWS: Workflow[] = [
  {
    id: "wf_1",
    name: "Customer Onboarding Calls",
    description: "Automated welcome calls for new customers",
    status: "Active",
    assignedUsers: ["demo_user", "demo_admin"],
    createdAt: "2024-01-15",
    progress: 75,
  },
  {
    id: "wf_2",
    name: "Lead Qualification Campaign",
    description: "AI-powered lead scoring and qualification calls",
    status: "Active",
    assignedUsers: ["demo_admin"],
    createdAt: "2024-01-20",
    progress: 60,
  },
  {
    id: "wf_3",
    name: "Customer Satisfaction Survey",
    description: "Post-service satisfaction and feedback collection",
    status: "Paused",
    assignedUsers: ["demo_user"],
    createdAt: "2024-01-10",
    progress: 40,
  },
  {
    id: "wf_4",
    name: "Appointment Reminder System",
    description: "Automated appointment confirmations and reminders",
    status: "Done",
    assignedUsers: ["demo_admin", "demo_super"],
    createdAt: "2024-01-05",
    progress: 100,
  },
  {
    id: "wf_5",
    name: "Sales Follow-up Sequence",
    description: "Automated follow-up calls for sales prospects",
    status: "New",
    assignedUsers: [],
    createdAt: "2024-01-25",
    progress: 0,
  },
]

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_1",
    name: "John Smith",
    email: "john.smith@example.com",
    preferredDate: "2024-02-15",
    preferredTime: "10:00 AM",
    purpose: "Product Demo",
    status: "Confirmed",
    createdAt: "2024-01-28",
  },
  {
    id: "apt_2",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    preferredDate: "2024-02-16",
    preferredTime: "2:00 PM",
    purpose: "Consultation",
    status: "Pending",
    createdAt: "2024-01-29",
  },
  {
    id: "apt_3",
    name: "Mike Davis",
    email: "mike.davis@startup.io",
    preferredDate: "2024-02-14",
    preferredTime: "11:30 AM",
    purpose: "Integration Discussion",
    status: "Confirmed",
    createdAt: "2024-01-27",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const storedUsers = localStorage.getItem("auth_users")
    if (!storedUsers) {
      localStorage.setItem("auth_users", JSON.stringify(DEMO_USERS))
    } else {
      // Merge demo users with existing users to ensure they're always available
      const existingUsers = JSON.parse(storedUsers)
      const mergedUsers = [...DEMO_USERS]

      existingUsers.forEach((existingUser: any) => {
        if (!DEMO_USERS.find((demo) => demo.email === existingUser.email)) {
          mergedUsers.push(existingUser)
        }
      })
      console.log(existingUsers)

      localStorage.setItem("auth_users", JSON.stringify(mergedUsers))
    }

    const storedWorkflows = localStorage.getItem("demo_workflows")
    if (!storedWorkflows) {
      localStorage.setItem("demo_workflows", JSON.stringify(DEMO_WORKFLOWS))
    }

    const storedAppointments = localStorage.getItem("demo_appointments")
    if (!storedAppointments) {
      localStorage.setItem("demo_appointments", JSON.stringify(DEMO_APPOINTMENTS))
    }

    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const getUserWorkflows = (): Workflow[] => {
    if (!user || typeof window === "undefined") return []

    const storedWorkflows = localStorage.getItem("demo_workflows")
    if (!storedWorkflows) return []

    const workflows: Workflow[] = JSON.parse(storedWorkflows)
    return workflows.filter((workflow) => workflow.assignedUsers.includes(user.id))
  }

  const getAllWorkflows = (): Workflow[] => {
    if (typeof window === "undefined") return []

    const storedWorkflows = localStorage.getItem("demo_workflows")
    if (!storedWorkflows) return []

    return JSON.parse(storedWorkflows)
  }

  const getAllAppointments = (): Appointment[] => {
    if (typeof window === "undefined") return []

    const storedAppointments = localStorage.getItem("demo_appointments")
    if (!storedAppointments) return []

    return JSON.parse(storedAppointments)
  }

  const bookAppointment = (appointmentData: Omit<Appointment, "id" | "status" | "createdAt">): boolean => {
    if (typeof window === "undefined") return false

    const storedAppointments = localStorage.getItem("demo_appointments")
    const appointments = storedAppointments ? JSON.parse(storedAppointments) : []

    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt_${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    }

    appointments.push(newAppointment)
    localStorage.setItem("demo_appointments", JSON.stringify(appointments))
    return true
  }

  const hasWorkflowSubscriptions = (): boolean => {
    return getUserWorkflows().length > 0
  }

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (typeof window === "undefined") return false

    const storedUsers = localStorage.getItem("auth_users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    const foundUser = users.find((u: any) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        role: foundUser.role || "user", // Default to 'user' role if not specified
      }
      setUser(userData)
      localStorage.setItem("auth_user", JSON.stringify(userData))
      return true
    }

    return false
  }

  const signUp = async (email: string, password: string, fullName?: string): Promise<boolean> => {
    if (typeof window === "undefined") return false

    const storedUsers = localStorage.getItem("auth_users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    if (users.find((u: any) => u.email === email)) {
      return false // User already exists
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      fullName,
      role: "user" as const,
    }

    users.push(newUser)
    localStorage.setItem("auth_users", JSON.stringify(users))

    return true
  }

  const promoteUser = (userId: string, newRole: "user" | "admin" | "superAdmin"): boolean => {
    if (typeof window === "undefined") return false

    const storedUsers = localStorage.getItem("auth_users")
    if (!storedUsers) return false

    const users = JSON.parse(storedUsers)
    const userIndex = users.findIndex((u: any) => u.id === userId)

    if (userIndex === -1) return false

    users[userIndex].role = newRole
    localStorage.setItem("auth_users", JSON.stringify(users))

    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole }
      setUser(updatedUser)
      localStorage.setItem("auth_user", JSON.stringify(updatedUser))
    }

    return true
  }

  const signOut = (): void => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user")
    }
  }

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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { User, Workflow, Appointment }
