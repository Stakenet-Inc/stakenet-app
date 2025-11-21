import { MailIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const EmailVerificationAlert = () => {
    return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MailIcon className="size-5 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-200">
                        Please verify your email address to access all features.
                    </span>
                </div>
                <Button size="sm" asChild>
                    <Link href="/verify-email">Verify Email</Link>
                </Button>
            </div>
        </div>
    );
}
