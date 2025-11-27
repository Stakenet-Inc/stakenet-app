import { EmailForm } from "@/components/auth/email-form";
import { EmailVerificationAlert } from "@/components/auth/email-verification-alert";
import { LogoutEverywhereButton } from "@/components/auth/logout-everywhere-button";
import { PasswordForm } from "@/components/auth/password-form";
import { ProfileDetailsForm } from "@/components/auth/profile-details-form";
import { ProfileInformationProps } from "@/interface";
import { getServerSession } from "@/lib/get-session";
import { format } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
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
    <main className="mx-auto w-full max-w-xl relative pb-60">
      <h1 className=" text-xl md:text-2xl font-semibold">Settings</h1>
      <p className="text-muted-foreground text-sm">
        Update your account details, email, and password.
      </p>
      <div className=" fixed bottom-0 z-20 w-full left-0 px-4 md:px-0 md:left-auto bg-linear-to-b from-transparent via-black/60 to-black max-w-xl pb-4 pt-4">
        {!user.emailVerified && <EmailVerificationAlert email={user.email} />}
      </div>
      <aside className=" bg-card px-4 py-6 rounded-xl mt-4 border border-input/60 md:border-input/40">
        <div className="">
          <ProfileInformation user={user} />
        </div>
        <div className="flex flex-col">
          <div className="flex-1">
            <ProfileDetailsForm user={user} />
          </div>
          <div className="flex-1 space-y-6">
            <EmailForm currentEmail={user.email} />
            <PasswordForm />
            <LogoutEverywhereButton />
          </div>
        </div>
      </aside>
    </main>
  );
}


function ProfileInformation({ user }: ProfileInformationProps) {
  return (

    <div>
      <div className="flex-1 space-y-2">
        <div>
          <h3 className="text-base font-medium">{user.name}</h3>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <CalendarDaysIcon className="size-4" />
            Member Since
          </div>
          <p className=" text-sm">
            {format(user.createdAt, "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}