"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import type { WishlistItem } from "@/types";
import { fetchProductBySlug } from "@/services/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { ButtonLink } from "@/components/ui/Button";
import { afterMount } from "@/lib/utils";
import type { Product } from "@/types";

const WISHLIST_KEY = "atelier-wishlist-v1";

function WishlistCard({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    fetchProductBySlug(slug).then(setProduct);
  }, [slug]);
  if (!product) return <Skeleton className="aspect-[4/5] w-full" />;
  return <ProductCard product={product} />;
}

export function WishlistClient() {
  const [items, setItems] = useState<WishlistItem[] | null>(null);

  useEffect(
    () =>
      afterMount(() => {
        try {
          setItems(JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? "[]"));
        } catch {
          setItems([]);
        }
      }),
    []
  );

  return (
    <div>
      <h1 className="font-serif text-4xl font-light">Wishlist</h1>
      {items === null ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 flex max-w-md flex-col items-center border border-dashed hairline p-10 text-center">
          <Heart size={32} strokeWidth={1} className="mb-4 text-muted" />
          <p className="font-serif text-2xl font-light">Nothing saved yet</p>
          <p className="mt-2 text-sm font-light text-muted">Tap the heart on any fragrance to keep it here.</p>
          <div className="mt-8">
            <ButtonLink href="/shop" variant="outline" size="sm">Discover Fragrances</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
          {items.map((item) => (
            <WishlistCard key={item.productId} slug={item.slug} />
          ))}
        </div>
      )}
      {items && items.length > 0 && (
        <p className="mt-8 text-xs font-light text-muted">
          Wishlist is stored in your browser. <Link href="/shop" className="underline underline-offset-4 hover:text-accent">Continue shopping</Link>.
        </p>
      )}
    </div>
  );
}
