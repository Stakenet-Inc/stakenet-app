import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MatchRow } from "./match-row";
import { Fixture } from "@/lib/api-football";

interface MatchListProps {
    fixtures: Fixture[];
}

export function MatchList({ fixtures }: MatchListProps) {
    // Group fixtures by league
    const groupedFixtures = fixtures.reduce((acc, fixture) => {
        const leagueName = `${fixture.league.country} - ${fixture.league.name}`;
        if (!acc[leagueName]) {
            acc[leagueName] = {
                league: leagueName,
                country: fixture.league.flag,
                items: [],
            };
        }
        acc[leagueName].items.push(fixture);
        return acc;
    }, {} as Record<string, { league: string; country: string; items: Fixture[] }>);

    const groups = Object.values(groupedFixtures);

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#1A1A1A] p-2 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">All Matches</Button>
                    <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/5">Upcoming Matches</Button>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-transparent text-muted-foreground hover:text-white hover:bg-white/5">
                        <ArrowUpDown className="size-4" />
                        Default
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-transparent text-muted-foreground hover:text-white hover:bg-white/5">
                        <SlidersHorizontal className="size-4" />
                        Descending
                    </Button>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            className="pl-9 h-9 w-[200px] bg-transparent border-white/10 focus-visible:ring-primary/50"
                        />
                    </div>
                </div>
            </div>

            {/* Match Groups */}
            <div className="space-y-4">
                {groups.map((group, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-white/5 bg-[#131313]">
                        <div className="px-4 py-3 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{group.country && <img src={group.country} alt="" className="w-5 h-auto inline-block" />}</span>
                                <h3 className="font-semibold text-white text-sm">{group.league}</h3>
                            </div>
                            <button className="text-muted-foreground hover:text-white transition-colors">
                                <ArrowUpDown className="size-4 rotate-180" />
                            </button>
                        </div>
                        <div>
                            {group.items.map((match) => (
                                <MatchRow
                                    key={match.fixture.id}
                                    time={new Date(match.fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    status={match.fixture.status.short as any}
                                    home={match.teams.home.name}
                                    away={match.teams.away.name}
                                    homeLogo={match.teams.home.logo}
                                    awayLogo={match.teams.away.logo}
                                    score={match.goals.home !== null ? `${match.goals.home} : ${match.goals.away}` : undefined}
                                    // Mock odds/predictions for now as they require separate API calls or paid plan features
                                    odds={{ home: 1.5, draw: 3.2, away: 4.5 }}
                                    prediction={{ pick: "1", odds: 1.5, result: "Pending" }}
                                    confidence={8.5}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
