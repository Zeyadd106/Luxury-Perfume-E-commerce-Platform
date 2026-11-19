import type { Metadata } from "next";
import { CollectionsClient } from "@/components/collections/CollectionsClient";
import { brandConfig } from "@/config/brand.config";

export const metadata: Metadata = {
  title: "Collections",
  description: `Explore the curated ${brandConfig.name} collections — signature, private, oud and limited editions.`,
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
