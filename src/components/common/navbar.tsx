import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import { Atom, Banana, ChevronDown, Ellipsis, Forward, X } from "lucide-react";

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

        <div className="flex items-center gap-2 rounded-full bg-muted/50 backdrop-blur-lg hover:bg-primary/20 hover:text-primary cursor-pointer py-1.5 px-2.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-sm"><path d="M8.11523 3.19409C9.15589 2.15344 10.844 2.15363 11.8848 3.19409L16.8057 8.11499C17.8462 9.15575 17.8463 10.8438 16.8057 11.8845L11.8848 16.8054C10.8441 17.8461 9.156 17.846 8.11523 16.8054L3.19434 11.8845C2.15387 10.8438 2.15369 9.15564 3.19434 8.11499L8.11523 3.19409ZM7.96582 7.49976C7.78889 7.49965 7.6396 7.63263 7.61914 7.80835C7.49243 8.90693 6.87202 9.52734 5.77344 9.65405C5.59772 9.67451 5.46474 9.8238 5.46484 10.0007C5.46517 10.1777 5.59859 10.3264 5.77441 10.3464C6.85731 10.4691 7.52042 11.0831 7.61816 12.1824C7.63414 12.3623 7.78525 12.4999 7.96582 12.4998C8.14634 12.4994 8.29693 12.3613 8.3125 12.1814C8.40645 11.0979 9.06302 10.4414 10.1465 10.3474C10.3264 10.3318 10.4645 10.1813 10.4648 10.0007C10.465 9.82016 10.3273 9.66905 10.1475 9.65308C9.04822 9.55533 8.4342 8.89222 8.31152 7.80933C8.29153 7.6335 8.14276 7.50008 7.96582 7.49976Z" fill="#AECE2A"></path></svg>
          <span className=" text-xs">
            Upgrade to Pro
          </span>
          <X className=" size-3 text-white" />
        </div>

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
