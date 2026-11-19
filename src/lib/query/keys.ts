export const queryKeys = {
  all: ["atelier"] as const,
  products: () => [...queryKeys.all, "products"] as const,
  productsFiltered: (filters: object) =>
    [...queryKeys.products(), "filtered", filters] as const,
  product: (slug: string) => [...queryKeys.all, "product", slug] as const,
  related: (slug: string) => [...queryKeys.all, "related", slug] as const,
  collections: () => [...queryKeys.all, "collections"] as const,
  collection: (slug: string) => [...queryKeys.all, "collection", slug] as const,
  collectionProducts: (slug: string) => [...queryKeys.all, "collection-products", slug] as const,
  reviews: (productId: string) => [...queryKeys.all, "reviews", productId] as const,
  search: (query: string) => [...queryKeys.all, "search", query] as const,
} as const;
