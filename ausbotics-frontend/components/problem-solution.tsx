import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

export function ProblemSolution() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Missed Opportunities",
      description:
        "Businesses lose potential customers when calls or messages go unanswered during off-hours or peak times.",
    },
    {
      icon: TrendingUp,
      title: "Rising Costs",
      description:
        "Traditional call centers are expensive to maintain and scale, especially for growing businesses.",
    },
    {
      icon: CheckCircle,
      title: "Inconsistent Service",
      description:
        "Human agents vary in performance, leading to inconsistent customer experiences and outcomes.",
    },
  ];

  const solutions = [
    {
      title: "24/7 Availability",
      description:
        "Our AI agents never sleep, ensuring every call is answered and every opportunity is captured, regardless of time or volume.",
    },
    {
      title: "Cost-Effective Scaling",
      description:
        "Scale your customer service operations without the overhead of hiring, training, and managing large teams.",
    },
    {
      title: "Consistent Excellence",
      description:
        "Every interaction follows your exact protocols and maintains the same high standard of service quality.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Problem Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            The Challenge Businesses Face
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Modern businesses struggle with customer communication challenges
            that impact growth and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {problems.map((problem, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-destructive/10 rounded-full p-3 w-fit mx-auto mb-4">
                <problem.icon className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Solution Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Solution
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI calling or messaging agents that solve these challenges while
            delivering superior customer experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {solution.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {solution.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
