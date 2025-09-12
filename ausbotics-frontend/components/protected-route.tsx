"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireSubscription?: boolean
  allowedRoles?: ("user" | "admin" | "superAdmin")[]
}

export function ProtectedRoute({
  children,
  requireSubscription = false,
  allowedRoles = ["user", "admin", "superAdmin"],
}: ProtectedRouteProps) {
  const { user, isLoading, hasWorkflowSubscriptions } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (!allowedRoles.includes(user.role)) {
        router.push("/")
        return
      }

      if (requireSubscription && user.role !== "superAdmin" && !hasWorkflowSubscriptions()) {
        router.push("/")
        return
      }
    }
  }, [user, isLoading, router, requireSubscription, allowedRoles, hasWorkflowSubscriptions])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  if (requireSubscription && user.role !== "superAdmin" && !hasWorkflowSubscriptions()) {
    return null
  }

  return <>{children}</>
}
