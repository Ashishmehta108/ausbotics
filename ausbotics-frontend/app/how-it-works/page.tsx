import { Navigation } from "@/components/navigation"
import { HowItWorksHero } from "@/components/how-it-works-hero"
import { ProcessSteps } from "@/components/process-steps"
import { ProcessBenefits } from "@/components/process-benefits"
import { GetStartedCTA } from "@/components/get-started-cta"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HowItWorksHero />
      <ProcessSteps />
      <ProcessBenefits />
      <GetStartedCTA />
    </main>
  )
}
