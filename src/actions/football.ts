"use server";

import { parseTeamNames } from "@/lib/api-football";

interface TeamSearchResult {
    team: {
        id: number;
        name: string;
        logo: string;
    };
}

/**
 * Searches for a team and returns its logo URL
 * Uses API-Football from RapidAPI
 */
export async function getTeamLogo(teamName: string): Promise<string | null> {
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey) {
        console.warn("FOOTBALL_API_KEY not configured");
        return null;
    }

    try {
        const response = await fetch(
            `https://v3.football.api-sports.io/teams?search=${encodeURIComponent(teamName)}`,
            {
                headers: {
                    "x-rapidapi-key": apiKey,
                    "x-rapidapi-host": "v3.football.api-sports.io",
                },
                next: { revalidate: 86400 }, // Cache for 24 hours
            }
        );

        if (!response.ok) {
            console.error("Football API error:", response.status);
            return null;
        }

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            // Return the logo of the first match
            return data.response[0].team.logo;
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch team logo:", error);
        return null;
    }
}

/**
 * Fetches logos for both teams in a match
 */
export async function getMatchLogos(teamsString: string): Promise<{ home: string | null; away: string | null }> {
    const teams = parseTeamNames(teamsString);

    if (teams.length < 2) {
        return { home: null, away: null };
    }

    const [homeLogo, awayLogo] = await Promise.all([
        getTeamLogo(teams[0]),
        getTeamLogo(teams[1]),
    ]);

    return {
        home: homeLogo,
        away: awayLogo,
    };
}
