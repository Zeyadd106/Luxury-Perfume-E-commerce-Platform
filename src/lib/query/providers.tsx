"use client";

import { useEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { subscribeCatalog } from "@/lib/catalog";

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserClient: QueryClient | undefined;

function getClient() {
  if (typeof window === "undefined") return makeClient();
  browserClient ??= makeClient();
  return browserClient;
}

/** Refetches every query whenever the product catalog changes (admin edits). */
function CatalogSync() {
  const queryClient = useQueryClient();
  useEffect(
    () =>
      subscribeCatalog(() => {
        void queryClient.invalidateQueries();
      }),
    [queryClient]
  );
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getClient()}>
      <CatalogSync />
      {children}
    </QueryClientProvider>
  );
}
