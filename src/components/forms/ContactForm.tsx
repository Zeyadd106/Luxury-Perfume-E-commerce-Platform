"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useSubmitContactForm } from "@/lib/query/hooks";
import { contactSchema, CONTACT_SUBJECTS, type ContactFormValues } from "@/lib/validations/schemas";
import { Field, Input, Select, Textarea } from "@/components/ui/fields";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/store/store";
import { useLang } from "@/lib/i18n/provider";

export function ContactForm() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const mutation = useSubmitContactForm();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const subjKey: Record<string, keyof typeof t.contact> = {
    "Order & Shipping": "subjOrder",
    "Returns & Exchanges": "subjReturns",
    "Product Questions": "subjProduct",
    "Wholesale & Partnerships": "subjWholesale",
    Other: "subjOther",
  };
  const subjectLabel = (s: string) => t.contact[subjKey[s] ?? "subjOther"];

  function onSubmit(values: ContactFormValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        setSent(true);
        reset();
        push(t.contact.messageReceived);
      },
      onError: () => push("Something went wrong. Please try again.", "error"),
    });
  }

  if (sent) {
    return (
      <div className="border hairline bg-ivory p-10 text-center">
        <CheckCircle2 size={40} className="mx-auto text-accent" strokeWidth={1.25} />
        <h3 className="mt-5 font-serif text-2xl font-light">{t.contact.messageSent}</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-muted">
          {t.contact.messageSentBody}
        </p>
        <Button variant="outline" size="sm" className="mt-8" onClick={() => setSent(false)}>
          {t.contact.sendAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label={t.account.firstName} error={errors.firstName?.message}>
          <Input {...register("firstName")} invalid={!!errors.firstName} autoComplete="given-name" />
        </Field>
        <Field label={t.account.lastName} error={errors.lastName?.message}>
          <Input {...register("lastName")} invalid={!!errors.lastName} autoComplete="family-name" />
        </Field>
      </div>
      <Field label={t.account.email} error={errors.email?.message}>
        <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
      </Field>
      <Field label={t.contact.subject} error={errors.subject?.message}>
        <Select {...register("subject")} invalid={!!errors.subject}>
          <option value="">{t.contact.selectSubject}</option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>{subjectLabel(s)}</option>
          ))}
        </Select>
      </Field>
      <Field label={t.contact.message} error={errors.message?.message}>
        <Textarea {...register("message")} invalid={!!errors.message} placeholder={t.contact.messagePlaceholder} />
      </Field>
      <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full sm:w-auto">
        {mutation.isPending ? t.account.sending : t.contact.sendMessage}
      </Button>
    </form>
  );
}
