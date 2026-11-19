"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { brandConfig } from "@/config/brand.config";
import { useNewsletterSubscription } from "@/lib/query/hooks";
import { useToast } from "@/lib/store/store";
import { SocialIcon } from "@/components/ui/SocialIcons";
import { afterMount } from "@/lib/utils";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => afterMount(() => setYear(new Date().getFullYear())), []);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const subscribe = useNewsletterSubscription();
  const { push } = useToast();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    subscribe.mutate(
      { email },
      {
        onSuccess: () => {
          push("Welcome to the maison — check your inbox.");
          setEmail("");
        },
        onError: () => setError("Something went wrong. Please try again."),
      }
    );
  }

  return (
    <footer className="bg-ink text-ivory">
      {/* newsletter band */}
      <div className="border-b border-ivory/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-accent">The Maison Letter</p>
            <h3 className="mt-3 font-serif text-3xl font-light sm:text-4xl">
              First access to new compositions
            </h3>
            <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ivory/60">
              Receive private previews, atelier stories and member-only offerings. One letter a month, never more.
            </p>
          </div>
          <form onSubmit={onSubmit} className="lg:justify-self-end lg:w-full lg:max-w-md">
            <div className="flex items-end gap-3 border-b border-ivory/30 pb-3 focus-within:border-accent">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-transparent text-sm font-light text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="eyebrow shrink-0 text-accent transition-colors hover:text-ivory disabled:opacity-50"
              >
                {subscribe.isPending ? "Joining…" : "Subscribe"}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </form>
        </div>
      </div>

      {/* link columns */}
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl tracking-[0.18em]">{brandConfig.logoText}</p>
          <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.42em] text-ivory/40">{brandConfig.tagline}</p>
          <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-ivory/60">{brandConfig.description}</p>
          <div className="mt-6 flex gap-3">
            {brandConfig.socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-all hover:border-accent hover:text-accent"
              >
                <SocialIcon name={s.icon} size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Shop" links={brandConfig.footerNavigation.shop} />
        <FooterColumn title="The House" links={brandConfig.footerNavigation.house} />
        <div>
          <p className="eyebrow mb-6 text-ivory/40">Client Care</p>
          <ul className="space-y-3">
            {brandConfig.footerNavigation.help.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm font-light text-ivory/70 transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-1 text-sm font-light text-ivory/60">
            <p>{brandConfig.contact.email}</p>
            <p>{brandConfig.contact.phone}</p>
            {brandConfig.contact.address.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-[0.6875rem] font-light tracking-[0.14em] text-ivory/40 sm:flex-row sm:px-8">
          <p>© {year ?? ""} {brandConfig.name}. {brandConfig.tagline}.</p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="hover:text-accent">Privacy</Link>
            <Link href="/contact" className="hover:text-accent">Terms</Link>
            <Link href="/contact" className="hover:text-accent">Shipping</Link>
            <span className="hidden sm:inline">Visa · Mastercard · Amex · PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="eyebrow mb-6 text-ivory/40">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm font-light text-ivory/70 transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
