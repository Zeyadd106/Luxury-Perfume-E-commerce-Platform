import type { Metadata } from "next";
import Link from "next/link";
import { AuthForms } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl font-light">Welcome Back</h1>
      <p className="mt-3 text-sm font-light text-muted">
        Sign in to your {`account`} — or{" "}
        <Link href="/account/register" className="underline underline-offset-4 hover:text-accent">create one</Link>.
      </p>
      <div className="mt-10 border hairline bg-ivory p-8">
        <AuthForms mode="login" />
      </div>
    </div>
  );
}
