"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useProduct } from "@/lib/query/hooks";
import { useCart, useToast, useUI, useWishlist } from "@/lib/store/store";
import { useRequireAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Rating } from "@/components/ui/Rating";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/provider";

export function QuickViewModal() {
  const { quickViewSlug, closeQuickView } = useUI();
  const { data: product, isLoading } = useProduct(quickViewSlug ?? "");
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { push } = useToast();
  const requireAuth = useRequireAuth();
  const { t } = useLang();
  const [sizeMl, setSizeMl] = useState<number | null>(null);

  const [prevProduct, setPrevProduct] = useState(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    const first = product?.sizes.find((s) => s.inStock) ?? product?.sizes[0];
    setSizeMl(first?.ml ?? null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuickView();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeQuickView]);

  if (!quickViewSlug) return null;

  const selected = product?.sizes.find((s) => s.ml === sizeMl);
  const wished = product ? has(product.id) : false;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={t.shop.quickView}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={closeQuickView} />
      <div className="relative grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto bg-ivory md:grid-cols-2">
        <button
          onClick={closeQuickView}
          className="absolute end-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-ivory/80 backdrop-blur transition-colors hover:text-accent"
          aria-label={t.nav.close}
        >
          <X size={18} />
        </button>

        <div className="relative aspect-[4/5] bg-ink/5 md:aspect-auto md:min-h-[560px]">
          {isLoading || !product ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <Image src={product.images[0]} alt={product.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-10">
          {isLoading || !product ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <>
              <p className="eyebrow text-accent">{product.category}</p>
              <h2 className="mt-2 font-serif text-3xl font-light">{product.name}</h2>
              <Rating value={product.rating} count={product.reviewsCount} className="mt-3" />
              <p className="mt-4 text-sm font-light leading-relaxed text-ink/70">{product.shortDescription}</p>

              <div className="mt-4">
                <p className="eyebrow mb-2 text-muted">{t.product.size}</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.ml}
                      onClick={() => setSizeMl(s.ml)}
                      disabled={!s.inStock}
                      className={cn(
                        "border px-4 py-2 text-xs tracking-wide transition-colors disabled:opacity-40",
                        sizeMl === s.ml ? "border-ink bg-ink text-ivory" : "hairline hover:border-ivory"
                      )}
                    >
                      {s.ml} ml · {formatPrice(s.price)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="font-serif text-2xl">{selected ? formatPrice(selected.price) : formatPrice(product.price)}</span>
                {selected?.compareAtPrice && (
                  <span className="text-sm text-muted line-through">{formatPrice(selected.compareAtPrice)}</span>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  disabled={!selected?.inStock}
                  onClick={() => {
                    if (!selected) return;
                    if (!requireAuth(`add ${product.name} to your bag`)) return;
                    addItem(
                      {
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        image: product.images[0],
                        sizeMl: selected.ml,
                        price: selected.price,
                      },
                      1
                    );
                    push(t.product.addedToBag.replace("{name}", product.name));
                    closeQuickView();
                  }}
                  className="flex items-center justify-center gap-2 bg-ink py-4 text-[0.75rem] font-medium uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-accent hover:text-ink disabled:opacity-50"
                >
                  <ShoppingBag size={15} /> {t.product.addToBag}
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      toggle({ productId: product.id, slug: product.slug, addedAt: new Date().toISOString() });
                      push(wished ? t.product.wishlistRemoved : t.product.wishlistSaved, "info");
                    }}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 border py-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors",
                      wished ? "border-accent bg-accent/10 text-accent" : "hairline hover:border-ivory"
                    )}
                  >
                    <Heart size={14} fill={wished ? "currentColor" : "none"} /> {wished ? t.product.savedLabel : t.shop.wishlist}
                  </button>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={closeQuickView}
                    className="flex flex-1 items-center justify-center border hairline py-3 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:border-ivory"
                  >
                    {t.product.fullDetails}
                  </Link>
                </div>
              </div>

              <div className="mt-6 border-t hairline pt-4">
                <p className="text-xs font-light text-muted">
                  {t.product.topHeart}: {product.topNotes.join(", ")} · {t.product.heartLabel}: {product.heartNotes.join(", ")}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
