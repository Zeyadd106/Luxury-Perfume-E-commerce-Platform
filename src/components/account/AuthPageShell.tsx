"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n/provider";

type Mode = "login" | "register" | "forgot";

export function AuthPageShell({ mode, children }: { mode: Mode; children: ReactNode }) {
  const { t } = useLang();
  const a = t.account;

  const heading = mode === "login" ? a.loginTitle : mode === "register" ? a.registerTitle : a.forgotTitle;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl font-light">{heading}</h1>
      <p className="mt-3 text-sm font-light text-muted">
        {mode === "login" && (
          <>
            {a.loginBody}{" "}
            <Link href="/account/register" className="underline underline-offset-4 hover:text-accent">
              {a.createOne}
            </Link>
            .
          </>
        )}
        {mode === "register" && (
          <>
            {a.registerBody}{" "}
            <Link href="/account/login" className="underline underline-offset-4 hover:text-accent">
              {a.signIn}
            </Link>
            .
          </>
        )}
        {mode === "forgot" && a.forgotBody}
      </p>
      <div className="mt-10 border hairline bg-ivory p-8">{children}</div>
    </div>
  );
}
