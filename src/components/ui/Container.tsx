import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide ? "mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12" : "mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Section({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section className={cn(dark ? "bg-ink text-ivory" : "bg-ivory text-ink", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 sm:mb-16", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-4", dark ? "text-accent" : "text-accent")}>{eyebrow}</p>
      )}
      <h2 className="font-serif text-4xl font-light leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h2>
      {description && (
        <p className={cn("mx-auto mt-5 max-w-xl text-[0.95rem] leading-relaxed font-light", align === "left" && "mx-0", dark ? "text-ivory/60" : "text-ink/60")}>
          {description}
        </p>
      )}
    </div>
  );
}
