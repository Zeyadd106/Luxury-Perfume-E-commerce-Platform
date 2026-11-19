import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { brandConfig } from "@/config/brand.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = brandConfig.currency): string {
  return new Intl.NumberFormat(brandConfig.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Runs fn after mount via requestAnimationFrame — hydrates client-only state safely. */
export function afterMount(fn: () => void): () => void {
  const id = requestAnimationFrame(fn);
  return () => cancelAnimationFrame(id);
}
