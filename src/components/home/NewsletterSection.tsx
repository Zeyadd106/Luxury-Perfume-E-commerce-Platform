"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useNewsletterSubscription } from "@/lib/query/hooks";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validations/schemas";
import { useToast } from "@/lib/store/store";
import { useLang } from "@/lib/i18n/provider";
import { Container, Section } from "@/components/ui/Container";
import { Reveal } from "@/components/animations/Reveal";

export function NewsletterSection() {
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const subscribe = useNewsletterSubscription();
  const { push } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterSchema) });

  function onSubmit(values: NewsletterFormValues) {
    subscribe.mutate(values, {
      onSuccess: () => {
        setDone(true);
        reset();
        push(t.home.subscribedToast);
      },
    });
  }

  return (
    <Section className="border-y hairline py-20 sm:py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4 text-accent">{t.footer.newsletterTitle}</p>
          <h2 className="font-serif text-4xl font-light leading-tight sm:text-5xl">
            {t.home.newsletterTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-muted">
            {t.home.newsletterBody}
          </p>

          {done ? (
            <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 border hairline bg-ivory px-6 py-5">
              <Check size={18} className="text-accent" />
              <p className="text-sm font-light">{t.footer.newsletterSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-10 max-w-md">
              <div className="flex items-end gap-3 border-b-2 border-ink pb-3 focus-within:border-accent">
                <input
                  type="email"
                  placeholder={t.footer.newsletterPlaceholder}
                  aria-label={t.footer.newsletterPlaceholder}
                  className="w-full bg-transparent text-sm font-light placeholder:text-muted/60 focus:outline-none"
                  {...register("email")}
                />
                <button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="eyebrow flex shrink-0 items-center gap-1 text-accent transition-colors hover:text-ivory disabled:opacity-50"
                >
                  {subscribe.isPending ? t.home.joining : t.home.join} <ArrowRight size={12} />
                </button>
              </div>
              {errors.email && <p className="mt-2 text-left text-xs text-red-700">{errors.email.message}</p>}
            </form>
          )}
        </Reveal>
      </Container>
    </Section>
  );
}
