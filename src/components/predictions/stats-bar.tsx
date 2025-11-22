import { Trophy, Calendar, CheckCircle2 } from "lucide-react";

interface StatsBarProps {
    predicted: number;
    upcoming: number;
    won: number;
}

export function StatsBar({ predicted = 0, upcoming = 0, won = 0 }: StatsBarProps) {
    return (
        <div className="flex items-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
                <Trophy className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Predicted</span>
                <span className="font-bold text-white">{predicted}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Upcoming</span>
                <span className="font-bold text-white">{upcoming}</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Won Matches</span>
                <span className="font-bold text-white">{won}</span>
            </div>
        </div>
    );
}
