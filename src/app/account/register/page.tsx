import type { Metadata } from "next";
import Link from "next/link";
import { AuthForms } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl font-light">Join the Maison</h1>
      <p className="mt-3 text-sm font-light text-muted">
        Already a member?{" "}
        <Link href="/account/login" className="underline underline-offset-4 hover:text-accent">Sign in</Link>.
      </p>
      <div className="mt-10 border hairline bg-ivory p-8">
        <AuthForms mode="register" />
      </div>
    </div>
  );
}
