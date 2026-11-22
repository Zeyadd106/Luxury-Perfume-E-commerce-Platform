import type { Order, OrderStatus } from "@/types";

/**
 * Client-side order store. Checkout writes orders to localStorage under
 * ORDERS_KEY (newest first); the admin dashboard reads and updates them here.
 */

export const ORDERS_KEY = "atelier-orders-v1";
export const ORDERS_EVENT = "zein:orders-changed";

let memoryOrders: Order[] | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

export function readOrders(): Order[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    if (raw === null) return memoryOrders ?? [];
    const parsed = JSON.parse(raw) as Order[];
    if (Array.isArray(parsed)) {
      memoryOrders = parsed;
      return parsed;
    }
    return memoryOrders ?? [];
  } catch {
    return memoryOrders ?? [];
  }
}

export function writeOrders(next: Order[]) {
  memoryOrders = next;
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — in-memory copy still applies */
  }
  window.dispatchEvent(new Event(ORDERS_EVENT));
  window.dispatchEvent(new StorageEvent("storage", { key: ORDERS_KEY }));
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  writeOrders(readOrders().map((o) => (o.id === id ? { ...o, status } : o)));
}

export function subscribeOrders(cb: () => void): () => void {
  if (!isBrowser()) return () => {};
  window.addEventListener(ORDERS_EVENT, cb);
  return () => window.removeEventListener(ORDERS_EVENT, cb);
}
