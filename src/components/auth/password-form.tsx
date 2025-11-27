"use client";

import { PasswordInput } from "@/components/auth/password-input";
import { LoadingButton } from "@/components/common/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { updatePasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "../ui/separator";


type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export function PasswordForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit({
    currentPassword,
    newPassword,
  }: UpdatePasswordValues) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setError(error.message || "Failed to change password");
    } else {
      setStatus("Password changed");
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <div>
      <Separator orientation="horizontal" className=" w-full mt-6 mb-6" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          {/* OAuth users (without a password) can use the "forgot password" flow */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput {...field} placeholder="Current password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput {...field} placeholder="New password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <div role="alert" className="text-sm text-red-600">
              {error}
            </div>
          )}
          {status && (
            <div role="status" className="text-sm text-green-600">
              {status}
            </div>
          )}
          <LoadingButton type="submit" loading={loading}>
            Change password
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
