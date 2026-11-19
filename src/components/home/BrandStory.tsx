import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";
import { brandConfig } from "@/config/brand.config";

export function BrandStory() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/story-1.svg"
                alt={`${brandConfig.name} atelier interior`}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden w-48 border-4 border-ivory sm:block lg:-right-8 lg:w-56">
              <div className="relative aspect-square">
                <Image src="/images/story-2.svg" alt="Fragrance ingredients" fill sizes="224px" className="object-cover" />
              </div>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow mb-4 text-accent">Our Story</p>
              <h2 className="font-serif text-4xl font-light leading-[1.1] sm:text-5xl">
                Perfume is memory,
                <br />
                <span className="italic text-accent">made wearable.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 space-y-5 text-[0.95rem] font-light leading-[1.9] text-ink/70">
                <p>
                  Founded in {brandConfig.founded}, {brandConfig.name} began as a single-room atelier in
                  Grasse with one conviction: that fine fragrance deserves the same patience and
                  reverence as fine wine.
                </p>
                <p>
                  Our master perfumers still macerate each composition for a minimum of six weeks,
                  drawing on rare naturals — Grasse rose, Assam oud, Mysore sandalwood — sourced
                  directly from the growers who cultivate them.
                </p>
                <p>
                  Nothing leaves the atelier until it has been worn, lived with, and approved by the
                  people who made it.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <a
                href="/our-story"
                className="eyebrow mt-10 inline-block border-b border-accent pb-1 text-accent transition-colors hover:text-ink"
              >
                Read Our Story
              </a>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
