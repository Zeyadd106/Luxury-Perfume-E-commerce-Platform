"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { useLang } from "@/lib/i18n/provider";

export function EditorialCampaign() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[50vh] lg:min-h-[80vh]">
          <Image
            src="/images/campaign-2.svg"
            alt="Editorial campaign — Zein"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-20">
          <Reveal>
            <p className="eyebrow mb-6 text-accent">{t.home.editorialEyebrow}</p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] sm:text-5xl lg:text-6xl">
              {t.home.editorialTitleA}
              <span className="italic text-accent"> {t.home.editorialTitleB}</span>
            </h2>
            <p className="mt-6 max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/60">
              {t.home.editorialBody}
            </p>
            <div className="mt-10">
              <ButtonLink href="/collections/limited" variant="light" size="lg">
                {t.home.editorialCta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
