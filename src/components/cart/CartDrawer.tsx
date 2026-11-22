"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCart, useFreeShippingProgress, useUI } from "@/lib/store/store";
import { formatPrice } from "@/lib/utils";
import { useLang } from "@/lib/i18n/provider";

export function CartDrawer() {
  const { t, dir } = useLang();
  const { cartOpen, closeCart } = useUI();
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { threshold, remaining, eligible } = useFreeShippingProgress();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cartOpen || !drawerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        drawerRef.current!.querySelectorAll("[data-cart-item]"),
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, delay: 0.25, ease: "power3.out" }
      );
    }, drawerRef.current);
    return () => ctx.revert();
  }, [cartOpen]);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen, closeCart]);

  return (
    <div className={`fixed inset-0 z-[70] ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-ink/50 transition-opacity duration-500 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <div
        ref={drawerRef}
        className={`absolute end-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory text-ink shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${cartOpen ? "translate-x-0" : dir === "rtl" ? "-translate-x-full" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <h2 className="font-serif text-xl">{t.cart.title} {items.length > 0 && `(${items.reduce((n, i) => n + i.quantity, 0)})`}</h2>
          <button onClick={closeCart} className="flex h-9 w-9 items-center justify-center hover:text-accent" aria-label="Close bag">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* free shipping meter */}
        {items.length > 0 && (
          <div className="border-b hairline px-6 py-4">
            <p className="mb-2 text-xs font-light text-muted">
              {eligible ? (
                <span className="text-accent">{t.cart.freeShipping}</span>
              ) : (
                <>{t.cart.awayFromFree}: {formatPrice(remaining)}</>
              )}
            </p>
            <div className="h-px w-full bg-ink/15">
              <div className="h-px bg-accent transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag size={40} strokeWidth={1} className="mb-5 text-muted" />
              <p className="font-serif text-2xl font-light">{t.cart.empty}</p>
              <p className="mt-2 max-w-xs text-sm font-light text-muted">
                {t.cart.emptyHint}
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="eyebrow mt-8 border border-ink px-8 py-3 hover:bg-ink hover:text-ivory transition-colors"
              >
                {t.hero.primaryCta}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {items.map((item) => (
                <li key={`${item.productId}-${item.sizeMl}`} data-cart-item className="flex gap-4 py-5">
                  <Link href={`/product/${item.slug}`} onClick={closeCart} className="relative h-28 w-20 shrink-0 overflow-hidden bg-ink/5">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${item.slug}`} onClick={closeCart} className="font-serif text-lg leading-tight hover:text-accent">
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">{item.sizeMl} ml · Eau de Parfum</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.sizeMl)}
                        className="text-muted transition-colors hover:text-red-800"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border hairline">
                        <button
                          onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-ivory/10"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-ivory/10"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t hairline px-6 py-5">
            <div className="mb-1 flex justify-between text-sm font-light">
              <span className="text-muted">{t.cart.subtotal}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between text-sm font-light">
              <span className="text-muted">{t.cart.shipping}</span>
              <span>{eligible ? "—" : "—"}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-[0.75rem] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-accent hover:text-ink"
            >
              {t.cart.checkout} <ArrowRight size={14} />
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="mt-3 block text-center text-xs font-light uppercase tracking-[0.2em] text-muted hover:text-ivory"
            >
              {t.cart.title}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

