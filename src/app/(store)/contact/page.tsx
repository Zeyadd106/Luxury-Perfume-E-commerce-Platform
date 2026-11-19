import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact the ${brandConfig.name} concierge team — we reply within one business day.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
      <Reveal className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4 text-accent">Concierge</p>
        <h1 className="font-serif text-4xl font-light leading-tight sm:text-6xl">Contact Us</h1>
        <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-muted">
          Questions about a fragrance, an order, or a bespoke commission — our team replies within
          one business day.
        </p>
      </Reveal>

      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="space-y-8">
            {[
              { icon: Mail, label: "Email", value: brandConfig.contact.email },
              { icon: Phone, label: "Telephone", value: brandConfig.contact.phone },
              { icon: Clock, label: "Atelier Hours", value: brandConfig.contact.hours },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border hairline">
                  <Icon size={18} strokeWidth={1.25} className="text-accent" />
                </div>
                <div>
                  <p className="eyebrow text-muted">{label}</p>
                  <p className="mt-1.5 text-sm font-light">{value}</p>
                </div>
              </div>
            ))}
            <div className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border hairline">
                <MapPin size={18} strokeWidth={1.25} className="text-accent" />
              </div>
              <div>
                <p className="eyebrow text-muted">The Atelier</p>
                {brandConfig.contact.address.map((line) => (
                  <p key={line} className="mt-1.5 text-sm font-light">{line}</p>
                ))}
              </div>
            </div>
            <div className="border hairline bg-ivory p-6">
              <p className="eyebrow mb-3 text-accent">Bespoke Commissions</p>
              <p className="text-sm font-light leading-relaxed text-ink/70">
                For private commissions and institutional orders, write to{" "}
                <a href={`mailto:${brandConfig.contact.email}`} className="underline underline-offset-4 hover:text-accent">
                  {brandConfig.contact.email}
                </a>{" "}
                with “Bespoke” in the subject line.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="border hairline bg-ivory p-8 sm:p-12">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
