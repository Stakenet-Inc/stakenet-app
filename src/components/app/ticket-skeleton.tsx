import { Skeleton } from "@/components/ui/skeleton";

export function TicketSkeleton() {
    return (
        <div className="relative flex flex-col bg-card border rounded-xl">
            <div className=" p-3 pb-4 md:p-5 md:pb-8">
                <div className="flex justify-between items-start gap-2 md:gap-4">
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-5 w-3/4" />
                    </div>
                    <Skeleton className="h-6 w-20 shrink-0" />
                </div>
            </div>

            <div className="relative h-px w-full">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-muted-foreground/20"></div>
                </div>
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
            </div>

            <div className="p-5 pt-6 bg-muted/30">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-7 w-24" />
                    </div>
                    <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}
