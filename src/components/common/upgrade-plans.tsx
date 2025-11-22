"use client"

import { Activity, DecimalsArrowRight, History, Sparkle, TicketCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetTitle, SheetTrigger } from "../ui/sheet";

const UpgradePlans = () => {
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
                    amount: 50, // GH₵50
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
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex items-center gap-2 w-fit justify-start rounded-full bg-muted/50 backdrop-blur-lg hover:bg-primary/10 hover:text-primary cursor-pointer py-2 px-3 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm"><path d="M8.11523 3.19409C9.15589 2.15344 10.844 2.15363 11.8848 3.19409L16.8057 8.11499C17.8462 9.15575 17.8463 10.8438 16.8057 11.8845L11.8848 16.8054C10.8441 17.8461 9.156 17.846 8.11523 16.8054L3.19434 11.8845C2.15387 10.8438 2.15369 9.15564 3.19434 8.11499L8.11523 3.19409ZM7.96582 7.49976C7.78889 7.49965 7.6396 7.63263 7.61914 7.80835C7.49243 8.90693 6.87202 9.52734 5.77344 9.65405C5.59772 9.67451 5.46474 9.8238 5.46484 10.0007C5.46517 10.1777 5.59859 10.3264 5.77441 10.3464C6.85731 10.4691 7.52042 11.0831 7.61816 12.1824C7.63414 12.3623 7.78525 12.4999 7.96582 12.4998C8.14634 12.4994 8.29693 12.3613 8.3125 12.1814C8.40645 11.0979 9.06302 10.4414 10.1465 10.3474C10.3264 10.3318 10.4645 10.1813 10.4648 10.0007C10.465 9.82016 10.3273 9.66905 10.1475 9.65308C9.04822 9.55533 8.4342 8.89222 8.31152 7.80933C8.29153 7.6335 8.14276 7.50008 7.96582 7.49976Z" fill="#009134"></path></svg>
                    <span className=" text-sm font-medium">
                        Upgrade to Pro
                    </span>
                    <X className=" size-4 text-muted-foreground" />
                </div>
            </SheetTrigger>
            <SheetContent className="bg-[#131313] rounded-xl border border-input/20  w-full px-4 pt-6">
                <SheetTitle className="text-base font-semibold text-start mb-6">Choose your Preferred Plan</SheetTitle>

                <RadioGroup defaultValue="pro" className="grid gap-4" onValueChange={setSelectedPlan}>
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
                        <p className="text-sm text-muted-foreground pl-7 pr-12 text-balance group-hover:text-white/70">
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
                        <p className="text-sm text-muted-foreground group-hover:text-white/70 pl-7 pr-8 text-balance mb-4">
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


                <SheetFooter className=" pb-6">
                    {selectedPlan === "free" ? (
                        <SheetClose asChild>
                            <Button className="w-full">
                                Close
                            </Button>
                        </SheetClose>
                    ) : (
                        <Button className="w-full" onClick={handleContinue} disabled={isLoading}>
                            {isLoading ? "Initializing..." : "Continue with Pro"}
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default UpgradePlans;
