import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import { Ellipsis, Forward, SmilePlus } from "lucide-react";




import Image from "next/image";
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
        <div className=" w-full flex items-center justify-center pl-28">
          <UpgradePlans />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Forward />
            Invite Friends
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
