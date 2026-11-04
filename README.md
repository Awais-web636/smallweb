# The Small Web

The Small Web is a browser-like web application for exploring a collection of fictional community websites. Visitors can open `.zz` pages, follow links between them, search their content, and keep an individual browsing history. Publishers can add new pages, which are cleaned before being stored and displayed.

## How it works

Choose a reader and enter a website address to open a page. Links between `.zz` websites are handled inside the app. Each reader has a separate navigation path and visit history; Back and Forward move through that path, and returning to a page restores its saved scroll position.

Search looks through page titles and written content. A publisher can submit a title, address, and HTML page. The app removes scripts and other active content before saving the page, then makes its text available to browse and search.

The frontend is built with Next.js, React, and TypeScript. An Express API validates requests and manages pages, navigation, search, and history. MongoDB stores the application data.

## Run locally

Requirements: Node.js 20.9 or newer, npm, and MongoDB.

Install dependencies from each project directory:

```powershell
Set-Location backend
npm install
Copy-Item .env.example .env

Set-Location ..\frontend
npm install
Copy-Item .env.example .env.local
```

Configure the MongoDB connection in `backend/.env` if needed. Start MongoDB, then run the backend and frontend in separate terminals:

```powershell
Set-Location backend
npm run dev
```

```powershell
Set-Location frontend
npm run dev
```

To load the sample websites and readers, run `npm run seed` from `backend`. The app opens at `http://localhost:3000`.

## Check the project

Run `npm test` and `npm run build` from `backend`. From `frontend`, run `npm test`, `npm run lint`, and `npm run build`.
