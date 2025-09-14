import { Navigation } from "@/components/navigation"
import { DemoHero } from "@/components/demo-hero"
import { DemoVideo } from "@/components/demo-video"
import { DemoProcess } from "@/components/demo-process"
import { DemoTestimonials } from "@/components/demo-testimonials"
import { AppointmentBooking } from "@/components/appointment-booking"

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <DemoHero />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <DemoVideo />
        <DemoProcess />
      </div>
      <DemoTestimonials />
    </main>
  )
}
