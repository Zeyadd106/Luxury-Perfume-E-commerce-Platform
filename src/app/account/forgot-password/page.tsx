import type { Metadata } from "next";
import { AuthForms } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-4xl font-light">Reset Password</h1>
      <p className="mt-3 text-sm font-light text-muted">Enter your email and we&rsquo;ll send a reset link.</p>
      <div className="mt-10 border hairline bg-ivory p-8">
        <AuthForms mode="forgot" />
      </div>
    </div>
  );
}
