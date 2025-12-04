"use client";

import bookiesLogo from "@/assets/bookies.png";
import sportybetLogo from "@/assets/sportybet.png";
import stakenetLogo from "@/assets/stakenet.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, Plus, TicketCheck, TicketSlash, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { TiMediaStop } from "react-icons/ti";
import { toast } from "sonner";
import { EmailVerificationAlert } from "../auth/email-verification-alert";
import { TicketItem } from "./ticket-item";
import { TicketSkeleton } from "./ticket-skeleton";

import { getPredictionsForMatches, MatchPrediction } from "@/actions/predictions";
import { BetSelection, scrapeSportyBet } from "@/actions/scraper";
import { scrapeBetSlipFromImage } from "@/actions/scraper-vision";
import { type User } from "@/lib/auth";
import { PredictionItem } from "./prediction-item";

export function BetSlipScraper({ user }: { user: User }) {
    const [bookingCode, setBookingCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const [messages, setMessages] = useState<Array<{
        id: string;
        role: 'user' | 'system';
        content?: string;
        bets?: BetSelection[];
        predictions?: (MatchPrediction | null)[];
        isLoading?: boolean;
        isError?: boolean;
        imageData?: string;
        isAnalyzing?: boolean;
    }>>([]);

    const handleAnalyze = async (msgId: string) => {
        const message = messages.find(msg => msg.id === msgId);

        if (!message || !message.bets) {
            toast.error("No bet slip found to analyze");
            return;
        }

        // Check if any bets are unavailable
        const hasUnavailable = message.bets.some(bet => bet.isUnavailable);

        if (hasUnavailable) {
            toast.error("Cannot analyze slip with unavailable matches. Please upload a more recent bet slip.");
            return;
        }

        // Set analyzing state
        setMessages(prev => prev.map(msg =>
            msg.id === msgId ? { ...msg, isAnalyzing: true } : msg
        ));

        try {
            // Fetch predictions for all matches
            const teamStrings = message.bets.map(bet => bet.teams);
            const predictions = await getPredictionsForMatches(teamStrings);

            console.log("Here are the predictions:", predictions);

            // Update message with predictions
            setMessages(prev => prev.map(msg =>
                msg.id === msgId
                    ? { ...msg, predictions, isAnalyzing: false }
                    : msg
            ));

            const successfulPredictions = predictions.filter(p => p !== null).length;
            toast.success(`Generated predictions for ${successfulPredictions} of ${teamStrings.length} matches`);
        } catch (error) {
            console.error("Prediction error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === msgId ? { ...msg, isAnalyzing: false } : msg
            ));
            toast.error("Failed to generate predictions. Please try again.");
        }
    };

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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error("Image too large. Please upload an image under 5MB");
            return;
        }

        setIsLoading(true);

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);

            await new Promise<void>((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        const base64Image = reader.result as string;

                        // Add user message with image
                        const userMsgId = Date.now().toString();
                        setMessages(prev => [...prev, {
                            id: userMsgId,
                            role: 'user',
                            content: 'Uploaded bet slip image',
                            imageData: base64Image
                        }]);

                        // Add temporary loading message
                        const loadingMsgId = (Date.now() + 1).toString();
                        setMessages(prev => [...prev, {
                            id: loadingMsgId,
                            role: 'system',
                            isLoading: true
                        }]);

                        // Process image with AI
                        const result = await scrapeBetSlipFromImage(base64Image);

                        if (result.success && result.bets) {
                            // Update loading message to success
                            setMessages(prev => prev.map(msg =>
                                msg.id === loadingMsgId
                                    ? { ...msg, isLoading: false, bets: result.bets, content: "Extracted bet slip from image" }
                                    : msg
                            ));
                            toast.success(`Successfully extracted ${result.bets!.length} bets`);
                        } else {
                            // Update loading message to error
                            setMessages(prev => prev.map(msg =>
                                msg.id === loadingMsgId
                                    ? { ...msg, isLoading: false, isError: true, content: result.error || "Failed to extract bet slip" }
                                    : msg
                            ));
                            toast.error(result.error || "Failed to extract bet slip");
                        }

                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(new Error("Failed to read image"));
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to process image");
            setMessages(prev => prev.filter(msg => !msg.isLoading));
        } finally {
            setIsLoading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex flex-col h-full relative max-w-3xl mx-auto w-full">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[calc(100dvh-100px)] md:min-h-[calc(100vh-240px)] md:pb-20">
                    <div className="flex flex-1 flex-col items-center pt-8 md:pt-0 h-full justify-between md:justify-center text-center md:space-y-4 relative z-10 w-full max-w-2xl md:px-4">
                        <div className=" w-full flex flex-col items-center">
                            <div className=" size-14 md:size-14 relative mb-2 md:mb-4">
                                <Image fill src={stakenetLogo} alt="Stakenet" className="object-contain" />
                            </div>

                            <div className="">
                                <h3 className="font-medium text-xl md:text-2xl">Analyze Your Betslip</h3>
                                <p className="text-muted-foreground text-sm">
                                    Enter your code below to extract and analyze
                                </p>
                            </div>
                        </div>

                        <div className=" w-full flex flex-col items-center">
                            <div className="relative w-full h-40">
                                <div className=" absolute inset-0 bg-linear-to-b from-transparent via-black/60 to-black z-20" />
                                <Image fill src={bookiesLogo} alt="Bookies" className="object-contain" />
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isLoading}
                            />
                            <div className=" z-20 -mt-12 relative max-w-3xl w-full flex items-center bg-[#131313] p-0.5 rounded-full transition-all border border-input/20 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className=" h-8 w-8 md:h-9 md:w-9 rounded-full shrink-0 ml-1 hover:bg-input/50"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    type="button"
                                >
                                    <Plus />
                                </Button>
                                <Input
                                    placeholder="Enter Booking Code"
                                    value={bookingCode}
                                    maxLength={12}
                                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                                    disabled={isLoading}
                                    className="border-none shadow-none bg-transparent focus-visible:ring-0 px-2 h-9 md:h-11"
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
                                        <TiMediaStop className=" size-4" />
                                    ) : (
                                        <ArrowUp className=" size-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-4 md:text-sm md:tracking-tight">
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
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative size-9 md:size-10 rounded-xl overflow-hidden">
                                                        {user?.image ? (
                                                            <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                                        ) : (
                                                            <Image src="https://unavatar.io/deviantart/spyed" alt="User" fill className="object-cover" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-sm">{msg.content}</span>
                                                </div>
                                                <Badge variant="outline" className="rounded-full pl-1 pr-2.5 md:pr-4 py-1 text-sm gap-2">
                                                    <div className=" relative size-6">
                                                        <Image fill src={sportybetLogo} alt="Sportybet Logo" />
                                                    </div>
                                                    Sportybet
                                                </Badge>
                                            </div>
                                            {msg.imageData && (
                                                <div className="ml-0 md:ml-12 max-w-sm">
                                                    <div className="relative w-full aspect-9/16 rounded-lg overflow-hidden border">
                                                        <Image
                                                            src={msg.imageData}
                                                            alt="Bet slip"
                                                            fill
                                                            className="object-contain bg-muted/30"
                                                        />
                                                    </div>
                                                </div>
                                            )}
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
                                                        <p className={msg.isError ? "text-destructive" : "text-white"}>{msg.content}</p>
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
                                                <>
                                                    <div className=" space-y-2.5 md:space-y-4 border rounded-xl px-2 md:px-4 pt-2.5 md:pt-4 pb-2.5 md:pb-4">
                                                        <div className="flex items-center justify-between px-1">
                                                            <h3 className="font-medium text-muted-foreground text-sm">Bet Slip</h3>
                                                            <Badge variant="secondary">{msg.bets.length} Matches</Badge>
                                                        </div>
                                                        {msg.bets.map((bet, index) => (
                                                            <TicketItem key={index} bet={bet} />
                                                        ))}
                                                        {!msg.predictions && (
                                                            <div className=" flex items-center justify-center">
                                                                <Button
                                                                    onClick={() => handleAnalyze(msg.id)}
                                                                    disabled={msg.isAnalyzing}
                                                                    className="gap-2"
                                                                >
                                                                    <Zap className="size-4" />
                                                                    {msg.isAnalyzing ? "Analyzing..." : "Analyze Bet Slip"}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Predictions Section */}
                                                    {msg.predictions && msg.predictions.length > 0 && (
                                                        <>
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative size-9 md:size-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                                                    <TicketCheck className="text-primary size-5" />
                                                                </div>
                                                                <div className="space-y-1 pt-1 text-sm">
                                                                    <p className="text-white">Match Predictions</p>
                                                                </div>
                                                            </div>
                                                            <div className=" space-y-2.5 md:space-y-4 border rounded-xl px-2 md:px-4 pt-2.5 md:pt-4 pb-2.5 md:pb-4 bg-primary/5">
                                                                <div className="flex items-center justify-between px-1">
                                                                    <h3 className="font-medium text-muted-foreground text-sm">Predictions</h3>
                                                                    <Badge variant="secondary">Matches {msg.predictions.filter(p => p !== null).length} Analyzed</Badge>
                                                                </div>
                                                                {msg.predictions.map((prediction, index) =>
                                                                    prediction ? (
                                                                        <PredictionItem
                                                                            key={index}
                                                                            prediction={prediction}
                                                                            teamLogos={msg.bets?.[index]?.teamLogos}
                                                                        />
                                                                    ) : (
                                                                        <div key={index} className="p-4 border rounded-xl bg-card text-center">
                                                                            <p className="text-sm text-muted-foreground">Prediction unavailable for this match</p>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed bottom-0 max-w-3xl w-full mx-auto left-0 md:left-auto  px-4 bg-linear-to-t from-black via-black to-transparent pb-6 pt-10 z-50">
                        {!user.emailVerified &&
                            <aside className=" mb-2">
                                <EmailVerificationAlert email={user.email} />
                            </aside>
                        }
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isLoading}
                        />
                        <div className="relative max-w-3xl w-full flex items-center bg-[#131313] p-0.5 rounded-full transition-all border border-input/20 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive">
                            <Button
                                size="icon"
                                variant="ghost"
                                className=" h-8 w-8 md:h-9 md:w-9 rounded-full shrink-0 ml-1 hover:bg-input/50"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                type="button"
                            >
                                <Plus />
                            </Button>
                            <Input
                                placeholder="Enter Booking Code"
                                value={bookingCode}
                                maxLength={12}
                                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                                disabled={isLoading}
                                className="border-none shadow-none bg-transparent focus-visible:ring-0 px-2 h-9 md:h-11"
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
                                    <TiMediaStop className=" size-6" />
                                ) : (
                                    <ArrowUp className=" size-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-4 md:text-sm md:tracking-tight">
                            Predictions are insights, not guarantees.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
