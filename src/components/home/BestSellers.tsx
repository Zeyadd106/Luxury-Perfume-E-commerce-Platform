"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/lib/query/hooks";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Reveal, StaggerReveal } from "@/components/animations/Reveal";
import { brandConfig } from "@/config/brand.config";

export function BestSellers() {
  const { data: products = [], isLoading } = useProducts({ badge: "bestsellers", sort: "popular" });
  const best = products.slice(0, 4);

  return (
    <Section dark className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[120px]" />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/campaign-1.svg"
                alt="Atelier Parfum campaign"
                fill
                sizes="(max-width:1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="eyebrow text-accent">Since {brandConfig.founded}</p>
                <p className="mt-3 font-serif text-3xl font-light leading-tight">
                  The scents our clients return to, season after season.
                </p>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading
                align="left"
                dark
                eyebrow="Most Coveted"
                title="Best Sellers"
                description="Ranked by the collectors who know our house best."
              />
            </Reveal>
            {isLoading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <StaggerReveal className="grid grid-cols-2 gap-x-4 gap-y-10">
                {best.map((p) => (
                  <div key={p.id} data-reveal-item>
                    <ProductCard product={p} dark />
                  </div>
                ))}
              </StaggerReveal>
            )}
            <Reveal className="mt-10">
              <Link href="/shop?filter=bestsellers" className="eyebrow inline-flex items-center gap-2 text-accent hover:text-ivory transition-colors">
                Shop Best Sellers <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
