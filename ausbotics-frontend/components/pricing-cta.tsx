import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import Link from "next/link"

export function PricingCTA() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 lg:p-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start your free trial today and see how AI calling agents can transform your business communication.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild>
                <Link href="/demo" className="inline-flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Talk to Sales
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">14 Days</div>
                <div className="text-muted-foreground">Free Trial</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">No Setup</div>
                <div className="text-muted-foreground">Hidden Fees</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support Included</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
