import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Headphones,
} from "@/components/simple-icons";
import Link from "next/link";

export function FeaturesPreview() {
  const features = [
    {
      icon: Zap,
      title: "From Idea to Impact",
      description:
        "Share your business problem. We transform it into a tailored AI automation that’s designed, built, and ready to deliver real results.  ",
    },
    {
      icon: Shield,
      title: "Your Workflow, Your Way ",
      description: "Every solution is crafted to match your work.",
    },
    {
      icon: Globe,
      title: "Built for Every Business",
      description:
        "No matter the size of your business, our automations are designed to grow with you.",
    },
    {
      icon: Headphones,
      title: "Custom Voice Options",
      description: "Choose from professional voice options ",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose Our AI Calling Agents?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for modern businesses that demand efficiency, reliability, and
            results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/features" className="inline-flex items-center gap-2">
              View All Features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
