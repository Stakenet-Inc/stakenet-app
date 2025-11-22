import { Ban } from "lucide-react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "../../../../components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div role="alert" className="text-sm text-destructive/10 border border-destructive/20 bg-destructive/10 h-9 line-clamp-1 flex items-center gap-2 px-2.5 rounded-lg ">
          <Ban className=" size-4" />
          <span>
            Token is missin
          </span>
        </div>
      )}
    </main>
  );
}