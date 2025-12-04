"use client";

import stakenetLogo from "@/assets/stakenet.png";
import { LoadingButton } from "@/components/common/loading-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error) {
      setError("Something went wrong");
    } else {
      setSuccess(
        "Reset link sent to your email",
      );
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-sm z-999">
      <CardHeader>
        <div className=" size-12 md:size-14 relative mb-2 mt-2">
          <Image fill src={stakenetLogo} alt="Stakenet" className="object-contain" />
        </div>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription className=" text-balance">
          Enter email address associated with your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {success && (
              <div role="status" className="text-sm bg-primary/10 border border-primary/20 line-clamp-1 h-9 flex items-center gap-2 px-2.5 rounded-lg text-primary">
                <Send className=" size-4" />
                <span>
                  {success}
                </span>
              </div>
            )}
            {error && (
              <div role="alert" className="text-sm text-destructive border border-destructive/20 bg-destructive/10 h-9 line-clamp-1 flex items-center gap-2 px-2.5 rounded-lg ">
                <Ban className=" size-4" />
                <span>
                  {error}
                </span>
              </div>
            )}

            <LoadingButton type="submit" className="w-full mt-2" loading={loading}>
              Send reset link
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center">
          <p className="text-muted-foreground text-center text-sm">
            Remeber your password?{" "}
            <Link href="/sign-in" className="hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
