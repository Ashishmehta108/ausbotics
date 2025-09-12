import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"
import Link from "next/link"

export function HowItWorksHero() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            How Our <span className="text-primary">AI Calling Agents</span> Work
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            From setup to success in just 4 simple steps. Our streamlined process gets your AI agents up and running
            quickly, so you can start seeing results immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo" className="inline-flex items-center gap-2">
                <Play className="h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact" className="inline-flex items-center gap-2">
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
