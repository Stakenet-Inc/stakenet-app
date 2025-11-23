export const TOP_LEAGUES = [39, 140, 78, 135, 61, 88, 94, 253];

export type Fixture = {
    fixture: {
        id: number;
        date: string;
        status: {
            long: string;
            short: string;
        };
        referee: string | null;
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
            winner: boolean | null;
        };
        away: {
            id: number;
            name: string;
            logo: string;
            winner: boolean | null;
        };
    };
    goals: {
        home: number | null;
        away: number | null;
    };
};

export interface Odds {
    fixture: {
        id: number;
    };
    bookmakers: {
        id: number;
        bets: {
            id: number;
            name: string;
            values: {
                value: string;
                odd: string;
            }[];
        }[];
    }[];
}

export interface Prediction {
    predictions: {
        winner: {
            id: number;
            name: string;
            comment: string;
        };
        win_or_draw: boolean;
        under_over: string | null;
        goals: {
            home: string | null;
            away: string | null;
        };
        advice: string;
        percent: {
            home: string;
            draw: string;
            away: string;
        };
    };
}

export async function getFixtures(status: "live" | "finished" | "scheduled" = "scheduled", leagueIds?: number[], date?: string) {
    const headers = {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY!,
    };

    let url = `${process.env.FOOTBALL_API_URL}/fixtures?`;

    const today = new Date().toISOString().split('T')[0];
    const queryDate = date || today;

    if (status === "finished") {
        url += `status=FT&last=20`;
    } else if (status === "scheduled") {
        url += `date=${queryDate}&status=NS`;
    } else if (status === "live") {
        url += `live=all`;
    }

    try {
        const res = await fetch(url, { headers, next: { revalidate: 60 } });
        if (!res.ok) throw new Error("Failed to fetch fixtures");
        const data = await res.json();
        let fixtures = data.response as Fixture[];

        if (leagueIds && leagueIds.length > 0) {
            fixtures = fixtures.filter(f => leagueIds.includes(f.league.id));
        }

        return fixtures;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getDailyOdds(date: string, leagueId?: number) {
    const headers = {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY!,
    };

    // Bet365 = 1. Fetching odds for the specific date.
    let url = `${process.env.FOOTBALL_API_URL}/odds?date=${date}&bookmaker=1`;
    if (leagueId) {
        url += `&league=${leagueId}`;
    }

    console.log('Fetching odds from:', url);

    try {
        const res = await fetch(url, { headers, next: { revalidate: 3600 } }); // Cache for 1 hour
        if (!res.ok) {
            console.error('Odds fetch failed:', res.status, res.statusText);
            return [];
        }
        const data = await res.json();
        console.log('Odds API response:', {
            count: data.response?.length || 0,
            results: data.results,
            errors: data.errors
        });
        return data.response as Odds[];
    } catch (error) {
        console.error('Error fetching odds:', error);
        return [];
    }
}

export async function getPrediction(fixtureId: number) {
    const headers = {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY!,
    };

    const url = `${process.env.FOOTBALL_API_URL}/predictions?fixture=${fixtureId}`;

    try {
        const res = await fetch(url, { headers, next: { revalidate: 86400 } }); // Cache for 24 hours
        if (!res.ok) {
            console.error(`Prediction fetch failed for fixture ${fixtureId}:`, res.status);
            return null;
        }
        const data = await res.json();
        if (data.errors && data.errors.length > 0) {
            console.error(`Prediction errors for fixture ${fixtureId}:`, data.errors);
            return null;
        }
        return data.response[0] as Prediction | null;
    } catch (error) {
        console.error(`Error fetching prediction for fixture ${fixtureId}:`, error);
        return null;
    }
}

/**
 * Parses team names from a match string (e.g., "Arsenal vs Chelsea")
 * and returns an array of team names
 */
export function parseTeamNames(teamsString: string): string[] {
    // Common separators: vs, v, -, @
    const separators = /\s+(?:vs\.?|v\.?|-|@)\s+/i;
    const teams = teamsString.split(separators);

    return teams.map(team => team.trim()).filter(Boolean);
}

