"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal, Parallax } from "@/components/animations/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { brandConfig } from "@/config/brand.config";
import { useLang } from "@/lib/i18n/provider";

export function OurStoryClient() {
  const { t } = useLang();
  const st = t.story;

  const values = [
    { title: st.val1Title, body: st.val1Body },
    { title: st.val2Title, body: st.val2Body },
    { title: st.val3Title, body: st.val3Body },
    { title: st.val4Title, body: st.val4Body },
  ];

  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink text-ivory">
        <Parallax className="absolute inset-0" speed={0.15}>
          <Image src="/images/story-1.svg" alt="The Zein workshop" fill priority sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <Container className="relative pb-20 pt-40">
          <Reveal>
            <p className="eyebrow mb-6 text-accent">{st.est.replace("{year}", String(brandConfig.founded))}</p>
            <h1 className="max-w-3xl font-serif text-5xl font-light leading-[1.05] sm:text-6xl lg:text-7xl">
              {st.heroTitleA}
              <span className="italic text-accent"> {st.heroTitleB}</span>
            </h1>
          </Reveal>
        </Container>
      </section>

      {/* intro */}
      <section className="bg-ivory py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="eyebrow mb-6 text-accent">{st.beginning}</p>
              <p className="font-serif text-2xl font-light leading-[1.6] sm:text-3xl">{st.quote}</p>
              <p className="mt-6 text-sm font-light text-muted">{st.foundedBy}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* philosophy */}
      <section className="border-y hairline py-20 sm:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="eyebrow mb-6 text-accent">{st.philosophy}</p>
              <h2 className="font-serif text-4xl font-light leading-[1.1] sm:text-5xl">
                {st.philosophyTitleA}
                <span className="italic text-accent"> {st.philosophyTitleB}</span>
              </h2>
              <div className="mt-8 space-y-5 text-[0.95rem] font-light leading-[1.9] text-ink/70">
                <p>{st.philosophyP1}</p>
                <p>{st.philosophyP2}</p>
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
            <p className="eyebrow mb-4 text-accent">{st.commitments}</p>
            <h2 className="font-serif text-4xl font-light sm:text-5xl">{st.howWeWork}</h2>
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
                <Image src="/images/campaign-1.svg" alt="Zein craftsmanship" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="eyebrow mb-6 text-accent">{st.craft}</p>
              <h2 className="font-serif text-4xl font-light leading-[1.1] sm:text-5xl">
                {st.craftTitleA}
                <span className="italic text-accent"> {st.craftTitleB}</span>
              </h2>
              <p className="mt-6 text-[0.95rem] font-light leading-[1.9] text-ink/70">{st.craftBody}</p>
              <div className="mt-10">
                <ButtonLink href="/collections" variant="primary" size="lg">
                  {st.exploreCollections}
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
