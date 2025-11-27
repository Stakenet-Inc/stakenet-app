"use client"

import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const EmailVerificationAlert = ({ email }: { email: string }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"send" | "verify">("send");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isVisible) return null;

    const handleSendCode = async () => {
        setIsLoading(true);
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "email-verification",
            });
            setStep("verify");
            toast.success("Verification code sent to your email");
        } catch (error) {
            toast.error("Failed to send verification code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (code: string) => {
        setIsLoading(true);
        try {
            await authClient.emailOtp.verifyEmail({
                email,
                otp: code,
            });
            toast.success("Email verified successfully");
            setIsOpen(false);
            setIsVisible(false);
            window.location.reload();
        } catch (error) {
            toast.error("Failed to verify email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-input/30 md:pl-5 pl-4 pr-4 md:pr-2 py-4 md:py-4 bg-[#131313] relative">
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
                        <Button size="sm" className=" w-full md:w-fit" onClick={() => setIsOpen(true)}>
                            Verify Email
                        </Button>
                        <Button size="icon" variant="ghost" className=" hidden md:flex" onClick={() => setIsVisible(false)}>
                            <X className=" size-5 text-muted-foreground" />
                        </Button>
                        <Button size="icon" variant="ghost" className=" absolute top-4 right-4 md:hidden" onClick={() => setIsVisible(false)}>
                            <X className=" size-5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className=" md:w-fit">
                    <DialogHeader>
                        <DialogTitle>
                            {step === "send" ? "Verify Email" : "Enter Verification Code"}
                        </DialogTitle>
                        <DialogDescription>
                            {step === "send"
                                ? "Verify your email now to access all features."
                                : "Enter the OTP code we sent to your email address."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center justify-center gap-4">
                        {step === "send" ? (
                            <Button onClick={handleSendCode} disabled={isLoading} className="w-full">
                                {isLoading ? "Sending..." : "Send Verification Code"}
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button
                                    onClick={() => handleVerifyCode(otp)}
                                    disabled={otp.length !== 6 || isLoading}
                                    className="w-full"
                                >
                                    {isLoading ? "Verifying..." : "Verify Code"}
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
