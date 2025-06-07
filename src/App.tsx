import { useState, useEffect } from 'react'
import './tailwind.css'

interface Match {
  date: string;
  time: string;
  home: string;
  guest: string;
}

function parseCSV(csv: string): Match[] {
  const lines = csv.trim().split('\n').slice(1); // skip header
  return lines.map(line => {
    const [date, time, home, guest] = line.split(';');
    return { date, time, home, guest };
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

function App() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetch('/sampledata.csv')
      .then(res => res.text())
      .then(text => {
        const allMatches = parseCSV(text);
        setMatches(allMatches.filter(m => isWithinNext7Days(m.date)));
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Heimspiele der nächsten 7 Tage</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {matches.length === 0 ? (
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
        )}
      </div>
    </div>
  )
}

export default App
