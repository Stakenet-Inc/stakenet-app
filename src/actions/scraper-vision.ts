"use server";

import { getMatchLogos } from "@/actions/sportmonks";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { prompt } from "@/prompts";
import { BetSelection } from "./scraper";

export interface VisionScrapeResult {
    success: boolean;
    bets?: BetSelection[];
    error?: string;
}

export async function scrapeBetSlipFromImage(base64Image: string): Promise<VisionScrapeResult> {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return {
                success: false,
                error: "AI service not configured. Please contact support."
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



        const imagePart = {
            inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);

        const response = await result!.response;
        const text = response.text();

        // Clean the response to extract JSON
        let jsonText = text.trim();

        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        // Parse the JSON response
        const parsedData = JSON.parse(jsonText);

        if (!parsedData.valid) {
            return {
                success: false,
                error: "This doesn't appear to be a valid bet slip. Please upload a screenshot of a betting slip."
            };
        }

        if (!parsedData.bets || !Array.isArray(parsedData.bets) || parsedData.bets.length === 0) {
            return {
                success: false,
                error: "No bets found in the image. Please ensure the bet slip is clearly visible."
            };
        }

        // Check if the slip is outdated (older than 1 day)
        let isOutdated = false;
        if (parsedData.date) {
            try {
                // Parse date format "DD/MM/YYYY HH:mm"
                const [datePart, timePart] = parsedData.date.split(' ');
                if (datePart) {
                    const [day, month, year] = datePart.split('/').map(Number);

                    // Create date object (months are 0-indexed in JS)
                    const slipDate = new Date(year, month - 1, day);

                    // Add time if available
                    if (timePart) {
                        const [hours, minutes] = timePart.split(':').map(Number);
                        slipDate.setHours(hours, minutes);
                    }

                    const oneDayAgo = new Date();
                    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

                    // Reset time portion for pure date comparison if needed, 
                    // but user asked for "time is in the past by one day", so full timestamp comparison is better.
                    // However, "checking current day" implies we might want to just check if the day is < yesterday.
                    // Let's stick to a 24h check or just strict date check.
                    // "if the time is in the past by one day by checking current day"
                    // Let's check if the slip date is before yesterday.

                    if (slipDate < oneDayAgo) {
                        isOutdated = true;
                    }
                }
            } catch (e) {
                console.error("Failed to parse date:", parsedData.date, e);
            }
        }

        // Fetch team logos for each bet
        const betsWithLogos = await Promise.all(
            parsedData.bets.map(async (bet: BetSelection) => {
                const logos = await getMatchLogos(bet.teams);

                // Check if odds are missing or empty to mark as unavailable
                // Also mark as unavailable if the slip is outdated
                const isUnavailable = (!bet.odds || bet.odds === '') || isOutdated;

                return {
                    ...bet,
                    teamLogos: logos,
                    isUnavailable,
                };
            })
        );

        return { success: true, bets: betsWithLogos };
    } catch (error: unknown) {
        console.error("Vision scraping failed:", error);

        if (error instanceof SyntaxError) {
            return {
                success: false,
                error: "Failed to parse bet slip data. Please try with a clearer image."
            };
        }

        return {
            success: false,
            error: "Failed to process image. Please try again."
        };
    }
}
