"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import xBetLogo from "@/assets/1xbet.png";
import bet365Logo from "@/assets/bet365.png";
import betKingLogo from "@/assets/betking.png";
import betwayLogo from "@/assets/betway.png";
import footballComLogo from "@/assets/football.png";
import mSportLogo from "@/assets/msport.png";
import sportybetLogo from "@/assets/sportybet.png";

const bookies = [
    {
        id: "xbet",
        name: "1XBet",
        url: "1xbet.com",
        logo: xBetLogo,
    },
    {
        id: "betway",
        name: "Betway",
        url: "betway.com",
        logo: betwayLogo,
    },
    {
        id: "bet365",
        name: "Bet365",
        url: "bet365.com",
        logo: bet365Logo,
    },
    {
        id: "betking",
        name: "Bet King",
        url: "betking.com",
        logo: betKingLogo,
    },
    {
        id: "football",
        name: "Football",
        url: "football.com",
        logo: footballComLogo,
    },
    {
        id: "MSport",
        name: "MSport",
        url: "msport.com",
        logo: mSportLogo,
    },
    {
        id: "sportybet",
        name: "Sportybet",
        url: "sportybet.com",
        logo: sportybetLogo,
    },
];

export function BookieSelector() {
    const [open, setOpen] = React.useState(false);
    const [selectedBookie, setSelectedBookie] = React.useState("sportybet");
    const [searchQuery, setSearchQuery] = React.useState("");

    const currentBookie = bookies.find((bookie) => bookie.id === selectedBookie);

    const filteredBookies = bookies.filter(
        (bookie) =>
            bookie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookie.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-52 h-[38px] justify-between rounded-full bg-[#131313] border border-input/20 has-[>svg]:px-0 has-[>svg]:pl-1.5 has-[>svg]:pr-2.5"
                >
                    <div className="flex items-center gap-3">
                        {currentBookie && (
                            <div className="relative size-6 rounded-full">
                                <Image
                                    fill
                                    src={currentBookie.logo}
                                    alt={currentBookie.name}
                                    className="object-cover rounded-full"
                                />
                            </div>
                        )}
                        <span className=" text-sm text-white/80">
                            {currentBookie?.name} Bookie
                        </span>
                    </div>
                    <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="pt-0 px-0 pb-2 bg-[#131313] border border-input/20 w-52" align="start">
                <div className="space-y-2">
                    <div className="relative ">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search bookies"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className=" pl-8 bg-transparent border-t-0 border-x-0 border-b border-b-input/20 rounded-none focus:ring-0 focus:ring-offset-0 ring-0 focus-visible:ring-0 focus-visible:border-input/20"
                        />
                    </div>

                    <RadioGroup
                        value={selectedBookie}
                        onValueChange={(value) => {
                            setSelectedBookie(value);
                            setOpen(false);
                        }}
                        className="space-y-0 gap-0 px-2"
                    >
                        {filteredBookies.map((bookie) => (
                            <label
                                key={bookie.id}
                                htmlFor={bookie.id}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
                                    "hover:bg-muted/50",
                                    selectedBookie === bookie.id && "bg-primary/15"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative size-8 rounded-full">
                                        <Image
                                            src={bookie.logo}
                                            alt={bookie.name}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    </div>
                                    <div className="flex flex-col -space-y-0.5">
                                        <span className="text-sm text-white">
                                            {bookie.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{bookie.url}</span>
                                    </div>
                                </div>

                                <RadioGroupItem
                                    value={bookie.id}
                                    id={bookie.id}
                                    className={cn(
                                        "border",
                                        selectedBookie === bookie.id
                                            ? " border-primary/80"
                                            : "border-input"
                                    )}
                                />
                            </label>
                        ))}
                    </RadioGroup>

                    {filteredBookies.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            No bookies found
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
