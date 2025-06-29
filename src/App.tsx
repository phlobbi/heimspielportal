import { useState, useEffect } from 'react'
import './tailwind.css'
import MatchSection from './components/MatchSection';
import { isPast, isWithinNext7Days, parseCSV } from './utils';

export interface Match {
  date: string;
  time: string;
  home: string;
  guest: string;
  result?: string; // Ergebnis optional
}

function App() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [futureMatches, setFutureMatches] = useState<Match[]>([]);
  const [pastMatches, setPastMatches] = useState<Match[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetch('/daten.csv')
      .then(res => res.text())
      .then(text => {
        const allMatches = parseCSV(text);
        setUpcomingMatches(allMatches.filter(m => isWithinNext7Days(m.date)));
        setFutureMatches(allMatches.filter(m => !isWithinNext7Days(m.date) && !isPast(m.date)));
        setPastMatches(allMatches.filter(m => isPast(m.date)).reverse());
      });
  }, []);

  return (
    <div className="min-h-screen bg-green-100 py-8 relative">
      <img src="/assets/tchb.svg" alt="TC Halberg Brebach Logo" className="w-32 h-20 mx-auto mb-2" />
      <h1 className="text-3xl font-bold text-center mb-2">Heimspielportal</h1>
      <div className="max-w-2xl mx-auto mb-4">
        <button
          className="w-full bg-green-300 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded transition cursor-pointer"
          onClick={() => setShowPast(v => !v)}
        >
          {showPast ? 'Anstehende Heimspiele anzeigen' : 'Vergangene Heimspiele anzeigen'}
        </button>
      </div>
      {showPast ? <MatchSection matches={pastMatches} headline="Vergangene Heimspiele" /> : (
        <>
          <MatchSection matches={upcomingMatches} headline="In den nächsten 7 Tagen" />
          <MatchSection matches={futureMatches} headline="In der Zukunft" />
        </>
      )}
      <footer className="bg-white rounded-lg shadow-lg m-4 opacity-95 fixed bottom-0 left-0">
        <div className="w-full mx-auto max-w-screen-xl p-4">
          <span className="text-xs text-gray-500 text-center">© 2025 <a href="https://tc-halberg-brebach.de" className="hover:underline">TC Halberg Brebach</a>. Alle Angaben ohne Gewähr.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
