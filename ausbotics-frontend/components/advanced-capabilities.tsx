import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Target, Users, Workflow, Database } from "lucide-react"

export function AdvancedCapabilities() {
  const capabilities = [
    {
      icon: Brain,
      title: "AI Learning & Adaptation",
      description: "Continuously learns from interactions to improve performance and accuracy over time.",
      badge: "Smart AI",
    },
    {
      icon: Zap,
      title: "Instant Response Time",
      description: "Sub-second response times ensure natural conversation flow without awkward pauses.",
      badge: "Lightning Fast",
    },
    {
      icon: Target,
      title: "Lead Qualification",
      description: "Automatically qualifies leads based on your criteria and routes them appropriately.",
      badge: "Sales Ready",
    },
    {
      icon: Users,
      title: "Sentiment Analysis",
      description: "Detects customer emotions and adjusts conversation tone and approach accordingly.",
      badge: "Emotion AI",
    },
    {
      icon: Workflow,
      title: "Smart Call Routing",
      description: "Intelligently routes calls to human agents when complex issues require personal attention.",
      badge: "Intelligent",
    },
    {
      icon: Database,
      title: "Knowledge Base Integration",
      description: "Accesses your knowledge base in real-time to provide accurate, up-to-date information.",
      badge: "Connected",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Advanced Capabilities</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cutting-edge AI features that set our calling agents apart from the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-secondary/10 rounded-lg p-3">
                  <capability.icon className="h-6 w-6 text-secondary" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {capability.badge}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{capability.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{capability.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
