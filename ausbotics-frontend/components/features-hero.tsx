import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function FeaturesHero() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Sparkle className="h-4 w-4 mr-2" />
            Powered by Advanced AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Powerful Features for <span className="text-primary">Modern Businesses</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover the comprehensive suite of features that make our AI calling agents the most advanced solution for
            customer service, lead generation, and business communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo" className="inline-flex items-center gap-2">
                Try All Features Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">See Pricing Plans</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
