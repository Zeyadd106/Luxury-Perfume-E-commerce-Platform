"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useSearchProducts, useProducts } from "@/lib/query/hooks";
import { useUI } from "@/lib/store/store";
import { formatPrice } from "@/lib/utils";
import { brandConfig } from "@/config/brand.config";

const RECENT_KEY = "atelier-recent-searches";

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data: results = [], isFetching } = useSearchProducts(query, 6);
  const { data: popular = [] } = useProducts({ badge: "bestsellers", sort: "popular" });

  useEffect(() => {
    if (searchOpen) {
      const id = setTimeout(() => {
        setRecent(getRecent());
        inputRef.current?.focus();
      }, 60);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(id);
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  // Animate open/close
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = gsap.context(() => {
      if (searchOpen) {
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.fromTo(
          overlay.querySelectorAll("[data-search-item]"),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.15, ease: "power3.out" }
        );
      } else {
        gsap.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.in" });
      }
    }, overlay);
    return () => ctx.revert();
  }, [searchOpen]);

  function submit(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 5);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecent(next);
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[60] bg-ivory ${searchOpen ? "" : "pointer-events-none opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="mx-auto flex min-h-full max-w-5xl flex-col px-5 py-6 sm:px-8">
        <div className="flex items-center justify-between" data-search-item>
          <p className="eyebrow text-muted">Search {brandConfig.name}</p>
          <button onClick={closeSearch} className="flex h-10 w-10 items-center justify-center hover:text-accent" aria-label="Close search">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="mt-10 border-b-2 border-ink pb-4"
          data-search-item
        >
          <div className="flex items-center gap-4">
            <Search size={26} strokeWidth={1} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fragrances, notes, collections…"
              className="w-full bg-transparent font-serif text-2xl font-light placeholder:text-muted/50 focus:outline-none sm:text-4xl"
              aria-label="Search query"
            />
          </div>
        </form>

        <div className="mt-10 flex-1 overflow-y-auto">
          {query.trim().length > 0 ? (
            <div data-search-item>
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow text-muted">
                  {isFetching ? "Searching…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
                </p>
                {results.length > 0 && (
                  <button
                    onClick={() => submit(query)}
                    className="eyebrow flex items-center gap-1 text-accent hover:underline"
                  >
                    View all <ArrowRight size={12} />
                  </button>
                )}
              </div>
              {results.length === 0 && !isFetching ? (
                <p className="font-serif text-xl font-light text-muted">
                  No results for “{query}”. Try a fragrance family, note, or collection.
                </p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={closeSearch}
                        className="group flex items-center gap-4 border-b hairline py-3"
                      >
                        <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-ink/5">
                          <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-serif text-lg">{p.name}</span>
                          <span className="block truncate text-xs text-muted">{p.fragranceFamily} · {p.category}</span>
                        </span>
                        <span className="text-sm">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2" data-search-item>
              {recent.length > 0 && (
                <div>
                  <p className="eyebrow mb-4 text-muted">Recent searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => submit(r)}
                        className="border hairline px-4 py-2 text-xs font-light tracking-wide hover:border-accent hover:text-accent"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="eyebrow mb-4 text-muted">Popular now</p>
                <ul className="space-y-1">
                  {popular.slice(0, 5).map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.slug}`} onClick={closeSearch} className="group flex items-center justify-between py-2 text-sm font-light hover:text-accent">
                        <span>{p.name}</span>
                        <span className="text-xs text-muted">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
