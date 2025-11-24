"use server";

import { getMatchLogos } from "@/actions/sportmonks";



export interface BetSelection {
  teams: string;
  market: string;
  selection: string;
  odds: string;
  isUnavailable?: boolean;
  teamLogos?: {
    home: string | null;
    away: string | null;
  };
  status?: string;
}

export interface ScrapeResult {
  success: boolean;
  bets?: BetSelection[];
  error?: string;
}

export async function scrapeSportyBet(bookingCode: string): Promise<ScrapeResult> {
  const browserless = process.env.BROWSERLESS_IO_API_KEY;

  const script = `
    export default async ({ page, context }) => {
      try {
        await page.goto('https://www.sportybet.com/', { waitUntil: 'networkidle0', timeout: 60000 });
        
        const inputSelector = 'input[placeholder="Booking Code"]';
        await page.waitForSelector(inputSelector, { timeout: 10000 });
        await page.type(inputSelector, context.bookingCode);
        
        // Find the Load button
        const buttonSelector = 'button.af-button--primary';
        await page.waitForSelector(buttonSelector, { timeout: 5000 });
        
        const clicked = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button.af-button--primary'));
          const loadButton = buttons.find(b => b.textContent && b.textContent.includes('Load'));
          if (loadButton) {
            loadButton.click();
            return true;
          }
          return false;
        });

        if (!clicked) {
          throw new Error('Load button not found');
        }

        // Wait for the bets to load
        await page.waitForSelector('.m-list .m-item', { timeout: 10000 });
        
        // Extract bet details
        const bets = await page.evaluate(() => {
          const items = Array.from(document.querySelectorAll('.m-list .m-item'));
          return items.map(item => {
            const teamEl = item.querySelector('.m-item-team');
            const marketEl = item.querySelector('.m-item-market');
            const selectionEl = item.querySelector('.m-item-play span');
            const oddsEl = item.querySelector('.m-item-odds .m-text-main');

            let teams = teamEl ? teamEl.innerText.trim() : '';
            const market = marketEl ? marketEl.innerText.trim() : '';
            const selection = selectionEl ? selectionEl.innerText.trim() : '';
            const odds = oddsEl ? oddsEl.innerText.trim() : '';

            let status = "08:00";
            // Check for "Live" prefix in teams
            if (teams.startsWith("Live")) {
                status = "Live";
                teams = teams.replace(/^Live\s*/, "").trim();
            }

            // Check if any field contains "unavailable" text or if odds are missing/empty
            const hasUnavailableText = [teams, market, selection, odds].some(
              field => field.toLowerCase().includes('unavailable')
            );
            const hasEmptyOdds = !odds || odds === '';

            return {
              teams,
              market,
              selection,
              odds,
              isUnavailable: hasUnavailableText || hasEmptyOdds,
              status
            };
          }).filter(bet => bet.teams); // Filter out any empty items
        });

        return { bets };
      } catch (error) {
        return { error: error.message };
      }
    };
  `;

  try {
    const response = await fetch(`https://production-sfo.browserless.io/function?token=${browserless}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: script,
        context: { bookingCode },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Browserless error:", errorText);
      return { success: false, error: `Browserless API error: ${response.status} ${response.statusText}` };
    }

    const data = await response.json();

    if (data.error) {
      return { success: false, error: data.error };
    }

    // Fetch team logos for each bet
    const betsWithLogos = await Promise.all(
      (data.bets || []).map(async (bet: BetSelection) => {
        const logos = await getMatchLogos(bet.teams);
        return {
          ...bet,
          teamLogos: logos,
        };
      })
    );

    return { success: true, bets: betsWithLogos };
  } catch (error: unknown) {
    console.error("Scraping failed:", error);
    return { success: false, error: "Failed to connect to scraping service" };
  }
}
