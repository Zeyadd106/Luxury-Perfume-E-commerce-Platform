"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { brandConfig } from "@/config/brand.config";
import { useUI } from "@/lib/store/store";
import { cn } from "@/lib/utils";

export function MobileMenu({ open }: { open: boolean }) {
  const pathname = usePathname();
  const { closeMobileMenu } = useUI();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel.querySelectorAll("[data-menu-item]"),
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, delay: 0.15, ease: "power3.out" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMobileMenu();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeMobileMenu]);

  return (
    <>
      <div
        className={cn("fixed inset-0 z-40 bg-ink/50 transition-opacity duration-500 lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={closeMobileMenu}
        aria-hidden
      />
      <div
        ref={panelRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-sm flex-col bg-ink text-ivory transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-ivory/10 px-6">
          <span className="font-serif text-xl tracking-[0.18em]">{brandConfig.logoText}</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
          <ul className="space-y-1">
            {brandConfig.navigation.map((link, i) => (
              <li key={link.href} data-menu-item>
                <Link
                  href={link.href}
                  className={cn(
                    "block py-3 font-serif text-3xl font-light transition-colors hover:text-accent",
                    pathname === link.href && "text-accent"
                  )}
                >
                  <span className="mr-4 text-xs tracking-widest text-accent">0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-ivory/10 pt-8" data-menu-item>
            <Link href="/account" className="eyebrow block py-2 text-ivory/70 hover:text-accent">
              My Account
            </Link>
            <Link href="/account/wishlist" className="eyebrow block py-2 text-ivory/70 hover:text-accent">
              Wishlist
            </Link>
          </div>
        </nav>
        <div className="border-t border-ivory/10 px-6 py-6" data-menu-item>
          <p className="text-xs font-light leading-relaxed text-ivory/50">{brandConfig.tagline}</p>
        </div>
      </div>
    </>
  );
}

