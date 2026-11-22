import type { Metadata } from "next";
import { AuthForms } from "@/components/account/AuthForms";
import { AuthPageShell } from "@/components/account/AuthPageShell";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <AuthPageShell mode="register">
      <AuthForms mode="register" />
    </AuthPageShell>
  );
}
