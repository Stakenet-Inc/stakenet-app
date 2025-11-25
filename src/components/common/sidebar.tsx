"use client";

import stakenetLogo from "@/assets/stakenet.png";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { sidebarBottomItems, sidebarTopItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";


export function Sidebar({ user }: { user?: { name?: string | null; image?: string | null } }) {
    const pathname = usePathname();
    const isProfileActive = pathname === "/profile";

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="fixed left-4 top-4 bottom-4 z-999 hidden w-16 flex-col items-center rounded-full bg-[#131313] border border-input/20 backdrop-blur-md py-6 text-white shadow-xl md:flex">
                <div className="mb-8 flex items-center justify-center">
                    <div className=" size-7 relative">
                        <Image fill src={stakenetLogo} alt="" className=" object-contain" />
                    </div>
                </div>

                <nav className="flex flex-1 flex-col items-center gap-4 w-full px-2">
                    {sidebarTopItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10",
                                            isActive
                                                ? "bg-primary/20 text-primary hover:bg-primary/10"
                                                : "text-white/70 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-primary" />
                                        )}
                                        <item.icon className="h-5 w-5" />
                                        <span className="sr-only">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className={cn(
                                        "ml-5 border-white/10",
                                        isActive
                                            ? "bg-muted/80 text-white"
                                            : "bg-muted/80 text-white"
                                    )}
                                >
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                <div className="mt-auto flex flex-col items-center gap-4">
                    {sidebarBottomItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10",
                                            isActive
                                                ? "bg-primary/20 text-primary hover:bg-primary/10"
                                                : "text-white/70 hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-primary" />
                                        )}
                                        <item.icon className="h-5 w-5" />
                                        <span className="sr-only">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className={cn(
                                        "ml-5 border-white/10",
                                        isActive
                                            ? "bg-muted/80 text-white"
                                            : "bg-muted/80 text-white"
                                    )}
                                >
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                    {user?.image ? (
                        <Tooltip key="/profile">
                            <TooltipTrigger asChild>
                                <Link href="/profile">
                                    <div className={cn("relative size-10 overflow-clip rounded-xl", isProfileActive ? " ring-2 ring-primary" : "")}>
                                        <Image
                                            fill
                                            src={user.image}
                                            alt={user.name || "User"}
                                            className="rounded-xl scale-105 object-cover"
                                        />
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className={cn(
                                    "ml-5 border-white/10",
                                    isProfileActive
                                        ? "bg-muted/80 text-white"
                                        : "bg-muted/80 text-white"
                                )}
                            >
                                <p>Profile</p>
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Tooltip key="/profile">
                            <TooltipTrigger asChild>
                                <Link href="/profile">
                                    <div className={cn("relative size-10 overflow-clip rounded-xl", isProfileActive ? " ring-2 ring-primary" : "")}>
                                        <Image
                                            fill
                                            src={"https://unavatar.io/deviantart/spyed"}
                                            alt="User"
                                            className="rounded-xl scale-105 object-cover"
                                        />
                                    </div>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                className={cn(
                                    "ml-5 border-white/10",
                                    isProfileActive
                                        ? "bg-muted/80 text-white"
                                        : "bg-muted/80 text-white"
                                )}
                            >
                                <p>Profile</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </aside>
        </TooltipProvider>
    );
}
