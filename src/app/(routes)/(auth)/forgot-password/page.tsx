import type { Metadata } from "next";
import { ForgotPasswordForm } from "../../../../components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <ForgotPasswordForm />
    </main>
  );
}
