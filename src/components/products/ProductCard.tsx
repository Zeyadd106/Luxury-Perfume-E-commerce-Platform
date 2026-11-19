"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart, useToast, useUI, useWishlist } from "@/lib/store/store";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";

const badgeStyles: Record<string, string> = {
  new: "bg-ivory text-ink",
  bestseller: "bg-ink text-ivory",
  limited: "bg-accent text-ink",
  sale: "bg-red-900 text-ivory",
};

const badgeLabels: Record<string, string> = {
  new: "New",
  bestseller: "Best Seller",
  limited: "Limited",
  sale: "Sale",
};

export function ProductCard({ product, priority = false, dark = false }: { product: Product; priority?: boolean; dark?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const { openCart } = useUI();
  const { has, toggle } = useWishlist();
  const { push } = useToast();
  const { openQuickView } = useUI();

  const defaultSize = product.sizes.find((s) => s.inStock && s.ml === 50) ?? product.sizes.find((s) => s.inStock) ?? product.sizes[0];
  const wished = has(product.id);
  const secondImage = product.images[1];

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        sizeMl: defaultSize.ml,
        price: defaultSize.price,
      },
      1
    );
    push(`${product.name} added to your bag`);
    openCart();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle({ productId: product.id, slug: product.slug, addedAt: new Date().toISOString() });
    push(wished ? "Removed from wishlist" : "Saved to wishlist", "info");
  }

  return (
    <article
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block" aria-label={product.name}>
        <div className="relative aspect-[4/5] overflow-hidden bg-ink/[0.04]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              hovered && secondImage ? "scale-[1.04] opacity-0" : "scale-100 opacity-100"
            )}
          />
          {secondImage && (
            <Image
              src={secondImage}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                hovered ? "scale-[1.04] opacity-100" : "scale-[1.06] opacity-0"
              )}
            />
          )}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={handleAdd}
              className="flex h-10 flex-1 items-center justify-center gap-2 bg-ivory/95 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur transition-colors hover:bg-accent"
              aria-label={`Quick add ${product.name}`}
            >
              <ShoppingBag size={14} /> Add to Bag
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openQuickView(product.slug);
              }}
              className="flex h-10 items-center justify-center border border-ivory/60 bg-ink/30 px-3 text-[0.6875rem] uppercase tracking-[0.2em] text-ivory backdrop-blur transition-colors hover:bg-ivory hover:text-ink"
              aria-label={`Quick view ${product.name}`}
            >
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {product.badge && (
        <span className={cn("absolute left-3 top-3 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em]", badgeStyles[product.badge])}>
          {badgeLabels[product.badge]}
        </span>
      )}
      <button
        onClick={handleWishlist}
        className={cn(
          "absolute right-3 top-3 flex h-9 w-9 items-center justify-center border backdrop-blur transition-all",
          wished ? "border-accent bg-accent text-ink" : "border-ivory/40 bg-ink/20 text-ivory hover:bg-ivory hover:text-ink"
        )}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
      >
        <Heart size={14} fill={wished ? "currentColor" : "none"} />
      </button>

      <div className="mt-4 space-y-1.5">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-serif text-lg font-medium leading-snug transition-colors hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className={cn("line-clamp-1 text-xs font-light", dark ? "text-ivory/50" : "text-muted")}>{product.shortDescription}</p>
        <Rating value={product.rating} count={product.reviewsCount} size={11} />
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-sm font-medium tracking-wide">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className={cn("text-xs line-through", dark ? "text-ivory/40" : "text-muted")}>{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        <p className={cn("text-[0.625rem] uppercase tracking-[0.18em]", dark ? "text-ivory/40" : "text-muted")}>
          {product.sizes.map((s) => `${s.ml}ml`).join(" · ")}
        </p>
      </div>
    </article>
  );
}

