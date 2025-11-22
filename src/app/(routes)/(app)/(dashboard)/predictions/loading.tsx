import { DateNavigator } from "@/components/predictions/date-navigator";
import { MatchTableSkeleton } from "@/components/predictions/match-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <main className="flex min-h-screen bg-black text-white">
            <div className="flex-1 p-6 md:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
                {/* Popular Matches Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl bg-[#111]" />
                    ))}
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 mb-6 w-full justify-between">
                            <div className="flex gap-2">
                                <Skeleton className="h-9 w-9 rounded-md bg-[#131313]" />
                                <div className="flex gap-2 ml-2">
                                    <Skeleton className="h-8 w-8 rounded-md bg-transparent" />
                                    <Skeleton className="h-8 w-16 rounded-md bg-transparent" />
                                    <Skeleton className="h-8 w-8 rounded-md bg-transparent" />
                                </div>
                            </div>
                            <Skeleton className="h-9 w-32 rounded-md bg-[#131313]" />
                        </div>
                    </div>
                    <MatchTableSkeleton />
                </div>
            </div>
        </main>
    );
}
