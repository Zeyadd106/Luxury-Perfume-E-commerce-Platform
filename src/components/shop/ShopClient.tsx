"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/lib/query/hooks";
import type { ProductFilters } from "@/services/api";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { useLang } from "@/lib/i18n/provider";
import { Select } from "@/components/ui/fields";
import { categories, fragranceFamilies } from "@/data/products";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const PAGE_SIZE = 9;
const SORTS = [
  { value: "featured", labelKey: "sortFeatured" },
  { value: "popular", labelKey: "sortPopular" },
  { value: "newest", labelKey: "sortNewest" },
  { value: "price-asc", labelKey: "sortPriceAsc" },
  { value: "price-desc", labelKey: "sortPriceDesc" },
] as const;

const GENDERS = [
  { value: "", labelKey: "all" },
  { value: "women", labelKey: "women" },
  { value: "men", labelKey: "men" },
  { value: "unisex", labelKey: "unisex" },
] as const;

interface ShopState extends ProductFilters {
  page: number;
}

function ShopInner() {
  const { t } = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = useMemo<ShopState>(() => {
    const filter = searchParams.get("filter");
    const badge =
      filter === "bestsellers" ? "bestsellers" : filter === "new" ? "new" : filter === "sale" ? "sale" : filter === "limited" ? "limited" : undefined;
    return {
      query: searchParams.get("q") ?? "",
      family: searchParams.get("family") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      collection: searchParams.get("collection") ?? undefined,
      gender: searchParams.get("gender") ?? undefined,
      badge,
      sort: (searchParams.get("sort") as ShopState["sort"]) ?? "featured",
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useState<ShopState>(initial);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // lock background scroll while the mobile filter drawer is open
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filtersOpen]);

  const { data: products = [], isLoading } = useProducts({
    query: state.query || undefined,
    family: state.family,
    category: state.category,
    gender: state.gender,
    collection: state.collection,
    badge: state.badge,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    sort: state.sort,
  });

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const page = Math.min(state.page, totalPages);
  const visible = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fam = t.home as unknown as Record<string, string>;
  const familyLabel = (v: string) => fam[`family${v[0].toUpperCase()}${v.slice(1)}Label`] ?? v;
  const genderLabel = (v: string) => (v === "women" ? t.shop.women : v === "men" ? t.shop.men : v === "unisex" ? t.shop.unisex : v);
  const badgeLabel = (v: string) => (v === "new" ? t.shop.newArrival : v === "bestseller" ? t.shop.bestseller : v === "limited" ? t.shop.limited : t.shop.sale);
  const sortLabel = (v: string) => t.shop[(SORTS.find((x) => x.value === v)?.labelKey ?? "sortFeatured") as keyof typeof t.shop];

  const activeChips: { label: string; clear: () => void }[] = [];
  if (state.family) activeChips.push({ label: familyLabel(state.family), clear: () => setState((s) => ({ ...s, family: undefined, page: 1 })) });
  if (state.category) activeChips.push({ label: state.category, clear: () => setState((s) => ({ ...s, category: undefined, page: 1 })) });
  if (state.gender) activeChips.push({ label: genderLabel(state.gender), clear: () => setState((s) => ({ ...s, gender: undefined, page: 1 })) });
  if (state.collection) activeChips.push({ label: `${t.shop.collections}: ${state.collection}`, clear: () => setState((s) => ({ ...s, collection: undefined, page: 1 })) });
  if (state.badge) activeChips.push({ label: badgeLabel(state.badge), clear: () => setState((s) => ({ ...s, badge: undefined, page: 1 })) });
  if (state.minPrice !== undefined || state.maxPrice !== undefined)
    activeChips.push({ label: t.shop.priceFilter, clear: () => setState((s) => ({ ...s, minPrice: undefined, maxPrice: undefined, page: 1 })) });
  if (state.query) activeChips.push({ label: `“${state.query}”`, clear: () => setState((s) => ({ ...s, query: "", page: 1 })) });

  const hasFilters = activeChips.length > 0;

  function clearAll() {
    setState({ page: 1, sort: "featured" });
    router.replace("/shop");
  }


  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      {/* header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-3 text-accent">{t.shop.title}</p>
          <h1 className="font-serif text-4xl font-light sm:text-5xl">{t.shop.title}</h1>
          <p className="mt-3 text-sm font-light text-muted">
            {isLoading ? t.shop.loading : t.shop.resultsCount.replace("{n}", String(products.length))}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 border hairline px-4 py-2.5 text-[0.6875rem] uppercase tracking-[0.18em] lg:hidden"
          >
            <SlidersHorizontal size={13} /> {t.shop.filters}
          </button>
          <Select
            value={state.sort}
            onChange={(e) => setState((s) => ({ ...s, sort: e.target.value as ShopState["sort"], page: 1 }))}
            aria-label={t.shop.sort}
            className="w-48 text-xs"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{sortLabel(s.value)}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* active chips */}
      {hasFilters && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <button
              key={c.label}
              onClick={c.clear}
              className="flex items-center gap-1.5 border hairline bg-ivory px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] hover:border-accent"
            >
              {c.label} <X size={11} />
            </button>
          ))}
          <button onClick={clearAll} className="eyebrow px-2 py-1 text-muted underline-offset-4 hover:text-accent hover:underline">
            {t.shop.clearAll}
          </button>
        </div>
      )}

      <div className="flex gap-12">
        {/* sidebar */}
        <aside
          className={cn(
            "w-60 shrink-0",
            filtersOpen
              ? "fixed inset-0 z-[70] block overflow-y-auto bg-ink text-ivory"
              : "hidden lg:block"
          )}
        >
          {filtersOpen && (
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ivory/10 bg-ink px-5 py-4">
              <p className="eyebrow text-ivory">{t.shop.filters}</p>
              <div className="flex items-center gap-4">
                <button onClick={clearAll} className="eyebrow text-accent hover:text-ivory">
                  {t.shop.clearAll}
                </button>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-9 w-9 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-accent hover:text-accent"
                  aria-label={t.nav.close}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}
          <div className={cn("space-y-8", filtersOpen ? "p-5 pb-28" : "")}>
            <FilterPanel state={state} setState={setState} />
          </div>
          {filtersOpen && (
            <div className="fixed inset-x-0 bottom-0 z-10 border-t border-ivory/10 bg-ink p-4">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-accent py-3.5 text-[0.75rem] font-medium uppercase tracking-[0.24em] text-ink transition-colors hover:bg-ivory"
              >
                {t.shop.resultsCount.replace("{n}", String(products.length))}
              </button>
            </div>
          )}
        </aside>
        {filtersOpen && <div className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />}

        {/* grid */}
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : visible.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
                {visible.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 4} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination page={page} total={totalPages} onChange={(p) => setState((s) => ({ ...s, page: p }))} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ state, setState }: { state: ShopState; setState: React.Dispatch<React.SetStateAction<ShopState>> }) {
  const { t } = useLang();
  const update = (patch: Partial<ShopState>) => setState((s) => ({ ...s, ...patch, page: 1 }));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-4 text-muted">{t.shop.family}</p>
        <ul className="space-y-2.5">
          {fragranceFamilies.map((f) => (
            <li key={f.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-light">
                <input
                  type="radio"
                  name="family"
                  checked={state.family === f.value}
                  onChange={() => update({ family: state.family === f.value ? undefined : f.value })}
                  className="accent-[#facc15]"
                />
                {(() => { const k = `family${f.value[0].toUpperCase()}${f.value.slice(1)}Label`; return (t.home as unknown as Record<string,string>)[k] ?? f.label; })()}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-4 text-muted">{t.shop.concentration}</p>
        <ul className="space-y-2.5">
          {categories.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-light">
                <input
                  type="checkbox"
                  checked={state.category === c}
                  onChange={() => update({ category: state.category === c ? undefined : c })}
                  className="accent-[#facc15]"
                />
                {c}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-4 text-muted">{t.shop.forLabel}</p>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              onClick={() => update({ gender: state.gender === g.value || (!g.value && !state.gender) ? undefined : g.value || undefined })}
              className={cn(
                "border px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
                (g.value === "" ? !state.gender : state.gender === g.value)
                  ? "border-ink bg-ink text-ivory"
                  : "hairline hover:border-ivory"
              )}
            >
              {t.shop[g.labelKey]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4 text-muted">{t.shop.collections}</p>
        <div className="flex flex-wrap gap-2">
          {([
            { value: undefined, labelKey: "all", kind: "collection" as const },
            { value: "signature", labelKey: "colSignature", kind: "collection" as const },
            { value: "private", labelKey: "colPrivate", kind: "collection" as const },
            { value: "summer", labelKey: "colSummer", kind: "collection" as const },
            { value: "limited", labelKey: "colLimited", kind: "collection" as const },
            { value: "new", labelKey: "colNewArrivals", kind: "badge" as const },
          ] as const).map((c) => {
            const active = c.kind === "collection" ? state.collection === c.value : state.badge === "new";
            return (
              <button
                key={c.labelKey}
                onClick={() =>
                  update(
                    c.kind === "collection"
                      ? { collection: c.value, badge: c.value ? undefined : undefined }
                      : { badge: state.badge === "new" ? undefined : "new" }
                  )
                }
                className={cn(
                  "border px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] transition-colors",
                  active ? "border-ink bg-ink text-ivory" : "hairline hover:border-ivory"
                )}
              >
                {t.shop[c.labelKey]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-4 text-muted">{t.shop.price}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t.shop.min}
            value={state.minPrice ?? ""}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border-b hairline bg-transparent px-0 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            placeholder={t.shop.max}
            value={state.maxPrice ?? ""}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border-b hairline bg-transparent px-0 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center border border-dashed hairline py-24 text-center">
      <p className="font-serif text-3xl font-light">{t.shop.empty}</p>
      <p className="mt-3 max-w-sm text-sm font-light text-muted">
        {t.shop.emptyHint}
      </p>
      <button onClick={onClear} className="eyebrow mt-8 border border-ink px-8 py-3 transition-colors hover:bg-ink hover:text-ivory">
        {t.shop.clearFilters}
      </button>
    </div>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  const { t } = useLang();
  return (
    <nav className="mt-14 flex items-center justify-center gap-2" aria-label={t.shop.sort}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="border hairline px-4 py-2 text-xs disabled:opacity-30 hover:border-ivory"
      >
        {t.shop.previous}
      </button>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={cn(
            "h-10 w-10 text-sm transition-colors",
            page === i + 1 ? "bg-ink text-ivory" : "hairline hover:border-ivory"
          )}
          aria-current={page === i + 1 ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= total}
        className="border hairline px-4 py-2 text-xs disabled:opacity-30 hover:border-ivory"
      >
        {t.shop.next}
      </button>
    </nav>
  );
}

export function ShopPage() {
  return (
    <Suspense>
      <ShopInner />
    </Suspense>
  );
}
