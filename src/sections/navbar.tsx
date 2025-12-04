"use client"

import stakenetLogo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <header className="w-full sticky top-0 bg-linear-to-b via-black/50 from-black to-transparent z-999 py-4 pr-4 md:pr-0">

            <nav className=" w-full flex items-center justify-between max-w-7xl mx-auto">
                <Link href="/">
                    <div className=" relative h-9 md:h-[38px] w-[180px]">
                        <Image
                            className=" object-contain"
                            fill
                            src={stakenetLogo}
                            alt="Stakenet logo"
                        />
                    </div>
                </Link>
                <div className="hidden lg:inline-flex items-center gap-8 text-sm">
                    <p>Home</p>
                    <p>Features</p>
                    <p>Changelog</p>
                    <p>Pricing</p>
                    <p>FAQs</p>
                </div>
                <div className=" inline-flex items-center gap-2">
                    <Link href="/analyze">
                        <Button>Dashboard</Button>
                    </Link>
                    <Link className=" hidden md:block" href="/analyze">
                        <Button variant="outline">Sign In</Button>
                    </Link>
                    <Button className="md:hidden" variant="ghost" size="icon">
                        <Menu className=" size-5" />
                    </Button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;