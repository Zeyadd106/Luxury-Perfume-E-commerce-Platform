"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, WishlistItem } from "@/types";
import { brandConfig } from "@/config/brand.config";
import { afterMount } from "@/lib/utils";

/* ----------------------------------- cart ---------------------------------- */

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, sizeMl: number) => void;
  updateQuantity: (productId: string, sizeMl: number, quantity: number) => void;
  clearCart: () => void;
  lastAddedAt: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "atelier-cart-v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const hydrated = useRef(false);

  useEffect(
    () =>
      afterMount(() => {
        setItems(loadCart());
        hydrated.current = true;
      }),
    []
  );

  useEffect(() => {
    if (hydrated.current) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId && i.sizeMl === item.sizeMl);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Math.min(10, next[idx].quantity + quantity) };
        return next;
      }
      return [...prev, { ...item, quantity }];
    });
    setLastAddedAt(Date.now());
  }, []);

  const removeItem = useCallback((productId: string, sizeMl: number) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.sizeMl === sizeMl)));
  }, []);

  const updateQuantity = useCallback((productId: string, sizeMl: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.productId === productId && i.sizeMl === sizeMl))
        : prev.map((i) =>
            i.productId === productId && i.sizeMl === sizeMl ? { ...i, quantity: Math.min(10, quantity) } : i
          )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    return { items, count, subtotal, addItem, removeItem, updateQuantity, clearCart, lastAddedAt };
  }, [items, addItem, removeItem, updateQuantity, clearCart, lastAddedAt]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function useFreeShippingProgress() {
  const { subtotal } = useCart();
  const threshold = brandConfig.freeShippingThreshold;
  return {
    threshold,
    remaining: Math.max(0, threshold - subtotal),
    progress: Math.min(1, subtotal / threshold),
    eligible: subtotal >= threshold,
  };
}

/* --------------------------------- wishlist -------------------------------- */

interface WishlistContextValue {
  items: WishlistItem[];
  has: (productId: string) => boolean;
  toggle: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const WISHLIST_KEY = "atelier-wishlist-v1";

function loadWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const hydrated = useRef(false);

  useEffect(
    () =>
      afterMount(() => {
        setItems(loadWishlist());
        hydrated.current = true;
      }),
    []
  );

  useEffect(() => {
    if (hydrated.current) window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }, [items]);

  const has = useCallback((productId: string) => items.some((i) => i.productId === productId), [items]);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) =>
      prev.some((i) => i.productId === item.productId)
        ? prev.filter((i) => i.productId !== item.productId)
        : [...prev, item]
    );
  }, []);

  const value = useMemo(() => ({ items, has, toggle }), [items, has, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

/* ------------------------------------ UI ----------------------------------- */

interface UIContextValue {
  cartOpen: boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  quickViewSlug: string | null;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleSearch = useCallback(() => setSearchOpen((v) => !v), []);
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((v) => !v), []);
  const closeQuickView = useCallback(() => setQuickViewSlug(null), []);

  const value = useMemo<UIContextValue>(
    () => ({
      cartOpen,
      searchOpen,
      mobileMenuOpen,
      quickViewSlug,
      openCart,
      closeCart,
      openSearch,
      closeSearch,
      toggleSearch,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu,
      openQuickView: setQuickViewSlug,
      closeQuickView,
    }),
    [cartOpen, searchOpen, mobileMenuOpen, quickViewSlug, openCart, closeCart, openSearch, closeSearch, toggleSearch, openMobileMenu, closeMobileMenu, toggleMobileMenu, closeQuickView]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}

/* ----------------------------------- toast --------------------------------- */

export interface Toast {
  id: number;
  message: string;
  tone: "success" | "info" | "error";
}

interface ToastContextValue {
  toasts: Toast[];
  push: (message: string, tone?: Toast["tone"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const push = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ toasts, push }), [toasts, push]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ------------------------------ composed store ----------------------------- */

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <UIProvider>
          <ToastProvider>{children}</ToastProvider>
        </UIProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
