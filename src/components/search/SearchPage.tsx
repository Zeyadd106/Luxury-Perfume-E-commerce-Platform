"use client";

import { SearchX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSearchProducts } from "@/lib/query/hooks";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useLang } from "@/lib/i18n/provider";

function SearchResults() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { data: results = [], isLoading } = useSearchProducts(q, 24);

  return (
    <Container className="py-12 lg:py-16">
      <div className="mb-12">
        <p className="eyebrow mb-3 text-accent">{t.search.eyebrow}</p>
        <h1 className="font-serif text-4xl font-light sm:text-5xl">
          {q ? <>{t.search.resultsFor} <span className="italic">“{q}”</span></> : t.search.eyebrow}
        </h1>
        {!isLoading && q && (
          <p className="mt-3 text-sm font-light text-muted">
            {t.search.resultsCount.replace("{n}", String(results.length))}
          </p>
        )}
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center border border-dashed hairline py-24 text-center">
          <SearchX size={36} strokeWidth={1} className="mb-5 text-muted" />
          <p className="font-serif text-3xl font-light">{t.search.noResults}</p>
          <p className="mt-3 max-w-sm text-sm font-light text-muted">
            {t.search.noResultsHint}
          </p>
          <div className="mt-8">
            <ButtonLink href="/shop" variant="outline" size="sm">{t.search.browseAll}</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}

export function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
