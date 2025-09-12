import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function AboutHero() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Bringing the Power of <span className="text-primary">AI Automation</span> to Everyone
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            At Ausbotics, we're on a mission to bring the power of AI automation to everyone—from growing startups to
            everyday businesses. We believe technology should make life easier, not harder.
          </p>
          <Button size="lg" asChild>
            <Link href="/demo" className="inline-flex items-center gap-2">
              See Our Technology in Action
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
