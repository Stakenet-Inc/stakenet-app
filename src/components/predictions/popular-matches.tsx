import { Card } from "@/components/ui/card";
import { StatsBar } from "./stats-bar";
import { Fixture } from "@/lib/api-football";
import Image from "next/image";

interface PopularMatchesProps {
    matches: Fixture[];
    stats: {
        predicted: number;
        upcoming: number;
        won: number;
    };
}

export function PopularMatches({ matches, stats }: PopularMatchesProps) {
    return (
        <div className="mb-8">
            <div className=" w-full flex items-center justify-between">
                <h2 className="text-lg font-semibold mb-4 text-white">Popular Matches</h2>
                <StatsBar {...stats} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {matches.map((match) => (
                    <Card key={match.fixture.id} className="bg-[#131313] border border-white/5 p-4 relative overflow-hidden group hover:bg-[#1A1A1A] transition-colors">
                        <div className="flex justify-center mb-2">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 uppercase tracking-wide">
                                {match.fixture.status.short === "FT" ? "Finished" : match.fixture.status.short}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className="size-12 relative flex items-center justify-center">
                                    <Image src={match.teams.home.logo} alt={match.teams.home.name} fill className="object-contain" />
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground text-center w-full leading-tight line-clamp-2">{match.teams.home.name}</span>
                            </div>

                            <div className="text-2xl font-bold text-white tracking-widest -mt-4">
                                {match.goals.home ?? 0}-{match.goals.away ?? 0}
                            </div>

                            <div className="flex flex-col items-center gap-3 w-1/3">
                                <div className="size-12 relative flex items-center justify-center">
                                    <Image src={match.teams.away.logo} alt={match.teams.away.name} fill className="object-contain" />
                                </div>
                                <span className="text-[11px] font-medium text-muted-foreground text-center w-full leading-tight line-clamp-2">{match.teams.away.name}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
