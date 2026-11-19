import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal, Parallax } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Our Story",
  description: `${brandConfig.name} — ${brandConfig.description}`,
};

const values = [
  {
    title: "Rare Ingredients",
    body: "We source naturals directly from the growers who cultivate them — Grasse rose at dawn, Assam oud by appointment, Mysore sandalwood by lot. No brokers, no substitutions.",
  },
  {
    title: "Patient Maceration",
    body: "Every composition rests a minimum of six weeks before it is judged. Time is the ingredient most houses refuse to pay for. We built our atelier around it.",
  },
  {
    title: "Small Batches",
    body: "Our master perfumers blend in sessions of fifty flacons. When a scent is gone, it is gone — which is precisely the point.",
  },
  {
    title: "Lasting Craft",
    body: "We formulate for the dry-down, not the spritz. A fragrance that disappears by lunch was never finished.",
  },
];

export default function OurStoryPage() {
  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink text-ivory">
        <Parallax className="absolute inset-0" speed={0.15}>
          <Image src="/images/story-1.svg" alt="The Atelier Parfum workshop" fill priority sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <Container className="relative pb-20 pt-40">
          <Reveal>
            <p className="eyebrow mb-6 text-accent">Est. {brandConfig.founded} — Grasse, France</p>
            <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">
              The house of
              <span className="italic text-accent"> lasting impressions</span>
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* intro */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="eyebrow mb-6 text-accent">The Beginning</p>
              <p className="font-serif text-2xl font-light leading-[1.6] sm:text-3xl">
                “We did not set out to make perfume. We set out to make something that could hold a
                memory — and then discovered that memory was only the beginning.”
              </p>
              <p className="mt-6 text-sm font-light text-muted">— The Founding Perfumers</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* philosophy */}
      <section className="border-y hairline py-20 sm:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow mb-6 text-accent">Philosophy</p>
              <h2 className="font-serif text-4xl font-light leading-[1.1] sm:text-5xl">
                Restraint is the
                <span className="italic text-accent"> loudest statement</span>
              </h2>
              <div className="mt-8 space-y-5 text-[0.95rem] font-light leading-[1.9] text-ink/70">
                <p>
                  In an industry that measures success in projection and volume, we measure ours in
                  silence. The best compliment our fragrances receive is not &ldquo;what are you
                  wearing?&rdquo; but &ldquo;you smell incredible — I just can&rsquo;t place it.&rdquo;
                </p>
                <p>
                  Every accord is built to reveal itself slowly. The opening flatters, the heart
                  explains, and the base — the part most houses neglect — is where the real work lives.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="/images/story-2.svg" alt="Rare perfume ingredients" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* values */}
      <section className="bg-ink py-20 text-ivory sm:py-28">
        <Container>
          <Reveal className="mb-14 text-center">
            <p className="eyebrow mb-4 text-accent">The Four Commitments</p>
            <h2 className="font-serif text-4xl font-light sm:text-5xl">How We Work</h2>
          </Reveal>
          <div className="grid gap-px bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="bg-ink p-8">
                <p className="font-serif text-5xl font-light text-accent">0{i + 1}</p>
                <h3 className="mt-5 font-serif text-2xl font-light">{v.title}</h3>
                <p className="mt-4 text-sm font-light leading-relaxed text-ivory/60">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* craft */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src="/images/campaign-1.svg" alt="Atelier Parfum craftsmanship" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="eyebrow mb-6 text-accent">Craftsmanship</p>
              <h2 className="font-serif text-4xl font-light leading-[1.1] sm:text-5xl">
                Blended by hand,
                <span className="italic text-accent"> judged by nose</span>
              </h2>
              <p className="mt-6 text-[0.95rem] font-light leading-[1.9] text-ink/70">
                Our master perfumers train for a decade before they are allowed to sign a formula.
                Each blend is evaluated on blotter strips at hourly intervals for three days — because
                a fragrance is not finished when it smells good. It is finished when it keeps
                surprising you.
              </p>
              <div className="mt-10">
                <ButtonLink href="/collections" variant="primary" size="lg">
                  Explore the Collections
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
