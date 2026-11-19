import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-ivory hover:bg-accent hover:text-ink border border-ink",
  outline:
    "bg-transparent text-ink border border-ink/30 hover:border-ink hover:bg-ink hover:text-ivory",
  ghost: "bg-transparent text-ink hover:text-accent border border-transparent",
  light:
    "bg-ivory text-ink hover:bg-accent border border-ivory",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.6875rem] tracking-[0.22em]",
  md: "px-7 py-3.5 text-[0.75rem] tracking-[0.22em]",
  lg: "px-10 py-4 text-[0.8125rem] tracking-[0.26em]",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
