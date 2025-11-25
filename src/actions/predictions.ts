"use server";

import { normalizeTeamName, parseTeamNames } from "@/utils/team-names";

interface FixtureSearchResult {
    id: number;
    name: string;
    starting_at: string;
    participants: Array<{
        id: number;
        name: string;
        meta: {
            location: string;
        };
    }>;
}

interface PredictionData {
    id: number;
    fixture_id: number;
    predictions: {
        // Type 233: 1X2 predictions
        home?: number;
        draw?: number;
        away?: number;
        // Type 231: BTTS
        yes?: number;
        no?: number;
        // Type 240: Correct scores
        scores?: Record<string, number>;
    };
    type_id: number;
}

interface SportsMonksResponse<T> {
    data: T[];
}

export interface MatchPrediction {
    fixtureId: number;
    teams: string;
    homeWinProbability: number;
    drawProbability: number;
    awayWinProbability: number;
    overUnder?: {
        over25: number;
        under25: number;
    };
    btts?: {
        yes: number;
        no: number;
    };
    correctScore?: {
        score: string;
        probability: number;
    };
    predictable: boolean;
}

/**
 * Extracts prediction data from API response
 */
function extractPredictionData(predictions: PredictionData[], teamsString: string, fixtureId: number): MatchPrediction {
    // Find the 1X2 prediction (type_id: 233)
    const prediction1X2 = predictions.find(p => p.type_id === 233);

    // Find the BTTS prediction (type_id: 231)
    const predictionBTTS = predictions.find(p => p.type_id === 231);

    // Find the Over/Under 2.5 prediction (type_id: 236)
    const predictionOU25 = predictions.find(p => p.type_id === 236);

    // Find Correct Score prediction (type_id: 240)
    const predictionCS = predictions.find(p => p.type_id === 240);

    // Extract 1X2 probabilities
    const homeWin = prediction1X2?.predictions.home || 0;
    const draw = prediction1X2?.predictions.draw || 0;
    const awayWin = prediction1X2?.predictions.away || 0;

    // Extract Over/Under 2.5 if available
    let overUnder;
    if (predictionOU25?.predictions.yes !== undefined) {
        overUnder = {
            over25: predictionOU25.predictions.yes,
            under25: predictionOU25.predictions.no || 0,
        };
    }

    // Extract BTTS if available
    let btts;
    if (predictionBTTS?.predictions.yes !== undefined) {
        btts = {
            yes: predictionBTTS.predictions.yes,
            no: predictionBTTS.predictions.no || 0,
        };
    }

    // Extract Correct Score if available
    let correctScore;
    if (predictionCS?.predictions.scores) {
        let maxProb = 0;
        let bestScore = "";

        Object.entries(predictionCS.predictions.scores).forEach(([score, prob]) => {
            if (prob > maxProb) {
                maxProb = prob;
                bestScore = score;
            }
        });

        if (bestScore) {
            correctScore = {
                score: bestScore,
                probability: maxProb,
            };
        }
    }

    return {
        fixtureId,
        teams: teamsString,
        homeWinProbability: homeWin,
        drawProbability: draw,
        awayWinProbability: awayWin,
        overUnder,
        btts,
        correctScore,
        predictable: true,
    };
}

/**
 * Fetches prediction by fixture ID
 */
async function fetchPredictionByFixtureId(fixtureId: number, teamsString: string): Promise<MatchPrediction | null> {
    const apiKey = process.env.SPORTS_MONK_API_KEY;

    if (!apiKey) return null;

    try {
        // Fetch predictions using the correct probabilities endpoint
        const predictionResponse = await fetch(
            `https://api.sportmonks.com/v3/football/predictions/probabilities/fixtures/${fixtureId}?api_token=${apiKey}`,
            {
                cache: 'no-store',
            }
        );

        if (!predictionResponse.ok) {
            console.error(`Prediction fetch failed for ID ${fixtureId}:`, predictionResponse.status);
            return {
                fixtureId,
                teams: teamsString,
                homeWinProbability: 0,
                drawProbability: 0,
                awayWinProbability: 0,
                predictable: false,
            };
        }

        const predictionData = await predictionResponse.json() as SportsMonksResponse<PredictionData>;

        // Check if predictions are available
        if (!predictionData.data || predictionData.data.length === 0) {
            console.log(`No predictions available for fixture: ${fixtureId} (not predictable)`);
            return {
                fixtureId,
                teams: teamsString,
                homeWinProbability: 0,
                drawProbability: 0,
                awayWinProbability: 0,
                predictable: false,
            };
        }

        // Extract predictions from the array
        return extractPredictionData(predictionData.data, teamsString, fixtureId);
    } catch (error) {
        console.error(`Failed to fetch prediction for fixture ${fixtureId}:`, error);
        return null;
    }
}

/**
 * Searches for a fixture and fetches predictions
 */
export async function getPredictionForMatch(teamsString: string): Promise<MatchPrediction | null> {
    const apiKey = process.env.SPORTS_MONK_API_KEY;

    if (!apiKey) {
        console.error("SPORTS_MONK_API_KEY not configured");
        return null;
    }

    try {
        const teams = parseTeamNames(teamsString);

        if (teams.length < 2) {
            console.error("Invalid team string:", teamsString);
            return null;
        }

        console.log(`Searching for fixture: ${teamsString}`);

        // Normalize team names before searching
        const normalizedTeam1 = normalizeTeamName(teams[0]);
        const normalizedTeam2 = normalizeTeamName(teams[1]);

        console.log(`Normalized team names: "${teams[0]}" -> "${normalizedTeam1}", "${teams[1]}" -> "${normalizedTeam2}"`);

        // Step 1: Search for both teams to get their IDs
        const team1Response = await fetch(
            `https://api.sportmonks.com/v3/football/teams/search/${encodeURIComponent(normalizedTeam1)}?api_token=${apiKey}`,
            { cache: 'no-store' }
        );

        const team2Response = await fetch(
            `https://api.sportmonks.com/v3/football/teams/search/${encodeURIComponent(normalizedTeam2)}?api_token=${apiKey}`,
            { cache: 'no-store' }
        );

        if (!team1Response.ok || !team2Response.ok) {
            console.log(`Team search failed - Team1 status: ${team1Response.status}, Team2 status: ${team2Response.status}`);
            return null;
        }

        const team1Data = await team1Response.json() as SportsMonksResponse<{ id: number; name: string }>;
        const team2Data = await team2Response.json() as SportsMonksResponse<{ id: number; name: string }>;

        console.log(`Team 1 search results:`, team1Data.data ? JSON.stringify(team1Data.data.slice(0, 2)) : 'No data');
        console.log(`Team 2 search results:`, team2Data.data ? JSON.stringify(team2Data.data.slice(0, 2)) : 'No data');

        if (!team1Data.data?.length) {
            const errorMsg = (team1Data as any).message || 'Unknown error';
            console.log(`No data found for team 1: ${teams[0]}. Error: ${errorMsg}`);
            return {
                fixtureId: 0,
                teams: teamsString,
                homeWinProbability: 0,
                drawProbability: 0,
                awayWinProbability: 0,
                predictable: false,
            };
        }

        if (!team2Data.data?.length) {
            const errorMsg = (team2Data as any).message || 'Unknown error';
            console.log(`No data found for team 2: ${teams[1]}. Error: ${errorMsg}`);
            return {
                fixtureId: 0,
                teams: teamsString,
                homeWinProbability: 0,
                drawProbability: 0,
                awayWinProbability: 0,
                predictable: false,
            };
        }

        const team1Id = team1Data.data[0].id;
        const team2Id = team2Data.data[0].id;

        console.log(`Found teams: ${team1Data.data[0].name} (ID: ${team1Id}) vs ${team2Data.data[0].name} (ID: ${team2Id})`);

        // Step 2: Get fixtures for team1 in the next 30 days
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 30);

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const fixturesResponse = await fetch(
            `https://api.sportmonks.com/v3/football/fixtures/between/${formatDate(today)}/${formatDate(futureDate)}/${team1Id}?api_token=${apiKey}&include=participants`,
            { cache: 'no-store' }
        );

        if (!fixturesResponse.ok) {
            console.log(`Could not get fixtures for team ${team1Id}`);
            return null;
        }

        const fixturesData = await fixturesResponse.json() as SportsMonksResponse<FixtureSearchResult>;

        if (!fixturesData.data?.length) {
            console.log(`No upcoming fixtures found for: ${teamsString}`);
            return null;
        }

        // Step 3: Find the fixture where both teams play
        const matchingFixture = fixturesData.data.find(fixture => {
            if (!fixture.participants || fixture.participants.length < 2) return false;

            const participantIds = fixture.participants.map(p => p.id);
            return participantIds.includes(team1Id) && participantIds.includes(team2Id);
        });

        if (!matchingFixture) {
            console.log(`No fixture found between ${teams[0]} and ${teams[1]}`);
            return null;
        }

        console.log(`Found fixture ID: ${matchingFixture.id} for ${teamsString}`);

        // Step 4: Get predictions for this fixture
        return await fetchPredictionByFixtureId(matchingFixture.id, teamsString);

    } catch (error) {
        console.error(`Failed to fetch predictions for "${teamsString}":`, error);
        return null;
    }
}

/**
 * Fetches predictions for multiple matches
 */
export async function getPredictionsForMatches(matches: string[]): Promise<(MatchPrediction | null)[]> {
    return Promise.all(matches.map(match => getPredictionForMatch(match)));
}
