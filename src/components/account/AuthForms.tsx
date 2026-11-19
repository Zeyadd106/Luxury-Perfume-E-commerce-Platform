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
import { CheckCircle2 } from "lucide-react";

const CUSTOMER_KEY = "atelier-customer-v1";

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
      push("Welcome back.");
      router.push("/account/profile");
    } catch {
      setServerError("Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <Input type="password" {...register("password")} invalid={!!errors.password} autoComplete="current-password" />
      </Field>
      <div className="flex justify-end">
        <Link href="/account/forgot-password" className="text-xs font-light text-muted underline-offset-4 hover:text-accent hover:underline">
          Forgot your password?
        </Link>
      </div>
      {serverError && <p className="text-xs text-red-700">{serverError}</p>}
      <p className="text-[0.625rem] font-light leading-relaxed text-muted">
        Demo authentication — credentials are not verified against a backend. Wire{" "}
        <code>loginRequest</code> in <code>src/services/api.ts</code> to your provider.
      </p>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}

function RegisterForm() {
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
      push("Account created. Bienvenue.");
      router.push("/account/profile");
    } catch {
      setServerError("Registration failed. Please try again.");
    } finally {
      setPending(false);
    }
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
      <Field label="Password" error={errors.password?.message} hint="8+ characters, one uppercase, one number">
        <Input type="password" {...register("password")} invalid={!!errors.password} autoComplete="new-password" />
      </Field>
      <Field label="Confirm Password" error={errors.confirmPassword?.message}>
        <Input type="password" {...register("confirmPassword")} invalid={!!errors.confirmPassword} autoComplete="new-password" />
      </Field>
      {serverError && <p className="text-xs text-red-700">{serverError}</p>}
      <p className="text-[0.625rem] font-light leading-relaxed text-muted">
        Demo authentication — accounts are stored locally only. Connect a real auth provider before
        production.
      </p>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

function ForgotForm({ onSent, sent }: { onSent: () => void; sent: boolean }) {
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
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (sent) {
    return (
      <div className="border hairline bg-ivory p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-accent" strokeWidth={1.25} />
        <h3 className="mt-4 font-serif text-2xl font-light">Check Your Inbox</h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-muted">
          If an account exists for that address, a reset link is on its way.
        </p>
        <Link href="/account/login" className="eyebrow mt-6 inline-block text-accent hover:underline">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} invalid={!!errors.email} autoComplete="email" />
      </Field>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send Reset Link"}
      </Button>
    </form>
  );
}
