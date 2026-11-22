import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { AccountNav } from "@/components/account/AccountNav";
import { AccountContinueLink } from "@/components/account/AccountContinueLink";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b hairline">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="ZEIN home"><Logo className="text-xl" /></Link>
          <AccountContinueLink />
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <AccountNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
