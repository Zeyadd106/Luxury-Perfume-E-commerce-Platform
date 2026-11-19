"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCollections } from "@/lib/query/hooks";
import { Reveal } from "@/components/animations/Reveal";
import { Skeleton } from "@/components/ui/Skeleton";

export function CollectionsClient() {
  const { data: collections = [], isLoading } = useCollections();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <Reveal className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4 text-accent">Curated Worlds</p>
        <h1 className="font-serif text-4xl font-light leading-tight sm:text-6xl">Collections</h1>
        <p className="mt-5 text-[0.95rem] font-light leading-relaxed text-muted">
          Each collection is a complete olfactory narrative — compositions chosen to be worn together,
          season after season.
        </p>
      </Reveal>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <Link
                href={`/collections/${c.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow text-accent">{String(i + 1).padStart(2, "0")} — {c.tagline}</p>
                  <h2 className="mt-2 font-serif text-3xl font-light text-ivory">{c.name}</h2>
                  <span className="eyebrow mt-4 inline-flex items-center gap-2 text-ivory/80 transition-colors group-hover:text-accent">
                    Discover <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
