"use client";

import { scrapeSportyBet, type BetSelection } from "@/app/actions";
import stakenetLogo from "@/assets/stakenet.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";


export function SportyBetScraper() {

    const [bookingCode, setBookingCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [bets, setBets] = useState<BetSelection[] | null>(null);

    const handleScrape = async () => {
        if (!bookingCode) {
            toast.error("Please enter a booking code");
            return;
        }

        setIsLoading(true);
        setBets(null);

        try {
            const result = await scrapeSportyBet(bookingCode);

            if (result.success && result.bets) {
                setBets(result.bets);
                toast.success(`Successfully loaded ${result.bets.length} bets`);
            } else {
                toast.error(result.error || "Failed to load booking");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative max-w-3xl mx-auto w-full">
            <div className="flex-1 overflow-hidden relative h-full">
                {!bets && !isLoading && (
                    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4 relative z-10">
                        <div className=" size-12 relative">
                            <Image fill src={stakenetLogo} alt="" className=" object-contain" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Analyze Your Bet Slip With AI</h3>
                            <p className="text-muted-foreground text-base max-w-sm mx-auto">
                                Enter a booking code below to extract and analyze your bet slip using our AI powered algorithms.
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-6 px-4 pb-32 pt-20">
                    {isLoading && (
                        <div className="space-y-4 border rounded-xl px-4 pt-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="font-semibold text-muted-foreground animate-pulse">Loading Betslip Details...</h3>
                                <Skeleton className="w-20 h-6" />
                            </div>
                            <TicketSkeleton />
                            <TicketSkeleton />
                            <TicketSkeleton />
                        </div>
                    )}

                    {bets && bets.length > 0 && (
                        <div className="space-y-4 border rounded-xl px-4 pt-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="font-semibold text-muted-foreground">Betslip Details</h3>
                                <Badge variant="secondary">{bets.length} Selections</Badge>
                            </div>
                            {bets.map((bet, index) => (
                                <TicketItem key={index} bet={bet} />
                            ))}
                        </div>
                    )}
                </div>
            </div>


            <div className="fixed bottom-0 max-w-3xl w-full mx-auto left-0 right-0 p-4 bg-linear-to-t from-background via-background to-transparent pt-10 z-50">
                <div className="relative flex items-center gap-2 bg-muted/50 backdrop-blur-md p-1.5 rounded-full border shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all hover:bg-muted/70">
                    <Input
                        placeholder="Enter Booking Code or click to paste it"
                        value={bookingCode}
                        onChange={(e) => setBookingCode(e.target.value)}
                        disabled={isLoading}
                        className="border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 min-h-12 px-4"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isLoading) {
                                handleScrape();
                            }
                        }}
                    />
                    <Button
                        onClick={handleScrape}
                        disabled={isLoading || !bookingCode}
                        size="icon"
                        className="rounded-full h-10 w-10 shrink-0 mr-1"
                    >
                        {isLoading ? (
                            <div className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <Send className=" size-5" />
                        )}
                    </Button>
                </div>
                <p className="text-sm text-center text-muted-foreground mt-3">
                    Predictions are insights, not guarantees.
                </p>
            </div>
        </div>
    );
}

function TicketItem({ bet }: { bet: BetSelection }) {
    return (
        <div className="relative flex flex-col bg-card border rounded-xl shadow-sm transition-all hover:shadow-md group">
            <div className="p-5 pb-8 relative">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
                    <div className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Match</span>
                        <p className="font-semibold text-base leading-tight">{bet.teams}</p>
                    </div>
                    <div className="md:shrink-0">
                        <Badge variant="outline" className="bg-background/50 backdrop-blur">
                            {bet.market}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="relative h-px w-full">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-muted-foreground/20"></div>
                </div>
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
            </div>

            <div className="p-5 pt-6 bg-muted/30">
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Selection</span>
                        <p className="font-bold text-lg text-primary">{bet.selection}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Odds</span>
                        <div className="text-2xl font-black tracking-tight text-primary">{bet.odds}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TicketSkeleton() {
    return (
        <div className="relative flex flex-col bg-card border rounded-xl">
            <div className="p-5 pb-8">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-5 w-3/4" />
                    </div>
                    <Skeleton className="h-6 w-20 shrink-0" />
                </div>
            </div>

            <div className="relative h-px w-full">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-muted-foreground/20"></div>
                </div>
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
            </div>

            <div className="p-5 pt-6 bg-muted/30">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-7 w-24" />
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}
