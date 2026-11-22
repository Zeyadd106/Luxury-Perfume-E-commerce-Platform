"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/provider";

export function AccountContinueLink() {
  const { t } = useLang();
  return (
    <Link href="/" className="eyebrow text-muted hover:text-accent">
      ← {t.account.continueShopping}
    </Link>
  );
}
