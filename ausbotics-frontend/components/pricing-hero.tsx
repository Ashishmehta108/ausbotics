import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

export function PricingHero() {
  const benefits = ["No setup fees", "14-day free trial", "Cancel anytime", "24/7 support included"]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Transparent Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Simple, <span className="text-primary">Transparent Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Choose the perfect plan for your business. All plans include our core AI calling features with no hidden
            fees or surprise charges.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
