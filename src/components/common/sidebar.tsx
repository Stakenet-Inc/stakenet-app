"use client";

import stakenetLogo from "@/assets/stakenet.png";
import { sidebarBottomItems, sidebarTopItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";


export function Sidebar({ user }: { user?: { name?: string | null; image?: string | null } }) {
    const pathname = usePathname();

    return (
        <aside className="fixed left-4 top-4 bottom-4 z-999 hidden w-16 flex-col items-center rounded-full bg-muted/50 border border-input/20 backdrop-blur-md py-6 text-white shadow-xl md:flex">
            <div className="mb-8 flex items-center justify-center">
                <div className=" size-8 relative">
                    <Image fill src={stakenetLogo} alt="" className=" object-contain" />
                </div>
            </div>

            <nav className="flex flex-1 flex-col items-center gap-4 w-full px-2">
                {sidebarTopItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10",
                                isActive
                                    ? "bg-primary/20 text-primary"
                                    : "text-white/70 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-primary" />
                            )}
                            <item.icon className="h-5 w-5" />
                            <span className="sr-only">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto flex flex-col items-center gap-4">
                {sidebarBottomItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10",
                                isActive
                                    ? "bg-primary/20 text-primary"
                                    : "text-white/70 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-primary" />
                            )}
                            <item.icon className="h-5 w-5" />
                            <span className="sr-only">{item.label}</span>
                        </Link>
                    );
                })}
                {user?.image && (
                    <div className=" relative size-10 overflow-clip rounded-xl">
                        <Image
                            fill
                            src={user.image}
                            alt={user.name || "User"}
                            className="rounded-xl scale-105 object-cover"
                        />
                    </div>
                )}
            </div>
        </aside>
    );
}
