"use client"

import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What's included in the development fee?",
      answer:
        "The one-time development fee covers custom AI model training, conversation flow setup, voice selection, CRM integration, and initial testing. This ensures your AI agent is perfectly tailored to your business needs before going live.",
    },
    {
      question: "Can I change plans later?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the difference. When downgrading, the change takes effect at your next billing cycle.",
    },
    {
      question: "What happens during the free trial?",
      answer:
        "During your 14-day free trial, you get full access to all features of your chosen plan. We'll help set up your AI agent and you can make real calls to test the system. No credit card required to start.",
    },
    {
      question: "Are there any additional fees?",
      answer:
        "No hidden fees! The only costs are the one-time development fee and monthly subscription. However, if you exceed your plan's call limits, additional calls are charged at $0.10 per call.",
    },
    {
      question: "What kind of support do you provide?",
      answer:
        "All plans include comprehensive support. Basic includes email support, Standard adds priority chat support, and Premium includes dedicated phone support with a personal account manager.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your service will continue until the end of your current billing period.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Everything you need to know about our pricing and plans.</p>
        </div>

        <div className="space-y-4">
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
      </div>
    </section>
  )
}
