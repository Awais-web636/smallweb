# The Small Web

A browser-like web application for a small, fictional network of community-written `.zz` websites. The app keeps website content in MongoDB, provides per-person visit history and browser back/forward state, supports content search, and lets predefined publishers add sanitized HTML pages.

## Features

- Address bar and controlled navigation between `.zz` sites.
- Persistent back/forward navigation stack, including forward-branch truncation.
- Per-navigation-entry scroll position restoration.
- Predefined readers and publishers; no authentication or accounts.
- Chronological, per-person visit history and jump-to-page behavior.
- MongoDB-backed search across page titles and extracted page content.
- Publishing with address/content validation, sanitization, and duplicate protection.
- Sandboxed iframe display of published HTML.
- Idempotent seed data for 10 interconnected websites, 5 people, and reproducible visit trails.

## Technology and architecture

- **Frontend:** Next.js App Router, React, TypeScript, responsive CSS.
- **Backend:** Node.js, Express, TypeScript, Zod, Helmet, CORS.
- **Database:** MongoDB with Mongoose models and indexes.
- **Tests:** Jest, Supertest, React Testing Library.

The backend follows routes → validation middleware → controllers → services → Mongoose models. The browser navigation stack is separate from the chronological `Visit` collection. A per-person in-process queue serializes stack changes in the single Express process used by this project.

### Folder map

```text
backend/
  src/config/       environment and MongoDB connection
  src/controllers/  thin HTTP request handlers
  src/middleware/   validation, errors, 404
  src/models/       Person, Site, Visit, BrowserSession
  src/routes/       REST endpoints
  src/scripts/      deterministic seed command
  src/security/     published-HTML sanitizer
  src/services/     application and navigation logic
  src/utils/        address, stack and async helpers
frontend/
  app/              browser, search, history and publishing pages
  components/       browser, search and publishing UI
  hooks/            browser state integration
  services/         typed API clients
  lib/              shared fetch client
  types/            API/domain types
```

## Data model

- **Person:** predefined display name and reader/publisher/both type.
- **Site:** unique normalized address, title, sanitized HTML, extracted searchable text, author reference, timestamps. A text index covers title and searchable content.
- **Visit:** successful arrival records only; includes person, site, address, timestamp, navigation type, and per-person sequence. Back and forward do not create visits.
- **BrowserSession:** one current navigation path per person. Entries store address, their own `scrollY`, and visit reference; `currentIndex` controls back/forward.

Navigating to a new address replaces entries after `currentIndex`; an unknown address is rejected before the session is changed. The navigation module serializes operations by person within the API process. For multi-process deployment, replace this in-process queue with a MongoDB transaction/coordination strategy.

## API

All routes are prefixed with `/api`.

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| GET | `/people` | Predefined people |
| GET | `/sites` | Website directory |
| GET | `/sites/:address` | Read a website by address |
| POST | `/sites` | Publish a website |
| GET | `/search?q=water` | Search titles and page text |
| GET | `/history?personId=<id>` | Chronological history for a person |
| GET | `/navigation/:personId` | Current stack and back/forward capabilities |
| POST | `/navigation/navigate` | Open address and record a visit |
| POST | `/navigation/back` | Move to prior entry without recording a visit |
| POST | `/navigation/forward` | Move to next entry without recording a visit |
| POST | `/navigation/restore` | Persist current entry scroll position |

Example requests:

```json
POST /api/navigation/navigate
{ "personId": "65a000000000000000000001", "address": "tidepool.zz", "navigationType": "typed" }

POST /api/sites
{ "publisherId": "65a000000000000000000001", "address": "mygarden.zz", "title": "Garden Notes", "htmlContent": "<h1>Hello</h1><p>Seeds and soil.</p>" }

POST /api/navigation/restore
{ "personId": "65a000000000000000000001", "entryId": "65a000000000000000000099", "scrollY": 420 }
```

Navigation responses include `{ "site": ..., "navigation": { "entries": [...], "currentIndex": 0, "canGoBack": false, "canGoForward": false } }`. Errors have a stable shape: `{ "error": { "code": "SITE_NOT_FOUND", "message": "..." } }`.

## Requirements

- Node.js 20.9+ and npm.
- MongoDB 6+ locally or a MongoDB Atlas URI.

## Install and configure

From the repository root:

```powershell
npm install
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env.local
```

Set `MONGODB_URI`, `PORT`, `NODE_ENV`, and `FRONTEND_URL` in `backend/.env`. The sample URI points to a local MongoDB database named `small-web`. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if the API is not at `http://localhost:5000/api`.

## Run

Start MongoDB, then open two terminals in the repository root:

```powershell
npm run dev:backend
npm run dev:frontend
```

Seed/reseed the sample dataset (safe to repeat):

```powershell
npm run seed
```

The frontend is served at `http://localhost:3000`; the API listens on `http://localhost:5000` by default.

## Tests and builds

```powershell
npm test
npm run build
```

Individual commands are also available:

```powershell
npm run test --workspace backend
npm run test --workspace frontend
npm run build --workspace backend
npm run build --workspace frontend
```

Backend tests cover navigation-stack branching and boundaries, address normalization, HTML sanitization, request validation, health, and error responses. Frontend tests verify that published content is isolated in a sandboxed iframe. Database-backed integration behavior requires a running MongoDB instance.

## HTML security

Submitted HTML is limited to semantic text/layout tags and basic tables. Scripts, stylesheets, inline styles, event handlers, images, forms, frames, and other active elements are excluded. Only links pointing to `.zz` hosts may retain `href`; link clicks in the viewer are intercepted and routed through the app. A sandboxed iframe is used with `sandbox="allow-same-origin"` only—scripts, forms, popups, downloads, and top-level navigation are not enabled. The iframe has a restrictive CSP (`default-src 'none'`) and the application also sets a CSP, `X-Content-Type-Options`, and a strict referrer policy.

The viewer intentionally has no image hosting, script execution, embedded media, forms, or outbound web navigation. Authors can write static text-focused pages and link to other `.zz` sites.

## Known limitations

- The in-process per-person navigation queue is appropriate for a single API process; horizontally scaled deployments need distributed coordination.
- This assessment dataset is intentionally small. Search uses MongoDB text indexing and a literal, escaped regex path for partial matches; it is not intended for large-scale indexing.
- The frontend expects the API origin to be configured at build time for its CSP.
- A MongoDB server is required for seed and end-to-end persistence checks.
- The requested narrated recording must be captured by the submitter; a timed narration outline is in [RECORDING-SCRIPT.md](./RECORDING-SCRIPT.md).

## Submission and demonstration

Use the commands above to run the frontend, backend, and seed. The time-coded walkthrough in [RECORDING-SCRIPT.md](./RECORDING-SCRIPT.md) covers a four-level trail, back/forward, restoration, history, search, publishing, a missing address, data design, and the HTML security boundary.
