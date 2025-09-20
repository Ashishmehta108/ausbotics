import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function ContactMethods() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our experts",
      contact: "+1 (555) 123-4567",
      action: "Call Now",
      href: "tel:+15551234567",
      availability: "Mon-Fri, 9 AM - 8 PM EST",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      contact: "support@aicallingagents.com",
      action: "Send Email",
      href: "mailto:support@aicallingagents.com",
      availability: "24/7 - Response within 4 hours",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Chat",
      description: "Quick questions and instant support",
      contact: "+1 (555) 123-4567",
      action: "Start Chat",
      href: "https://wa.me/15551234567",
      availability: "Mon-Fri, 9 AM - 6 PM EST",
    },
    {
      icon: Calendar,
      title: "Schedule a Call",
      description: "Book a consultation with our team",
      contact: "30-minute consultation",
      action: "Book Meeting",
      href: "/book",
      availability: "Available 7 days a week",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Contact Methods
        </h2>
        <p className="text-muted-foreground">
          Choose the contact method that works best for you. We're here to help
          in whatever way is most convenient.
        </p>
      </div>

      <div className="space-y-4">
        {contactMethods.map((method, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                <method.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  {method.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {method.description}
                </p>
                <p className="font-medium text-foreground mb-2">
                  {method.contact}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  {method.availability}
                </p>
                <Button asChild size="sm">
                  <Link href={method.href}>{method.action}</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
