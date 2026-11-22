import type { Metadata } from "next";
import { AuthForms } from "@/components/account/AuthForms";
import { AuthPageShell } from "@/components/account/AuthPageShell";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell mode="forgot">
      <AuthForms mode="forgot" />
    </AuthPageShell>
  );
}
