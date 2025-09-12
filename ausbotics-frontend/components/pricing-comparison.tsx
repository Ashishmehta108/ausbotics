import { Card } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function PricingComparison() {
  const features = [
    {
      category: "Core Features",
      items: [
        { feature: "AI Conversation Engine", basic: true, standard: true, premium: true },
        { feature: "24/7 Availability", basic: false, standard: true, premium: true },
        { feature: "CRM Integration", basic: "1 platform", standard: "3 platforms", premium: "Unlimited" },
        { feature: "Analytics Dashboard", basic: "Basic", standard: "Advanced", premium: "White-label" },
        { feature: "Voice Options", basic: "Standard", standard: "Custom", premium: "Custom Creation" },
      ],
    },
    {
      category: "Language & Communication",
      items: [
        { feature: "Languages Supported", basic: "1 (English)", standard: "5 languages", premium: "50+ languages" },
        { feature: "Sentiment Analysis", basic: false, standard: true, premium: true },
        { feature: "Lead Qualification", basic: false, standard: true, premium: true },
        { feature: "Custom Conversation Flows", basic: false, standard: true, premium: true },
      ],
    },
    {
      category: "Support & Service",
      items: [
        { feature: "Email Support", basic: true, standard: true, premium: true },
        { feature: "Chat Support", basic: false, standard: true, premium: true },
        { feature: "Phone Support", basic: false, standard: false, premium: true },
        { feature: "Dedicated Account Manager", basic: false, standard: false, premium: true },
        { feature: "Custom Integrations", basic: false, standard: false, premium: true },
      ],
    },
  ]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-primary mx-auto" />
      ) : (
        <X className="h-5 w-5 text-muted-foreground mx-auto" />
      )
    }
    return <span className="text-sm text-foreground">{value}</span>
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Detailed Feature Comparison</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare all features across our pricing tiers to find the perfect fit for your business needs.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-4 bg-muted/50">
            <div className="p-4">
              <h3 className="font-semibold text-foreground">Features</h3>
            </div>
            <div className="p-4 text-center border-l border-border">
              <h3 className="font-semibold text-foreground">Basic</h3>
            </div>
            <div className="p-4 text-center border-l border-border bg-primary/5">
              <h3 className="font-semibold text-primary">Standard</h3>
            </div>
            <div className="p-4 text-center border-l border-border">
              <h3 className="font-semibold text-foreground">Premium</h3>
            </div>
          </div>

          {features.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="grid grid-cols-4 bg-muted/20 border-t border-border">
                <div className="p-4 col-span-4">
                  <h4 className="font-semibold text-foreground">{category.category}</h4>
                </div>
              </div>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="grid grid-cols-4 border-t border-border">
                  <div className="p-4">
                    <span className="text-foreground text-sm">{item.feature}</span>
                  </div>
                  <div className="p-4 text-center border-l border-border">{renderFeatureValue(item.basic)}</div>
                  <div className="p-4 text-center border-l border-border bg-primary/5">
                    {renderFeatureValue(item.standard)}
                  </div>
                  <div className="p-4 text-center border-l border-border">{renderFeatureValue(item.premium)}</div>
                </div>
              ))}
            </div>
          ))}
        </Card>
      </div>
    </section>
  )
}
