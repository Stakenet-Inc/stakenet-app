import { EmailForm } from "@/components/auth/email-form";
import { EmailVerificationAlert } from "@/components/auth/email-verification-alert";
import { LogoutEverywhereButton } from "@/components/auth/logout-everywhere-button";
import { PasswordForm } from "@/components/auth/password-form";
import { ProfileDetailsForm } from "@/components/auth/profile-details-form";
import { UserAvatar } from "@/components/auth/user-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileInformationProps } from "@/interface";
import { getServerSession } from "@/lib/get-session";
import { format } from "date-fns";
import { CalendarDaysIcon, ShieldIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";


export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-muted-foreground">
            Update your account details, email, and password.
          </p>
        </div>
        {!user.emailVerified && <EmailVerificationAlert email={user.email} />}
        <div>
          <ProfileInformation user={user} />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <ProfileDetailsForm user={user} />
          </div>
          <div className="flex-1 space-y-6">
            <EmailForm currentEmail={user.email} />
            <PasswordForm />
            <LogoutEverywhereButton />
          </div>
        </div>
      </div>
    </main>
  );
}


function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-5" />
          Profile Information
        </CardTitle>
        <CardDescription>
          Your account details and current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-32 sm:size-24"
            />
            {user.role && (
              <Badge>
                <ShieldIcon className="size-3" />
                {user.role}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDaysIcon className="size-4" />
                Member Since
              </div>
              <p className="font-medium">
                {format(user.createdAt, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}