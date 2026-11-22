import type { Product } from "@/types";
import { products as seedProducts } from "@/data/products";

/**
 * Client-side product catalog.
 *
 * The seed catalog lives in `src/data/products.ts`. Admin edits are persisted
 * to localStorage under CATALOG_KEY and broadcast so every open tab and every
 * TanStack Query cache refreshes immediately. On the server (SSR/prerender)
 * the seed catalog is returned unchanged.
 */

export const CATALOG_KEY = "zein-catalog-v1";
export const CATALOG_EVENT = "zein:catalog-changed";

/** In-memory fallback so edits survive even if localStorage is unavailable. */
let memoryCatalog: Product[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function readCatalog(): Product[] {
  if (!isBrowser()) return seedProducts;
  try {
    const raw = window.localStorage.getItem(CATALOG_KEY);
    // No stored catalog → in-memory copy or seed. A stored array (even empty)
    // is authoritative, so admin deletions are never resurrected on refresh.
    if (raw === null) return memoryCatalog ?? seedProducts;
    const parsed = JSON.parse(raw) as Product[];
    if (Array.isArray(parsed)) {
      memoryCatalog = parsed;
      return parsed;
    }
    return memoryCatalog ?? seedProducts;
  } catch {
    return memoryCatalog ?? seedProducts;
  }
}

function notify() {
  window.dispatchEvent(new Event(CATALOG_EVENT));
}

export function writeCatalog(next: Product[]) {
  memoryCatalog = next;
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CATALOG_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode / quota) — in-memory copy still applies.
  }
  notify();
}

export function upsertProduct(product: Product) {
  const list = readCatalog();
  const idx = list.findIndex((p) => p.id === product.id);
  const next = idx >= 0 ? list.map((p) => (p.id === product.id ? product : p)) : [product, ...list];
  writeCatalog(next);
}

export function removeProduct(id: string) {
  writeCatalog(readCatalog().filter((p) => p.id !== id));
}

export function resetCatalog() {
  memoryCatalog = null;
  if (!isBrowser()) return;
  window.localStorage.removeItem(CATALOG_KEY);
  notify();
}

/** Subscribe to catalog changes in this tab (same-tab admin edits). */
export function subscribeCatalog(cb: () => void): () => void {
  if (!isBrowser()) return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === CATALOG_KEY || e.key === null) cb();
  };
  window.addEventListener(CATALOG_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CATALOG_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}
