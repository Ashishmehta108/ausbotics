import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"

export function PricingTiers() {
  const tiers = [
    {
      name: "Basic",
      description: "Perfect for small businesses getting started",
      developmentFee: 2500,
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        "Up to 500 calls/month",
        "Basic AI conversation flows",
        "Email support",
        "Standard voice options",
        "Basic analytics dashboard",
        "CRM integration (1 platform)",
      ],
      limitations: ["Business hours only", "English language only"],
      popular: false,
    },
    {
      name: "Standard",
      description: "Most popular for growing businesses",
      developmentFee: 4500,
      monthlyPrice: 599,
      yearlyPrice: 5990,
      features: [
        "Up to 2,000 calls/month",
        "Advanced AI conversation flows",
        "Priority email & chat support",
        "Custom voice options",
        "Advanced analytics & reporting",
        "CRM integration (3 platforms)",
        "24/7 availability",
        "5 languages supported",
        "Lead qualification",
        "Sentiment analysis",
      ],
      limitations: [],
      popular: true,
    },
    {
      name: "Premium",
      description: "Enterprise solution for large organizations",
      developmentFee: 7500,
      monthlyPrice: 1299,
      yearlyPrice: 12990,
      features: [
        "Unlimited calls/month",
        "Custom AI model training",
        "Dedicated account manager",
        "Custom voice creation",
        "White-label dashboard",
        "Unlimited CRM integrations",
        "24/7 phone support",
        "50+ languages supported",
        "Advanced lead scoring",
        "Custom integrations",
        "API access",
        "Priority feature requests",
      ],
      limitations: [],
      popular: false,
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            All plans include a one-time development fee to customize your AI agent, plus a monthly subscription for
            ongoing service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className={`p-8 relative hover:shadow-lg transition-all duration-300 ${
                tier.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="text-sm text-muted-foreground">One-time Development Fee</div>
                  <div className="text-3xl font-bold text-foreground">${tier.developmentFee.toLocaleString()}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Subscription</div>
                  <div className="text-4xl font-bold text-primary">${tier.monthlyPrice}</div>
                  <div className="text-sm text-muted-foreground">or ${tier.yearlyPrice}/year (save 2 months)</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="font-semibold text-foreground">What's included:</h4>
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {tier.limitations.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h5 className="font-medium text-muted-foreground text-sm mb-2">Limitations:</h5>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="text-muted-foreground text-sm">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button className="w-full" variant={tier.popular ? "default" : "outline"} asChild>
                  <Link href="/demo">Start Free Trial</Link>
                </Button>
                <Button variant="ghost" className="w-full text-sm" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? We offer enterprise packages tailored to your specific requirements.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact for Enterprise Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
