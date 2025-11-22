"use client";

import bookiesLogo from "@/assets/bookies.png";
import sportybetLogo from "@/assets/sportybet.png";
import stakenetLogo from "@/assets/stakenet.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, Paperclip, TicketSlash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { EmailVerificationAlert } from "../auth/email-verification-alert";
import { TicketItem } from "./ticket-item";
import { TicketSkeleton } from "./ticket-skeleton";


import { BetSelection, scrapeSportyBet } from "@/actions/scraper";
import { type User } from "@/lib/auth";

export function BetSlipScraper({ user }: { user: User }) {
    const [bookingCode, setBookingCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Array<{
        id: string;
        role: 'user' | 'system';
        content?: string;
        bets?: BetSelection[];
        isLoading?: boolean;
        isError?: boolean;
    }>>([]);

    const handleScrape = async () => {
        if (!bookingCode) {
            toast.error("Please enter a booking code");
            return;
        }

        const code = bookingCode;
        setBookingCode("");
        setIsLoading(true);

        // Add user message
        const userMsgId = Date.now().toString();
        setMessages(prev => [...prev, {
            id: userMsgId,
            role: 'user',
            content: code
        }]);

        // Add temporary loading message
        const loadingMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: loadingMsgId,
            role: 'system',
            isLoading: true
        }]);

        try {
            const result = await scrapeSportyBet(code);

            if (result.success && result.bets) {
                // Update loading message to success
                setMessages(prev => prev.map(msg =>
                    msg.id === loadingMsgId
                        ? { ...msg, isLoading: false, bets: result.bets, content: "Retrieved your bet slip from Sportybet" }
                        : msg
                ));
                toast.success(`Successfully loaded ${result.bets!.length} bets`);
            } else {
                // Update loading message to error
                setMessages(prev => prev.map(msg =>
                    msg.id === loadingMsgId
                        ? { ...msg, isLoading: false, isError: true, content: "Something went wrong" }
                        : msg
                ));
                toast.error(result.error || "Failed to load booking");
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.map(msg =>
                msg.id === loadingMsgId
                    ? { ...msg, isLoading: false, isError: true, content: "Something went wrong" }
                    : msg
            ));
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full relative max-w-3xl mx-auto w-full">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[calc(100dvh-100px)] md:min-h-[calc(100vh-240px)] md:pb-20">
                    <div className="flex flex-1 flex-col items-center pt-8 md:pt-0 h-full justify-between md:justify-center text-center md:space-y-4 relative z-10 w-full max-w-2xl md:px-4">
                        <div className=" w-full flex flex-col items-center">
                            <div className=" size-9 md:size-10 relative mb-4">
                                <Image fill src={stakenetLogo} alt="Stakenet" className="object-contain" />
                            </div>

                            <div className="">
                                <h3 className="font-semibold text-base md:text-lg tracking-tight">Analyze Your Bet Slip</h3>
                                <p className="text-muted-foreground text-sm">
                                    Enter your code below to extract and analyze
                                </p>
                            </div>
                        </div>

                        <div className=" w-full flex flex-col items-center">
                            <div className="relative w-full h-40">
                                <div className=" absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background z-20" />
                                <Image fill src={bookiesLogo} alt="Bookies" className="object-contain" />
                            </div>

                            <div className=" z-20 -mt-12 relative max-w-3xl w-full flex items-center bg-muted/50 backdrop-blur-md p-0.5 rounded-full transition-all hover:bg-muted/70 border border-input/20 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive">
                                <Button size="icon" variant="ghost" className=" h-8 w-8 md:h-9 md:w-9 rounded-full shrink-0 ml-1 hover:bg-input/50">
                                    <Paperclip />
                                </Button>
                                <Input
                                    placeholder="Enter Booking Code"
                                    value={bookingCode}
                                    onChange={(e) => setBookingCode(e.target.value)}
                                    disabled={isLoading}
                                    className="border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 px-2"
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
                                    className="rounded-full h-8 w-8 md:h-9 md:w-9 shrink-0 mr-0.5 md:mr-1"
                                >
                                    {isLoading ? (
                                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <ArrowUp className=" size-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                Predictions are insights, not guarantees.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto relative h-full pb-40 md:pb-60 pt-8 md:pt-12 md:px-4 scrollbar-hide">
                        <div className="space-y-8">
                            {messages.map((msg) => (
                                <div key={msg.id} className="space-y-4">
                                    {msg.role === 'user' ? (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="relative size-9 md:size-10 rounded-xl overflow-hidden">
                                                    {user?.image ? (
                                                        <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-primary">U</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-sm">{msg.content}</span>
                                            </div>
                                            <Badge variant="outline" className="rounded-full pl-1 pr-2.5 md:pr-4 py-1 text-sm gap-2">
                                                <div className=" relative size-6 md:size-7">
                                                    <Image fill src={sportybetLogo} alt="Sportybet Logo" />
                                                </div>
                                                Sportybet
                                            </Badge>
                                        </div>
                                    ) : (
                                        <div className=" space-y-4 md:space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className={msg.isError ? "relative size-9 md:size-10 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0" : "relative size-9 md:size-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0"}>
                                                    <TicketSlash className={msg.isError ? "text-destructive size-5" : "text-primary size-5"} />
                                                </div>
                                                <div className="space-y-1 pt-1 text-sm">
                                                    {msg.isLoading ? (
                                                        <p className="text-muted-foreground animate-pulse">Fetching bet slip...</p>
                                                    ) : (
                                                        <p className={msg.isError ? "text-destructive" : "text-primary"}>{msg.content}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {msg.isLoading ? (
                                                <div className=" space-y-2.5 md:space-y-4 border rounded-xl px-2 md:px-4 pt-2.5 md:pt-4 pb-2.5 md:pb-4">
                                                    <div className="flex items-center justify-between px-1">
                                                        <Skeleton className="w-40 h-6" />
                                                        <Skeleton className="w-20 h-6" />
                                                    </div>
                                                    <TicketSkeleton />
                                                    <TicketSkeleton />
                                                    <TicketSkeleton />
                                                </div>
                                            ) : msg.bets && (
                                                <div className=" space-y-2.5 md:space-y-4 border rounded-xl px-2 md:px-4 pt-2.5 md:pt-4 pb-2.5 md:pb-4">
                                                    <div className="flex items-center justify-between px-1">
                                                        <h3 className="font-semibold text-muted-foreground text-sm">Betslip Details</h3>
                                                        <Badge variant="secondary">{msg.bets.length} Selections</Badge>
                                                    </div>
                                                    {msg.bets.map((bet, index) => (
                                                        <TicketItem key={index} bet={bet} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed bottom-0 max-w-3xl w-full mx-auto left-0 right-0 px-4 bg-linear-to-t from-background via-background to-transparent pb-6 pt-10 z-50">
                        {!user.emailVerified &&
                            <aside className=" mb-2">
                                <EmailVerificationAlert />
                            </aside>
                        }
                        <div className="relative max-w-3xl w-full flex items-center bg-muted/50 backdrop-blur-md p-0.5 rounded-full transition-all hover:bg-muted/70 border border-input/20 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive">
                            <Button size="icon" variant="ghost" className=" h-8 w-8 md:h-9 md:w-9 rounded-full shrink-0 ml-1 hover:bg-input/50">
                                <Paperclip />
                            </Button>
                            <Input
                                placeholder="Enter Booking Code"
                                value={bookingCode}
                                onChange={(e) => setBookingCode(e.target.value)}
                                disabled={isLoading}
                                className="border-none shadow-none bg-transparent dark:bg-transparent focus-visible:ring-0 px-2"
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
                                className="rounded-full h-8 w-8 md:h-9 md:w-9 shrink-0 mr-0.5 md:mr-1"
                            >
                                {isLoading ? (
                                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <ArrowUp className=" size-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Predictions are insights, not guarantees.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}


