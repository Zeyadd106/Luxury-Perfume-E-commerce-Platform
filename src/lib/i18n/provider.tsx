"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { messages, type Lang, type Messages } from "./messages";

const STORAGE_KEY = "zein-lang";

interface I18nContextValue {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Messages;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "ar" || stored === "en") setLangState(stored);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const m = messages[lang];
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.documentElement.dir = m.dir;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleLang = useCallback(() => setLang(lang === "en" ? "ar" : "en"), [lang, setLang]);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, dir: messages[lang].dir, t: messages[lang], setLang, toggleLang }),
    [lang, setLang, toggleLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLang(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
