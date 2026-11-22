"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useToast } from "@/lib/store/store";

export const CUSTOMER_KEY = "atelier-customer-v1";

export interface StoredCustomer {
  email: string;
  name: string;
}

export function getCustomer(): StoredCustomer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CUSTOMER_KEY);
    return raw ? (JSON.parse(raw) as StoredCustomer) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCustomer() !== null;
}

/**
 * Returns a guard that verifies the visitor is signed in. When they aren't,
 * it shows a prompt and redirects to the login page with a `next` return URL.
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { push } = useToast();

  return useCallback(
    (action = "continue") => {
      if (isAuthenticated()) return true;
      push(`Please sign in or create an account to ${action}.`, "info");
      const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
      router.push(`/account/login${next}`);
      return false;
    },
    [router, pathname, push]
  );
}

/** Post-auth destination: honors ?next= when it is a safe internal path. */
export function postAuthTarget(fallback = "/account/profile"): string {
  if (typeof window === "undefined") return fallback;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
