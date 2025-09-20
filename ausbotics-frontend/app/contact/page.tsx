import { Navigation } from "@/components/navigation";
import { ContactHero } from "@/components/contact-hero";
import { ContactForm } from "@/components/contact-form";
import { ContactMethods } from "@/components/contact-methods";
import { ContactFAQ } from "@/components/contact-faq";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ContactHero />
      <div className=" max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <ContactMethods />
      </div>
      <ContactFAQ />
    </main>
  );
}
