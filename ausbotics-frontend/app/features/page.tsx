import { Navigation } from "@/components/navigation"
import { FeaturesHero } from "@/components/features-hero"
import { CoreFeatures } from "@/components/core-features"
import { AdvancedCapabilities } from "@/components/advanced-capabilities"
import { IntegrationsSection } from "@/components/integrations-section"
import { FeatureComparison } from "@/components/feature-comparison"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <FeaturesHero />
      <CoreFeatures />
      <AdvancedCapabilities />
      <IntegrationsSection />
      <FeatureComparison />
    </main>
  )
}
