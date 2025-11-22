"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Fixture, Odds, Prediction } from "@/lib/api-football";
import { cn } from "@/lib/utils";
import { ChevronDown, Star } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { MatchTableRow } from "./match-table-row";

interface MatchTableProps {
    fixtures: Fixture[];
    odds?: Odds[];
    predictions?: Record<number, Prediction>;
}

export function MatchTable({ fixtures, odds = [], predictions = {} }: MatchTableProps) {
    // Group fixtures by league
    const groupedFixtures = fixtures.reduce((acc, fixture) => {
        const leagueId = fixture.league.id;
        if (!acc[leagueId]) {
            acc[leagueId] = {
                league: fixture.league,
                fixtures: [],
            };
        }
        acc[leagueId].fixtures.push(fixture);
        return acc;
    }, {} as Record<number, { league: Fixture["league"]; fixtures: Fixture[] }>);

    // State for collapsed leagues
    const [collapsedLeagues, setCollapsedLeagues] = useState<Record<number, boolean>>({});

    const toggleLeague = (leagueId: number) => {
        setCollapsedLeagues(prev => ({
            ...prev,
            [leagueId]: !prev[leagueId]
        }));
    };

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A]">
            <Table>
                <TableHeader className="bg-[#111]">
                    <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="w-[100px] text-start pl-6">Time</TableHead>
                        <TableHead className="w-[300px]">Participants</TableHead>
                        <TableHead className="text-start">1</TableHead>
                        <TableHead className="text-start">X</TableHead>
                        <TableHead className="text-start">2</TableHead>
                        <TableHead className="text-start">Over 2.5</TableHead>
                        <TableHead className="text-start">BTTS</TableHead>
                        <TableHead className="text-start">Prediction</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.values(groupedFixtures).map(({ league, fixtures }) => (
                        <React.Fragment key={`league-${league.id}`}>
                            <TableRow
                                className="bg-[#161616] hover:bg-[#1A1A1A] cursor-pointer border-white/10 h-11"
                                onClick={() => toggleLeague(league.id)}
                            >
                                <TableCell colSpan={9} className="py-2">
                                    <div className="flex items-center justify-between w-full px-2 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-6 relative flex items-center justify-start">
                                                <Image src={league.logo} alt={league.name} fill className="object-contain" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white">{league.name}</span>
                                                <Star className="h-3.5 w-3.5 text-muted-foreground hover:text-yellow-500 transition-colors" />
                                                <span className="text-xs text-muted-foreground">({fixtures.length} fixtures)</span>
                                            </div>
                                        </div>
                                        <ChevronDown className={cn(" size-4 text-muted-foreground transition-transform duration-200", collapsedLeagues[league.id] && "-rotate-90")} />
                                    </div>
                                </TableCell>
                            </TableRow>

                            {/* Fixture Rows */}
                            {!collapsedLeagues[league.id] && fixtures.map((fixture) => {
                                const matchOdds = odds.find(o => o.fixture.id === fixture.fixture.id);
                                const bets = matchOdds?.bookmakers[0]?.bets || [];

                                // Bet ID 1 = Match Winner (1x2)
                                const matchWinner = bets.find(b => b.id === 1)?.values;
                                const homeOdd = matchWinner?.find(v => v.value === "Home")?.odd;
                                const drawOdd = matchWinner?.find(v => v.value === "Draw")?.odd;
                                const awayOdd = matchWinner?.find(v => v.value === "Away")?.odd;

                                // Bet ID 5 = Goals Over/Under, Value "Over 2.5"
                                const over25 = bets.find(b => b.id === 5)?.values.find(v => v.value === "Over 2.5")?.odd;
                                // Bet ID 13 = BTTS, Value "Yes"
                                const btts = bets.find(b => b.id === 13)?.values.find(v => v.value === "Yes")?.odd;

                                const prediction = predictions[fixture.fixture.id];

                                return (
                                    <MatchTableRow
                                        key={fixture.fixture.id}
                                        fixture={fixture}
                                        odds={{
                                            home: homeOdd,
                                            draw: drawOdd,
                                            away: awayOdd,
                                            over25,
                                            btts
                                        }}
                                        prediction={prediction}
                                    />
                                );
                            })}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>

            {fixtures.length === 0 && (
                <div className="text-start py-12 text-muted-foreground text-sm">
                    No matches found for this date.
                </div>
            )}
        </div>
    );
}
