import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export const EmailVerificationAlert = () => {
    return (
        <div className="rounded-xl border border-input/20 md:pl-4 pl-4 pr-4 md:pr-2 py-4 md:py-2 bg-muted/50 backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col items-start w-full">
                    <p className=" text-sm">
                        Verify Email
                    </p>
                    <span className=" text-sm text-muted-foreground pr-8 md:pr-0 text-balance">
                        Please verify your email address to access all features.
                    </span>
                </div>
                <div className=" mt-6 md:mt-0 inline-flex items-center gap-2 w-full md:w-fit">
                    <Button size="sm" className=" w-full md:w-fit" asChild>
                        <Link href="/verify-email">Verify Email</Link>
                    </Button>
                    <Button size="icon" variant="ghost" className=" hidden md:flex">
                        <X className=" size-5 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" className=" absolute top-2 right-2 md:hidden">
                        <X className=" size-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
