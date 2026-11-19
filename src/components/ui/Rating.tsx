import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = value >= i - 0.25;
          const half = !filled && value >= i - 0.75;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-ink/20" fill="currentColor" strokeWidth={0} />
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? "100%" : "50%" }}>
                  <Star size={size} className="text-accent" fill="currentColor" strokeWidth={0} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {count !== undefined && (
        <span className="text-xs opacity-60">({count})</span>
      )}
    </div>
  );
}
