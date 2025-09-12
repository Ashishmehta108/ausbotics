import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

export function FeatureComparison() {
  const comparisonData = [
    {
      feature: "24/7 Availability",
      traditional: false,
      aiAgent: true,
    },
    {
      feature: "Unlimited Concurrent Calls",
      traditional: false,
      aiAgent: true,
    },
    {
      feature: "Consistent Service Quality",
      traditional: false,
      aiAgent: true,
    },
    {
      feature: "Scalable and Reliable",
      traditional: false,
      aiAgent: true,
    },
    {
      feature: "Instant Response Time",
      traditional: false,
      aiAgent: true,
    },
    {
      feature: "Real-time Analytics",
      traditional: true,
      aiAgent: true,
    },
    {
      feature: "CRM Integration",
      traditional: true,
      aiAgent: true,
    },
    {
      feature: "Scalability",
      traditional: false,
      aiAgent: true,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">AI Agents vs Traditional Call Centers</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how our AI calling agents compare to traditional call center solutions.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto overflow-hidden">
          <div className="grid grid-cols-3 bg-muted/50">
            <div className="p-6">
              <h3 className="font-semibold text-foreground">Feature</h3>
            </div>
            <div className="p-6 text-center border-l border-border">
              <h3 className="font-semibold text-foreground">Traditional Call Center</h3>
            </div>
            <div className="p-6 text-center border-l border-border bg-primary/5">
              <h3 className="font-semibold text-primary">AI Calling Agents</h3>
            </div>
          </div>

          {comparisonData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 border-t border-border">
              <div className="p-6">
                <span className="text-foreground">{item.feature}</span>
              </div>
              <div className="p-6 text-center border-l border-border">
                {item.traditional ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                )}
              </div>
              <div className="p-6 text-center border-l border-border bg-primary/5">
                {item.aiAgent ? (
                  <Check className="h-5 w-5 text-primary mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                )}
              </div>
            </div>
          ))}
        </Card>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/demo">Experience the Difference</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
