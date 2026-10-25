# Ganemulla Local Tourist Day-Visit Planner

A full-stack web application that helps a visitor discover attractions around **Ganemulla, Sri Lanka** and assemble a realistic one-day plan.

**ITE2953 – Programming Group Project**
Bachelor of Information Technology (External Degree) · Faculty of Information Technology · University of Moratuwa

---

## Overview

Regional tourism in Sri Lanka is concentrated on a small number of national destinations, while attractions close to a town such as Ganemulla remain difficult to discover and poorly supported by existing mapping and travel platforms. This project presents a curated catalogue of **ten attractions within a 25 km radius** of Ganemulla town centre and lets a visitor turn that catalogue into an ordered day plan.

The visitor side requires no account. The administrator side is protected by a JWT login and provides full create, read, update and delete control over the catalogue.

**What it does**

- Lists places with distance, category, opening hours and a photograph
- Filters by category and searches across name, category and description
- Shows each place on an OpenStreetMap map
- Builds a persistent day plan with add, reorder, remove and clear
- Lets an administrator manage the catalogue through a protected dashboard

---

## Features

### Visitor (no login)

| Feature | Detail |
|---|---|
| Catalogue | Ten seed places; card shows photo, category, distance, name, description and hours |
| Filter and search | Six categories plus free-text search; filtering is client-side and instant |
| Distance | Haversine distance from Ganemulla town centre (`7.0736, 79.9989`), computed on the server |
| Details | Modal with a Leaflet map, opening hours, travel tips and an external map link |
| Day plan | Add, remove, reorder and clear stops; persisted in `localStorage`; combined distance summary |
| Empty and error states | Explicit messages for no results, failed requests and missing coordinates |
| Accessibility | Cards and dialogs are keyboard reachable and labelled for screen readers |
| Disclaimer | Prominent notice below the hero and inside the details dialog (NFR-004) |

### Administrator

| Feature | Detail |
|---|---|
| Login | Username and password exchanged for a two-hour JSON Web Token |
| Password storage | bcrypt hash with a per-password salt; plaintext is never stored or returned |
| Directory | Table with photo thumbnail, category, distance, opening hours and row actions |
| Create / edit | One form for both; server-side validation and a live photo preview |
| Delete | Confirmation step before any request is sent |
| Validation | Field whitelist, type checks, coordinate ranges and photo URL scheme |
| Distance warning | Places beyond 25 km are accepted with a warning (BR-001) |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (`mongodb` driver) |
| Authentication | `jsonwebtoken`, `bcryptjs` |
| Maps | Leaflet 1.9 + OpenStreetMap tiles |
| Testing | Vitest 4, Testing Library, Supertest, `@vitest/coverage-v8` |

Plain JavaScript throughout — no TypeScript, no UI framework, no ORM.

---

## Architecture

```mermaid
flowchart LR
  subgraph Browser
    UI[React 19 SPA]
  end
  subgraph Server["Node.js process"]
    API[Express 5 JSON API]
  end
  DB[(MongoDB Atlas)]
  OSM[OpenStreetMap tiles]
  IMG[External image host]

  UI -->|JSON over HTTP /api| API
  API -->|official driver| DB
  UI -->|map tiles| OSM
  UI -->|place photographs| IMG
```

The application is a three-tier system. In development, Vite serves the client on port 5173 and proxies `/api` to Express on port 3000. In production, `npm run build` writes the bundle to `public/` and Express serves both the static files and the API on a single port, so no CORS configuration is required.

**Two pages, one bundle.** `client/src/App.jsx` renders `AdminPage` when the path starts with `/admin`, otherwise `HomePage`. Express maps `GET /admin` to the same `index.html`.

---

## Getting started

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (required by Vite 8)
- A free **MongoDB Atlas** cluster
- Internet access for OpenStreetMap tiles and place photographs

### 1. Create the database

1. Sign up at <https://www.mongodb.com/cloud/atlas/register> and create a **free M0** cluster.
2. **Database Access → Add New Database User** and note the username and password.
3. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`).
4. **Clusters → Connect → Drivers** and copy the connection string.

### 2. Configure the environment

Copy the template and fill in your connection string:

```bash
cp .env.example .env
```

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=touristPlanner
JWT_SECRET=change-this-to-any-long-random-text
ADMIN_USER=admin
ADMIN_PASS=admin123
```

> URL-encode special characters in the password (`@` → `%40`), or use letters and digits only.
> Set a strong `ADMIN_PASS` **before the first run**. The admin is created once; to change it later, delete the `admins` document in Atlas and restart.

### 3. Install and run

```bash
npm install
npm run dev
```

`npm run dev` starts the Express API on **port 3000** and the Vite dev server on **port 5173**. Open <http://localhost:5173>.

On first start the server connects to Atlas, inserts the ten seed places if the collection is empty, and creates the administrator account.

**Admin page:** <http://localhost:5173/admin>

### 4. Production build

```bash
npm run build   # React + Tailwind -> public/
npm start       # http://localhost:3000 — Express serves the app and the API
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Express (3000) and Vite with hot reload (5173) |
| `npm run build` | Build the React app into `public/` |
| `npm start` | Serve the built app and API on port 3000 |
| `npm test` | Offline unit suite (no database needed) |
| `npm run test:watch` | Unit suite in watch mode |
| `npm run test:coverage` | Unit suite with a coverage report |
| `npm run test:integration` | HTTP integration suite against Atlas |
| `npm run test:regression` | End-to-end user journeys against Atlas |
| `npm run test:all` | All three suites in sequence |

---

## Data model

Database: `touristPlanner` (configurable with `DB_NAME`).

**`places`**

```js
{
  _id,            // ObjectId
  name,           // string, required, trimmed, max 2,000 characters
  category,       // one of: Nature, Religious, Dining, Heritage, Recreation, Eco-Tourism
  description,    // string, required, trimmed, max 2,000 characters
  imageUrl,       // string, optional — absolute http(s) URL or a root-relative path
  lat, lng,       // number, required, lat −90…90, lng −180…180
  distanceKm,     // number, computed by the server on create/update/seed, one decimal
  openingHours,   // string, optional, empty string when absent
  travelTips,     // string, optional, empty string when absent
  createdAt       // Date, set on insert only
}
```

`distanceKm` is never accepted from the client: it is always recomputed from the fixed Ganemulla origin with the Haversine formula, so a stored distance cannot be corrupted.

**`admins`**

```js
{ _id, username, passwordHash }   // bcrypt, 10 rounds; never returned to the client
```

### Place photographs

Each place carries its own `imageUrl`, set by the administrator in the create/edit form. The card renders that URL directly, so photographs are catalogue data rather than bundled build assets. When the field is empty, or the image fails to load, the card shows its category gradient and topographic pattern instead of borrowing another location's photo.

The ten seed places point at Wikimedia Commons files. Because images are fetched from an external host, availability and transfer time are outside the application's control.

---

## API

All routes are JSON. Admin routes require `Authorization: Bearer <token>` and answer `401` without it.

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | — | Liveness check |
| `GET` | `/api/places` | — | All places; add `?category=Dining` to filter |
| `GET` | `/api/places/:id` | — | One place |
| `POST` | `/api/login` | — | Exchange credentials for `{ token }` (valid 2 hours) |
| `POST` | `/api/places` | Bearer | Create a place |
| `PUT` | `/api/places/:id` | Bearer | Update the editable fields |
| `DELETE` | `/api/places/:id` | Bearer | Delete a place |

Status codes: `200` read/update, `201` create, `400` validation, `401` authentication, `404` unknown id or route, `500` unexpected server error.

**Example**

```http
POST /api/places
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Example Garden",
  "category": "Nature",
  "description": "A small garden used to illustrate the contract.",
  "imageUrl": "https://example.com/example-garden.jpg",
  "lat": 7.08,
  "lng": 80.01,
  "openingHours": "8:00 AM - 5:00 PM",
  "travelTips": "Visit before noon."
}
```

`201 Created` returns the stored place with its computed `distanceKm` and a `warning` string that is non-empty when the place lies beyond the 25 km limit.

---

## Project structure

```text
.
├── client/                       # React frontend
│   ├── index.html                # single page: fonts, Leaflet CDN, #root
│   ├── public/images/            # hero artwork (source assets)
│   └── src/
│       ├── main.jsx              # mounts <App />
│       ├── App.jsx               # chooses the page from the URL
│       ├── pages/
│       │   ├── HomePage.jsx      # search, filter, grid, details, plan drawer
│       │   └── AdminPage.jsx     # login state, dashboard, save/delete
│       ├── components/
│       │   ├── Header.jsx, CategoryFilter.jsx, PlaceCard.jsx,
│       │   │   PlaceDetails.jsx, MapView.jsx, PlanDrawer.jsx,
│       │   │   PlaceImage.jsx, TopoPattern.jsx, Icons.jsx
│       │   └── admin/
│       │       ├── LoginForm.jsx
│       │       ├── PlaceForm.jsx     # one form for add + edit
│       │       └── PlaceTable.jsx    # directory with photo thumbnails
│       ├── hooks/                # usePlaces (catalogue), useDayPlan (persisted plan)
│       ├── services/             # api.js fetch wrapper, auth.js token storage
│       ├── lib/                  # categories, display helpers, image resolver
│       └── index.css             # Tailwind and shared component classes
├── server/                       # Express backend
│   ├── index.js                  # entry: .env, connect, seed, listen
│   ├── app.js                    # JSON, static files, routes, error handler
│   ├── config/db.js              # one MongoDB client + getDb()
│   ├── routes/                   # placeRoutes.js, authRoutes.js
│   ├── controllers/              # placeController.js, authController.js
│   ├── models/place.js           # category whitelist + buildPlace() validation
│   ├── middleware/               # requireAuth/signToken, asyncHandler
│   ├── utils/distance.js         # Ganemulla origin + Haversine
│   ├── data/seedPlaces.js        # the ten starter places
│   ├── seed/seedDatabase.js      # inserts places and admin once
│   └── scripts/                  # one-off imageUrl backfill for older databases
├── test/
│   ├── integration/              # Supertest suite against a real Atlas test database
│   ├── regression/               # end-to-end user journeys
│   └── setup.js                  # shared test setup
├── public/                       # generated by `npm run build` (git-ignored)
├── software_requirements_specification.md
├── vite.config.js                # root: client, outDir: public, /api proxy
├── vitest*.config.js             # unit, integration and regression configurations
└── tailwind.config.js / postcss.config.js
```

---

## Testing

The project uses three complementary suites.

| Suite | Command | Scope | Needs Atlas |
|---|---|---|---|
| Unit | `npm test` | Validation, auth, distance maths, hooks, API wrapper, seeding | No |
| Integration | `npm run test:integration` | Real Express app driven with Supertest | Yes |
| Regression | `npm run test:regression` | Six end-to-end user journeys | Yes |

**Current result:** 166 tests passing — **134 unit** across 14 files, **26 integration** and **6 regression** journeys.

Unit coverage of the in-scope logic:

| Metric | Coverage |
|---|---|
| Statements | 97.82% (180 / 184) |
| Branches | 97.32% (109 / 112) |
| Functions | 98.03% (50 / 51) |
| Lines | 97.36% (148 / 152) |

The integration and regression suites read `MONGODB_URI` from `.env` and connect to a separate database, `touristPlannerTest` (override with `TEST_DB_NAME`), so they never touch the real catalogue. The unit suite runs fully offline because every external dependency is mocked.

---

## Documentation

- [`software_requirements_specification.md`](software_requirements_specification.md) — functional and non-functional requirements, business rules, data model and seed data.

---

## Deployment (optional)

1. Push the repository to GitHub. `.env` and `public/` are ignored.
2. Create a web service on a Node host such as Render.
3. Build command: `npm install && npm run build` · Start command: `npm start`.
4. Add `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `ADMIN_USER` and `ADMIN_PASS` as environment variables.
5. The platform supplies HTTPS, which satisfies NFR-007.

Map tiles are subject to the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/); the attribution `© OpenStreetMap contributors` is shown on every map.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `MONGODB_URI is missing` | Create `.env` from `.env.example` and paste your Atlas link |
| `Could not connect to any servers` | Atlas → Network Access → allow your IP (or `0.0.0.0/0`) |
| `bad auth : authentication failed` | Wrong credentials, or special characters not URL-encoded |
| Page loads but looks unstyled | Run `npm run build` before `npm start`, or use `npm run dev` |
| Admin says "Please log in again" | Token expired (2 h) or `JWT_SECRET` changed — log in again |
| Map is blank or grey | No access to `tile.openstreetmap.org`, or the place has no coordinates |
| A photo does not appear | The URL is unreachable; the card falls back to the placeholder band |

---

## Notes and limitations

- There are no tourist accounts: a day plan lives in one browser's `localStorage`.
- The plan sums each stop's distance from Ganemulla; it does not compute leg-to-leg travel time.
- Login has no rate limiting or account lockout.
- Photographs depend on an external host and are not uploaded, resized or cached by the application.
- The catalogue is intentionally limited to ten curated places.

---

## Author

**Bandara BWDC** — E2410352
ITE2953 Programming Group Project, University of Moratuwa.
