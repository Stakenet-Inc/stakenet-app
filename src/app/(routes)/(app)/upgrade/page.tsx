"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Activity, DecimalsArrowRight, History, Sparkle, TicketCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


const UpgradePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");

    const handleContinue = async () => {
        if (selectedPlan === "free") {
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    plan: "PRO",
                    amount: 50,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to initialize payment");
            }

            const data = await response.json();
            window.location.href = data.authorization_url;
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <main className="mx-auto w-full max-w-xl py-12 flex flex-col justify-between h-[calc(100vh-4rem)] md:h-fit">
            <div>
                <h1 className=" text-xl md:text-2xl font-semibold">Upgrade</h1>

                <div className=" mt-4 md:mt-6 mb-8">
                    <RadioGroup defaultValue="pro" className="grid gap-2.5" onValueChange={setSelectedPlan}>
                        <Label
                            htmlFor="free"
                            className="flex cursor-pointer flex-col rounded-xl border border-muted bg-transparent p-4 hover:bg-muted/30 group hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="free" id="free" className="data-[state=checked]:border-primary data-[state=checked]:text-primary" />
                                    <span className="font-medium text-base">Starter pack</span>
                                </div>
                                <span className="font-medium">Free</span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-7 pr-12 text-balance group-hover:text-white/70 text-start w-full">
                                Perfect for casual bettors getting started with basic analysis.
                            </p>
                        </Label>

                        <Label
                            htmlFor="pro"
                            className="flex cursor-pointer flex-col rounded-xl border border-muted bg-transparent p-4 hover:bg-muted/30 group hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="pro" id="pro" className="data-[state=checked]:border-primary data-[state=checked]:text-primary" />
                                    <span className="font-medium text-base">Pro pack</span>
                                </div>
                                <span className="font-medium">GH₵50/mo</span>
                            </div>
                            <p className="text-sm text-muted-foreground group-hover:text-white/70 pl-7 pr-8 text-balance mb-4 text-start w-full">
                                For serious bettors who want AI insights and advanced analytics.
                            </p>
                            <ul className="space-y-3 mb-1 text-sm text-muted-foreground group-hover:text-white w-full">
                                <li className="flex items-center gap-2 w-full justify-start">
                                    <Sparkle className=" size-5 text-primary" />
                                    AI-Powered Bet Slip Analysis
                                </li>
                                <li className="flex items-center gap-2 w-full justify-start">
                                    <TicketCheck className=" size-5 text-primary" />
                                    Value Bet Suggestions
                                </li>
                                <li className="flex items-center gap-2 w-full justify-start">
                                    <History className=" size-5 text-primary" />
                                    Historic Data Insights
                                </li>
                                <li className="flex items-center gap-2 w-full justify-start">
                                    <DecimalsArrowRight className=" size-5 text-primary" />
                                    Market & Odds Trends
                                </li>
                                <li className="flex items-center gap-2 w-full justify-start">
                                    <Activity className=" size-5 text-primary" />
                                    Form & Weather Analysis
                                </li>
                            </ul>
                        </Label>
                    </RadioGroup>
                </div>
            </div>

            {selectedPlan === "free" ? (
                <Button disabled className="w-full">
                    Continue with Free
                </Button>
            ) : (
                <Button className="w-full" onClick={handleContinue} disabled={isLoading}>
                    {isLoading ? "Initializing..." : "Continue with Pro"}
                </Button>
            )}
        </main>
    );
};

export default UpgradePage;