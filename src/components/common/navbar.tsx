import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import { Atom, Banana, ChevronDown, Ellipsis, Forward } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";



import Image from "next/image";
import { Badge } from "../ui/badge";
import MobileSidebar from "./mobile-sidebar";
import UpgradePlans from "./upgrade-plans";
import UpgradePlansMobile from "./upgrade-plans-mobile";

export async function Navbar() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 md:pl-20 md:pr-4 pt-4 pb-2 md:pb-0 md:pt-2 bg-linear-to-b from-background to-transparent">
      <div className="hidden md:flex items-center justify-between px-6 py-3 text-white relative">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className=" text-sm font-medium" variant="ghost">Stakenet <ChevronDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-84" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div className=" flex items-center justify-between w-full">
                    <div className=" flex items-center gap-4">
                      <Atom className=" size-5 text-white" />
                      <div className=" flex flex-col items-start">
                        <span className=" font-medium text-sm">Stakenet PRO</span>
                        <span className=" text-xs text-muted-foreground">Our smartest algorithm & more</span>
                      </div>
                    </div>
                    <Badge variant="outline">Upgrade</Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className=" flex items-center justify-between w-full">
                    <div className=" flex items-center gap-4">
                      <Banana className=" size-5 text-white" />
                      <div className=" flex flex-col items-start">
                        <span className=" font-medium text-sm">Stakenet</span>
                        <span className=" text-xs text-muted-foreground">Our smartest algorithm & more</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <UpgradePlans />
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Forward />
            Share
          </Button>
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        </div>
      </div>

      <div className=" md:hidden w-full flex items-center justify-between px-4">
        <MobileSidebar />

        <UpgradePlansMobile />

        <div className=" relative size-9 overflow-clip rounded-xl">
          <Image
            fill
            src={user.image || `https://ui-avatars.com/api/?name=${user.name || "User"}`}
            alt={user.name || "User"}
            className="rounded-xl scale-105 object-cover"
          />
        </div>
      </div>
    </header>
  );
}
