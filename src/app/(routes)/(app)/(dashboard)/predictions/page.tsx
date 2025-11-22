import { DateNavigator } from "@/components/predictions/date-navigator";
import { MatchTable } from "@/components/predictions/match-table";
import { getDailyOdds, getFixtures, getPrediction, Prediction, TOP_LEAGUES } from "@/lib/api-football";

interface PredictionsPageProps {
    searchParams: Promise<{
        date?: string;
    }>;
}

const PredictionsPage = async ({ searchParams }: PredictionsPageProps) => {
    const { date } = await searchParams;
    const queryDate = date || new Date().toISOString().split('T')[0];

    const upcoming = await getFixtures("scheduled", TOP_LEAGUES, queryDate);
    const finished = await getFixtures("finished", TOP_LEAGUES);

    // Fetch odds for the specific date (all leagues)
    const allOdds = await getDailyOdds(queryDate);

    // Filter odds to only include our fixtures
    const fixtureIds = new Set(upcoming.map(f => f.fixture.id));
    const filteredOdds = allOdds.filter(odd => fixtureIds.has(odd.fixture.id));


    // Fetch predictions for upcoming fixtures
    // Note: This might be heavy if there are many matches, but we are filtering by TOP_LEAGUES
    const predictionPromises = upcoming.map(fixture => getPrediction(fixture.fixture.id));
    const predictionResults = await Promise.all(predictionPromises);

    // Create a map of fixtureId -> Prediction
    const predictionsMap = predictionResults.reduce((acc, pred, index) => {
        if (pred) {
            acc[upcoming[index].fixture.id] = pred;
        }
        return acc;
    }, {} as Record<number, Prediction>);


    const stats = {
        predicted: upcoming.length + finished.length,
        upcoming: upcoming.length,
        won: finished.filter(f => f.goals.home !== null).length
    };

    return (
        <main className="flex min-h-screen bg-black text-white">
            <div className="flex-1 p-6 md:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <DateNavigator />
                    </div>
                    <MatchTable fixtures={upcoming} odds={filteredOdds} predictions={predictionsMap} />
                </div>
            </div>
        </main>
    );
};

export default PredictionsPage;