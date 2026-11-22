import type { FragranceFamily, Gender, Product, ProductBadge, ProductSize } from "@/types";
import { readCatalog } from "@/lib/catalog";

export interface ProductFormValues {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  collection: string;
  fragranceFamily: FragranceFamily;
  gender: Gender;
  badge: ProductBadge;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  sizes: ProductSize[];
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  ingredients: string;
  images: string;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const toList = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function productToForm(p: Product): ProductFormValues {
  return {
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    category: p.category,
    collection: p.collection,
    fragranceFamily: p.fragranceFamily,
    gender: p.gender,
    badge: p.badge,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    stock: p.stock,
    isFeatured: p.isFeatured,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isActive: p.isActive,
    sizes: p.sizes.map((s) => ({ ...s })),
    topNotes: p.topNotes.join(", "),
    heartNotes: p.heartNotes.join(", "),
    baseNotes: p.baseNotes.join(", "),
    ingredients: p.ingredients.join(", "),
    images: p.images.join("\n"),
  };
}

export function emptyForm(collectionSlug: string): ProductFormValues {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 250,
    compareAtPrice: null,
    category: "Eau de Parfum",
    collection: collectionSlug,
    fragranceFamily: "woody",
    gender: "unisex",
    badge: null,
    rating: 5,
    reviewsCount: 0,
    stock: 20,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    isActive: true,
    sizes: [
      { ml: 30, price: 185, inStock: true },
      { ml: 50, price: 260, inStock: true },
    ],
    topNotes: "",
    heartNotes: "",
    baseNotes: "",
    ingredients: "Alcohol Denat., Parfum (Fragrance), Aqua (Water)",
    images: "",
  };
}

export function formToProduct(v: ProductFormValues, existing?: Product): Product {
  const catalog = readCatalog();
  const baseSlug = v.slug || slugify(v.name);
  const slug = existing
    ? baseSlug
    : (() => {
        const taken = new Set(catalog.map((p) => p.slug));
        let s = baseSlug || "fragrance";
        let n = 2;
        while (taken.has(s)) s = `${baseSlug}-${n++}`;
        return s;
      })();
  const id = existing?.id ?? `p-${slug}`;
  return {
    ...build(v, id, slug),
    createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
  };
}

function build(v: ProductFormValues, id: string, slug: string): Omit<Product, "createdAt"> {
  const images = v.images
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    id,
    slug,
    name: v.name.trim(),
    shortDescription: v.shortDescription.trim(),
    description: v.description.trim(),
    price: v.price,
    compareAtPrice: v.compareAtPrice && v.compareAtPrice > v.price ? v.compareAtPrice : undefined,
    images: images.length ? images : ["/images/hero-alt.svg"],
    category: v.category,
    collection: v.collection,
    fragranceFamily: v.fragranceFamily,
    gender: v.gender,
    sizes: v.sizes.filter((s) => s.ml > 0),
    topNotes: toList(v.topNotes),
    heartNotes: toList(v.heartNotes),
    baseNotes: toList(v.baseNotes),
    ingredients: toList(v.ingredients),
    rating: Math.min(5, Math.max(0, v.rating)),
    reviewsCount: Math.max(0, Math.round(v.reviewsCount)),
    stock: Math.max(0, Math.round(v.stock)),
    isFeatured: v.isFeatured,
    isBestSeller: v.isBestSeller,
    isNewArrival: v.isNewArrival,
    isActive: v.isActive,
    badge: v.badge,
  };
}
