import { useState, useEffect } from 'react'
import './tailwind.css'

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
  const [matches, setMatches] = useState<Match[]>([]);
  const [pastMatches, setPastMatches] = useState<Match[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetch('/sampledata.csv')
      .then(res => res.text())
      .then(text => {
        const allMatches = parseCSV(text);
        setMatches(allMatches.filter(m => isWithinNext7Days(m.date)));
        setPastMatches(allMatches.filter(m => isPast(m.date)).reverse());
      });
  }, []);

  return (
    <div className="min-h-screen bg-green-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Heimspiele der nächsten 7 Tage</h1>
      <div className="max-w-2xl mx-auto mb-4">
        <button
          className="w-full bg-green-300 hover:bg-green-400 text-green-900 font-semibold py-2 px-4 rounded transition"
          onClick={() => setShowPast(v => !v)}
        >
          {showPast ? 'Anstehende Heimspiele anzeigen' : 'Vergangene Heimspiele anzeigen'}
        </button>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        {!showPast ? (
          matches.length === 0 ? (
            <div className="text-center text-gray-500">Keine Heimspiele in den nächsten 7 Tagen.</div>
          ) : (
            matches.map((m, i) => (
              <div key={i} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg">{m.home} <span className="text-gray-400">vs.</span> {m.guest}</div>
                  <div className="text-gray-600">{m.date} um {m.time} Uhr</div>
                </div>
              </div>
            ))
          )
        ) : (
          pastMatches.length === 0 ? (
            <div className="text-center text-gray-500">Keine vergangenen Heimspiele.</div>
          ) : (
            pastMatches.map((m, i) => (
              <div key={i} className="bg-gray-100 rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between opacity-80">
                <div>
                  <div className="font-semibold text-lg">{m.home} <span className="text-gray-400">vs.</span> {m.guest}</div>
                  <div className="text-gray-600">{m.date} um {m.time} Uhr</div>
                </div>
                {m.result && m.result.trim() !== '' && (
                  <div className="mt-2 md:mt-0 md:ml-4 text-green-700 font-bold">Ergebnis: {m.result}</div>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  )
}

export default App
