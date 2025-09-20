import { Card } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";

export function ProcessBenefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Cost Savings",
      description: "Reduce operational costs by up to 70%",
      stat: "70% Savings",
    },
    {
      icon: TrendingUp,
      title: "Improved Efficiency",
      description: "Handle 10x more calls simultaneously",
      stat: "10x Capacity",
    },
    {
      icon: Users,
      title: "Better Experience",
      description: "Consistent service quality every time",
      stat: "95% Satisfaction",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Our Process Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined approach delivers measurable results from day one,
            helping businesses transform their customer service operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-4">
                <benefit.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="bg-secondary text-secondary-foreground font-bold text-lg px-4 py-2 rounded-full w-fit mx-auto mb-4">
                {benefit.stat}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
