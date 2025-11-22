import { cn } from "@/lib/utils";
import Image from "next/image";

interface MatchRowProps {
    time: string;
    status: "Finished" | "Upcoming" | "Live";
    home: string;
    away: string;
    homeLogo: string;
    awayLogo: string;
    score?: string;
    odds: {
        home: number;
        draw: number;
        away: number;
    };
    prediction: {
        pick: string;
        odds: number;
        result?: "Won" | "Lost" | "Pending";
    };
    confidence: number; // 0-10
}

export function MatchRow({
    time,
    status,
    home,
    away,
    homeLogo,
    awayLogo,
    score,
    odds,
    prediction,
    confidence,
}: MatchRowProps) {
    return (
        <div className="grid grid-cols-12 gap-4 items-center py-3 px-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
            {/* Time & Status */}
            <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                <span className="text-xs font-medium text-muted-foreground">{time}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-muted-foreground border border-white/5">
                    {status}
                </span>
            </div>

            {/* Teams & Score */}
            <div className="col-span-5 flex items-center justify-between px-4">
                <div className="flex items-center gap-3 flex-1 justify-end">
                    <span className="text-sm font-medium text-white text-right">{home}</span>
                    <div className="size-6 relative flex items-center justify-center">
                        <Image src={homeLogo} alt={home} fill className="object-contain" />
                    </div>
                </div>

                <div className="mx-4 px-3 py-1 rounded bg-[#111] border border-white/10 text-sm font-bold text-white min-w-[60px] text-center">
                    {score || "vs"}
                </div>

                <div className="flex items-center gap-3 flex-1 justify-start">
                    <div className="size-6 relative flex items-center justify-center">
                        <Image src={awayLogo} alt={away} fill className="object-contain" />
                    </div>
                    <span className="text-sm font-medium text-white text-left">{away}</span>
                </div>
            </div>

            {/* Odds */}
            <div className="col-span-3 flex items-center gap-2 justify-center">
                <div className="flex flex-col items-center gap-1 bg-[#1A1A1A] rounded p-1 min-w-[40px]">
                    <span className="text-[10px] text-muted-foreground">1</span>
                    <span className="text-xs font-medium text-blue-400">{odds.home}</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-[#1A1A1A] rounded p-1 min-w-[40px]">
                    <span className="text-[10px] text-muted-foreground">X</span>
                    <span className="text-xs font-medium text-blue-400">{odds.draw}</span>
                </div>
                <div className="flex flex-col items-center gap-1 bg-[#1A1A1A] rounded p-1 min-w-[40px]">
                    <span className="text-[10px] text-muted-foreground">2</span>
                    <span className="text-xs font-medium text-blue-400">{odds.away}</span>
                </div>
            </div>

            {/* Prediction */}
            <div className="col-span-2 flex items-center justify-center gap-2">
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase">Pick</span>
                    <div className={cn(
                        "px-2 py-1 rounded text-xs font-bold min-w-[50px] text-center",
                        prediction.result === "Won" ? "bg-green-500/20 text-green-500 border border-green-500/30" :
                            prediction.result === "Lost" ? "bg-red-500/20 text-red-500 border border-red-500/30" :
                                "bg-primary/20 text-primary border border-primary/30"
                    )}>
                        {prediction.pick}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{prediction.odds}</span>
                </div>
            </div>

            {/* Confidence */}
            <div className="col-span-1 flex items-center justify-end">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white">{confidence}/10</span>
                </div>
            </div>
        </div>
    );
}
