"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCollection, useCollectionProducts } from "@/lib/query/hooks";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { Reveal, StaggerReveal } from "@/components/animations/Reveal";
import { brandConfig } from "@/config/brand.config";

export function CollectionDetailClient({ slug }: { slug: string }) {
  const { data: collection, isLoading: loadingCol } = useCollection(slug);
  const { data: products = [], isLoading: loadingProducts } = useCollectionProducts(slug);
  const loading = loadingCol || loadingProducts;

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Skeleton className="h-[55vh] w-full" />
        <div className="mt-16">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-32 text-center">
        <p className="font-serif text-4xl font-light">Collection not found</p>
        <Link href="/collections" className="eyebrow mt-8 border border-ink px-8 py-3 hover:bg-ink hover:text-ivory transition-colors">
          All Collections
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[45vh] lg:min-h-[70vh]">
            <Image src={collection.image} alt={collection.name} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-16">
            <Reveal>
              <Link href="/collections" className="eyebrow mb-8 inline-flex items-center gap-2 text-ivory/60 transition-colors hover:text-accent">
                <ArrowLeft size={13} /> All Collections
              </Link>
              <p className="eyebrow mb-4 text-accent">{collection.tagline}</p>
              <h1 className="font-serif text-4xl font-light leading-[1.05] sm:text-5xl lg:text-6xl">{collection.name}</h1>
              <p className="mt-6 max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/60">{collection.description}</p>
              <p className="eyebrow mt-8 text-ivory/40">{products.length} fragrance{products.length === 1 ? "" : "s"}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* products */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        {products.length === 0 ? (
          <p className="py-16 text-center font-serif text-2xl font-light text-muted">This collection is being restocked.</p>
        ) : (
          <StaggerReveal className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <div key={p.id} data-reveal-item>
                <ProductCard product={p} />
              </div>
            ))}
          </StaggerReveal>
        )}
        <Reveal className="mt-16 text-center">
          <Link
            href="/shop"
            className="eyebrow inline-flex items-center gap-2 border border-ink px-10 py-4 transition-all hover:bg-ink hover:text-ivory"
          >
            Continue Shopping — {brandConfig.name}
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
