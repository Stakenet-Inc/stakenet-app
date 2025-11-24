"use server";

interface TeamSearchResult {
    id: number;
    name: string;
    image_path: string;
}

interface SportsMonksResponse<T> {
    data: T[];
}

/**
 * Parses team names from a match string (e.g., "Arsenal vs Chelsea")
 * and returns an array of team names
 */
function parseTeamNames(teamsString: string): string[] {
    // Common separators: vs, v, -, @
    const separators = /\s+(?:vs\.?|v\.?|-|@)\s+/i;
    const teams = teamsString.split(separators);

    return teams.map(team => team.trim()).filter(Boolean);
}

const TEAM_NAME_MAPPING: Record<string, string> = {
    // Abbreviations to Full Names
    "Man Utd": "Manchester United",
    "Man City": "Manchester City",
    "Sheff Utd": "Sheffield United",
    "Nottm Forest": "Nottingham Forest",
    "Wolves": "Wolverhampton Wanderers",
    "Spurs": "Tottenham Hotspur",
    "QPR": "Queens Park Rangers",
    "Preston": "Preston North End",
    "Blackburn": "Blackburn Rovers",
    "West Brom": "West Bromwich Albion",
    "Brighton": "Brighton & Hove Albion",
    "Wigan": "Wigan Athletic",
    "Bolton": "Bolton Wanderers",
    "Wycombe": "Wycombe Wanderers",
    "MK Dons": "Milton Keynes Dons",
    "Doncaster": "Doncaster Rovers",
    "Rotherham": "Rotherham United",
    "Peterborough": "Peterborough United",
    "Oxford": "Oxford United",
    "Cambridge": "Cambridge United",
    "Colchester": "Colchester United",
    "Sutton": "Sutton United",
    "Carlisle": "Carlisle United",
    "Torquay": "Torquay United",
    "Hartlepool": "Hartlepool United",
    "Scunthorpe": "Scunthorpe United",
    "Southend": "Southend United",
    "Maidstone": "Maidstone United",
    "Ebbsfleet": "Ebbsfleet United",
    "Dag & Red": "Dagenham & Redbridge",
    "Crewe": "Crewe Alexandra",
    "Plymouth": "Plymouth Argyle",
    "Accrington": "Accrington Stanley",
    "Forest Green": "Forest Green Rovers",
    "Harrogate": "Harrogate Town",
    "Crawley": "Crawley Town",
    "Swindon": "Swindon Town",
    "Northampton": "Northampton Town",
    "Cheltenham": "Cheltenham Town",
    "Shrewsbury": "Shrewsbury Town",
    "Fleetwood": "Fleetwood Town",
    "Grimsby": "Grimsby Town",
    "Luton": "Luton Town",
    "Ipswich": "Ipswich Town",
    "Huddersfield": "Huddersfield Town",
    "Mansfield": "Mansfield Town",
    "Yeovil": "Yeovil Town",
    "Halifax": "FC Halifax Town",
    "Grimsby Town": "Grimsby Town",

    // Short names to Full Names (Common in UK)
    "Leeds": "Leeds United",
    "Leicester": "Leicester City",
    "Norwich": "Norwich City",
    "Newcastle": "Newcastle United",
    "West Ham": "West Ham United",
    "Cardiff": "Cardiff City",
    "Swansea": "Swansea City",
    "Stoke": "Stoke City",
    "Hull": "Hull City",
    "Derby": "Derby County",
    "Coventry": "Coventry City",
    "Inter": "Inter Milan",
    "AC Milan": "Milan",
    "Bayern": "Bayern Munich",
    "Dortmund": "Borussia Dortmund",
    "Gladbach": "Borussia Monchengladbach",
    "Leverkusen": "Bayer Leverkusen",
    "Frankfurt": "Eintracht Frankfurt",
    "Schalke": "Schalke 04",
    "Hertha": "Hertha Berlin",
    "Mainz": "Mainz 05",
    "Koln": "FC Koln",
    "Augsburg": "FC Augsburg",
    "Stuttgart": "VfB Stuttgart",
    "Wolfsburg": "VfL Wolfsburg",
    "Bochum": "VfL Bochum",
    "Hoffenheim": "TSG Hoffenheim",
    "Werder": "Werder Bremen",
    "Hamburg": "Hamburger SV",
    "Elche CF": "Elche",
    "Caykur Rizespor": "Rizespor",
    "Fenerbahce Istanbul": "Fenerbahce",
    "Fenerbahçe": "Fenerbahce",
    "Hannover": "Hannover 96",
    "Nurnberg": "FC Nurnberg",
    "Dusseldorf": "Fortuna Dusseldorf",
    "St Pauli": "FC St. Pauli",
    "Karlsruhe": "Karlsruher SC",
    "Kaiserslautern": "FC Kaiserslautern",
    "Rostock": "Hansa Rostock",
    "Magdeburg": "Magdeburg",
    "Braunschweig": "Eintracht Braunschweig",
    "Osnabruck": "VfL Osnabruck",
    "Wiesbaden": "Wehen Wiesbaden",
    "Elversberg": "SV Elversberg",
    "Paderborn": "Paderborn",
    "Greuther Furth": "SpVgg Greuther Furth",
    "Kiel": "Holstein Kiel",

    "PSG": "Paris Saint-Germain",
    "Marseille": "Olympique Marseille",
    "Lyon": "Olympique Lyonnais",
    "Monaco": "AS Monaco",
    "Lille": "LOSC Lille",
    "Nice": "OGC Nice",
    "Rennes": "Stade Rennais",
    "Lens": "RC Lens",
    "Nantes": "FC Nantes",
    "Reims": "Stade de Reims",
    "Strasbourg": "RC Strasbourg",
    "Toulouse": "Toulouse FC",
    "Montpellier": "Montpellier HSC",
    "Lorient": "FC Lorient",
    "Metz": "FC Metz",
    "Le Havre": "Le Havre AC",
    "Clermont": "Clermont Foot",
    "Brest": "Stade Brestois 29",

    "Barca": "Barcelona",
    "Real": "Real Madrid",
    "Athletic Club": "Athletic Bilbao",
    "Sociedad": "Real Sociedad",
    "Betis": "Real Betis",
    "Celta": "Celta Vigo",
    "Osasuna": "CA Osasuna",
    "Girona": "Girona",
    "Rayo": "Rayo Vallecano",
    "Mallorca": "RCD Mallorca",
    "Alaves": "Deportivo Alaves",
    "Las Palmas": "UD Las Palmas",
    "Granada": "Granada CF",
    "Cadiz": "Cadiz CF",
    "Almeria": "UD Almeria",

    "Juve": "Juventus",
    "Roma": "AS Roma",
    "Napoli": "Napoli",
    "US Lecce": "Lecce",
    "Salernitana": "Salernitana",

    "Ajax": "Ajax",
    "Feyenoord": "Feyenoord Rotterdam",
    "PSV": "PSV Eindhoven",
    "AZ": "AZ Alkmaar",

    "Benfica": "Benfica",
    "Porto": "Porto",
    "Sporting": "Sporting",
    "Braga": "Braga",
};

function normalizeTeamName(name: string): string {
    // Check direct mapping first
    if (TEAM_NAME_MAPPING[name]) {
        return TEAM_NAME_MAPPING[name];
    }

    // Remove year suffix (e.g. "Como 1907" -> "Como")
    let normalized = name.replace(/\s+\d{4}$/, "").trim();

    // Remove "SC" prefix if present (e.g. "SC Pisa" -> "Pisa")
    normalized = normalized.replace(/^SC\s+/, "").trim();

    // Remove "FC" suffix if present
    normalized = normalized.replace(/\s+FC$/, "").trim();

    return normalized;
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
        console.log(`Searching for team: "${teamName}" (normalized: "${normalizedName}")`);

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
