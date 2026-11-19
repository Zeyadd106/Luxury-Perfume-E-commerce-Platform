"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Citrus, Flower2, Gem, Leaf, Moon, Sparkles, TreePine } from "lucide-react";
import type { FragranceFamily } from "@/types";
import { fragranceFamilies } from "@/data/products";
import { Container, Section, SectionHeading } from "@/components/ui/Container";
import { Reveal, StaggerReveal } from "@/components/animations/Reveal";

const icons: Record<FragranceFamily, typeof Leaf> = {
  woody: TreePine,
  floral: Flower2,
  oriental: Gem,
  fresh: Leaf,
  citrus: Citrus,
  gourmand: Sparkles,
  aromatic: Moon,
};

export function FragranceDiscovery() {
  const router = useRouter();

  return (
    <Section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Fragrance Families"
            title="Discover Your Family"
            description="Every great scent begins with a family. Find the accord that speaks to you."
          />
        </Reveal>
        <StaggerReveal className="grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-3 lg:grid-cols-7">
          {fragranceFamilies.map((f) => {
            const Icon = icons[f.value as FragranceFamily];
            return (
              <Link
                key={f.value}
                href={`/shop?family=${f.value}`}
                data-reveal-item
                className="group flex flex-col items-center bg-ivory px-3 py-8 text-center transition-colors hover:bg-ink hover:text-ivory"
              >
                <Icon size={26} strokeWidth={1.25} className="mb-4 text-accent transition-transform duration-500 group-hover:scale-110" />
                <span className="font-serif text-lg font-light">{f.label}</span>
                <span className="mt-1 hidden text-[0.625rem] font-light leading-snug text-muted group-hover:text-ivory/60 sm:block">
                  {f.description}
                </span>
                <ArrowRight size={12} className="mt-3 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            );
          })}
        </StaggerReveal>
        <Reveal className="mt-10 text-center">
          <button
            onClick={() => router.push("/shop")}
            className="eyebrow text-muted underline-offset-4 hover:text-accent hover:underline"
          >
            Browse the full collection
          </button>
        </Reveal>
      </Container>
    </Section>
  );
}
