import { MatchPrediction } from "@/actions/predictions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { TeamLogoFallback } from "./team-logo-fallback";

interface PredictionItemProps {
    prediction: MatchPrediction;
    teamLogos?: {
        home: string | null;
        away: string | null;
    };
}

export function PredictionItem({ prediction, teamLogos }: PredictionItemProps) {
    // Parse team names
    const parseTeams = (teamsString: string) => {
        const separators = /\s+(?:vs\.?|v\.?|-|@)\s+/i;
        const teams = teamsString.split(separators);
        return {
            home: teams[0]?.trim() || "",
            away: teams[1]?.trim() || "",
        };
    };

    const { home, away } = parseTeams(prediction.teams);

    // Determine most likely outcome
    const probabilities = [
        { label: "Home", value: prediction.homeWinProbability },
        { label: "Draw", value: prediction.drawProbability },
        { label: "Away", value: prediction.awayWinProbability },
    ];
    const mostLikely = probabilities.reduce((max, curr) =>
        curr.value > max.value ? curr : max
    );

    if (!prediction.predictable) {
        return (
            <div className="relative flex flex-col bg-card border rounded-xl shadow-sm opacity-60">
                <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">Predictions not available for this match</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col bg-card border rounded-xl shadow-sm transition-all hover:shadow-md group">
            <div className="p-3 pb-4 md:p-4 md:pb-4 relative">
                <div className="flex flex-row justify-between items-start gap-4">
                    {/* Teams */}
                    <div className="space-y-1.5 md:space-y-2 flex flex-col flex-1">
                        <div className="flex flex-col items-start gap-1">
                            <div className="flex flex-col items-start gap-0.5 flex-wrap w-full">
                                {/* Home Team */}
                                <div className="flex items-center gap-2 w-full">
                                    {teamLogos?.home ? (
                                        <div className="relative size-6 shrink-0">
                                            <Image
                                                src={teamLogos.home}
                                                alt={home}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <TeamLogoFallback teamName={home} />
                                    )}
                                    <span className=" text-sm flex-1">{home}</span>

                                </div>

                                {/* Away Team */}
                                <div className="flex items-center gap-2 w-full">
                                    {teamLogos?.away ? (
                                        <div className="relative size-6 shrink-0">
                                            <Image
                                                src={teamLogos.away}
                                                alt={away}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <TeamLogoFallback teamName={away} />
                                    )}
                                    <span className=" text-sm flex-1">{away}</span>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Most Likely Outcome */}
                    <div className="flex flex-col gap-1 items-end">
                        <p className="text-sm text-muted-foreground">Prediction</p>
                        <Badge variant="default" className="bg-primary/80">
                            {mostLikely.label}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="relative h-px w-full">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-muted-foreground/20"></div>
                </div>
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="p-4 pt-4 md:p-4 md:pt-4 bg-muted/30 space-y-3">
                {/* Over/Under if available */}
                {prediction.overUnder && (
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-sm  text-muted-foreground  tracking-wider">Over/Under 2.5</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {prediction.overUnder.over25 > prediction.overUnder.under25 ? (
                                <>
                                    <span className="text-sm ">Over 2.5</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm ">Under 2.5</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* BTTS if available */}
                {prediction.btts && (
                    <div className="space-y-1.5">
                        <span className="text-sm  text-muted-foreground  tracking-wider">Both Teams to Score</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm ">
                                {prediction.btts.yes > prediction.btts.no ? "Yes" : "No"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Correct Score if available */}
                {prediction.correctScore && (
                    <div className="space-y-1.5">
                        <span className="text-sm text-muted-foreground tracking-wider">Most Likely Score</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium">{prediction.correctScore.score}</span>
                            <Badge variant="outline" className="text-xs">
                                {prediction.correctScore.probability.toFixed(1)}%
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Confidence indicator */}
                <div className="pt-2 border-t border-dashed border-muted-foreground/20">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm  text-muted-foreground  tracking-wider">Confidence</span>
                        <span className="text-sm font-medium text-primary">{mostLikely.value.toFixed(1)}%</span>
                    </div>
                    <Progress value={mostLikely.value} className="h-1.5" />
                </div>
            </div>
        </div>
    );
}
