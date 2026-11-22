"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { brandConfig } from "@/config/brand.config";
import { cn, afterMount } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLang } from "@/lib/i18n/provider";

const AUTH_KEY = "zein-admin-auth";
const PASSCODE = "zein-admin";

const nav = [
  { href: "/admin", labelKey: "dashboard" as const, exact: true },
  { href: "/admin/products/new", labelKey: "newProduct" as const },
];

export function AdminGate({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(
    () =>
      afterMount(() => {
        setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
      }),
    []
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (code.trim() === PASSCODE) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
    } else {
      setError("Incorrect passcode");
    }
  }

  if (authed === null) {
    return <div className="min-h-screen bg-ink" />;
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-5 text-ivory">
        <form onSubmit={onSubmit} className="w-full max-w-sm border border-ivory/15 p-10 text-center">
          <Logo tone="light" className="text-2xl" />
          <p className="eyebrow mt-8 text-ivory/75">{t.admin.adminAccess}</p>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t.admin.passcode}
            autoFocus
            className="mt-6 w-full border-b border-ivory/30 bg-transparent py-3 text-center tracking-[0.3em] text-ivory placeholder:text-ivory/50 focus:border-accent focus:outline-none"
          />
          {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            className="eyebrow mt-8 w-full border border-accent bg-accent px-8 py-3.5 text-ink transition-colors hover:bg-ivory"
          >
            Enter Dashboard
          </button>
          <p className="mt-6 text-[0.625rem] font-light text-ivory/65">
            {t.langName === "العربية" ? "رمز تجريبي — استبدله بمصادقة حقيقية قبل الإنتاج." : "Demo passcode — replace with real auth before production."}
          </p>
        </form>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLang();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ink text-ivory">
      <header className="border-b border-ivory/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-8">
            <Link href="/admin" aria-label="Admin home">
              <Logo tone="light" className="text-xl" />
            </Link>
            <span className="hidden text-[0.5625rem] uppercase tracking-[0.3em] text-accent sm:block">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-3 overflow-x-auto sm:gap-6 [&>*]:shrink-0">
          <LanguageSwitcher dark />
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "eyebrow transition-colors hover:text-accent",
                  (l.exact ? pathname === l.href : pathname.startsWith(l.href))
                    ? "text-accent"
                    : "text-ivory/80"
                )}
              >
                {t.admin[l.labelKey]}
              </Link>
            ))}
            <Link href="/" className="eyebrow text-ivory/65 hover:text-ivory">
              {t.nav.viewStore} ↗
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                router.push("/admin");
                router.refresh();
              }}
              className="eyebrow text-ivory/65 hover:text-accent"
            >
              {t.nav.signOut}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">{children}</main>
      <footer className="border-t border-ivory/10 py-6 text-center text-[0.625rem] font-light tracking-wide text-ivory/65">
        {brandConfig.name} Admin — catalog changes sync to the storefront instantly
      </footer>
    </div>
  );
}
