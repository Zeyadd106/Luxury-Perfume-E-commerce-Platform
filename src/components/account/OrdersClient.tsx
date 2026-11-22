"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@/types";
import { formatPrice, afterMount } from "@/lib/utils";
import { useLang } from "@/lib/i18n/provider";
import { ButtonLink } from "@/components/ui/Button";

const ORDERS_KEY = "atelier-orders-v1";
const statusLabelKey: Record<Order["status"], "statusProcessing" | "statusShipped" | "statusDelivered" | "statusCancelled"> = {
  processing: "statusProcessing",
  shipped: "statusShipped",
  delivered: "statusDelivered",
  cancelled: "statusCancelled",
};

const statusStyles: Record<Order["status"], string> = {
  processing: "bg-accent/15 text-ink",
  shipped: "bg-blue-100 text-blue-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-red-100 text-red-900",
};

export function OrdersClient() {
  const { t } = useLang();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(
    () =>
      afterMount(() => {
        try {
          const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]") as Order[];
          setOrders(raw);
        } catch {
          setOrders([]);
        }
      }),
    []
  );

  return (
    <div>
      <h1 className="font-serif text-4xl font-light">{t.account.orders}</h1>
      {orders === null ? (
        <p className="mt-6 text-sm font-light text-muted">{t.shop.loading}</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 max-w-md border border-dashed hairline p-10 text-center">
          <p className="font-serif text-2xl font-light">{t.account.noOrders}</p>
          <p className="mt-3 text-sm font-light text-muted">
            {t.account.noOrdersBody}
          </p>
          <div className="mt-8">
            <ButtonLink href="/shop" variant="outline" size="sm">{t.account.startShopping}</ButtonLink>
          </div>
        </div>
      ) : (
        <ul className="mt-10 space-y-6">
          {orders.map((o) => (
            <li key={o.id} className="border hairline bg-ivory p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                <span className={`px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] ${statusStyles[o.status]}`}>
                  {t.admin[statusLabelKey[o.status]]}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-4 overflow-x-auto">
                {o.items.slice(0, 4).map((item) => (
                  <Link key={`${item.productId}-${item.sizeMl}`} href={`/product/${item.slug}`} className="relative h-16 w-12 shrink-0 overflow-hidden bg-ink/5">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </Link>
                ))}
                <span className="ms-auto text-sm font-medium">{formatPrice(o.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
