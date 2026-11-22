"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/lib/query/hooks";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Reveal, StaggerReveal } from "@/components/animations/Reveal";
import { useLang } from "@/lib/i18n/provider";

export function FeaturedCollection() {
  const { t } = useLang();
  const { data: products = [], isLoading } = useProducts({ sort: "featured" });
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <Section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={t.home.featuredEyebrow}
            title={t.home.featuredTitle}
            description={t.home.featuredDesc}
          />
        </Reveal>
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <StaggerReveal className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-4">
            {featured.map((p) => (
              <div key={p.id} data-reveal-item>
                <ProductCard product={p} />
              </div>
            ))}
          </StaggerReveal>
        )}
        <Reveal className="mt-14 text-center">
          <Link
            href="/shop"
            className="eyebrow inline-flex items-center gap-2 border border-ink px-10 py-4 transition-all hover:bg-ink hover:text-ivory"
          >
            {t.home.featuredCta} <ArrowRight size={14} />
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
