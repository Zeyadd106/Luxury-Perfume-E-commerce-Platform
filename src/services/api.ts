import type {
  Collection,
  NewsletterSubscription,
  Order,
  Product,
  Review,
} from "@/types";
import type { CheckoutFormValues, ContactFormValues } from "@/lib/validations/schemas";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { getReviewsForProduct } from "@/data/reviews";
import { delay } from "@/lib/utils";

/**
 * Mock service layer.
 *
 * Every function mirrors the signature a real REST/GraphQL backend would
 * expose. To integrate a real backend, replace the bodies with `fetch` calls
 * to the corresponding endpoints — all hooks and pages stay unchanged.
 */

export interface ProductFilters {
  query?: string;
  category?: string;
  family?: string;
  gender?: string;
  collection?: string;
  minPrice?: number;
  maxPrice?: number;
  badge?: "bestsellers" | "new" | "sale" | "limited";
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "popular";
}

function applyFilters(list: Product[], f: ProductFilters): Product[] {
  let out = list.filter((p) => p.isActive);
  if (f.query) {
    const q = f.query.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.topNotes.join(" ").toLowerCase().includes(q) ||
        p.heartNotes.join(" ").toLowerCase().includes(q) ||
        p.baseNotes.join(" ").toLowerCase().includes(q)
    );
  }
  if (f.category) out = out.filter((p) => p.category === f.category);
  if (f.family) out = out.filter((p) => p.fragranceFamily === f.family);
  if (f.gender) out = out.filter((p) => p.gender === f.gender || p.gender === "unisex");
  if (f.collection) out = out.filter((p) => p.collection === f.collection);
  if (f.minPrice !== undefined) out = out.filter((p) => p.price >= f.minPrice!);
  if (f.maxPrice !== undefined) out = out.filter((p) => p.price <= f.maxPrice!);
  if (f.badge === "bestsellers") out = out.filter((p) => p.isBestSeller);
  if (f.badge === "new") out = out.filter((p) => p.isNewArrival);
  if (f.badge === "sale") out = out.filter((p) => p.compareAtPrice !== undefined);
  if (f.badge === "limited") out = out.filter((p) => p.badge === "limited");
  return out;
}

function applySort(list: Product[], sort?: ProductFilters["sort"]): Product[] {
  const arr = [...list];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "newest":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "popular":
      return arr.sort((a, b) => b.reviewsCount - a.reviewsCount);
    default:
      return arr.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  await delay(250);
  return applySort(applyFilters(products, filters), filters.sort);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  await delay(200);
  return products.find((p) => p.slug === slug && p.isActive) ?? null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(150);
  return products.find((p) => p.id === id) ?? null;
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  await delay(150);
  const sameFamily = products.filter(
    (p) => p.id !== product.id && p.fragranceFamily === product.fragranceFamily && p.isActive
  );
  const sameCollection = products.filter(
    (p) => p.id !== product.id && p.collection === product.collection && p.isActive
  );
  const merged = [...sameCollection, ...sameFamily];
  const seen = new Set<string>();
  return merged.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true))).slice(0, limit);
}

export async function fetchCollections(): Promise<Collection[]> {
  await delay(200);
  return [...collections].sort((a, b) => a.order - b.order);
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  await delay(150);
  return collections.find((c) => c.slug === slug) ?? null;
}

export async function fetchCollectionProducts(slug: string): Promise<Product[]> {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return [];
  const set = new Set(collection.productSlugs);
  return products.filter((p) => set.has(p.slug) && p.isActive);
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  await delay(180);
  return getReviewsForProduct(productId);
}

export async function searchProducts(query: string, limit = 8): Promise<Product[]> {
  await delay(120);
  if (!query.trim()) return [];
  return applyFilters(products, { query }).slice(0, limit);
}

export async function subscribeNewsletter(payload: {
  email: string;
}): Promise<NewsletterSubscription> {
  await delay(600);
  return { email: payload.email, subscribedAt: new Date().toISOString() };
}

export async function submitContactForm(_payload: ContactFormValues): Promise<{ ok: boolean }> {
  void _payload;
  await delay(800);
  return { ok: true };
}

export interface CheckoutPayload {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: Omit<CheckoutFormValues, "shippingMethod" | "paymentMethod" | "discountCode">;
  shippingMethod: string;
  paymentMethod: string;
  discountCode?: string;
  items: Order["items"];
  totals: { subtotal: number; shipping: number; discount: number; total: number };
}

export async function placeOrder(payload: CheckoutPayload): Promise<Order> {
  await delay(900);
  return {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    items: payload.items,
    subtotal: payload.totals.subtotal,
    shipping: payload.totals.shipping,
    discount: payload.totals.discount,
    total: payload.totals.total,
    status: "processing",
    shippingAddress: { ...payload.shippingAddress, email: payload.customer.email, phone: payload.customer.phone },
    shippingMethod: payload.shippingMethod,
    paymentMethod: payload.paymentMethod,
    createdAt: new Date().toISOString(),
  };
}

// Auth — UI-only stubs. Replace with real provider calls when a backend exists.
export async function loginRequest(email: string): Promise<{ ok: boolean; user: { email: string } }> {
  await delay(700);
  return { ok: true, user: { email } };
}

export async function registerRequest(email: string): Promise<{ ok: boolean; user: { email: string } }> {
  await delay(800);
  return { ok: true, user: { email } };
}

export async function forgotPasswordRequest(_email: string): Promise<{ ok: boolean }> {
  void _email;
  await delay(700);
  return { ok: true };
}
