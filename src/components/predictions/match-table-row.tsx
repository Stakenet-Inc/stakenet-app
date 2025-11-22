import { TableCell, TableRow } from "@/components/ui/table";
import { Fixture, Prediction } from "@/lib/api-football";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface MatchTableRowProps {
    fixture: Fixture;
    odds?: {
        home?: string;
        draw?: string;
        away?: string;
        over25?: string;
        btts?: string;
    };
    prediction?: Prediction;
}

export function MatchTableRow({ fixture, odds, prediction }: MatchTableRowProps) {
    const { status, date } = fixture.fixture;
    const { home, away } = fixture.teams;
    const { goals } = fixture;

    const time = format(new Date(date), "hh:mm a");
    const isFinished = status.short === "FT" || status.short === "AET" || status.short === "PEN";

    // Parse prediction to get team and text
    const getPredictionDisplay = () => {
        if (!prediction) return null;

        const { winner, win_or_draw } = prediction.predictions;
        const advice = prediction.predictions.advice;

        // Determine which team logo to show and what text
        let teamLogo = "";
        let predictionText = "";

        if (winner.id === home.id) {
            teamLogo = home.logo;
            predictionText = win_or_draw ? `${home.name} or Draw` : `${home.name} Win`;
        } else if (winner.id === away.id) {
            teamLogo = away.logo;
            predictionText = win_or_draw ? `${away.name} or Draw` : `${away.name} Win`;
        } else {
            // If no clear winner, show the advice text
            predictionText = advice.split(":")[0] || advice;
            teamLogo = home.logo; // Default to home team logo
        }

        return { teamLogo, predictionText };
    };

    const predictionDisplay = getPredictionDisplay();

    return (
        <TableRow className="hover:bg-[#0F0F0F] border-white/5 group">
            <TableCell className="text-start py-3">
                <div className="flex flex-col items-center justify-center min-w-[60px]">
                    {isFinished ? (
                        <div className="flex flex-col items-center gap-0.5">
                            <span className="text-white text-sm">{goals.home} - {goals.away}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">FT</span>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">{time}</span>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="size-5 relative flex items-center justify-center">
                            <Image src={home.logo} alt={home.name} fill className="object-contain" />
                        </div>
                        <span className={cn("truncate text-sm", isFinished && goals.home! > goals.away! ? "font-medium text-white" : "text-[#A1A1AA]")}>
                            {home.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="size-5 relative flex items-center justify-center">
                            <Image src={away.logo} alt={away.name} fill className="object-contain" />
                        </div>
                        <span className={cn("truncate text-sm", isFinished && goals.away! > goals.home! ? "font-medium text-white" : "text-[#A1A1AA]")}>
                            {away.name}
                        </span>
                    </div>
                </div>
            </TableCell>

            <TableCell className="text-start text-sm font-medium text-white/90 py-3">{odds?.home || "-"}</TableCell>
            <TableCell className="text-start text-sm font-medium text-white/90 py-3">{odds?.draw || "-"}</TableCell>
            <TableCell className="text-start text-sm font-medium text-white/90 py-3">{odds?.away || "-"}</TableCell>
            <TableCell className="text-start text-sm font-medium text-white/90 py-3">{odds?.over25 || "-"}</TableCell>
            <TableCell className="text-start text-sm font-medium text-white/90 py-3">{odds?.btts || "-"}</TableCell>

            <TableCell className="text-start py-3">
                {predictionDisplay ? (
                    <div className="flex items-center gap-2">
                        <div className="size-5 relative flex items-center justify-center shrink-0">
                            <Image src={predictionDisplay.teamLogo} alt="Team" fill className="object-contain" />
                        </div>
                        <span className="text-sm text-muted-foreground font-medium truncate">
                            {predictionDisplay.predictionText}
                        </span>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">N/A</span>
                )}
            </TableCell>
        </TableRow>
    );
}
