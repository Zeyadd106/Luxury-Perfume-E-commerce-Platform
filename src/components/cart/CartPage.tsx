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
import { useLang } from "@/lib/i18n/provider";

const FREE_SHIPPING = brandConfig.freeShippingThreshold;
const FLAT_SHIPPING = 15;

export function CartPage() {
  const { t } = useLang();
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
      push(t.cart.codeAppliedToast);
    } else {
      setCodeError(t.cart.invalidCode);
    }
  }

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center py-28 text-center">
        <ShoppingBag size={44} strokeWidth={1} className="mb-6 text-muted" />
        <h1 className="font-serif text-4xl font-light">{t.cart.empty}</h1>
        <p className="mt-4 max-w-sm text-sm font-light text-muted">
          {t.cart.emptyHint}
        </p>
        <div className="mt-10">
          <ButtonLink href="/shop" size="lg">{t.shop.title}</ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-12 lg:py-16">
      <h1 className="mb-10 font-serif text-4xl font-light sm:text-5xl">{t.cart.title}</h1>

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
                        push(t.cart.itemRemoved, "info");
                      }}
                      className="text-muted transition-colors hover:text-red-800"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border hairline">
                      <button onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center hover:bg-ivory/10" aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.sizeMl, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center hover:bg-ivory/10" aria-label="Increase">
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
            ← {t.cart.continue}
          </Link>
        </div>

        {/* summary */}
        <aside className="h-fit border hairline bg-ivory p-8 lg:sticky lg:top-28">
          <h2 className="eyebrow mb-6 text-muted">{t.checkout.orderSummary}</h2>

          {!eligible && items.length > 0 && (
            <p className="mb-6 border border-accent/40 bg-accent/10 px-4 py-3 text-xs font-light text-ink/80">
              {t.cart.addMoreForFree.replace("{amount}", formatPrice(FREE_SHIPPING - subtotal))}
            </p>
          )}

          {/* discount */}
          <div className="mb-6">
            <p className="eyebrow mb-2 text-muted">{t.cart.discountCode}</p>
            {applied ? (
              <p className="flex items-center justify-between border-b border-accent/50 pb-2 text-sm">
                <span className="font-medium text-accent">{applied} — {t.cart.codeApplied}</span>
                <button onClick={() => { setApplied(null); sessionStorage.removeItem("atelier-discount"); }} className="text-xs text-muted hover:text-ivory">{t.cart.remove}</button>
              </p>
            ) : (
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t.cart.enterCode}
                  className="w-full border-b hairline bg-transparent px-0 py-2 text-sm font-light focus:border-accent focus:outline-none"
                />
                <button onClick={applyCode} className="eyebrow shrink-0 text-accent hover:text-ivory">
                  {t.cart.apply}
                </button>
              </div>
            )}
            {codeError && <p className="mt-2 text-xs text-red-700">{codeError}</p>}
          </div>

          <dl className="space-y-3 text-sm font-light">
            <div className="flex justify-between">
              <dt className="text-muted">{t.cart.subtotal}</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <dt>{t.cart.discount} (15%)</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">{t.cart.shipping}</dt>
              <dd>{shipping === 0 ? t.cart.complimentary : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t hairline pt-4 text-base font-medium">
              <dt>{t.cart.total}</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <ButtonLink href="/checkout" size="lg" className="mt-8 w-full">
            {t.cart.checkout} <ArrowRight size={14} />
          </ButtonLink>
          <p className="mt-4 text-center text-[0.625rem] font-light tracking-wide text-muted">
            {t.cart.secureNote}
          </p>
        </aside>
      </div>
    </Container>
  );
}
