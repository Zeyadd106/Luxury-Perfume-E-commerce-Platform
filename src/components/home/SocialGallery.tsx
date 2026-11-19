import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcons";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";
import { brandConfig } from "@/config/brand.config";

const images = [1, 2, 3, 4, 5, 6].map((i) => `/images/social-${i}.svg`);

export function SocialGallery() {
  return (
    <Section className="py-20 sm:py-24">
      <Container>
        <Reveal className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="eyebrow mb-3 text-accent">@{brandConfig.name.toLowerCase().replace(/\s+/g, "")}</p>
            <h2 className="font-serif text-4xl font-light sm:text-5xl">Worn &amp; Loved</h2>
          </div>
          <a
            href={brandConfig.socialLinks.find((s) => s.icon === "instagram")?.href ?? "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow flex items-center gap-2 border hairline px-6 py-3 transition-colors hover:border-ink"
          >
            <SocialIcon name="instagram" size={14} /> Follow on Instagram <ArrowUpRight size={12} />
          </a>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {images.map((src, i) => (
              <Link
                key={src}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden bg-ink/5"
                aria-label={`Instagram post ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`Atelier Parfum lifestyle ${i + 1}`}
                  fill
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-300 group-hover:bg-ink/30 group-hover:opacity-100">
                  <SocialIcon name="instagram" size={20} className="text-ivory" />
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
