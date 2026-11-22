"use client";

import { MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormValues } from "@/lib/validations/schemas";
import { Field, Input, Select } from "@/components/ui/fields";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/store/store";
import { useLang } from "@/lib/i18n/provider";
import { afterMount } from "@/lib/utils";

const ADDR_KEY = "atelier-addresses-v1";
const COUNTRIES = ["France", "United States", "United Kingdom", "Germany", "Italy", "Spain", "Japan", "Canada", "Australia", "Switzerland", "Belgium", "Netherlands"];

interface SavedAddress extends AddressFormValues {
  id: string;
}

export function AddressesClient() {
  const { t } = useLang();
  const { push } = useToast();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(
    () =>
      afterMount(() => {
        try {
          setAddresses(JSON.parse(localStorage.getItem(ADDR_KEY) ?? "[]"));
        } catch {
          /* ignore */
        }
      }),
    []
  );

  function onSubmit(values: AddressFormValues) {
    const next = [...addresses, { ...values, id: `addr-${addresses.length}-${values.postalCode}` }];
    setAddresses(next);
    localStorage.setItem(ADDR_KEY, JSON.stringify(next));
    reset();
    setShowForm(false);
    push(t.account.addressSaved);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl font-light">{t.account.addresses}</h1>
        <Button variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus size={13} /> {t.account.addAddress}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-2xl border hairline bg-ivory p-8" noValidate>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={t.account.firstName} error={errors.firstName?.message}>
              <Input {...register("firstName")} invalid={!!errors.firstName} />
            </Field>
            <Field label={t.account.lastName} error={errors.lastName?.message}>
              <Input {...register("lastName")} invalid={!!errors.lastName} />
            </Field>
            <Field label={t.account.email} error={errors.email?.message} className="sm:col-span-2">
              <Input type="email" {...register("email")} invalid={!!errors.email} />
            </Field>
            <Field label={t.checkout.phone} error={errors.phone?.message}>
              <Input type="tel" {...register("phone")} invalid={!!errors.phone} />
            </Field>
            <Field label={t.checkout.address} error={errors.address1?.message}>
              <Input {...register("address1")} invalid={!!errors.address1} />
            </Field>
            <Field label={t.checkout.address2} error={errors.address2?.message}>
              <Input {...register("address2")} invalid={!!errors.address2} />
            </Field>
            <Field label={t.checkout.city} error={errors.city?.message}>
              <Input {...register("city")} invalid={!!errors.city} />
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
              <Input {...register("postalCode")} invalid={!!errors.postalCode} />
            </Field>
          </div>
          <div className="mt-8 flex gap-3">
            <Button type="submit">{t.account.saveAddress}</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>{t.account.cancel}</Button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="mt-10 flex max-w-md flex-col items-center border border-dashed hairline p-10 text-center">
          <MapPin size={32} strokeWidth={1} className="mb-4 text-muted" />
          <p className="font-serif text-2xl font-light">{t.account.noAddresses}</p>
          <p className="mt-2 text-sm font-light text-muted">{t.account.noAddressesHint}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="border hairline bg-ivory p-6">
              <p className="font-medium">{a.firstName} {a.lastName}</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted">
                {a.address1}{a.address2 ? `, ${a.address2}` : ""}<br />
                {a.city}, {a.postalCode}<br />
                {a.country}<br />
                {a.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
