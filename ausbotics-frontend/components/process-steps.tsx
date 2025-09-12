import { Card } from "@/components/ui/card"
import { Upload, Settings, Phone, BarChart3, ArrowRight } from "lucide-react"

export function ProcessSteps() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Business Script",
      description:
        "Provide your call scripts, FAQs, and business information. Our system analyzes your content to understand your brand voice and customer service approach.",
      details: [
        "Upload existing scripts and documentation",
        "Define your brand voice and tone",
        "Set conversation goals and outcomes",
        "Configure business rules and policies",
      ],
    },
    {
      number: "02",
      icon: Settings,
      title: "Train Your AI Agent",
      description:
        "Our advanced AI learns your business processes, products, and services. The training process ensures natural, on-brand conversations every time.",
      details: [
        "AI learns your product catalog and services",
        "Customizes responses to match your brand",
        "Integrates with your existing CRM system",
        "Tests and validates conversation flows",
      ],
    },
    {
      number: "03",
      icon: Phone,
      title: "AI Makes Intelligent Calls",
      description:
        "Your AI agent starts making calls, handling customer inquiries, generating leads, and providing support with human-like conversations.",
      details: [
        "Handles inbound and outbound calls 24/7",
        "Manages multiple conversations simultaneously",
        "Escalates complex issues to human agents",
        "Maintains conversation context and history",
      ],
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Monitor & Optimize",
      description:
        "Access comprehensive analytics and reports to track performance, measure ROI, and continuously improve your AI agent's effectiveness.",
      details: [
        "Real-time call monitoring and analytics",
        "Performance metrics and KPI tracking",
        "Customer satisfaction scoring",
        "Continuous learning and improvement",
      ],
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Simple 4-Step Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get your AI calling agent up and running in minutes, not weeks. Our streamlined process makes it easy.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 top-32 w-px h-20 bg-border transform -translate-x-1/2"></div>
              )}

              <div
                className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Step Content */}
                <div className="flex-1">
                  <Card className="p-8 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Step Visual */}
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-12 w-80 h-80 flex items-center justify-center">
                      <step.icon className="h-24 w-24 text-primary" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <ArrowRight className="h-6 w-6 text-primary rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
