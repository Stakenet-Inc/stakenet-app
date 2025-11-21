import { SportyBetScraper } from "@/components/dashboard/sporty-bet-scraper";
import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl">
      <SportyBetScraper user={user} />
    </main>
  );
}