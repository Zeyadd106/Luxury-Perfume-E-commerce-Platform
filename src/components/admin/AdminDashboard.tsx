"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { readCatalog, removeProduct, resetCatalog } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/lib/store/store";
import { afterMount } from "@/lib/utils";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { OrdersPanel } from "@/components/admin/OrdersPanel";
import { useLang } from "@/lib/i18n/provider";

export function AdminDashboard() {
  const { t } = useLang();
  const router = useRouter();
  const { push } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => afterMount(() => setProducts(readCatalog())), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.includes(q) ||
        p.collection.includes(q)
    );
  }, [products, query]);

  const stats = useMemo(() => {
    const active = products.filter((p) => p.isActive).length;
    const stockValue = products.reduce(
      (sum, p) => sum + p.sizes.reduce((s, sz) => s + sz.price, 0) * Math.max(1, Math.floor(p.stock / 10)),
      0
    );
    const lowStock = products.filter((p) => p.stock <= 10).length;
    return { total: products.length, active, stockValue, lowStock };
  }, [products]);

  function onDelete(id: string, name: string) {
    removeProduct(id);
    setProducts(readCatalog());
    setConfirmId(null);
    push(`“${name}” ${t.admin.removedToast}`, "info");
  }

  function onReset() {
    if (!window.confirm(t.admin.resetConfirm)) return;
    resetCatalog();
    setProducts(readCatalog());
    push(t.admin.resetToast, "info");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      {/* stats */}
      <div className="grid grid-cols-2 gap-px border border-ivory/10 bg-ivory/10 lg:grid-cols-4">
        {[
          [t.admin.totalFragrances, stats.total],
          [t.admin.activeListings, stats.active],
          [t.admin.inventoryValue, formatPrice(stats.stockValue)],
          [t.admin.lowStock, stats.lowStock],
        ].map(([label, value]) => (
          <div key={label} className="bg-ink px-6 py-8">
            <p className="eyebrow text-ivory/75">{label}</p>
            <p className="mt-3 font-serif text-3xl font-light text-ivory">{value}</p>
          </div>
        ))}
      </div>

      <OrdersPanel />

      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light">{t.admin.products}</h1>
          <p className="mt-1 text-sm font-light text-ivory/75">
            {t.admin.syncNote}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.admin.searchProducts}
            className="w-56 border-b border-ivory/25 bg-transparent px-0 py-2.5 text-sm font-light text-ivory placeholder:text-ivory/50 focus:border-accent focus:outline-none"
          />
          <ButtonLink href="/admin/products/new" size="sm">
            <Plus size={13} /> {t.admin.newProduct}
          </ButtonLink>
          <button
            onClick={onReset}
            className="eyebrow border border-red-400/40 px-4 py-2 text-red-300 transition-colors hover:bg-red-400/10"
            title={t.admin.resetConfirm}
          >
            {t.admin.resetData}
          </button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto border border-ivory/10">
        <table className="w-full min-w-[860px] text-start text-sm">
          <thead>
            <tr className="border-b border-ivory/10 text-[0.625rem] uppercase tracking-[0.22em] text-ivory/75">
              <th className="px-5 py-4 font-medium">{t.admin.productName}</th>
              <th className="px-5 py-4 font-medium">{t.admin.collection}</th>
              <th className="px-5 py-4 font-medium">{t.admin.sizesLabel}</th>
              <th className="px-5 py-4 font-medium">{t.admin.price}</th>
              <th className="px-5 py-4 font-medium">{t.admin.stock}</th>
              <th className="px-5 py-4 font-medium">{t.admin.status}</th>
              <th className="px-5 py-4 font-medium text-end">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-ivory/5 transition-colors hover:bg-ivory/5">
                <td className="px-5 py-4">
                  <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-accent">
                    {p.name}
                  </Link>
                  <p className="mt-0.5 text-xs font-light text-ivory/65">/{p.slug}</p>
                </td>
                <td className="px-5 py-4 text-ivory/80">{p.collection}</td>
                <td className="px-5 py-4 text-ivory/80">
                  {p.sizes.map((s) => `${s.ml}ml`).join(" · ")}
                </td>
                <td className="px-5 py-4">{formatPrice(p.price)}</td>
                <td className="px-5 py-4">
                  <span className={p.stock <= 10 ? "text-accent" : "text-ivory/70"}>{p.stock}</span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={
                      p.isActive
                        ? "border border-emerald-400/40 px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.18em] text-emerald-300"
                        : "border border-red-400/40 px-2 py-0.5 text-[0.5625rem] uppercase tracking-[0.18em] text-red-300"
                    }
                  >
                    {p.isActive ? t.admin.live : t.admin.hidden}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex h-8 w-8 items-center justify-center border border-ivory/15 text-ivory/80 transition-colors hover:border-accent hover:text-accent"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil size={13} />
                    </Link>
                    {confirmId === p.id ? (
                      <button
                        onClick={() => onDelete(p.id, p.name)}
                        className="border border-red-400/60 px-3 py-1.5 text-[0.625rem] uppercase tracking-[0.18em] text-red-300 transition-colors hover:bg-red-400/10"
                      >
                        {t.admin.confirm}
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="flex h-8 w-8 items-center justify-center border border-ivory/15 text-ivory/80 transition-colors hover:border-red-400/60 hover:text-red-300"
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm font-light text-ivory/65">
                  {t.admin.noMatch.replace("{q}", query)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs font-light leading-relaxed text-ivory/65">
        Admin changes are stored in this browser&apos;s local storage and broadcast to every open
        tab. For a multi-user production deployment, point <code>src/services/api.ts</code> at a
        real backend — the admin UI will work unchanged.
      </p>
    </div>
  );
}
