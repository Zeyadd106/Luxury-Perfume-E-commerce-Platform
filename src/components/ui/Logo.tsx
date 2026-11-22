import { brandConfig } from "@/config/brand.config";
import { cn } from "@/lib/utils";

/**
 * Brand wordmark. Renders the logo text with the final character in the accent
 * color — e.g. "ZEIN" displays as ZEI + N.
 * tone="light" for dark backgrounds, tone="dark" for light backgrounds.
 */
export function Logo({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const text = brandConfig.logoText;
  const head = text.slice(0, -1);
  const last = text.slice(-1);
  return (
    <span
      className={cn(
        "font-serif font-medium tracking-[0.18em]",
        tone === "light" ? "text-ivory" : "text-ink",
        className
      )}
    >
      {head}
      <span className="text-accent">{last}</span>
    </span>
  );
}
