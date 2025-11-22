import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";

export function MatchTableSkeleton() {
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A]">
            <Table>
                <TableHeader className="bg-[#111]">
                    <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="w-[100px] text-center">Time</TableHead>
                        <TableHead className="w-[300px]">Participants</TableHead>
                        <TableHead className="text-center">1</TableHead>
                        <TableHead className="text-center">X</TableHead>
                        <TableHead className="text-center">2</TableHead>
                        <TableHead className="text-center">Over 2.5</TableHead>
                        <TableHead className="text-center">BTTS</TableHead>
                        <TableHead className="text-right">Prediction</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Skeleton Rows */}
                    {[1, 2, 3].map((leagueIndex) => (
                        <React.Fragment key={`league-skeleton-${leagueIndex}`}>
                            {/* League Header Skeleton */}
                            <TableRow className="bg-[#161616] border-white/10 hover:bg-[#161616]">
                                <TableCell colSpan={9} className="py-2">
                                    <div className="flex items-center justify-between px-4">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-4 w-32 bg-white/10" />
                                                <Skeleton className="h-3 w-16 bg-white/10" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-4 w-4 bg-white/10" />
                                    </div>
                                </TableCell>
                            </TableRow>

                            {/* Match Row Skeletons */}
                            {[1, 2].map((matchIndex) => (
                                <TableRow key={`match-skeleton-${leagueIndex}-${matchIndex}`} className="border-white/5 hover:bg-transparent">
                                    {/* Time/Status */}
                                    <TableCell className="text-center py-3">
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <Skeleton className="h-4 w-12 bg-white/10 mb-1" />
                                            <Skeleton className="h-3 w-8 bg-white/10" />
                                        </div>
                                    </TableCell>

                                    {/* Participants */}
                                    <TableCell className="py-3">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
                                                <Skeleton className="h-3 w-24 bg-white/10" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-5 w-5 rounded-full bg-white/10" />
                                                <Skeleton className="h-3 w-24 bg-white/10" />
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Odds Columns */}
                                    <TableCell className="text-center py-3"><Skeleton className="h-3 w-8 bg-white/10 mx-auto" /></TableCell>
                                    <TableCell className="text-center py-3"><Skeleton className="h-3 w-8 bg-white/10 mx-auto" /></TableCell>
                                    <TableCell className="text-center py-3"><Skeleton className="h-3 w-8 bg-white/10 mx-auto" /></TableCell>
                                    <TableCell className="text-center py-3"><Skeleton className="h-3 w-8 bg-white/10 mx-auto" /></TableCell>
                                    <TableCell className="text-center py-3"><Skeleton className="h-3 w-8 bg-white/10 mx-auto" /></TableCell>

                                    {/* Referee */}
                                    <TableCell className="text-right py-3">
                                        <div className="flex flex-col items-end gap-1">
                                            <Skeleton className="h-3 w-16 bg-white/10" />
                                            <div className="flex gap-1">
                                                <Skeleton className="h-3 w-2 bg-white/10" />
                                                <Skeleton className="h-3 w-2 bg-white/10" />
                                            </div>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
