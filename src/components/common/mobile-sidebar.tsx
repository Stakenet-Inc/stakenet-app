"use client";

import stakenetLogo from "@/assets/stakenet.png";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { sidebarBottomItems, sidebarTopItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
    const pathname = usePathname();
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="size-9 flex items-center justify-center cursor-pointer">
                    <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-white">
                        <path d="M11.6663 12.6686L11.801 12.6823C12.1038 12.7445 12.3313 13.0125 12.3313 13.3337C12.3311 13.6547 12.1038 13.9229 11.801 13.985L11.6663 13.9987H3.33325C2.96609 13.9987 2.66839 13.7008 2.66821 13.3337C2.66821 12.9664 2.96598 12.6686 3.33325 12.6686H11.6663ZM16.6663 6.00163L16.801 6.0153C17.1038 6.07747 17.3313 6.34546 17.3313 6.66667C17.3313 6.98788 17.1038 7.25586 16.801 7.31803L16.6663 7.33171H3.33325C2.96598 7.33171 2.66821 7.03394 2.66821 6.66667C2.66821 6.2994 2.96598 6.00163 3.33325 6.00163H16.6663Z"></path>
                    </svg>
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background p-0">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <div className="flex flex-col h-full py-6 text-white px-4">
                    <div className="mb-8 px-4 flex items-center gap-2 justify-start">
                        <div className="relative size-7">
                            <Image fill src={stakenetLogo} alt="Stakenet" className="object-contain" />
                        </div>
                        <span className=" text-xl font-medium tracking-tight">Stakenet</span>
                    </div>

                    <nav className="flex flex-1 flex-col gap-2">
                        {sidebarTopItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        " relative flex items-center gap-2.5 px-4 text-sm h-10 rounded-xl transition-all hover:bg-white/10",
                                        isActive
                                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                                            : "text-white/70 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <div className="absolute -left-3 h-2 w-1 rounded-r-full bg-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto flex flex-col gap-2">
                        {sidebarBottomItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        " relative flex items-center gap-2.5 px-4 text-sm h-10 rounded-xl transition-all hover:bg-white/10",
                                        isActive
                                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                                            : "text-white/70 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
