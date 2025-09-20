import { Card } from "@/components/ui/card";
import { Upload, Settings, Phone, BarChart3, ArrowRight } from "lucide-react";

export function ProcessSteps() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Book a Strategy Session",
      description:
        "Present your business challenge, and we’ll craft a tailored AI agent designed to fit your needs. Define the voice and tone that match your brand, and set clear goals to ensure meaningful customer outcomes.",
      details: [
        " Share your problem statement for a customized AI solution",
        "Define your brand’s voice and communication style",
        "Set goals and desired outcomes for your AI agent",
      ],
    },
    {
      number: "02",
      icon: Settings,
      title: "Ongoing Training & Refinement",
      description:
        "Your AI agent will be trained to handle your business needs, and we’ll continuously update it to incorporate improvements, changes, or new requirements.",
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
      title: "Personalized Dashboard",
      description:
        "Access a dedicated dashboard to view your workspace, monitor customer interactions, and track outcomes—while your AI agent reduces the manual effort of calls and messages.",
      details: [
        "Handles inbound and outbound calls 24/7",
        "Manages multiple conversations simultaneously",
        "Escalates complex issues to human agents",
        "Maintains conversation context and history",
      ],
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple 3-Step Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get your AI calling agent up and running in minutes, not weeks. Our
            streamlined process makes it easy to Bring your AI calling agent to
            life with a simple, streamlined process designed to make setup
            effortless and impactful.
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
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
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
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
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
  );
}
