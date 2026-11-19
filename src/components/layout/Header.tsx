"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { brandConfig } from "@/config/brand.config";
import { useCart, useUI } from "@/lib/store/store";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const { searchOpen, toggleSearch, openCart, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > lastY);
      setLastY(y);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b hairline bg-ivory/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
          hidden && "-translate-y-full"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
          {/* left: mobile menu + nav */}
          <div className="flex flex-1 items-center gap-6">
            <button
              className="flex h-10 w-10 items-center justify-center lg:hidden"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              {brandConfig.navigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "eyebrow transition-colors hover:text-accent",
                    pathname === link.href ? "text-accent" : "text-ink/80"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* center: logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label={brandConfig.name}>
            <span className="font-serif text-2xl font-medium tracking-[0.18em] sm:text-[1.7rem]">
              {brandConfig.logoText}
            </span>
            <span className="mt-0.5 block text-[0.5625rem] uppercase tracking-[0.42em] text-muted">
              {brandConfig.tagline.split(" ").slice(0, 3).join(" ")}
            </span>
          </Link>

          {/* right: actions */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button
              onClick={toggleSearch}
              className={cn(
                "flex h-10 w-10 items-center justify-center transition-colors hover:text-accent",
                searchOpen ? "text-accent" : "text-ink"
              )}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link
              href="/account"
              className="hidden h-10 w-10 items-center justify-center transition-colors hover:text-accent sm:flex"
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center transition-colors hover:text-accent"
              aria-label={`Shopping bag, ${count} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[0.5625rem] font-semibold text-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileMenuOpen} />
    </>
  );
}
