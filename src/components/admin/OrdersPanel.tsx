"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Package } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { readOrders, subscribeOrders, updateOrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/lib/store/store";
import { useLang } from "@/lib/i18n/provider";

const STATUSES: OrderStatus[] = ["processing", "shipped", "delivered", "cancelled"];

const statusLabelKey: Record<OrderStatus, "statusProcessing" | "statusShipped" | "statusDelivered" | "statusCancelled"> = {
  processing: "statusProcessing",
  shipped: "statusShipped",
  delivered: "statusDelivered",
  cancelled: "statusCancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  processing: "border-amber-400/40 text-amber-300",
  shipped: "border-sky-400/40 text-sky-300",
  delivered: "border-emerald-400/40 text-emerald-300",
  cancelled: "border-red-400/40 text-red-300",
};

export function OrdersPanel() {
  const { push } = useToast();
  const { t } = useLang();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      setOrders(readOrders());
      unsubscribe = subscribeOrders(() => setOrders(readOrders()));
    });
    return () => {
      cancelAnimationFrame(id);
      unsubscribe?.();
    };
  }, []);

  function onStatusChange(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    updateOrderStatus(order.id, status);
    setOrders(readOrders());
    push(`${t.admin.orderDetails}: ${order.id} → ${t.admin[statusLabelKey[status]]}`, status === "cancelled" ? "info" : "success");
  }

  const pending = orders.filter((o) => o.status === "processing").length;

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow text-accent">{t.admin.ordersSubtitle}</p>
          <h2 className="mt-2 font-serif text-3xl font-light">{t.admin.ordersTitle}</h2>
          <p className="mt-1 text-sm font-light text-ivory/60">
            {t.admin.orderCount.replace("{n}", String(orders.length))}
            {pending > 0 && ` · ${t.admin.awaitingFulfillment}: ${pending}`}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center border border-ivory/10 px-6 py-16 text-center">
          <Package size={36} strokeWidth={1} className="text-ivory/30" />
          <p className="mt-4 font-serif text-xl font-light">{t.admin.noOrders}</p>
          <p className="mt-2 max-w-sm text-sm font-light text-ivory/60">
            {t.admin.noOrdersHint}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const addr = o.shippingAddress;
            const isOpen = expanded === o.id;
            return (
              <article key={o.id} className="border border-ivory/10 bg-ivory/5">
                {/* summary row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-start sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{o.id}</span>
                  <span className="text-sm font-light text-ivory/70">
                    {addr.firstName} {addr.lastName}
                  </span>
                  <span className="hidden text-sm font-light text-ivory/50 md:inline">
                    {addr.city}, {addr.country}
                  </span>
                  <span className="hidden text-sm font-light text-ivory/50 lg:inline">
                    {t.admin.itemsCount.replace("{n}", String(o.items.reduce((n, i) => n + i.quantity, 0)))}
                  </span>
                  <span className="ms-auto font-medium">{formatPrice(o.total)}</span>
                  <span
                    className={`border px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.18em] ${statusStyles[o.status]}`}
                  >
                    {t.admin[statusLabelKey[o.status]]}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`text-ivory/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* details */}
                {isOpen && (
                  <div className="border-t border-ivory/10 px-5 py-6 sm:px-6">
                    <div className="grid gap-8 lg:grid-cols-3">
                      {/* items */}
                      <div>
                        <p className="eyebrow mb-4 text-ivory/50">{t.admin.items}</p>
                        <ul className="space-y-3">
                          {o.items.map((item, i) => (
                            <li key={i} className="flex items-baseline justify-between gap-4 text-sm">
                              <span className="font-light">
                                {item.name}{" "}
                                <span className="text-ivory/50">· {item.sizeMl} ml × {item.quantity}</span>
                              </span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                        <dl className="mt-5 space-y-1.5 border-t border-ivory/10 pt-4 text-sm font-light">
                          <div className="flex justify-between"><dt className="text-ivory/60">{t.cart.subtotal}</dt><dd>{formatPrice(o.subtotal)}</dd></div>
                          <div className="flex justify-between"><dt className="text-ivory/60">{t.cart.shipping} ({o.shippingMethod === "express" ? t.checkout.express : t.checkout.standard})</dt><dd>{formatPrice(o.shipping)}</dd></div>
                          {o.discount > 0 && (
                            <div className="flex justify-between"><dt className="text-ivory/60">{t.cart.discount}</dt><dd className="text-accent">−{formatPrice(o.discount)}</dd></div>
                          )}
                          <div className="flex justify-between border-t border-ivory/10 pt-2 font-medium"><dt>{t.cart.total}</dt><dd>{formatPrice(o.total)}</dd></div>
                        </dl>
                      </div>

                      {/* customer + shipping */}
                      <div>
                        <p className="eyebrow mb-4 text-ivory/50">{t.admin.customer}</p>
                        <p className="text-sm font-medium">
                          {addr.firstName} {addr.lastName}
                        </p>
                        <p className="mt-1 text-sm font-light text-ivory/70">{addr.email}</p>
                        <p className="text-sm font-light text-ivory/70">{addr.phone}</p>
                        <p className="eyebrow mb-4 mt-6 text-ivory/50">{t.admin.shipTo}</p>
                        <address className="text-sm font-light not-italic leading-relaxed text-ivory/80">
                          {addr.address1}
                          {addr.address2 ? <>, {addr.address2}</> : null}
                          <br />
                          {addr.postalCode} {addr.city}
                          <br />
                          {addr.country}
                        </address>
                        <p className="mt-3 text-xs font-light text-ivory/50">
                          {t.admin.payment}: {o.paymentMethod === "cod" ? t.checkout.codTitle : o.paymentMethod} · {t.admin.placedOn} {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* status updater */}
                      <div>
                        <p className="eyebrow mb-4 text-ivory/50">{t.admin.updateStatus}</p>
                        <div className="space-y-3">
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => onStatusChange(o, s)}
                              disabled={o.status === s}
                              className={`flex w-full items-center justify-between border px-4 py-3 text-start text-sm font-light transition-colors ${
                                o.status === s
                                  ? `${statusStyles[s]} cursor-default`
                                  : "border-ivory/20 text-ivory/70 hover:border-accent hover:text-accent"
                              }`}
                            >
                              <span>{t.admin[statusLabelKey[s]]}</span>
                              {o.status === s && <span className="text-[0.5625rem] uppercase tracking-[0.2em]">{t.admin.current}</span>}
                            </button>
                          ))}
                        </div>
                        {o.status === "cancelled" && (
                          <p className="mt-4 text-xs font-light text-red-300">
                            {t.admin.orderCancelledNote}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
