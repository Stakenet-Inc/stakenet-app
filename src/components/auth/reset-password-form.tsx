"use client";

import { PasswordInput } from "@/components/auth/password-input";
import { LoadingButton } from "@/components/common/loading-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import stakenetLogo from "@/assets/stakenet.png";
import { Ban, CircleCheck } from "lucide-react";


type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      setError("Something went wrong");
    } else {
      setSuccess("Reset. Sign in with new password");
      setTimeout(() => router.push("/sign-in"), 3000);
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-sm z-999">
      <CardHeader>
        <div className=" size-9 md:size-10 relative mb-2 mt-2">
          <Image fill src={stakenetLogo} alt="Stakenet" className="object-contain" />
        </div>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription className=" text-balance">
          Enter new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {success && (
              <div role="status" className="text-sm bg-primary/10 border border-primary/20 line-clamp-1 h-9 flex items-center gap-2 px-2.5 rounded-lg text-primary">
                <CircleCheck className=" size-4" />
                {success}
              </div>
            )}
            {error && (
              <div role="alert" className="text-sm text-destructive border border-destructive/20 bg-destructive/10 h-9 line-clamp-1 flex items-center gap-2 px-2.5 rounded-lg ">
                <Ban className=" size-4" />
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full mt-2" loading={loading}>
              Reset password
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
