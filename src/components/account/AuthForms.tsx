"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordRequest, loginRequest, registerRequest } from "@/services/api";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  type ForgotPasswordFormValues,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/lib/validations/schemas";
import { Field, Input } from "@/components/ui/fields";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/store/store";
import { CUSTOMER_KEY, postAuthTarget } from "@/lib/auth";
import { useLang } from "@/lib/i18n/provider";
import { CheckCircle2 } from "lucide-react";

type Mode = "login" | "register" | "forgot";

export function AuthForms({ mode }: { mode: Mode }) {
  const [serverError, setServerError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  if (mode === "forgot") return <ForgotForm onSent={() => setForgotSent(true)} sent={forgotSent} />;
  if (mode === "register") return <RegisterForm />;
  return <LoginForm serverError={serverError} setServerError={setServerError} />;
}

function saveCustomer(email: string) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify({ email, name: email.split("@")[0] }));
}

function LoginForm({ serverError, setServerError }: { serverError: string; setServerError: (s: string) => void }) {
  const { t } = useLang();
  const router = useRouter();
  const { push } = useToast();
  const [pending, setPending] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setPending(true);
    setServerError("");
    try {
      await loginRequest(values.email);
      saveCustomer(values.email);
      push(t.account.welcomeBack);
      router.push(postAuthTarget());
    } catch {
      setServerError(t.account.signInFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <Field label={t.account.email} error={errors.email?.message}>
        <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
      </Field>
      <Field label={t.account.password} error={errors.password?.message}>
        <Input type="password" {...register("password")} invalid={!!errors.password} autoComplete="current-password" />
      </Field>
      <div className="flex justify-end">
        <Link href="/account/forgot-password" className="text-xs font-light text-muted underline-offset-4 hover:text-accent hover:underline">
          {t.account.forgotLink}
        </Link>
      </div>
      {serverError && <p className="text-xs text-red-700">{serverError}</p>}
      <p className="text-[0.625rem] font-light leading-relaxed text-muted">
        {t.account.demoLogin}
      </p>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t.account.signingIn : t.account.signIn}
      </Button>
    </form>
  );
}

function RegisterForm() {
  const { t } = useLang();
  const router = useRouter();
  const { push } = useToast();
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setPending(true);
    setServerError("");
    try {
      await registerRequest(values.email);
      saveCustomer(values.email);
      push(t.account.accountCreated);
      router.push(postAuthTarget());
    } catch {
      setServerError(t.account.registerFailed);
    } finally {
      setPending(false);
    }
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
      <Field label="Password" error={errors.password?.message} hint={t.account.passwordHint}>
        <Input type="password" {...register("password")} invalid={!!errors.password} autoComplete="new-password" />
      </Field>
      <Field label={t.account.confirmPassword} error={errors.confirmPassword?.message}>
        <Input type="password" {...register("confirmPassword")} invalid={!!errors.confirmPassword} autoComplete="new-password" />
      </Field>
      {serverError && <p className="text-xs text-red-700">{serverError}</p>}
      <p className="text-[0.625rem] font-light leading-relaxed text-muted">
        {t.account.demoRegister}
      </p>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t.account.creating : t.account.signUp}
      </Button>
    </form>
  );
}

function ForgotForm({ onSent, sent }: { onSent: () => void; sent: boolean }) {
  const { t } = useLang();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setPending(true);
    setError("");
    try {
      await forgotPasswordRequest(values.email);
      onSent();
    } catch {
      setError(t.account.genericError);
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="border hairline bg-ivory p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-accent" strokeWidth={1.25} />
        <h3 className="mt-4 font-serif text-2xl font-light">{t.account.checkInbox}</h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-muted">
          {t.account.inboxBody}
        </p>
        <Link href="/account/login" className="eyebrow mt-6 inline-block text-accent hover:underline">
          {t.account.backToSignIn}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <Field label={t.account.email} error={errors.email?.message}>
        <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
      </Field>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t.account.sending : t.account.sendReset}
      </Button>
    </form>
  );
}
