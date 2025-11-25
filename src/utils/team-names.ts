import { TEAM_NAME_MAPPING } from "@/constants/teams";

/**
 * Normalizes team names by applying custom mappings and removing common suffixes/prefixes
 */
export function normalizeTeamName(name: string): string {
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
 * Parses team names from a match string (e.g., "Arsenal vs Chelsea")
 * and returns an array of team names
 */
export function parseTeamNames(teamsString: string): string[] {
    // Common separators: vs, v, -, @
    const separators = /\s+(?:vs\.?|v\.?|-|@)\s+/i;
    const teams = teamsString.split(separators);

    return teams.map(team => team.trim()).filter(Boolean);
}
