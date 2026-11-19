"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart, useFreeShippingProgress, useToast } from "@/lib/store/store";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { brandConfig } from "@/config/brand.config";

const FREE_SHIPPING = brandConfig.freeShippingThreshold;
const FLAT_SHIPPING = 15;

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const { eligible } = useFreeShippingProgress();
  const { push } = useToast();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [codeError, setCodeError] = useState("");

  const shipping = items.length === 0 ? 0 : eligible ? 0 : FLAT_SHIPPING;
  const discount = applied ? Math.round(subtotal * 0.15) : 0;
  const total = Math.max(0, subtotal - discount + shipping);

  function applyCode() {
    setCodeError("");
    if (code.trim().toUpperCase() === "FIRST15") {
      const c = code.trim().toUpperCase();
      setApplied(c);
      sessionStorage.setItem("atelier-discount", c);
      push("Code FIRST15 applied — 15% off");
    } else {
      setCodeError("Invalid code. Try FIRST15 for 15% off.");
    }
  }

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center py-28 text-center">
        <ShoppingBag size={44} strokeWidth={1} className="mb-6 text-muted" />
        <h1 className="font-serif text-4xl font-light">Your Bag is Empty</h1>
        <p className="mt-4 max-w-sm text-sm font-light text-muted">
          Discover compositions crafted to linger — explore the full collection.
        </p>
        <div className="mt-10">
          <ButtonLink href="/shop" size="lg">Shop All Fragrances</ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 lg:py-16">
      <h1 className="mb-10 font-serif text-4xl font-light sm:text-5xl">Your Bag</h1>

      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        {/* items */}
        <div>
          <ul className="divide-y divide-ink/10 border-y hairline">
            {items.map((item) => (
              <li key={`${item.productId}-${item.sizeMl}`} className="flex gap-5 py-6">
                <Link href={`/product/${item.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-ink/5">
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/product/${item.slug}`} className="font-serif text-xl hover:text-accent transition-colors">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">{item.sizeMl} ml</p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.productId, item.sizeMl);
                        push("Item removed", "info");
                      }}
                      className="text-muted transition-colors hover:text-red-800"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border hairline">
                      <button onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-ink/5" aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-ink/5" aria-label="Increase">
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="eyebrow mt-8 inline-flex items-center gap-2 text-muted hover:text-accent transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        {/* summary */}
        <aside className="h-fit border hairline bg-ivory p-8 lg:sticky lg:top-28">
          <h2 className="eyebrow mb-6 text-muted">Order Summary</h2>

          {!eligible && items.length > 0 && (
            <p className="mb-6 border border-accent/40 bg-accent/10 px-4 py-3 text-xs font-light text-ink/80">
              Add {formatPrice(FREE_SHIPPING - subtotal)} more for complimentary shipping.
            </p>
          )}

          {/* discount */}
          <div className="mb-6">
            <p className="eyebrow mb-2 text-muted">Discount Code</p>
            {applied ? (
              <p className="flex items-center justify-between border-b border-accent/50 pb-2 text-sm">
                <span className="font-medium text-accent">{applied} — 15% off</span>
                <button onClick={() => { setApplied(null); sessionStorage.removeItem("atelier-discount"); }} className="text-xs text-muted hover:text-ink">Remove</button>
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-full border-b hairline bg-transparent px-0 py-2 text-sm font-light focus:border-accent focus:outline-none"
                />
                <button onClick={applyCode} className="eyebrow shrink-0 text-accent hover:text-ink">
                  Apply
                </button>
              </div>
            )}
            {codeError && <p className="mt-2 text-xs text-red-700">{codeError}</p>}
          </div>

          <dl className="space-y-3 text-sm font-light">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <dt>Discount (15%)</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t hairline pt-4 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
            Proceed to Checkout <ArrowRight size={14} />
          </ButtonLink>
          <p className="mt-4 text-center text-[0.625rem] font-light tracking-wide text-muted">
            Secure checkout · {brandConfig.name} never stores card details
          </p>
        </aside>
      </div>
    </Container>
  );
}
