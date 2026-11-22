"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { useProduct, useRelatedProducts, useReviews } from "@/lib/query/hooks";
import { useCart, useToast, useUI, useWishlist } from "@/lib/store/store";
import { useRequireAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import { Rating } from "@/components/ui/Rating";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn, afterMount } from "@/lib/utils";
import { useLang } from "@/lib/i18n/provider";

const RECENT_KEY = "atelier-recently-viewed";

function getRecentViewed(exclude: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
    return raw.filter((s) => s !== exclude).slice(0, 4);
  } catch {
    return [];
  }
}

function NotesPyramid({ product }: { product: NonNullable<ReturnType<typeof useProduct>["data"]> }) {
  const { t } = useLang();
  const [open, setOpen] = useState<string | null>("top");
  const groups = [
    { key: "top", label: t.product.topNotesLabel, icon: "◦", notes: product.topNotes, desc: t.product.topDesc },
    { key: "heart", label: t.product.heartNotesLabel, icon: "◦", notes: product.heartNotes, desc: t.product.heartDesc },
    { key: "base", label: t.product.baseNotesLabel, icon: "◦", notes: product.baseNotes, desc: t.product.baseDesc },
  ];
  return (
    <div className="divide-y divide-ink/10 border-y hairline">
      {groups.map((g) => (
        <div key={g.key}>
          <button
            onClick={() => setOpen(open === g.key ? null : g.key)}
            className="flex w-full items-center justify-between py-5 text-left"
            aria-expanded={open === g.key}
          >
            <span className="flex items-baseline gap-4">
              <span className="font-serif text-lg">{g.label}</span>
              <span className="hidden text-xs font-light text-muted sm:inline">{g.desc}</span>
            </span>
            <span className={cn("text-lg transition-transform duration-300", open === g.key && "rotate-45")}>+</span>
          </button>
          <div className={cn("grid transition-all duration-500", open === g.key ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0")}>
            <div className="overflow-hidden">
              <div className="flex flex-wrap gap-2">
                {g.notes.map((n) => (
                  <span key={n} className="border hairline px-3 py-1.5 text-xs font-light">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailClient() {
  const { t } = useLang();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: related = [] } = useRelatedProducts(slug);
  const { data: reviews = [] } = useReviews(product?.id ?? "");
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { push } = useToast();
  const { openCart } = useUI();
  const requireAuth = useRequireAuth();

  const [imageIndex, setImageIndex] = useState(0);
  const [sizeMl, setSizeMl] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  // recently viewed — write storage immediately, hydrate display state after mount
  useEffect(() => {
    if (!slug) return;
    const prev = getRecentViewed(slug);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify([slug, ...prev].slice(0, 8)));
    return afterMount(() => setRecentSlugs(prev));
  }, [slug]);

  // reset selections when the loaded product changes (render-time state adjustment)
  const [prevProduct, setPrevProduct] = useState(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    const first = product?.sizes.find((s) => s.inStock) ?? product?.sizes[0];
    setSizeMl(first?.ml ?? null);
    setImageIndex(0);
    setQuantity(1);
  }

  const selected = product?.sizes.find((s) => s.ml === sizeMl);
  const wished = product ? has(product.id) : false;
  const inStock = selected?.inStock ?? false;

  function handleAdd() {
    if (!product || !selected) return;
    if (!requireAuth(`add ${product.name} to your bag`)) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[imageIndex] ?? product.images[0],
        sizeMl: selected.ml,
        price: selected.price,
      },
      quantity
    );
    setAdded(true);
    push(t.product.addedToBag.replace("{name}", product.name));
    const btn = document.getElementById("add-to-bag-btn");
    if (btn) {
      gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" });
    }
    setTimeout(() => setAdded(false), 2200);
    setTimeout(() => openCart(), 500);
  }

  const breadcrumb = useMemo(() => {
    if (!product) return [];
    return [
      { label: t.nav.home, href: "/" },
      { label: t.nav.shop, href: "/shop" },
      { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` },
      { label: product.name, href: `/product/${product.slug}` },
    ];
  }, [product, t.nav.home, t.nav.shop]);

  if (isLoading) return <ProductSkeleton />;
  if (isError || !product) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-32 text-center">
        <p className="font-serif text-4xl font-light">{t.product.notFound}</p>
        <p className="mt-4 text-sm font-light text-muted">
          {t.product.notFoundHint}
        </p>
        <Link href="/shop" className="eyebrow mt-8 border border-ink px-8 py-3 hover:bg-ink hover:text-ivory transition-colors">
          {t.product.returnToShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:px-8">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted">
          {breadcrumb.map((b, i) => (
            <li key={b.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted/50">/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-ink">{b.label}</span>
              ) : (
                <Link href={b.href} className="hover:text-accent transition-colors">{b.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
            {product.images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${product.name} — view ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(max-width:1024px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-opacity duration-700",
                  i === imageIndex ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
            {product.badge && (
              <span className="absolute start-4 top-4 bg-ivory/90 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.18em] backdrop-blur">
                {product.badge === "sale" ? `${t.product.savePrefix} ${formatPrice((product.compareAtPrice ?? 0) - product.price)}` : product.badge}
              </span>
            )}
          </div>
          <div className="mt-3 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImageIndex(i)}
                className={cn(
                  "relative aspect-[4/5] w-20 overflow-hidden border transition-all sm:w-24",
                  i === imageIndex ? "border-ink opacity-100" : "hairline opacity-60 hover:opacity-100"
                )}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === imageIndex}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* info */}
        <div className="flex flex-col">
          <p className="eyebrow text-accent">{product.category} · {product.fragranceFamily}</p>
          <h1 className="mt-3 font-serif text-4xl font-light leading-tight sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewsCount} />
            <Link href="#reviews" className="text-xs font-light text-muted underline-offset-4 hover:text-accent hover:underline">
              {t.product.readReviews}
            </Link>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl">{selected ? formatPrice(selected.price) : formatPrice(product.price)}</span>
            {selected?.compareAtPrice && (
              <span className="text-base text-muted line-through">{formatPrice(selected.compareAtPrice)}</span>
            )}
            {selected?.compareAtPrice && (
              <span className="bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                {t.product.offPercent.replace("{n}", String(Math.round((1 - selected.price / selected.compareAtPrice) * 100)))}
              </span>
            )}
          </div>

          <p className="mt-6 text-[0.95rem] font-light leading-[1.9] text-ink/70">{product.description}</p>

          {/* size selector */}
          <div className="mt-8">
            <p className="eyebrow mb-3 text-muted">
              {t.product.size}{selected ? ` — ${selected.ml} ml` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.ml}
                  onClick={() => setSizeMl(s.ml)}
                  disabled={!s.inStock}
                  className={cn(
                    "border px-5 py-3 text-sm transition-all disabled:opacity-40",
                    sizeMl === s.ml ? "border-ink bg-ink text-ivory" : "hairline hover:border-ivory"
                  )}
                >
                  {s.ml} ml
                  {!s.inStock && <span className="ms-2 text-[0.625rem] uppercase tracking-wider opacity-70">{t.product.soldOut}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* quantity + add */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center border hairline">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-12 w-12 items-center justify-center hover:bg-ivory/10" aria-label={t.product.decreaseQty}>
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="flex h-12 w-12 items-center justify-center hover:bg-ivory/10" aria-label={t.product.increaseQty}>
                <Plus size={14} />
              </button>
            </div>
            <button
              id="add-to-bag-btn"
              onClick={handleAdd}
              disabled={!inStock || !selected}
              className={cn(
                "flex flex-1 items-center justify-center gap-3 py-4 text-[0.75rem] font-medium uppercase tracking-[0.24em] transition-all duration-300",
                added ? "bg-accent text-ink" : "bg-ink text-ivory hover:bg-accent hover:text-ink",
                (!inStock || !selected) && "cursor-not-allowed opacity-50"
              )}
            >
              {added ? (
                <>
                  <Check size={16} /> {t.product.added}
                </>
              ) : inStock ? (
                <>
                  <ShoppingBag size={16} /> {t.product.addToBag}{selected ? ` — ${formatPrice(selected.price * quantity)}` : ""}
                </>
              ) : (
                t.product.unavailable
              )}
            </button>
            <button
              onClick={() => {
                if (!product) return;
                toggle({ productId: product.id, slug: product.slug, addedAt: new Date().toISOString() });
                push(wished ? t.product.wishlistRemoved : t.product.wishlistSaved, "info");
              }}
              className={cn(
                "flex h-[52px] w-[52px] items-center justify-center border transition-colors",
                wished ? "border-accent bg-accent/10 text-accent" : "hairline hover:border-ivory"
              )}
              aria-label={wished ? t.product.wishlistRemoved : t.product.wishlistSaved}
              aria-pressed={wished}
            >
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t hairline pt-6">
            {[
              { icon: Truck, label: t.product.shippingOver },
              { icon: RotateCcw, label: t.product.returns30 },
              { icon: ShieldCheck, label: t.product.authentic },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon size={18} strokeWidth={1.25} className="text-accent" />
                <span className="text-[0.625rem] font-light leading-snug text-muted">{label}</span>
              </div>
            ))}
          </div>

          {/* accordions */}
          <div className="mt-10">
            <NotesPyramid product={product} />
          </div>

          {/* details */}
          <details className="group mt-2 border-b hairline">
            <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-medium tracking-wide">
              {t.product.detailsTitle}
              <span className="text-lg transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="pb-6">
              <p className="mb-4 text-sm font-light leading-relaxed text-ink/70">
                {product.description}
              </p>
              <p className="eyebrow mb-2 text-muted">{t.product.inci}</p>
              <p className="text-xs font-light leading-relaxed text-muted">{product.ingredients.join(" · ")}</p>
              <p className="mt-4 text-xs font-light text-muted">
                {t.product.concentration}: {product.category} · {t.product.genderLabel}: {product.gender} · {t.product.composedIn}
              </p>
            </div>
          </details>
        </div>
      </div>

      {/* reviews */}
      <section id="reviews" className="mt-24 border-t hairline pt-16">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <div>
            <p className="eyebrow mb-4 text-accent">{t.product.reviews}</p>
            <div className="font-serif text-6xl font-light">{product.rating.toFixed(1)}</div>
            <Rating value={product.rating} count={product.reviewsCount} className="mt-3" />
            <p className="mt-4 text-sm font-light text-muted">{t.product.basedOnReviews.replace("{n}", String(product.reviewsCount))}</p>
          </div>
          <div className="space-y-8">
            {reviews.slice(0, 5).map((r) => (
              <article key={r.id} className="border-b hairline pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.author}</p>
                    <p className="text-xs text-muted">{r.date}</p>
                  </div>
                  <Rating value={r.rating} size={12} />
                </div>
                <p className="mt-3 font-serif text-lg">{r.title}</p>
                <p className="mt-2 text-sm font-light leading-relaxed text-ink/70">{r.comment}</p>
                {r.verified && <p className="mt-2 text-[0.625rem] uppercase tracking-[0.18em] text-accent">{t.product.verifiedPurchase}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3 text-accent">{t.product.completeRitual}</p>
              <h2 className="font-serif text-3xl font-light sm:text-4xl">{t.product.related}</h2>
            </div>
            <Link href={`/shop?family=${product.fragranceFamily}`} className="eyebrow hidden text-muted hover:text-accent sm:block">
              {t.product.shopFamily.replace("{family}", product.fragranceFamily)}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* recently viewed */}
      {recentSlugs.length > 0 && (
        <RecentlyViewed slugs={recentSlugs} currentSlug={slug} />
      )}
    </div>
  );
}

function RecentlyViewed({ slugs, currentSlug }: { slugs: string[]; currentSlug: string }) {
  const { t } = useLang();
  return (
    <section className="mt-24">
      <div className="mb-10">
        <p className="eyebrow mb-3 text-accent">{t.product.pickUpWhere}</p>
        <h2 className="font-serif text-3xl font-light sm:text-4xl">{t.product.recentlyViewed}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
        {slugs
          .filter((s) => s !== currentSlug)
          .slice(0, 4)
          .map((s) => (
            <RecentCard key={s} slug={s} />
          ))}
      </div>
    </section>
  );
}

function RecentCard({ slug }: { slug: string }) {
  const { data: product, isLoading } = useProduct(slug);
  if (isLoading || !product) return <Skeleton className="aspect-[4/5] w-full" />;
  return <ProductCard product={product} />;
}

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Skeleton className="aspect-[4/5] w-full" />
        <div className="space-y-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
