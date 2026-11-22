import type { Metadata } from "next";
import { AuthForms } from "@/components/account/AuthForms";
import { AuthPageShell } from "@/components/account/AuthPageShell";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthPageShell mode="login">
      <AuthForms mode="login" />
    </AuthPageShell>
  );
}
