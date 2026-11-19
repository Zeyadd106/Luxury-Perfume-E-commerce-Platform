"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-reveal wrapper: fades + lifts children into view once.
 * Respects prefers-reduced-motion and cleans up ScrollTriggers.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (REDUCED || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            once,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [delay, y, once]);

  return (
    <div ref={ref} className={cn(REDUCED ? "opacity-100" : "opacity-0", className)}>
      {children}
    </div>
  );
}

/** Staggered reveal for lists of children. */
export function StaggerReveal({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (REDUCED || !ref.current) return;
    const ctx = gsap.context(() => {
      const items = ref.current!.querySelectorAll<HTMLElement>("[data-reveal-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Gentle parallax for a background image. */
export function Parallax({
  children,
  className,
  speed = 0.25,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (REDUCED || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current!.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
