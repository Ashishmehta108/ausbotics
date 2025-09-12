"use client"

import { useAuth } from "@/contexts/auth-context"
import { UserDashboard } from "@/components/dashboards/user-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { SuperAdminDashboard } from "@/components/dashboards/super-admin-dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  return (

    <ProtectedRoute requireSubscription={user?.role === "user"}>
      {user?.role === "superAdmin" && <SuperAdminDashboard />}
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "user" && <UserDashboard />}
    </ProtectedRoute>
  )
}
