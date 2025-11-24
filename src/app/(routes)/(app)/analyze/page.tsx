import { BetSlipScraper } from "@/components/app/bet-slip-scraper";
import { getServerSession } from "@/lib/get-session";
import type { Metadata } from "next";
import { unauthorized } from "next/navigation";

export const metadata: Metadata = {
    title: "Analyze",
};

export default async function DashboardPage() {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) unauthorized();

    return (
        <main className="mx-auto w-full max-w-6xl">
            <BetSlipScraper user={user} />
        </main>
    );
}