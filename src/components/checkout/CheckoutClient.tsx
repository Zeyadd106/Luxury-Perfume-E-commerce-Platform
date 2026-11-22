"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CheckCircle2, Lock, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Order } from "@/types";
import { usePlaceOrder } from "@/lib/query/hooks";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations/schemas";
import { useCart, useToast } from "@/lib/store/store";
import { isAuthenticated } from "@/lib/auth";
import { useLang } from "@/lib/i18n/provider";
import { formatPrice, afterMount, cn } from "@/lib/utils";
import { Field, Input, Select } from "@/components/ui/fields";
import { Button } from "@/components/ui/Button";
import { brandConfig } from "@/config/brand.config";

const ORDERS_KEY = "atelier-orders-v1";

function saveOrder(order: Order) {
  try {
    const raw = JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]") as Order[];
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...raw].slice(0, 50)));
  } catch {
    /* storage unavailable */
  }
}

const COUNTRIES = ["France", "United States", "United Kingdom", "Germany", "Italy", "Spain", "Japan", "Canada", "Australia", "Switzerland", "Belgium", "Netherlands"];

export function CheckoutClient() {
  const { items, subtotal, clearCart } = useCart();
  const placeOrder = usePlaceOrder();
  const { push } = useToast();
  const router = useRouter();
  const { t } = useLang();
  const [placed, setPlaced] = useState<Order | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | undefined>(undefined);

  useEffect(
    () =>
      afterMount(() => setAppliedCode(sessionStorage.getItem("atelier-discount") ?? undefined)),
    []
  );

  const discount = appliedCode === "FIRST15" ? Math.round(subtotal * 0.15) : 0;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { shippingMethod: "standard", paymentMethod: "cod" },
  });

  const { shippingMethod } = useWatch({ control });
  const shippingCost = useMemo(() => {
    if (items.length === 0) return 0;
    if (subtotal - discount >= brandConfig.freeShippingThreshold) return 0;
    return shippingMethod === "express" ? 35 : 15;
  }, [items.length, subtotal, discount, shippingMethod]);
  const total = subtotal - discount + shippingCost;

  function onSubmit(values: CheckoutFormValues) {
    setSubmitError("");
    if (!isAuthenticated()) {
      push("Please sign in or create an account to place your order.", "info");
      router.push("/account/login?next=/checkout");
      return;
    }
    placeOrder.mutate(
      {
        customer: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
        },
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address1: values.address1,
          address2: values.address2,
          city: values.city,
          country: values.country,
          postalCode: values.postalCode,
        },
        shippingMethod: values.shippingMethod,
        paymentMethod: values.paymentMethod,
        discountCode: appliedCode,
        items,
        totals: { subtotal, shipping: shippingCost, discount, total },
      },
      {
        onSuccess: (order) => {
          saveOrder(order);
          clearCart();
          sessionStorage.removeItem("atelier-discount");
          setPlaced(order);
          push(`Order ${order.id} confirmed`);
          window.scrollTo({ top: 0 });
        },
        onError: () => setSubmitError("We couldn't place your order. Please try again."),
      }
    );
  }

  if (placed) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center">
        <CheckCircle2 size={56} strokeWidth={1} className="text-accent" />
        <p className="eyebrow mt-8 text-accent">{t.checkout.confirmed}</p>
        <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">{t.checkout.thankYou} {placed.shippingAddress.firstName}.</h1>
        <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-muted">
          {t.checkout.orderReceived.replace("{id}", placed.id).replace("{email}", placed.shippingAddress.email)}
        </p>
        <div className="mt-10 grid w-full grid-cols-3 gap-px border hairline bg-ink/10 text-center">
          {[
            [t.checkout.order, placed.id],
            [t.checkout.total, formatPrice(placed.total)],
            [t.checkout.status, placed.status],
          ].map(([k, v]) => (
            <div key={k} className="bg-ivory px-4 py-6">
              <p className="eyebrow text-muted">{k}</p>
              <p className="mt-2 text-sm font-medium capitalize">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => router.push("/account/orders")} size="lg">{t.account.orders}</Button>
          <ButtonLinkLight href="/shop" label={t.checkout.continueShopping} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-28 text-center">
        <h1 className="font-serif text-4xl font-light">{t.cart.empty}</h1>
        <p className="mt-4 text-sm font-light text-muted">{t.cart.emptyHint}</p>
        <div className="mt-10">
          <Button onClick={() => router.push("/shop")}>{t.shop.title}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
      <h1 className="mb-10 font-serif text-4xl font-light sm:text-5xl">{t.checkout.title}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* form columns */}
        <div className="space-y-14">
          {/* contact */}
          <fieldset>
            <legend className="eyebrow mb-6 text-accent">{t.checkout.contact}</legend>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label={t.checkout.email} error={errors.email?.message}>
                <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
              </Field>
              <Field label={t.checkout.phone} error={errors.phone?.message} hint={t.checkout.phoneHint}>
                <Input type="tel" {...register("phone")} invalid={!!errors.phone} autoComplete="tel" />
              </Field>
            </div>
          </fieldset>

          {/* shipping */}
          <fieldset>
            <legend className="eyebrow mb-6 text-accent">{t.checkout.shipping}</legend>
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label={t.checkout.firstName} error={errors.firstName?.message}>
                <Input {...register("firstName")} invalid={!!errors.firstName} autoComplete="given-name" />
              </Field>
              <Field label={t.checkout.lastName} error={errors.lastName?.message}>
                <Input {...register("lastName")} invalid={!!errors.lastName} autoComplete="family-name" />
              </Field>
              <Field label={t.checkout.address} error={errors.address1?.message} className="sm:col-span-2">
                <Input {...register("address1")} invalid={!!errors.address1} autoComplete="address-line1" />
              </Field>
              <Field label={t.checkout.address2} error={errors.address2?.message} className="sm:col-span-2">
                <Input {...register("address2")} invalid={!!errors.address2} autoComplete="address-line2" />
              </Field>
              <Field label={t.checkout.city} error={errors.city?.message}>
                <Input {...register("city")} invalid={!!errors.city} autoComplete="address-level2" />
              </Field>
              <Field label={t.checkout.country} error={errors.country?.message}>
                <Select {...register("country")} invalid={!!errors.country}>
                  <option value="">{t.checkout.selectCountry}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label={t.checkout.postalCode} error={errors.postalCode?.message}>
                <Input {...register("postalCode")} invalid={!!errors.postalCode} autoComplete="postal-code" />
              </Field>
            </div>
          </fieldset>

          {/* shipping method */}
          <fieldset>
            <legend className="eyebrow mb-6 flex items-center gap-2 text-accent">
              <Truck size={14} /> {t.checkout.delivery}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "standard", label: t.checkout.standard, desc: t.checkout.standardDesc, price: subtotal - discount >= brandConfig.freeShippingThreshold ? 0 : 15 },
                { value: "express", label: t.checkout.express, desc: t.checkout.expressDesc, price: subtotal - discount >= brandConfig.freeShippingThreshold ? 20 : 35 },
              ].map((m) => (
                <label
                  key={m.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between border p-5 transition-colors",
                    shippingMethod === m.value ? "border-ink bg-ink/5" : "hairline hover:border-ivory/60"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input type="radio" value={m.value} {...register("shippingMethod")} className="accent-[#c6a46c]" />
                    <span>
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="block text-xs font-light text-muted">{m.desc}</span>
                    </span>
                  </span>
                  <span className="text-sm">{m.price === 0 ? "Free" : formatPrice(m.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* payment */}
          <fieldset>
            <legend className="eyebrow mb-6 flex items-center gap-2 text-accent">
              <Lock size={14} /> {t.checkout.payment}
            </legend>
            <div className="flex items-start gap-4 border hairline bg-ivory p-6">
              <Banknote size={22} strokeWidth={1.25} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="text-sm font-medium">{t.checkout.codTitle}</p>
                <p className="mt-1.5 text-xs font-light leading-relaxed text-muted">
                  {t.checkout.codBody}
                </p>
              </div>
            </div>
            <input type="hidden" {...register("paymentMethod")} />
            <input type="hidden" {...register("discountCode")} />
          </fieldset>
        </div>

        {/* summary */}
        <aside className="h-fit border hairline bg-ivory p-8 lg:sticky lg:top-28">
          <h2 className="eyebrow mb-6 text-muted">{t.checkout.orderSummary}</h2>
          <ul className="mb-6 max-h-64 space-y-4 overflow-y-auto">
            {items.map((item) => (
              <li key={`${item.productId}-${item.sizeMl}`} className="flex items-center gap-4">
                <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-ink/5">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-muted">{item.sizeMl} ml × {item.quantity}</span>
                </span>
                <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-3 border-t hairline pt-5 text-sm font-light">
            <div className="flex justify-between">
              <dt className="text-muted">{t.cart.subtotal}</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <dt>{t.cart.discount}</dt>
                <dd>−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">{t.cart.shipping}</dt>
              <dd>{shippingCost === 0 ? t.checkout.complimentary : formatPrice(shippingCost)}</dd>
            </div>
            <div className="flex justify-between border-t hairline pt-4 text-base font-medium">
              <dt>{t.cart.total}</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {submitError && <p className="mt-4 text-xs text-red-700">{submitError}</p>}

          <Button
            type="submit"
            size="lg"
            disabled={placeOrder.isPending}
            className="mt-8 w-full"
          >
            {placeOrder.isPending ? t.checkout.placing : `${t.checkout.placeOrder} — ${formatPrice(total)}`}
          </Button>
          <p className="mt-4 text-center text-[0.625rem] font-light leading-relaxed text-muted">
            By placing this order you agree to our terms. This is a demo storefront — no payment is
            processed.
          </p>
        </aside>
      </form>
    </div>
  );
}

function ButtonLinkLight({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center border border-ink px-10 py-4 text-[0.8125rem] uppercase tracking-[0.26em] transition-colors hover:bg-ink hover:text-ivory"
    >
      {label}
    </Link>
  );
}
