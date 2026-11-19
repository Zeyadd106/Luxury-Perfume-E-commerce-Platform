import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { BrandStory } from "@/components/home/BrandStory";
import { BestSellers } from "@/components/home/BestSellers";
import { FragranceDiscovery } from "@/components/home/FragranceDiscovery";
import { EditorialCampaign } from "@/components/home/EditorialCampaign";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { SocialGallery } from "@/components/home/SocialGallery";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: { absolute: `${brandConfig.name} — ${brandConfig.tagline}` },
  description: brandConfig.description,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCollection />
      <BrandStory />
      <BestSellers />
      <FragranceDiscovery />
      <EditorialCampaign />
      <NewsletterSection />
      <SocialGallery />
    </>
  );
}
