"use server";

import { normalizeTeamName, parseTeamNames } from "@/utils/team-names";

interface TeamSearchResult {
    id: number;
    name: string;
    image_path: string;
}

interface SportsMonksResponse<T> {
    data: T[];
}

/**
 * Searches for a team and returns its logo URL using SportsMonks API
 */
export async function getTeamLogo(teamName: string): Promise<string | null> {
    const apiKey = process.env.SPORTS_MONK_API_KEY;

    if (!apiKey) {
        console.warn("SPORTS_MONK_API_KEY not configured");
        return null;
    }

    try {
        const normalizedName = normalizeTeamName(teamName);

        const response = await fetch(
            `https://api.sportmonks.com/v3/football/teams/search/${encodeURIComponent(normalizedName)}?api_token=${apiKey}`,
            {
                cache: 'no-store', // Disable cache for debugging
            }
        );

        if (!response.ok) {
            console.error("SportsMonks API error:", response.status, await response.text());
            return null;
        }

        const data = await response.json() as SportsMonksResponse<TeamSearchResult>;

        console.log(`SportsMonks search for "${teamName}": found ${data.data?.length || 0} results`);
        if (data.data && data.data.length > 0) {
            return data.data[0].image_path;
        }


        if (!data.data || data.data.length === 0) {
            console.log(`Empty response for "${teamName}":`, JSON.stringify(data));
        }

        return null;
    } catch (error) {
        console.error(`Failed to fetch team logo for "${teamName}":`, error);
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
