"use client";

import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/animations/Reveal";
import { brandConfig } from "@/config/brand.config";
import { useLang } from "@/lib/i18n/provider";

export function ContactClient() {
  const { t } = useLang();
  const c = t.contact;

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-20">
      <Reveal className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4 text-accent">{c.concierge}</p>
        <h1 className="font-serif text-4xl font-light leading-tight sm:text-6xl">{c.title}</h1>
        <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-muted">{c.intro}</p>
      </Reveal>

      <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="space-y-8">
            {[
              { icon: Mail, label: t.account.email, value: brandConfig.contact.email },
              { icon: Phone, label: c.telephone, value: brandConfig.contact.phone },
              { icon: Clock, label: c.atelierHours, value: brandConfig.contact.hours },
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
                <p className="eyebrow text-muted">{c.theHouse}</p>
                {brandConfig.contact.address.map((line) => (
                  <p key={line} className="mt-1.5 text-sm font-light">{line}</p>
                ))}
              </div>
            </div>
            <div className="border hairline bg-ivory p-6">
              <p className="eyebrow mb-3 text-accent">{c.bespokeTitle}</p>
              <p className="text-sm font-light leading-relaxed text-ink/70">
                {c.bespokePre}{" "}
                <a href={`mailto:${brandConfig.contact.email}`} className="underline underline-offset-4 hover:text-accent">
                  {brandConfig.contact.email}
                </a>{" "}
                {c.bespokePost}
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
