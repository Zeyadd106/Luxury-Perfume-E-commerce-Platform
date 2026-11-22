"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product, ProductSize } from "@/types";
import { collections } from "@/data/collections";
import { products as seedProducts } from "@/data/products";
import {
  emptyForm,
  formToProduct,
  productToForm,
  slugify,
  type ProductFormValues,
} from "@/lib/admin/productFactory";
import { readCatalog, upsertProduct } from "@/lib/catalog";
import { formatPrice, afterMount } from "@/lib/utils";
import { useToast } from "@/lib/store/store";
import { useLang } from "@/lib/i18n/provider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/fields";

const FAMILIES = ["woody", "floral", "oriental", "fresh", "citrus", "gourmand", "aromatic"] as const;
const GENDERS = ["women", "men", "unisex"] as const;
const CATEGORIES = ["Eau de Parfum", "Eau de Toilette", "Extrait de Parfum", "Parfum"] as const;
const BADGES = [
  { value: "", labelKey: "none" },
  { value: "new", labelKey: "badgeNew" },
  { value: "bestseller", labelKey: "badgeBestseller" },
  { value: "limited", labelKey: "badgeLimited" },
  { value: "sale", labelKey: "badgeSale" },
] as const;

const imageSuggestions = [...new Set(seedProducts.flatMap((p) => p.images))];

export function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const { push } = useToast();
  const { t } = useLang();

  const [v, setV] = useState<ProductFormValues | null>(null);
  const [existing, setExisting] = useState<Product | undefined>(undefined);
  const [missing, setMissing] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Resolve the live catalog after mount — localStorage isn't available during SSR.
  useEffect(
    () =>
      afterMount(() => {
        const catalog = readCatalog();
        if (!productId || productId === "new") {
          setV(emptyForm(collections[0]?.slug ?? "signature"));
          setSlugEdited(false);
          return;
        }
        const found = catalog.find((p) => p.id === productId || p.slug === productId);
        if (found) {
          setExisting(found);
          setV(productToForm(found));
          setSlugEdited(true);
        } else {
          setMissing(true);
        }
      }),
    [productId]
  );

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setV((prev) => (prev ? { ...prev, [key]: value } : prev));

  function validate(current: ProductFormValues): boolean {
    const e: Record<string, string> = {};
    if (!current.name.trim()) e.name = "Name is required";
    if (!current.shortDescription.trim()) e.shortDescription = "Short description is required";
    if (current.price <= 0) e.price = "Price must be greater than 0";
    if (current.sizes.length === 0) e.sizes = "Add at least one size";
    if (current.sizes.some((s) => s.ml <= 0)) e.sizes = "Every size needs a volume in ml";
    if (
      !existing &&
      current.slug &&
      readCatalog().some((p) => p.slug === current.slug)
    ) {
      e.slug = "This slug is already in use";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit() {
    if (!v || !validate(v)) return;
    const product = formToProduct(v, existing);
    upsertProduct(product);
    setSaved(true);
    push(existing ? `“${product.name}” updated` : `“${product.name}” added to catalog`);
    setTimeout(() => router.push("/admin"), 600);
  }

  function updateSize(i: number, patch: Partial<ProductSize>) {
    setV((prev) =>
      prev
        ? { ...prev, sizes: prev.sizes.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }
        : prev
    );
  }

  if (missing) {
    return (
      <div className="border border-ivory/10 p-12 text-center">
        <p className="font-serif text-2xl font-light">{t.admin.productNotFound}</p>
        <p className="mt-3 text-sm font-light text-ivory/75">
          It may have been deleted, or this link is outdated.
        </p>
        <ButtonLink href="/admin" variant="outline" size="sm">{t.admin.backToDashboard}</ButtonLink>
      </div>
    );
  }

  if (!v) {
    return <div className="h-96 animate-pulse border border-ivory/10 bg-ivory/5" aria-label={t.admin.loadingForm} />;
  }

  const previewImage = v.images.split("\n").map((s) => s.trim()).find(Boolean) ?? imageSuggestions[0];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      {/* form */}
      <div className="space-y-10">
        {/* identity */}
        <section className="border hairline bg-ivory p-6 sm:p-8">
          <h2 className="eyebrow mb-6 text-accent">{t.admin.identity}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t.admin.productName} error={errors.name} className="sm:col-span-2">
              <Input
                value={v.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugEdited) set("slug", slugify(e.target.value));
                }}
                placeholder="NOIR Absolu"
              />
            </Field>
            <Field label={t.admin.urlSlug} error={errors.slug} hint={t.admin.hintSlug}>
              <Input
                value={v.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="noir-absolu"
              />
            </Field>
            <Field label={t.admin.badge}>
              <Select
                value={v.badge ?? ""}
                onChange={(e) => set("badge", (e.target.value || null) as ProductFormValues["badge"])}
              >
                {BADGES.map((b) => (
                  <option key={b.value} value={b.value}>{t.admin[b.labelKey]}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.admin.shortDescription} error={errors.shortDescription} className="sm:col-span-2">
              <Input
                value={v.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="One-line scent story shown on cards"
              />
            </Field>
            <Field label={t.admin.fullDescription} className="sm:col-span-2">
              <Textarea
                value={v.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="The composition narrative…"
              />
            </Field>
          </div>
        </section>

        {/* classification */}
        <section className="border hairline bg-ivory p-6 sm:p-8">
          <h2 className="eyebrow mb-6 text-accent">Classification & Pricing</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field label={t.admin.category}>
              <Select value={v.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.admin.collection}>
              <Select value={v.collection} onChange={(e) => set("collection", e.target.value)}>
                {collections.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.admin.fragranceFamily}>
              <Select value={v.fragranceFamily} onChange={(e) => set("fragranceFamily", e.target.value as ProductFormValues["fragranceFamily"])}>
                {FAMILIES.map((f) => (
                  <option key={f} value={f} className="capitalize">{f}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.admin.gender}>
              <Select value={v.gender} onChange={(e) => set("gender", e.target.value as ProductFormValues["gender"])}>
                {GENDERS.map((g) => (
                  <option key={g} value={g} className="capitalize">{g}</option>
                ))}
              </Select>
            </Field>
            <Field label={t.admin.priceUsd} error={errors.price}>
              <Input
                type="number"
                min={0}
                step="1"
                value={v.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </Field>
            <Field label={t.admin.compareAtPrice} hint={t.admin.hintCompareAt}>
              <Input
                type="number"
                min={0}
                step="1"
                value={v.compareAtPrice ?? ""}
                onChange={(e) => set("compareAtPrice", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="e.g. 340"
              />
            </Field>
            <Field label={t.admin.stockUnits}>
              <Input
                type="number"
                min={0}
                value={v.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
              />
            </Field>
            <Field label={t.admin.rating} hint="0 – 5">
              <Input
                type="number"
                min={0}
                max={5}
                step="0.1"
                value={v.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
              />
            </Field>
            <Field label={t.admin.reviewsCount}>
              <Input
                type="number"
                min={0}
                value={v.reviewsCount}
                onChange={(e) => set("reviewsCount", Number(e.target.value))}
              />
            </Field>
          </div>

          {/* sizes */}
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="eyebrow text-ink/60">{t.admin.sizes}</p>
              <button
                type="button"
                onClick={() => set("sizes", [...v.sizes, { ml: 50, price: v.price, inStock: true }])}
                className="eyebrow text-accent hover:text-ivory"
              >
                {t.admin.addSize}
              </button>
            </div>
            {errors.sizes && <p className="mb-3 text-xs text-red-700">{errors.sizes}</p>}
            <div className="space-y-3">
              {v.sizes.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3">
                  <Field label={t.admin.volumeMl}>
                    <Input
                      type="number"
                      min={1}
                      value={s.ml}
                      onChange={(e) => updateSize(i, { ml: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label={t.admin.price}>
                    <Input
                      type="number"
                      min={0}
                      value={s.price}
                      onChange={(e) => updateSize(i, { price: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label={t.admin.compareAt}>
                    <Input
                      type="number"
                      min={0}
                      value={s.compareAtPrice ?? ""}
                      onChange={(e) =>
                        updateSize(i, { compareAtPrice: e.target.value === "" ? undefined : Number(e.target.value) })
                      }
                      placeholder="—"
                    />
                  </Field>
                  <div className="flex items-center gap-3 pb-3">
                    <label className="flex items-center gap-2 text-xs font-light text-muted">
                      <input
                        type="checkbox"
                        checked={s.inStock}
                        onChange={(e) => updateSize(i, { inStock: e.target.checked })}
                        className="h-4 w-4 accent-[#facc15]"
                      />
                      {t.admin.inStock}
                    </label>
                    <button
                      type="button"
                      onClick={() => set("sizes", v.sizes.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-800 hover:underline"
                      aria-label={`Remove size ${s.ml}ml`}
                    >
                      {t.admin.remove}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* olfactive + imagery */}
        <section className="border hairline bg-ivory p-6 sm:p-8">
          <h2 className="eyebrow mb-6 text-accent">{t.admin.composition}</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Field label={t.admin.topNotes} hint={t.admin.commaSeparated}>
              <Input value={v.topNotes} onChange={(e) => set("topNotes", e.target.value)} placeholder="Bergamot, Cardamom" />
            </Field>
            <Field label={t.admin.heartNotes} hint={t.admin.commaSeparated}>
              <Input value={v.heartNotes} onChange={(e) => set("heartNotes", e.target.value)} placeholder="Rose, Jasmine" />
            </Field>
            <Field label={t.admin.baseNotes} hint={t.admin.commaSeparated}>
              <Input value={v.baseNotes} onChange={(e) => set("baseNotes", e.target.value)} placeholder="Sandalwood, Musk" />
            </Field>
            <Field label={t.admin.ingredients} hint={t.admin.commaSeparated} className="sm:col-span-3">
              <Textarea value={v.ingredients} onChange={(e) => set("ingredients", e.target.value)} rows={3} />
            </Field>
            <Field label={t.admin.imagePaths} hint={t.admin.hintImagePaths} className="sm:col-span-3">
              <Textarea
                value={v.images}
                onChange={(e) => set("images", e.target.value)}
                rows={3}
                placeholder={"/images/products/my-fragrance/front.svg\n/images/products/my-fragrance/detail.svg"}
              />
              <p className="mt-2 text-[0.625rem] font-light text-muted">
                Available images include:{" "}
                {imageSuggestions.slice(0, 4).map((s) => (
                  <code key={s} className="mr-2">{s.split("/").slice(-2).join("/")}</code>
                ))}
                …
              </p>
            </Field>
          </div>
        </section>

        {/* visibility flags */}
        <section className="border hairline bg-ivory p-6 sm:p-8">
          <h2 className="eyebrow mb-6 text-accent">{t.admin.visibility}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["isActive", t.admin.visActive],
                ["isFeatured", t.admin.visFeatured],
                ["isBestSeller", t.admin.visBestSeller],
                ["isNewArrival", t.admin.visNewArrival],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-3 text-sm font-light">
                <input
                  type="checkbox"
                  checked={v[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="h-4 w-4 accent-[#facc15]"
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-4">
          <Button type="button" size="lg" onClick={onSubmit} disabled={saved}>
            {saved ? t.admin.saved : existing ? t.admin.saveChanges : t.admin.addProduct}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin")}>
            Cancel
          </Button>
          {existing && (
            <a
              href={`/product/${existing.slug}`}
              target="_blank"
              rel="noreferrer"
              className="eyebrow ml-auto text-muted hover:text-accent"
            >
              View live page ↗
            </a>
          )}
        </div>
      </div>

      {/* live preview */}
      <aside className="h-fit lg:sticky lg:top-24">
        <p className="eyebrow mb-4 text-muted">{t.admin.livePreview}</p>
        <div className="border hairline bg-ivory p-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt={v.name || "Preview"} className="h-full w-full object-cover" />
          </div>
          <div className="pt-4">
            {v.badge && (
              <span className="mb-2 inline-block bg-accent px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.18em] text-ink">
                {v.badge}
              </span>
            )}
            <p className="font-serif text-lg leading-snug">{v.name || "Product name"}</p>
            <p className="mt-1 line-clamp-2 text-xs font-light text-muted">
              {v.shortDescription || "Short description…"}
            </p>
            <p className="mt-3 text-sm font-medium">
              {formatPrice(v.sizes[0]?.price ?? v.price)}
              {v.compareAtPrice ? (
                <span className="ml-2 text-xs font-light text-muted line-through">
                  {formatPrice(v.compareAtPrice)}
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-[0.625rem] font-light uppercase tracking-[0.2em] text-muted">
              {v.sizes.length} size{v.sizes.length === 1 ? "" : "s"} · {v.fragranceFamily} · {v.gender}
            </p>
          </div>
        </div>
        {v.images.includes("\n") && (
          <p className="mt-3 text-[0.625rem] font-light text-muted">+{v.images.split("\n").filter((s) => s.trim()).length - 1} more image{v.images.split("\n").filter((s) => s.trim()).length > 2 ? "s" : ""}</p>
        )}
      </aside>
    </div>
  );
}
