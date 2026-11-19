"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchCollectionBySlug,
  fetchCollectionProducts,
  fetchCollections,
  fetchProductBySlug,
  fetchProducts,
  fetchRelatedProducts,
  fetchReviews,
  placeOrder,
  searchProducts,
  submitContactForm,
  subscribeNewsletter,
  type CheckoutPayload,
  type ProductFilters,
} from "@/services/api";
import type { ContactFormValues, NewsletterFormValues } from "@/lib/validations/schemas";
import { queryKeys } from "./keys";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.productsFiltered(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: queryKeys.related(slug),
    queryFn: async () => {
      const product = await fetchProductBySlug(slug);
      if (!product) return [];
      return fetchRelatedProducts(product);
    },
    enabled: !!slug,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections(),
    queryFn: fetchCollections,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCollection(slug: string) {
  return useQuery({
    queryKey: queryKeys.collection(slug),
    queryFn: () => fetchCollectionBySlug(slug),
    enabled: !!slug,
  });
}

export function useCollectionProducts(slug: string) {
  return useQuery({
    queryKey: queryKeys.collectionProducts(slug),
    queryFn: () => fetchCollectionProducts(slug),
    enabled: !!slug,
  });
}

export function useReviews(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews(productId),
    queryFn: () => fetchReviews(productId),
    enabled: !!productId,
  });
}

export function useSearchProducts(query: string, limit = 8) {
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchProducts(query, limit),
    enabled: query.trim().length > 0,
    staleTime: 30 * 1000,
  });
}

export function useNewsletterSubscription() {
  return useMutation({
    mutationFn: (values: NewsletterFormValues) => subscribeNewsletter({ email: values.email }),
  });
}

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: (values: ContactFormValues) => submitContactForm(values),
  });
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => placeOrder(payload),
  });
}
