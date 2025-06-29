import { useState, useEffect } from 'react'
import './tailwind.css'
import MatchTile from './components/MatchTile';

interface Match {
  date: string;
  time: string;
  home: string;
  guest: string;
  result?: string; // Ergebnis optional
}

function parseCSV(csv: string): Match[] {
  const lines = csv.trim().split('\n');
  const header = lines[0].split(';');
  const resultIdx = header.findIndex(h => h.toLowerCase().includes('match'));
  return lines.slice(1).map(line => {
    const parts = line.split(';');
    const [date, time, home, guest] = parts;
    const result = resultIdx >= 0 ? parts[resultIdx] : undefined;
    return { date, time, home, guest, result };
  });
}

function isWithinNext7Days(dateStr: string): boolean {
  const [day, month, year] = dateStr.split('.').map(Number);
  const matchDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0,0,0,0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 6);
  return matchDate >= today && matchDate <= in7Days;
}

function isPast(dateStr: string): boolean {
  const [day, month, year] = dateStr.split('.').map(Number);
  const matchDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0,0,0,0);
  return matchDate < today;
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
      <div className="max-w-2xl mx-auto space-y-4 mb-10">
        {!showPast ? (
          upcomingMatches.length === 0 ? (
            <div className="text-center text-gray-500">Keine Heimspiele in den nächsten 7 Tagen.</div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center">Demnächst</h2>
              {upcomingMatches.map((m, i) => <MatchTile key={i} home={m.home} guest={m.guest} date={m.date} time={m.time} />)}
              <h2 className="text-2xl font-bold text-center">In der Zukunft</h2>
              {futureMatches.map((m, i) => <MatchTile key={i} home={m.home} guest={m.guest} date={m.date} time={m.time} />)}
            </>
          )
        ) : (
          pastMatches.length === 0 ? (
            <div className="text-center text-gray-500">Keine vergangenen Heimspiele.</div>
          ) : (
            <>
            <h2 className="text-2xl font-bold text-center">Vergangene Heimspiele</h2>
            {
            pastMatches.map((m, i) => (
              <MatchTile key={i} home={m.home} guest={m.guest} date={m.date} time={m.time} result={m.result} />
            ))}
            </>
          )
        )}
      </div>
      <footer className="bg-white rounded-lg shadow-lg m-4 opacity-95 fixed bottom-0 left-0">
        <div className="w-full mx-auto max-w-screen-xl p-4">
          <span className="text-xs text-gray-500 text-center">© 2025 <a href="https://tc-halberg-brebach.de" className="hover:underline">TC Halberg Brebach</a>. Alle Angaben ohne Gewähr.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
