import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export function EditorialCampaign() {
  return (
    <section className="relative overflow-hidden bg-ink text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[50vh] lg:min-h-[80vh]">
          <Image
            src="/images/campaign-2.svg"
            alt="Editorial campaign — Atelier Parfum"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-20">
          <Reveal>
            <p className="eyebrow mb-6 text-accent">The Autumn Edit</p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] sm:text-5xl lg:text-6xl">
              Amber, smoke and
              <span className="italic text-accent"> golden hour.</span>
            </h2>
            <p className="mt-6 max-w-md text-[0.95rem] font-light leading-relaxed text-ivory/60">
              Our seasonal edit gathers the house&rsquo;s warmest compositions — amber extraits,
              smoky woods and resins that bloom as the light fades.
            </p>
            <div className="mt-10">
              <ButtonLink href="/collections/limited" variant="light" size="lg">
                Explore the Edit
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
