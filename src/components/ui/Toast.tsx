"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToast } from "@/lib/store/store";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
};

export function ToastViewport() {
  const { toasts } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const Icon = icons[t.tone];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full items-center gap-3 border bg-ivory px-5 py-3.5 text-sm font-light shadow-lg",
              t.tone === "error" ? "border-red-800/40 text-red-900" : "hairline text-ink"
            )}
            role="status"
          >
            <Icon size={16} className={t.tone === "success" ? "text-accent" : t.tone === "error" ? "text-red-800" : "text-muted"} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
