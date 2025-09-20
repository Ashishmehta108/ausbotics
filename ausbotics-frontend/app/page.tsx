"use client";

import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturesPreview } from "@/components/features-preview";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const { user, hasWorkflowSubscriptions } = useAuth();
  const [hassubs, sethassubs] = useState(false);
  useEffect(() => {
    const setsubs = async () => {
      const hassubs = await hasWorkflowSubscriptions();
      sethassubs(hassubs);
    };
    setsubs();
  }, [user]);
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
    </main>
  );
}
