import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone, Mail, Clock } from "lucide-react"

export function ContactHero() {
  const contactStats = [
    { icon: MessageCircle, text: "24/7 Support Available" },
    { icon: Phone, text: "Average 2-minute response" },
    { icon: Mail, text: "Multiple contact channels" },
    { icon: Clock, text: "Same-day consultation booking" },
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            We're Here to Help
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Get in Touch with Our <span className="text-primary">Expert Team</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Have questions about AI calling agents? Need a custom solution? Our team of experts is ready to help you
            transform your business communication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm text-center">{stat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
