"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function DateNavigator() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dateParam = searchParams.get("date");
    const date = dateParam ? new Date(dateParam) : new Date();
    const [open, setOpen] = useState(false);

    const handleDateSelect = (newDate: Date | undefined) => {
        if (newDate) {
            const formatted = format(newDate, "yyyy-MM-dd");
            router.push(`/predictions?date=${formatted}`);
            setOpen(false);
        }
    };

    const handlePrevDay = () => {
        const newDate = subDays(date, 1);
        handleDateSelect(newDate);
    };

    const handleNextDay = () => {
        const newDate = addDays(date, 1);
        handleDateSelect(newDate);
    };

    return (
        <div className="flex items-center justify-between w-full mb-6">
            <div className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <CalendarIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                        />
                    </PopoverContent>
                </Popover>

                <div className="flex items-center gap-2 ml-2">
                    <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-transparent">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-medium text-white min-w-[60px] text-center">
                        {format(date, "dd.MM.yy")}
                    </span>

                    <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-transparent">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Button variant="outline">
                <Settings2 />
                Configuration
            </Button>
        </div>
    );
}
