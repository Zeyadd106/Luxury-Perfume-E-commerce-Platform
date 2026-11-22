import type { Metadata } from "next";
import { OurStoryClient } from "@/components/story/OurStoryClient";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Our Story",
  description: `${brandConfig.name} — ${brandConfig.description}`,
};

export default function OurStoryPage() {
  return <OurStoryClient />;
}
