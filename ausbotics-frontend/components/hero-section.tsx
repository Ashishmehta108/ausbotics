import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Bot, MessageSquare, BarChart3, Clock } from "@/components/simple-icons"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Bring the Power of <span className="text-primary">AI Automation</span> to Everyone
          </h1>

          {/* Hero Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            From growing startups to everyday businesses, our intelligent bots reduce manual effort, handle tasks
            independently, and deliver consistent results. Technology should make life easier, not harder.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/demo">See the Demo</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-transparent" asChild>
              <Link href="/how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Hero Visual/Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">24/7 Availability</h3>
              <p className="text-sm text-muted-foreground">Never miss a call or opportunity</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-secondary/10 rounded-full p-3 w-fit mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Human-like Conversations</h3>
              <p className="text-sm text-muted-foreground">Natural, engaging interactions</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Smart Automation</h3>
              <p className="text-sm text-muted-foreground">Intelligent bots that work independently</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="bg-secondary/10 rounded-full p-3 w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Scalable Solutions</h3>
              <p className="text-sm text-muted-foreground">Grows with your business needs</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  )
}
