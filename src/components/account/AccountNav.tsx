"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Package, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/provider";
import { CUSTOMER_KEY } from "@/lib/auth";

const links = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();
  const { t } = useLang();

  function signOut() {
    localStorage.removeItem(CUSTOMER_KEY);
    // Full reload so every client store re-reads auth state from scratch.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }
  const labelKey: Record<string, keyof typeof t.account> = {
    Profile: "profile", Orders: "orders", Addresses: "addresses", Wishlist: "wishlist",
  };
  return (
    <nav aria-label="Account">
      <p className="eyebrow mb-6 text-muted">{t.account.dashboard}</p>
      <ul className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 border-l-2 py-2.5 pl-4 text-sm font-light transition-colors",
                pathname === href ? "border-accent text-ink" : "border-transparent text-muted hover:text-ivory"
              )}
            >
              <Icon size={15} strokeWidth={1.5} /> {t.account[labelKey[label] ?? "profile"]}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t hairline pt-6">
        <button onClick={signOut} className="eyebrow text-muted hover:text-accent">{t.account.signOut}</button>
      </div>
    </nav>
  );
}
