"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer:
        "We aim to respond to all inquiries within 4 hours during business hours. For urgent matters, please call our phone support line for immediate assistance. WhatsApp messages are typically answered within 30 minutes during business hours.",
    },
    {
      question: "What information should I include in my message?",
      answer:
        "Please include your company name, current customer service challenges, expected call volume, and any specific requirements. The more details you provide, the better we can tailor our response to your needs.",
    },
    {
      question: "Can I schedule a call outside business hours?",
      answer:
        "Yes! While our standard business hours are Monday-Friday 9 AM - 8 PM EST, we offer flexible scheduling for consultations. Use our calendar booking system to find a time that works for your schedule, including evenings and weekends.",
    },
    {
      question: "Do you offer technical support for existing customers?",
      answer:
        "Existing customers have access to priority technical support through all our contact methods. Premium plan customers also have access to dedicated phone support and a personal account manager.",
    },
    {
      question: "What if I need a custom integration or solution?",
      answer:
        "We specialize in custom solutions! Please contact our sales team directly at sales@aicallingagents.com or schedule a consultation call. We'll discuss your specific requirements and provide a tailored proposal.",
    },
    {
      question: "Is there a cost for consultations?",
      answer:
        "Initial consultations and demos are completely free. We only charge for implementation and ongoing service. There are no hidden fees or charges for speaking with our team about your needs.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Quick answers to common questions about contacting us and our support process.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Still Have Questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our team is here to help with any questions about AI calling agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/demo" className="inline-flex items-center gap-2">
                Schedule a Call
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="mailto:support@aicallingagents.com">Email Us Directly</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
