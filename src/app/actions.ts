"use server";

export interface BetSelection {
  teams: string;
  market: string;
  selection: string;
  odds: string;
}

export interface ScrapeResult {
  success: boolean;
  bets?: BetSelection[];
  error?: string;
}

export async function scrapeSportyBet(bookingCode: string): Promise<ScrapeResult> {
  const BROWSERLESS_API_KEY = "2TPZY0wM3TejCGodc52e3242089dd5381f6485b6c54b22bec";
  
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

            return {
              teams: teamEl ? teamEl.innerText.trim() : '',
              market: marketEl ? marketEl.innerText.trim() : '',
              selection: selectionEl ? selectionEl.innerText.trim() : '',
              odds: oddsEl ? oddsEl.innerText.trim() : ''
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
    const response = await fetch(`https://production-sfo.browserless.io/function?token=${BROWSERLESS_API_KEY}`, {
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

    return { success: true, bets: data.bets };
  } catch (error) {
    console.error("Scraping failed:", error);
    return { success: false, error: "Failed to connect to scraping service" };
  }
}
