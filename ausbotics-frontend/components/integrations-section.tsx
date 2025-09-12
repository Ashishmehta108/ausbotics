import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plug } from "lucide-react"
import Link from "next/link"

export function IntegrationsSection() {
  const integrations = [
    {
      category: "CRM Systems",
      items: ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "Microsoft Dynamics"],
    },
    {
      category: "Communication",
      items: ["Twilio", "RingCentral", "Zoom Phone", "8x8", "Vonage"],
    },
    {
      category: "Help Desk",
      items: ["Zendesk", "Freshdesk", "ServiceNow", "Intercom", "Help Scout"],
    },
    {
      category: "Analytics",
      items: ["Google Analytics", "Mixpanel", "Segment", "Amplitude", "Hotjar"],
    },
    {
      category: "Productivity",
      items: ["Slack", "Microsoft Teams", "Google Workspace", "Notion", "Airtable"],
    },
    {
      category: "E-commerce",
      items: ["Shopify", "WooCommerce", "Magento", "BigCommerce", "Stripe"],
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Seamless Integrations</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with your existing tools and workflows. Our AI agents integrate with 100+ popular business
            applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {integrations.map((integration, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Plug className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{integration.category}</h3>
              </div>
              <div className="space-y-2">
                {integration.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-muted-foreground text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-primary/5 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">Need a Custom Integration?</h3>
            <p className="text-muted-foreground mb-6">
              Our team can build custom integrations for your specific business needs and existing systems.
            </p>
            <Button asChild>
              <Link href="/contact" className="inline-flex items-center gap-2">
                Request Custom Integration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
