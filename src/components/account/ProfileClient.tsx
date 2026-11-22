"use client";

import { useEffect, useState } from "react";
import { Input, Field } from "@/components/ui/fields";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/store/store";
import { useLang } from "@/lib/i18n/provider";
import { afterMount } from "@/lib/utils";

const CUSTOMER_KEY = "atelier-customer-v1";

interface CustomerInfo {
  email: string;
  name: string;
}

export function ProfileClient() {
  const { t } = useLang();
  const { push } = useToast();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(
    () =>
      afterMount(() => {
        try {
          const raw = localStorage.getItem(CUSTOMER_KEY);
          if (raw) setCustomer(JSON.parse(raw));
        } catch {
          /* ignore */
        }
      }),
    []
  );

  if (!customer) {
    return (
      <div>
        <h1 className="font-serif text-4xl font-light">{t.account.profile}</h1>
        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-muted">
          {t.account.guestNote}
        </p>
        <div className="mt-8 flex gap-4">
          <Button onClick={() => router.push("/account/login")}>{t.account.signIn}</Button>
          <Button variant="outline" onClick={() => router.push("/account/register")}>{t.account.signUp}</Button>
        </div>
      </div>
    );
  }

  const displayName = customer.name;

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;
    setSaving(true);
    const updated: CustomerInfo = {
      email: customer.email,
      name: `${firstName || displayName.split(" ")[0] || ""} ${lastName}`.trim() || displayName,
    };
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(updated));
    setCustomer(updated);
    setSaving(false);
    push(t.account.profileUpdated);
  }

  return (
    <div>
      <h1 className="font-serif text-4xl font-light">{t.account.profile}</h1>
      <p className="mt-3 text-sm font-light text-muted">{customer.email}</p>

      <form onSubmit={onSave} className="mt-10 max-w-lg space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <Field label={t.account.firstName}>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={displayName.split(" ")[0] ?? ""} />
          </Field>
          <Field label={t.account.lastName}>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
        </div>
        <Field label={t.account.email}>
          <Input value={customer.email} disabled className="opacity-60" />
        </Field>
        <Button type="submit" disabled={saving}>{saving ? t.account.saving : t.account.save}</Button>
      </form>
    </div>
  );
}
