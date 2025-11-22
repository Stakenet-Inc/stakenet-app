import { BetSelection } from "@/actions/scraper";
import { Badge } from "@/components/ui/badge";

export function TicketItem({ bet }: { bet: BetSelection }) {
    return (
        <div className="relative flex flex-col bg-card border rounded-xl shadow-sm transition-all hover:shadow-md group">
            <div className=" p-3 pb-4 md:p-5 md:pb-8 relative">
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-2 md:gap-4">
                    <div className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Match</span>
                        <p className="font-medium text-balance text-sm md:text-base leading-tight">{bet.teams}</p>
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
                    <div className="w-full border-t-2 border-dashed border-muted-foreground/20"></div>
                </div>
                <div className="absolute -left-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -left-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
                <div className="absolute -right-px top-1/2 -translate-y-1/2 w-3 h-6 overflow-hidden z-10">
                    <div className="absolute top-0 -right-3 w-6 h-6 bg-background rounded-full border border-border"></div>
                </div>
            </div>

            <div className="p-4 pt-4 md:p-5 md:pt-6 bg-muted/30">
                <div className="flex justify-between items-end">
                    <div className="md:space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Selection</span>
                        <p className="font-semibold  text-sm md:text-base text-primary">{bet.selection}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Odds</span>
                        <div className=" text-sm md:text-base font-semibold tracking-tight text-primary">{bet.odds}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
