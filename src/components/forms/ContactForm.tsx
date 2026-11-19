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

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const mutation = useSubmitContactForm();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  function onSubmit(values: ContactFormValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        setSent(true);
        reset();
        push("Message received — we'll reply within 24 hours.");
      },
      onError: () => push("Something went wrong. Please try again.", "error"),
    });
  }

  if (sent) {
    return (
      <div className="border hairline bg-ivory p-10 text-center">
        <CheckCircle2 size={40} className="mx-auto text-accent" strokeWidth={1.25} />
        <h3 className="mt-5 font-serif text-2xl font-light">Message Sent</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-muted">
          Thank you for reaching out. A member of our concierge team will respond within one
          business day.
        </p>
        <Button variant="outline" size="sm" className="mt-8" onClick={() => setSent(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="First Name" error={errors.firstName?.message}>
          <Input {...register("firstName")} invalid={!!errors.firstName} autoComplete="given-name" />
        </Field>
        <Field label="Last Name" error={errors.lastName?.message}>
          <Input {...register("lastName")} invalid={!!errors.lastName} autoComplete="family-name" />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
      </Field>
      <Field label="Subject" error={errors.subject?.message}>
        <Select {...register("subject")} invalid={!!errors.subject}>
          <option value="">Select a subject…</option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>
      <Field label="Message" error={errors.message?.message}>
        <Textarea {...register("message")} invalid={!!errors.message} placeholder="How can we help?" />
      </Field>
      <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full sm:w-auto">
        {mutation.isPending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
