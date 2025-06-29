import type { Match } from "../App";
import MatchTile from "./MatchTile";

interface MatchSectionProps {
    matches: Match[];
    headline: string;
}

const MatchSection = ({ matches, headline }: MatchSectionProps) => {
    
    if (matches.length === 0) {
        return (
            <section className="text-center">
            <h2 className="text-2xl font-bold">{headline}</h2>
            <p className="text-gray-500">Keine Spiele gefunden.</p>
            </section>
        );
    }
    
    return (
        <section className="max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-center">{headline}</h2>
            {matches.map((m, i) => (
                <MatchTile key={i} home={m.home} guest={m.guest} date={m.date} time={m.time} result={m.result} />
            ))}
        </section>
    );
};

export default MatchSection;