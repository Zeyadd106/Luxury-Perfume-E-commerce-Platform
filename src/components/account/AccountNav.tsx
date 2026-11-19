"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Package, User, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Account">
      <p className="eyebrow mb-6 text-muted">My Account</p>
      <ul className="space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 border-l-2 py-2.5 pl-4 text-sm font-light transition-colors",
                pathname === href ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
              )}
            >
              <Icon size={15} strokeWidth={1.5} /> {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 border-t hairline pt-6">
        <Link href="/" className="eyebrow text-muted hover:text-accent">Sign Out</Link>
      </div>
    </nav>
  );
}
