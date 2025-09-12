import { Badge } from "@/components/ui/badge"
import { Play, Calendar, Phone } from "lucide-react"

export function DemoHero() {
  const benefits = [
    { icon: Play, text: "Live AI agent demonstration" },
    { icon: Calendar, text: "Personalized consultation" },
    { icon: Phone, text: "Custom use case discussion" },
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Free Demo Available
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            See Our <span className="text-primary">AI Calling Agents</span> in Action
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Experience the power of AI-driven customer service firsthand. Book a personalized demo and discover how our
            intelligent calling agents can transform your business communication.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-muted-foreground">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
