import { Card } from "@/components/ui/card"
import { Clock, Users, Presentation as PresentationChart, CheckCircle } from "lucide-react"

export function DemoProcess() {
  const steps = [
    {
      icon: Users,
      title: "Consultation Call",
      duration: "15 minutes",
      description: "We'll discuss your business needs, current challenges, and specific use cases for AI agents.",
    },
    {
      icon: PresentationChart,
      title: "Custom Proposal",
      duration: "10 minutes",
      description:
        "Receive a personalized proposal with pricing, implementation timeline, and next steps for your business.",
    },
    {
      icon: CheckCircle,
      title: "AI Agent Delivery",
      duration: "10 days",
      description:
        "After our discussion call and understanding your business problem, we design, build, and deliver your AI agent within 10 days.",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">What to Expect</h2>
        <p className="text-muted-foreground">
          Our demo process is designed to give you a comprehensive understanding of how AI calling agents can benefit
          your specific business.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-foreground">Sessions with Experts</span>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="bg-primary/10 rounded-full p-3 flex-shrink-0">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <span className="text-sm text-muted-foreground">({step.duration})</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
