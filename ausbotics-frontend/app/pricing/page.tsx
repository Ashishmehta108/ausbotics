import { Navigation } from "@/components/navigation"
import { PricingHero } from "@/components/pricing-hero"
import { PricingTiers } from "@/components/pricing-tiers"
import { PricingComparison } from "@/components/pricing-comparison"
import { PricingFAQ } from "@/components/pricing-faq"
import { PricingCTA } from "@/components/pricing-cta"

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <PricingHero />
      <PricingTiers />
      <PricingComparison />
      <PricingFAQ />
      <PricingCTA />
    </main>
  )
}
