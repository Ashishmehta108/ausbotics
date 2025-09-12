import { Card } from "@/components/ui/card"
import { Star, MessageSquareQuote } from "lucide-react"

export function DemoTestimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "VP of Customer Success",
      company: "TechFlow Solutions",
      content:
        "The demo was incredibly impressive. Seeing the AI agent handle complex customer scenarios in real-time convinced us this was the right solution for our growing business.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      title: "Operations Director",
      company: "HealthCare Plus",
      content:
        "What stood out was how natural the conversations felt. The AI agent understood context and responded appropriately to every question we threw at it during the demo.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      title: "CEO",
      company: "Local Services Co",
      content:
        "The personalized demo showed exactly how AI agents could handle our appointment scheduling. We went from demo to implementation in just two weeks.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">What Our Demo Attendees Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from business leaders who experienced our AI calling agents firsthand during their demo sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="mb-4">
                <MessageSquareQuote className="h-8 w-8 text-primary/20 mb-2" />
                <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
              </div>
              <div className="border-t border-border pt-4">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.title}, {testimonial.company}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
