import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Target, Lamp, Users } from "lucide-react"
import Link from "next/link"

export function CompanyValues() {
  const values = [
    {
      icon: Zap,
      title: "Simple & Smart",
      description: "Our intelligent bots are built to be simple, smart, and scalable for any business size.",
    },
    {
      icon: Target,
      title: "Results-Focused",
      description:
        "We design bots that deliver consistent results and help businesses save time and boost productivity.",
    },
    {
      icon: Lamp,
      title: "Innovation Made Easy",
      description: "We combine startup creativity with cutting-edge AI reliability to make technology accessible.",
    },
    {
      icon: Users,
      title: "Future of Work",
      description: "We believe the future of work is smarter, not harder—and our bots make that future a reality.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
          <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 lg:p-12 mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At Ausbotics, we're on a mission to bring the power of AI automation to everyone—from growing startups to
              everyday businesses. We believe technology should make life easier, not harder, which is why our
              intelligent bots are built to reduce manual effort, handle tasks independently, and deliver consistent
              results.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We combine the creativity of a startup with the reliability of cutting-edge AI to design bots that are
              simple, smart, and scalable. Whether it's streamlining daily operations or transforming the way work gets
              done, Ausbotics is here to help businesses save time, boost productivity, and focus on what matters most.
            </p>
            <p className="text-lg text-primary font-semibold">
              At the heart of Ausbotics is a simple belief: the future of work is smarter, not harder—and our bots are
              here to make that future a reality.
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These principles guide everything we do and shape how we build intelligent automation solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="bg-secondary/10 rounded-full p-4 w-fit mx-auto mb-4">
                <value.icon className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-primary/5 rounded-2xl p-8 lg:p-12 text-center">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Ready to Transform Your Business?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join businesses that have already revolutionized their operations with our intelligent AI automation bots.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo">Schedule a Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
