"use client";

import { useAuth } from "@/contexts/auth-context";
import { UserDashboard } from "@/components/dashboards/user-dashboard";
import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { SuperAdminDashboard } from "@/components/dashboards/super-admin-dashboard";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  console.log(user);

  return (
    <ProtectedRoute requireSubscription={user?.role === "USER"}>
      {user?.role.toLowerCase() === "superadmin" && <SuperAdminDashboard />}
      {user?.role.toLowerCase() === "admin" && <AdminDashboard />}
      {user?.role.toLowerCase() === "user" && <UserDashboard />}
    </ProtectedRoute>
  );
}
