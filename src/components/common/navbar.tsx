import { UserDropdown } from "@/components/auth/user-dropdown";
import { getServerSession } from "@/lib/get-session";
import Link from "next/link";

export async function Navbar() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 md:pl-24 pr-4 pt-4 bg-background">
      <div className="flex items-center justify-between rounded-full  px-6 py-3 text-white shadow-lg">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold hover:text-[#D4F5CA] transition-colors"
        >
          Stakenet
        </Link>
        <div>
          Upgrade to PRO
        </div>
        <div className="flex items-center gap-2">
          <UserDropdown user={user} />
        </div>
      </div>
    </header>
  );
}
