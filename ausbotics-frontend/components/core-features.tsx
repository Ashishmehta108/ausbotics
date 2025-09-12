import { Card } from "@/components/ui/card"
import { MessageSquare, Globe, BarChart3, Mic, Clock, Shield } from "lucide-react"

export function CoreFeatures() {
  const features = [
    {
      icon: MessageSquare,
      title: "Natural Human-like Conversations",
      description:
        "Advanced natural language processing creates conversations that feel authentic and engaging, with context awareness and emotional intelligence.",
      highlights: [
        "Context-aware responses",
        "Emotional intelligence",
        "Natural speech patterns",
        "Dynamic conversation flow",
      ],
    },
    {
      icon: Globe,
      title: "Scalable and Reliable",
      description: "Whether you're a startup or enterprise, our automations grow with your needs.",
      highlights: [
        "Enterprise-grade infrastructure",
        "Auto-scaling capabilities",
        "99.9% uptime guarantee",
        "Load balancing optimization",
      ],
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description:
        "Comprehensive insights and reporting to track performance, measure ROI, and optimize your customer interactions.",
      highlights: ["Real-time call analytics", "Performance metrics", "ROI tracking", "Custom reporting"],
    },
    {
      icon: Mic,
      title: "Custom Voice Options",
      description:
        "Choose from professional voice options or create a custom voice that perfectly matches your brand identity.",
      highlights: ["Professional voice library", "Custom voice creation", "Brand voice matching", "Tone customization"],
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Never miss an opportunity with AI agents that work around the clock, handling unlimited concurrent calls.",
      highlights: [
        "Round-the-clock operation",
        "Unlimited concurrent calls",
        "No downtime",
        "Global time zone support",
      ],
    },
    {
      icon: Shield,
      title: "Tailored to Your Workflow",
      description: "No cookie-cutter templates. Every solution is adapted to your exact processes.",
      highlights: [
        "Custom process mapping",
        "Workflow integration",
        "Personalized automation",
        "Business-specific solutions",
      ],
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Core Features</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to deliver exceptional customer experiences with AI-powered calling agents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    {highlight}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
