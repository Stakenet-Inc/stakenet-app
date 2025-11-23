import { BetSelection } from "@/actions/scraper";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { TeamLogoFallback } from "./team-logo-fallback";
import { Separator } from "../ui/separator";
export function TicketItem({ bet }: { bet: BetSelection }) {
    // Parse team names from the teams string
    const parseTeams = (teamsString: string) => {
        const separators = /\s+(?:vs\.?|v\.?|-|@)\s+/i;
        const teams = teamsString.split(separators);
        return {
            home: teams[0]?.trim() || "",
            away: teams[1]?.trim() || "",
        };
    };

    const { home, away } = parseTeams(bet.teams);

    return (
        <div className="relative flex flex-col bg-card border rounded-xl shadow-sm transition-all hover:shadow-md group">
            <div className=" p-3 pb-4 md:p-4 md:pb-4 relative">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-2 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2 flex flex-col w-full">
                        <div className="flex items-center gap-2">
                            <span>08:00</span>
                            <div className="h-4">
                                <Separator orientation="vertical" />
                            </div>
                            <div className="flex flex-col items-start gap-0.5 flex-wrap">
                                {/* Home Team */}
                                <div className="flex items-center gap-2">
                                    {bet.teamLogos?.home ? (
                                        <div className="relative size-6 shrink-0">
                                            <Image
                                                src={bet.teamLogos.home}
                                                alt={home}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <TeamLogoFallback teamName={home} />
                                    )}
                                    <span className="font-medium text-sm md:text-base">{home}</span>
                                </div>

                                {/* Away Team */}
                                <div className="flex items-center gap-2">
                                    {bet.teamLogos?.away ? (
                                        <div className="relative size-6 shrink-0">
                                            <Image
                                                src={bet.teamLogos.away}
                                                alt={away}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <TeamLogoFallback teamName={away} />
                                    )}
                                    <span className="font-medium text-sm md:text-base">{away}</span>
                                </div>
                            </div>
                        </div>
                        {/* Teams with logos */}
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
                    <div className="w-full border-t border-dashed border-muted-foreground/20"></div>
                </div>
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
            </div>

            <div className="p-4 pt-4 md:p-4 md:pt-4 bg-muted/30">
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Selection</span>
                        <p className="font-semibold  text-sm md:text-base text-primary">{bet.selection}</p>
                    </div>
                    <div className="text-right flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Odds</span>
                        <div className=" text-sm md:text-base font-semibold tracking-tight text-primary">{bet.odds}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
