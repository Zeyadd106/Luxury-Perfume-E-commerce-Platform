"use client";

import { useLang } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/** Compact EN | عربي toggle. */
export function LanguageSwitcher({ className, dark = false }: { className?: string; dark?: boolean }) {
  const { lang, setLang } = useLang();
  const active = "bg-accent text-ink";
  const idle = dark ? "text-ivory/60 hover:text-ivory" : "text-muted hover:text-ink";

  return (
    <div
      className={cn("flex items-center border text-[0.625rem] font-medium uppercase tracking-[0.18em]", dark ? "border-ivory/25" : "hairline", className)}
      role="group"
      aria-label="Language"
    >
      <button
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn("px-2.5 py-1.5 transition-colors", lang === "en" ? active : idle)}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ar")}
        aria-pressed={lang === "ar"}
        className={cn("px-2.5 py-1.5 transition-colors", lang === "ar" ? active : idle)}
      >
        عربي
      </button>
    </div>
  );
}
