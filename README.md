# heimspielportal

A frontend for showing upcoming and recent tennis matches at a local tennis club, written in React.

## Motivation
Previously in our local tennis club, match schedules were shared as static PDFs that quickly became outdated and were only available in print. This made it difficult for members and visitors to stay informed about upcoming games, especially when matches were postponed or cancelled. By providing a dynamic, online portal, we aim to keep everyone up to date, attract more spectators on matchdays, and potentially gain new club members.

_Just imagine what a bad look it would be, if spectators were to come for a match that had been cancelled..._

My goal is that this project can be used as a starting point to also improve user experience in other clubs.

## Features

As of now, heimspielportal has the following features:

- Overview over all upcoming and historic home matches of a tennis club
- Automatic retrieval of data from a CSV-file (`daten.csv`)
- Filtering for distinct time frames:
  - Matches in the next 7 days
  - Future matches (beyond 7 days)
  - Historic matches
- Toggle between historic and upcoming matches
- Responsive, mobile first UI, built with Tailwind CSS
- Can be adapted for other clubs
- No backend required: Just build and publish!

## Get started
If you want to make this project your own, you can just pull it and run the development server using [Vite](https://vite.dev).

```bash
npm install
npm run dev 
```

For deployment, a static web server is sufficient. Just run `npm run build` and copy the `dist` folder to your preferred hosting solution.

> [!NOTE]
> This implementation is specific to our own club.
> I highly encourage you to make it your own by forking it or proposing changes that make customization easier for everyone.

## How do I fill it with data?
How you get your data to the application is entirely up to you.
For our purposes, we have a tool that automatically retrieves data from a webservice and saves it locally as a CSV file.
The CSV file is named `daten.csv` and saves the data in the following format:

```csv
Datum;Zeit;Heimteam;Gastteam;Ort;Matches;Sätze
01.01.1970;09:41;Hometeam One;Guestteam One;Homeclub;21:0;20:0
```

Again, feel free to modify this behaviour as a fork.