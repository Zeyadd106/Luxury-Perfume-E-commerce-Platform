import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { brandConfig } from "@/config/brand.config";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Fragrance Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — ${brandConfig.name}`,
      description: product.shortDescription,
      images: [{ url: product.images[0], width: 800, height: 1000 }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug && p.isActive);
  if (!product) notFound();
  return <ProductDetailClient />;
}
