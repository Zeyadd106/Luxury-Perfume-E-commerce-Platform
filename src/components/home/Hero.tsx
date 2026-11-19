"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brandConfig } from "@/config/brand.config";
import { ButtonLink } from "@/components/ui/Button";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const h = brandConfig.hero;

  useEffect(() => {
    if (REDUCED || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-hero-img]", { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 })
        .fromTo(
          "[data-hero-eyebrow]",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=1.2"
        )
        .fromTo(
          "[data-hero-title]",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1 },
          "-=0.6"
        )
        .fromTo(
          "[data-hero-sub]",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-cta]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.4"
        );

      // parallax on scroll
      gsap.to("[data-hero-img]", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -12,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0" data-hero-img>
        <Image
          src={h.image}
          alt={h.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8 lg:pb-28" data-hero-copy>
        <p data-hero-eyebrow className="eyebrow mb-6 text-accent">{h.eyebrow}</p>
        <h1 className="max-w-4xl font-serif text-[13vw] font-light leading-[0.95] sm:text-7xl lg:text-[6.5rem]">
          <span data-hero-title className="block">{h.title}</span>
          <span data-hero-title className="block italic text-accent">{h.titleEmphasis}</span>
        </h1>
        <p data-hero-sub className="mt-6 max-w-md text-base font-light leading-relaxed text-ivory/70 sm:text-lg">
          {h.subtitle}
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <span data-hero-cta>
            <ButtonLink href={h.primaryCta.href} variant="light" size="lg">
              {h.primaryCta.label}
            </ButtonLink>
          </span>
          <span data-hero-cta>
            <ButtonLink href={h.secondaryCta.href} variant="outline" size="lg" className="border-ivory/50 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink">
              {h.secondaryCta.label}
            </ButtonLink>
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        <div className="h-10 w-px overflow-hidden bg-ivory/30">
          <div className="h-full w-full animate-[scroll_2s_ease-in-out_infinite] bg-accent" />
        </div>
      </div>
      <style>{`@keyframes scroll { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }`}</style>
    </section>
  );
}
