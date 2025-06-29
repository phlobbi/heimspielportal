interface MatchTileProps {
    home: string;
    guest: string;
    date: string;
    time: string;
    result?: string;
}

const MatchTile = ({ home, guest, date, time, result }: MatchTileProps) => {
    return (
        <div className={"bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"}>
            <div>
                <div className="font-semibold text-lg">{home} <span className="text-gray-400">vs.</span> {guest}</div>
                <div className="text-gray-600">{date} um {time} Uhr</div>
            </div>
            {result && result.trim() !== '' && (
                <div className="mt-2 md:mt-0 md:ml-4 text-green-700 font-bold">Ergebnis: {result}</div>
            )}
        </div>
    )
}

export default MatchTile;