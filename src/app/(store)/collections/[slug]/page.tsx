import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/data/collections";
import { CollectionDetailClient } from "@/components/collections/CollectionDetailClient";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.name,
    description: collection.description,
    openGraph: { images: [{ url: collection.image, width: 1600, height: 1100 }] },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();
  return <CollectionDetailClient slug={slug} />;
}
