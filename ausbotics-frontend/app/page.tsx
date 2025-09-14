"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesPreview } from "@/components/features-preview"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { user, hasWorkflowSubscriptions } = useAuth()
  const [hassubs, sethassubs] = useState(false)
  useEffect(() => {
    const setsubs = async () => {
      const hassubs = await hasWorkflowSubscriptions()
      sethassubs(hassubs)
    }
    setsubs()
  }, [

    user])
  return (
    <main className="min-h-screen">
      <Navigation />

      {user && (
        <div className="bg-muted/50 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Welcome back, {user.fullName || user.email}!</h2>
                <p className="text-sm text-muted-foreground">
                  {hassubs
                    ? "You have active workflow subscriptions. Access your dashboard to manage them."
                    : "You don't have any workflow subscriptions yet. Contact us to get started."}
                </p>
              </div>
              {hassubs && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <HeroSection />
      <FeaturesPreview />
    </main>
  )
}
