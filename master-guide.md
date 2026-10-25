# Master Guide — Ganemulla Local Tourist Day-Visit Planner

### From zero to a completed MERN app, one working product at a time

> **How this guide works**
> The project is built in **10 iterations**. At the end of *every* iteration you have a **working end product** — something that runs, does something useful, and can be demoed to a supervisor. No iteration leaves you with broken or half-built code.
>
> Every iteration follows the same rhythm:
> - 🎯 **The working product** — what will be running at the end
> - 🧠 **New concepts** — the theory, explained in plain English
> - 🛠️ **Build steps** — exactly what to create (file names match this repo)
> - ✅ **Definition of Done** — how you know the iteration is truly finished
> - 🎤 **What you can demo now** — the 30-second demo for your supervisor
>
> 💡 This guide is also a **map of the repo**: every file mentioned below is a real file in this project. When you get stuck, open the corresponding file — it is a working reference implementation of that step.

---

## 0. The Big Picture (read this first)

### 0.1 What you are building

A web app for tourists near **Ganemulla, Sri Lanka**:

| Who | What they do |
|---|---|
| **Tourist** (no login) | Browses attractions within 25 km, filters by category, sees details + a map, and builds a one-day visit plan |
| **Admin** (logs in) | Adds, edits, and deletes the places the tourists see |

Two pages, one app:

- `/` → Tourist page (browse, filter, details, map, planner)
- `/admin` → Admin page (login, manage places)

---

### 0.2 What is NOT in scope (and never will be)

Per the SRS: no payments, no bookings, no hotel/transport reservations, no multi-day trips. If a feature idea isn't on the scope list, park it. A finished small app beats a broken big one.

---

### 0.3 The stack, in plain English

You will hear this called a **MERN** app:

| Letter | Short for | In this project | What it actually does |
|---|---|---|---|
| **M** | **MongoDB** | MongoDB Atlas (free cloud tier) | The database — where place records live, like a cloud spreadsheet |
| **E** | **Express** | `server/app.js` | The backend framework — it receives browser requests and sends back data |
| **R** | **React** | `client/src/` | The frontend — draws everything you see in the browser |
| **N** | **Node.js** | runs `server/index.js` | The runtime — lets your computer run JavaScript *outside* the browser |

Supporting cast (equally important):

- **Vite** — the build tool that makes React easy to run (`npm run dev`)
- **Tailwind CSS** — styling via small utility classes (`bg-white`, `rounded-xl`)
- **Leaflet + OpenStreetMap** — free interactive maps, no API key needed
- **JWT + bcrypt** — secure admin login

How one request flows:

```
Browser (React) ──fetch──▶ Express API ──driver──▶ MongoDB Atlas
   ▲                           │
   └──────── JSON back ────────┘
```

The frontend **never talks to the database directly**. It only ever talks to Express, and Express talks to MongoDB. This one sentence is the whole architecture.

---

### 0.4 New vocabulary you'll see in every iteration

- **API** — a set of URLs your server answers. Example: `GET /api/places` returns the list of places as JSON.
- **JSON** — `{ "name": "Henarathgoda Botanical Garden", "distanceKm": 4.1 }` — the data format both humans and computers love.
- **HTTP methods** — `GET` (read), `POST` (create), `PUT` (update), `DELETE` (remove).
- **Status codes** — `200` OK, `400` you sent bad data, `401` not logged in, `404` not found, `500` server broke.
- **Route** — one URL + method + the code that runs for it.
- **Controller** — the code that actually does the work for a route (kept separate to stay tidy).
- **Middleware** — code that runs *before* the main request handler, e.g. checking "are you logged in?" (a bouncer at the door).

---

### 0.5 The iteration map

| Iteration | You end up with a working... | SRS features covered |
|---|---|---|
| **0. Foundation** | Express server with a health-check URL | — |
| **1. Real data** | Database seeded with 10 places, served as JSON by the API | BR-003, OR-001 |
| **2. Complete reading API** | Places list, single place, distance calc, 404s & error handling | FR-007–009 (API side) |
| **3. Tourist page v1** | React page showing real places as styled cards | FR-001–004 |
| **4. Browse complete** | Category filter, search, details modal, disclaimer | FR-005–006, 010–015, NFR-004 |
| **5. Map view** | Interactive OpenStreetMap inside the details modal | FR-016–019, OR-002 |
| **6. One-day planner** | Add / remove / reorder / clear plan with a summary | FR-020–027 |
| **7. Admin login** | Secure admin authentication with a protected API | FR-028–032, NFR-005–006 |
| **8. Admin CRUD** | Admin adds, edits, deletes places → tourist page updates | FR-033–040, BR-001, BR-002 |
| **9. Tests** | Automated test suite proving the app works | NFR-010 |
| **10. Ship it** | Production build + live deployed URL | NFR-001, 007, UI-01 |
| **11. Integration & regression** | Real-HTTP API tests + user-journey guards on a test database | NFR-010, FR-032–040 (HTTP level), BR-002/003 |

At the end of Iteration 10, **every functional requirement (FR-001 → FR-040) is satisfied.** There is a full checklist in the final section. Iteration 11 then wraps the finished product in an integration-and-regression safety net — the tests chapter of a real-world project.

---

### 0.6 Golden rules before you start

1. **Run the app after every small step.** Don't write 200 lines and then look at it. Write 10, run, look.
2. **Git commit at the end of every iteration.** Commit early, commit ugly. Git is your undo button.
3. **One error at a time.** When something breaks, read the *first* red error in the console, not the last.
4. **The browser console (F12) is your friend.** Backend problems appear in the terminal; frontend problems appear in the browser console. Check both.
5. **Never put real passwords in code.** Secrets live in `.env`, and `.env` is never committed.

---

## ITERATION 0 — Foundation: your server says hello

### 🎯 The working product

You run one command, open `http://localhost:3000/api/health` in a browser, and see:

```json
{ "status": "ok" }
```

That is a real, live backend. Everything else in this project gets built on top of it.

### 🧠 New concepts

- **Node.js** — JavaScript that runs *without a browser*. It lets you build a server with the same language you use for the frontend.
- **npm** — Node's app store. You type `npm install express` and the code is downloaded into `node_modules/`.
- **package.json** — your project's shopping list: scripts (like `npm run dev`, `npm test`) and dependencies.
- **Express** — a tiny framework whose whole job is: *"when a request comes in for THIS url, run THIS function."* That's it.
- **Port** — a channel number on your machine. Our backend listens on port **3000**.
- **`.env`** — a file holding settings your code shouldn't remember: passwords, database URLs. Your code loads it with the `dotenv` package.
- **localhost** = "this computer."

### 🛠️ Build steps

1. **Install Node.js LTS** (v20 or newer from nodejs.org). Check with `node -v` and `npm -v`.
2. **Create the project folder** and initialize it:
   ```bash
   npm init -y
   git init
   ```
3. **Create `.gitignore`** so heavy files and secrets never reach GitHub:
   ```
   node_modules/
   .env
   public/
   coverage/
   dist/
   ```
4. **Install the first two packages:**
   ```bash
   npm install express dotenv
   ```
5. **Create the folder skeleton** — one folder per job:
   ```
   server/
   ├── index.js       # starts the app (the "ignition key")
   ├── app.js         # the app itself (routes + rules)
   ├── config/        # database connection
   ├── routes/        # URL definitions
   ├── controllers/   # the actual work
   ├── models/        # data shapes + validation
   ├── middleware/    # bouncer code (auth, error catching)
   ├── utils/         # helpers (distance math)
   ├── seed/          # filling the DB with starter data
   └── data/          # the starter data itself
   ```
6. **Write `server/app.js`** — create the Express app, parse incoming JSON, and add the health route:
   ```js
   import express from 'express';
   const app = express();
   app.use(express.json());            // let Express read JSON request bodies

   app.get('/api/health', (_req, res) => {
     res.json({ status: 'ok' });
   });

   export default app;
   ```
7. **Write `server/index.js`** — load settings and start listening:
   ```js
   import 'dotenv/config';
   import app from './app.js';

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
   ```
8. **Add a script** in `package.json`: `"start": "node server/index.js"`.
9. **Run it:** `npm start` → open the browser → see `{"status":"ok"}`.

### ✅ Definition of Done

- [ ] `http://localhost:3000/api/health` returns `{"status":"ok"}` in a browser
- [ ] Stopping with `Ctrl+C` and restarting works every time
- [ ] Unknown URLs (like `/api/nothing`) don't crash the server
- [ ] `git commit -m "Iteration 0: working Express health-check"`

### 🎤 What you can demo now

"This is my backend. It's a Node server. A browser asked it for `/api/health`, and it answered with live JSON over HTTP."

---

## ITERATION 1 — Real data: MongoDB Atlas + 10 seeded places

### 🎯 The working product

A cloud database exists, holds **10 real places** (the SRS Appendix A list: Henarathgoda Botanical Garden, Kelaniya Raja Maha Viharaya, etc.), and your server prints them out.

Open `http://localhost:3000/api/places` and see 10 real places as JSON. **Restart the server — still exactly 10 places, no duplicates.**

### 🧠 New concepts

- **MongoDB vs SQL** — SQL stores *rows in tables*; MongoDB stores **documents that look like JSON**, inside **collections** (folders of similar documents). A "place" document is literally `{ name: "...", lat: 7.07, lng: 79.99 }`. That JSON-family resemblance is exactly why MongoDB suits a JavaScript project.
- **MongoDB Atlas** — MongoDB, hosted in the cloud by the official company. The free **M0 tier** is perfect for this project.
- **Connection string (URI)** — the "address + key" to your database. It *contains* your password, so it lives only in `.env`. Anatomy: `mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/`
- **Driver** — the `mongodb` npm package. It translates your JavaScript calls into database-speak. `db.collection('places')` just means "the folder called places."
- **Seeding** — first-run script that fills an empty database with starter data, so the app is never blank. (SRS **BR-003** requires at least 10 seed places.)

### 🛠️ Build steps

1. **Create the free database** (one-time, ~5 minutes):
   1. Sign up at mongodb.com/cloud/atlas/register → create a **free M0 cluster**.
   2. **Database Access** → add a user (remember the password!).
   3. **Network Access** → Add IP → **Allow access from anywhere** (`0.0.0.0/0`).
   4. **Clusters → Connect → Drivers** → copy the connection string.
2. **Create `.env` and `.env.example`** (example file has fake values, real one has yours):
   ```env
   MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=touristPlanner
   JWT_SECRET=some-long-random-string
   ADMIN_USER=admin
   ADMIN_PASS=admin123
   ```
   > Tip: if the password contains `@ : / ? #`, URL-encode them (`@` becomes `%40`), or just use letters + numbers in the password.
3. **Install the driver:** `npm install mongodb`
4. **Create `server/config/db.js`** — connect once, share the connection:
   - Read `MONGODB_URI` + `DB_NAME` from `.env`.
   - Export `getDb()` that returns the connected database handle.
   - Fail fast with a clear message if `MONGODB_URI` is missing.
5. **Create `server/models/place.js`** — the Place **model**:
   - The list of allowed categories: `Nature, Religious, Dining, Heritage, Recreation, Eco-Tourism` (**FR-006**).
   - A `buildPlace()` helper that takes raw incoming data and returns a cleaned place object or throws: checks that `name`, `category`, `description`, `lat`, `lng` exist and have the right types, and copies only whitelisted fields (**OR-001**, and NFR-008 — this is the anti-injection security: unknown/extra fields are simply dropped).
   - Think of the model as **a bouncer checking data before it's allowed into the database**.
6. **Create `server/data/seedPlaces.js`** — the 10 places from SRS Appendix A. Each: `name, category, description, lat, lng, openingHours, travelTips`.
7. **Create `server/seed/seedDatabase.js`** — runs on server start:
   - Look at the `places` collection — **if it already has documents, do nothing** (this is what stops duplicates on restart).
   - Otherwise insert the 10 seed places.
   - Also create the admin account in an `admins` collection: `{ username, passwordHash }` — hash the password with `bcryptjs` (**NFR-006**; login itself comes in Iteration 7).
8. **Wire it up in `server/index.js`** — order matters: load env → connect DB → seed → start listening.
9. **Add a temporary list route in `app.js`**: `GET /api/places` → read all docs from `places` → `res.json(...)`.

### ✅ Definition of Done

- [ ] Atlas "Browse Collections" shows the `touristPlanner` database with a `places` collection containing exactly 10 documents
- [ ] `http://localhost:3000/api/places` returns all 10 as JSON with `name`, `category`, `lat`, `lng`
- [ ] Restarting the server does **not** add more documents (seed runs only once)
- [ ] Optional: `http://localhost:3000/api/health` still works
- [ ] `git commit -m "Iteration 1: MongoDB Atlas connected, 10 places seeded"`

### 🎤 What you can demo now

"This app has a real cloud database. On first run it seeds 10 tourist attractions. The API is serving live data from MongoDB Atlas."

---

## ITERATION 2 — A complete reading API: distance, details, and graceful errors

### 🎯 The working product

The backend is now **feature-complete for reading**:

- `GET /api/places` — list, with `distanceKm` computed for each place
- `GET /api/places?category=Dining` — filtered list
- `GET /api/places/:id` — one place's full details
- Bad requests get clean `400`/`404` answers, never a cryptic crash or a hanging page

### 🧠 New concepts

- **Route → Controller pattern** — `routes/placeRoutes.js` says *"GET /api/places is handled by placeController.list"*. `controllers/placeController.js` does the actual work. Routes = phone directory; controllers = the people answering.
- **Haversine formula** — the math that turns two latitude/longitude pairs into "as the crow flies" km. No Google Maps API, no key, no cost, works offline (**FR-007, FR-008**).
- **Compute-on-read** — we *calculate* `distanceKm` when data is served (from Ganemulla origin `7.0736, 79.9989`) instead of storing it. The database is the single source of truth, so distance can never be stale.
- **Central error handling** — controllers "throw" errors; one middleware at the end of `app.js` catches everything and sends a tidy JSON answer. No `try/catch` chaos in 20 places.
- **asyncHandler** — a tiny helper that wraps async controller functions and forwards errors to that central handler, so you never write the same try/catch twice.
- **Why "Distance unavailable" matters** — if coordinates are missing, show `"Distance unavailable"` (**FR-009**) rather than `NaN` — small, but this exact kind of care is what NFR-010 ("no runtime exceptions on missing fields") is about.

### 🛠️ Build steps

1. **Create `server/utils/distance.js`**:
   - A `GANEMULLA_ORIGIN = { lat: 7.0736, lng: 79.9989 }` constant (the fixed reference point, **FR-008**).
   - A `haversineKm(lat1, lng1, lat2, lng2)` function using the Haversine formula.
   - Unit test later in Iteration 9 — keep this file pure (no database, no printing).
2. **Make the list controller professional** — refactor the temporary route from Iteration 1 into the proper shape:
   - `server/controllers/placeController.js` gets `list`, `getOne` (more CRUD verbs arrive in Iteration 8).
   - `list`: read `category` from the query string; build a Mongo filter (skip the filter entirely when no category is given); for each place compute `distanceKm = haversineKm(place.lat, place.lng, origin...)`; send the array.
3. **Add `GET /api/places/:id`** (`getOne`):
   - Find by id; if not found → throw a `404`-style error ("Place not found").
   - Include `distanceKm` on the single place too.
4. **Create `server/middleware/asyncHandler.js`**:
   ```js
   // wraps an async controller so thrown errors reach the error handler
   const asyncHandler = (fn) => (req, res, next) =>
     Promise.resolve(fn(req, res, next)).catch(next);
   export default asyncHandler;
   ```
5. **Add the central error handler** at the *bottom* of `server/app.js`:
   - Recognizes errors with an attached status → sends that status + message.
   - Anything unrecognized → `500` with a generic "Server error". (Never leak stack traces or DB internals to the client.)
6. **Register real routes** — `server/routes/placeRoutes.js` mounted at `/api` in `app.js`, replacing the temporary placeholders.
7. **Test manually like a pest** — hit URLs with wrong ids, wrong categories, garbage ids. The API should always answer something sane.

### ✅ Definition of Done

- [ ] `GET /api/places` → every place has `distanceKm`, and manual sanity check agrees (km values in the 4–22 km range per Appendix A)
- [ ] `GET /api/places?category=Dining` → only Dining places; `?category=Banana` → empty list, **not** an error
- [ ] `GET /api/places/<real-id>` → one full place
- [ ] `GET /api/places/<made-up-id>` → `404` JSON error, server stays alive
- [ ] Every response is JSON with the right status code
- [ ] `git commit -m "Iteration 2: read API complete — list, filter, details, distance, errors"`

### 🎤 What you can demo now

"Here is my complete reading API. Filtering works, distance is calculated live from Ganemulla town centre, and the API answers politely even when I ask it for nonsense."

---

## ITERATION 3 — The frontend wakes up: React + Tailwind showing real places

### 🎯 The working product

`npm run dev` starts **both** servers. Open `http://localhost:5173` and see a **styled page with a header and 10 place cards** (name, category badge, distance) — real data fetched from your Express API.

### 🧠 New concepts

- **React** — a library for building UI from **components**: reusable Lego bricks (`PlaceCard` used 10 times = one grid). You write **JSX** — HTML living inside JavaScript, with `{}` holes where JS values go.
- **Props vs state** — props are settings parents pass down (`<PlaceCard place={x} />`, read-only); state is a component's own memory (`useState`). Rule: **the screen is a picture of your state** — you change state, React redraws.
- **Vite** — a dev server with *hot reload* (the page updates the instant you save) that also does the production build later.
- **The proxy** — in `vite.config.js`, the frontend runs on port 5173 and the API on 3000. Vite's proxy forwards any `/api/*` request from 5173 → 3000, so the two ports never fight and you don't worry about CORS during development.
- **Custom hook** — a function starting with `use` that bundles logic + state for reuse. `usePlaces()` will carry "fetch the places, remember loading/error" so any page can have it in one line.
- **Tailwind CSS** — styling by stacking small utility classes: `rounded-xl bg-white shadow p-4 flex gap-2`. No naming CSS classes, no context-switching to a separate file.
- **`npm run dev` = two servers** — via `concurrently`. Express (3000, your API) + Vite (5173, your React app).

### 🛠️ Build steps

1. **Install frontend deps:**
   ```bash
   npm install react react-dom
   npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/postcss postcss concurrently
   ```
2. **Create the tooling config:**
   - `vite.config.js` — React plugin, build output to `public/`, and the `/api` proxy to `http://localhost:3000`.
   - `tailwind.config.js` — scan `./client/index.html` and `./client/src/**/*.{js,jsx}`.
   - `postcss.config.js` — just `@tailwindcss/postcss`. Tailwind v4 prefixes CSS itself (Lightning CSS), so autoprefixer is not needed.
3. **Create the client skeleton:**
   - `client/index.html` — a single HTML page with `<div id="root">` and `<script type="module" src="/src/main.jsx">`.
   - `client/src/index.css` — `@import 'tailwindcss'` plus `@config "../../tailwind.config.js"` (so v4 still reads the legacy JS theme), then small utility classes you reuse (`.btn`, `.field`, `.chip`).
   - `client/src/main.jsx` — mounts `<App />` into `#root`.
   - `client/src/App.jsx` — for now just shows a "Hello" heading.
4. **Update the dev script** in `package.json`:
   ```json
   "dev": "concurrently -k \"node server/index.js\" \"vite\""
   ```
5. **Create `client/src/lib/constants.js`** — one file for shared values: categories list, badge colors per category, a `kmText()` helper for pretty "4.1 km" (or "Distance unavailable") labels.
6. **Create `client/src/services/api.js`** — a small `fetch` wrapper: sets `Content-Type: application/json`, parses JSON responses, and throws a friendly Error on non-2xx status. One place for HTTP plumbing instead of repeating it in every component.
7. **Create `client/src/hooks/usePlaces.js`** — the custom hook:
   - On mount, call the API; keep state `{ places, loading, error }`.
   - Show a simple loading line while fetching, and the error message if the API dies (**UI-02**: honest error display).
8. **Build the visible pieces:**
   - `components/Header.jsx` — app name + one-line tagline.
   - `components/PlaceCard.jsx` — the card: name, category badge, distance text. Props only: `place`.
   - `pages/HomePage.jsx` — uses `usePlaces()`, renders a responsive Tailwind grid of cards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — instant **UI-01** responsiveness).

### ✅ Definition of Done

- [ ] `npm run dev` shows **two** servers starting (API + Vite) with no errors
- [ ] `localhost:5173` shows the header + 10 real place cards (same content as `localhost:3000/api/places`)
- [ ] Resizing the browser: 1 column on a phone width → 3 on desktop
- [ ] Each card shows name, category, distance — matching the JSON
- [ ] Stop the backend frontend-only reset: page shows a clear error, not a blank screen
- [ ] `git commit -m "Iteration 3: React + Tailwind frontend showing live API data"`

### 🎤 What you can demo now

"This is the tourist page, connected to my own backend and database. It's responsive — watch me resize — and the cards are one reusable React component rendered 10 times."

---

## ITERATION 4 — Browse like a tourist: filters, search, details, disclaimers

### 🎯 The working product

The tourist page is now **fully usable for reading**:

- Category chips filter the grid instantly
- A search box narrows by name
- Clicking a card opens a **details modal** with description, opening hours, travel tips, distance — and friendly fallbacks when data is missing
- A disclaimer banner warns that info should be verified (**NFR-004**)

### 🧠 New concepts

- **Lifting state up** — HomePage owns "which category is active" (because Header, Filter, and Grid all care about it) and passes it down as props.
- **Controlled input** — the search box's value comes from React state (`value={q}` + `onChange={...}`), so UI and data never disagree.
- **Client-side filtering** — the list is small (tens of places), so filtering *in the browser* is instant and satisfies NFR-002's 1-second rule. (Server-side `?category=` already exists from Iteration 2 and is used as the data source.)
- **Conditional rendering** — the modal exists in JSX only when a place is selected: `{selected && <PlaceDetails place={selected} />}`.
- **Empty states** — an explicit "No places match your filters" message is a feature, not an accident (**FR-004**).

### 🛠️ Build steps

1. **`components/CategoryFilter.jsx`** — an "All" chip + one chip per category; the active one is visually highlighted; calls back up via props.
2. **Add search state to `HomePage.jsx`** — a text input; filter `places` by name before rendering.
3. **`components/PlaceDetails.jsx`** — the details modal:
   - Name + category badge (**FR-010**), full description (**FR-011**)
   - `openingHours` — show it, otherwise the text **"Not provided"** (**FR-012 + FR-015**)
   - `travelTips` — same pattern (**FR-013 + FR-015**)
   - Distance in km (**FR-014**), via `kmText()` from `lib/constants.js`
   - *Map placeholder for tomorrow*: an empty box where the map will go in Iteration 5
4. **Modal behavior** — close button + clicking the dark backdrop + `Escape` key. Simple props: `place`, `onClose`.
5. **Disclaimer banner** — an amber strip under the header on both pages (**NFR-004**, NFR wording: hours and tips are subject to change).
6. **Wire HomePage together** — search + category + grid all in one state; click card → set `selected` → modal opens.

### ✅ Definition of Done

- [ ] Each category chip filters instantly; "All" restores everything
- [ ] Typing a search word filters instantly; clearing it restores the full list
- [ ] No results → friendly empty-state message, never a blank area (**FR-004**)
- [ ] Every place's modal opens with description, distance, fallbacks ("Not provided" is visibly present on a place with no tips — check a seed place)
- [ ] Disclaimer banner is visible on the tourist page
- [ ] `git commit -m "Iteration 4: category filter, search, details modal, disclaimer"`

### 🎤 What you can demo now

Full tourist-browsing flow: filter by Eco-Tourism, search "Kelaniya", open details, close with Escape. Trusted UX, not just a demo app.

---

## ITERATION 5 — Put it on the map: Leaflet + OpenStreetMap

### 🎯 The working product

The details modal shows a **real interactive map** centered on the place with a pin marker. A button opens the same location on openstreetmap.org in a new tab. Places without coordinates quietly show a notice instead of a map.

### 🧠 New concepts

- **Tiles** — web maps are photo grids served from a server; your browser lays them out like a jigsaw while you pan/zoom. OpenStreetMap serves them for free — with the obligation to show attribution (**OR-002**: show `© OpenStreetMap contributors` on the map).
- **Leaflet** — the tiny library that manages the tile jigsaw + markers. Loaded once via `<link>`/`<script>` in `client/index.html`.
- **Why this beats a Google Maps embed** — no API key, no billing account, no per-view quota — nothing to expire mid-demo.
- **`useRef` vs `useState` for the map** — the map object is *not* something the screen renders as HTML, so it lives in a `useRef` (a persistent box React doesn't render) instead of re-creating a full map on every state change.
- **Effect cleanup** — the `useEffect` that creates the map returns a cleanup function that removes it. If you skip this, closing a modal leaves a zombie map behind.

### 🛠️ Build steps

1. **Load Leaflet in `client/index.html`** — Leaflet CSS + Leaflet JS (CDN), plus your own small `<style>` fix so tile images load (a classic blank-grey-map gotcha).
2. **Create `components/MapView.jsx`** — accepts `lat`, `lng`, optional `name`:
   - If coordinates are missing → render a short notice instead of the map (**FR-019**).
   - In a `useEffect`: create the map on a `useRef` div, centered at `[lat, lng]` at zoom ~13, add the OpenStreetMap tile layer **with attribution**, add a `L.marker` pin (**FR-016, FR-017, OR-002**).
   - Return the cleanup function: remove the map instance.
3. **"Open in OpenStreetMap"** button/link in `PlaceDetails.jsx` builds the URL and opens a new tab (**FR-018**):
   ```
   https://www.openstreetmap.org/?mlat=<lat>&mlon=<lng>#map=15/<lat>/<lng>
   ```
4. **Swap the placeholder** in `PlaceDetails.jsx` from Iteration 4 for `<MapView place={place} />`.

### ✅ Definition of Done

- [ ] Every place with coordinates: interactive map — pan, zoom, pin at the right location (**FR-016–017**)
- [ ] Attribution visible on the map (**OR-002**)
- [ ] External OSM link opens a new tab at the right spot (**FR-018**)
- [ ] Optionally test a place with blank `lat`/`lng` in the database → notice shown, no crash (**FR-019**)
- [ ] Open/close the modal several times in a row without console errors (proves cleanup works)
- [ ] `git commit -m "Iteration 5: interactive OpenStreetMap in place details"`

### 🎤 What you can demo now

Open "Muthurajawela Wetland", show pan/zoom/pin, click through to the full-screen OSM map, and come back. A spatial feature at zero cost.

---

## ITERATION 6 — The planner: build a one-day trip

### 🎯 The working product

A **plan drawer** opens from the header. Tourists add places to their day, reorder them, remove them, clear all, and see a summary. **Refresh the page — the plan is still there.**

### 🧠 New concepts

- **localStorage** — a tiny notebook the browser keeps even after closing the tab. Perfect for FR-026 ("retain the plan at minimum for the session"). Strings only — so we `JSON.stringify` to save and `JSON.parse` to load.
- **Immutable updates** — never `myArray.push(...)`, because with valid pragma React can't see in-box changes; instead build a new array: `setPlan(plan.filter(p => p.id !== id))`. A new array = React knows something changed = re-render.
- **Derived data** — the summary (total places, total km) is *calculated while rendering* from the plan, never stored. Derived state is impossible to get out of sync with its source. (**FR-025**)
- **App-level state** — the plan lives in `App.jsx` because *two* pages care: HomePage (add button) and the drawer (show plan).

### 🛠️ Build steps

1. **Create `hooks/useDayPlan.js`** — the whole planner brain in one hook:
   - Load the plan from localStorage on start; save on every change.
   - `add(place)` — append if not already present; silently ignore duplicates (**FR-020, FR-022**).
   - `remove(id)` (**FR-021**), `move(index, -1|+1)` — swap neighbors for reorder (**FR-023**), `clear()` with one click (**FR-027**).
   - Return `{ plan, add, remove, move, clear, inPlan, totalCount, totalKm }`.
2. **Add the "Add to Plan" button** on PlaceDetails (and optionally on each card) — disabled with an "Already in plan" state when it's already in.
3. **Create `components/PlanDrawer.jsx`** — slides in from the right:
   - Numbered list in the chosen order (**FR-024**) with ▲/▼ buttons to reorder and ✕ to remove
   - Summary footer: item count + cumulative km (**FR-025**)
   - "Clear plan" with a tiny confirm step (destructive action)
   - Plan count badge in the Header so it's visible from everywhere
4. **Lift the hook**: `App.jsx` creates `const plan = useDayPlan()` and passes it down by props to HomePage and PlanDrawer.
5. **Hand-test the three SRS sequences:**
   - Add 3 different places → remove the middle one → verify order renumbers
   - Move "Upali's" above a nature site → verify visual order instantly changes (**FR-023**)
   - Refresh the page → the same 3 places are still planned (**FR-026**)

### ✅ Definition of Done

- [ ] Add → drawer opens with the place; duplicate add is impossible (**FR-020, FR-022**)
- [ ] Remove, reorder ▲▼, clear all work; the list is always renumbered per current sequence (**FR-021, 023, 024, 027**)
- [ ] Summary count and total km are correct (check by hand against the card distances) (**FR-025**)
- [ ] Refresh keeps the plan (**FR-026**)
- [ ] `git commit -m "Iteration 6: one-day visit planner with localStorage"`

### 🎤 What you can demo now

The headline feature. Build a full day in five seconds: garden → temple → dinner. Reorder, remove one, refresh, show the plan survived.

---

## ITERATION 7 — Admin login: identity with real security

### 🎯 The working product

`/admin` shows a **login page**. Correct credentials → dashboard shell appears (content in the next iteration). Wrong credentials → clear error. Logging out (or waiting 2 h) → back to login. The API itself refuses all write requests without a token.

### 🧠 New concepts

- **Authentication vs authorization** — *authentication* = "who are you?" (login); *authorization* = "what may you do?" (admin-only). This iteration adds both: login checks **who**, the middleware decides **what**.
- **bcrypt** — a one-way scrambler made for passwords. We store only the hash. Even if someone steals the database, they don't have admin passwords (**NFR-006**). The seed script from Iteration 1 already stores hashed passwords; now we finally use them.
- **JWT (JSON Web Token)** — a signed "hall pass" the server hands out at login; the client shows it on every admin request. Contains payload + **signature** — fake the payload, break the signature, run out the 2-hour expiry, and the server rejects it (**FR-032**).
  - Shape: `xxxxx.yyyyy.zzzzz` = header.payload.signature — decode `yyyyy` at jwt.io to see your own username; that "decoding" is public knowledge and safe, since the *signature* is what provides the trust.
- **Authorization header** — admin requests carry `Authorization: Bearer <token>`; the `requireAuth` middleware reads it, verifies it, and either lets the request through (with admin info attached) or returns `401`.
- **Where to keep the token** — the client stores it and reattaches it on every request. Logout = delete the stored token (the server never needs its own logout).

### 🛠️ Build steps

1. **`POST /api/login`** — two backend files:
   - `server/routes/authRoutes.js` — mounts the new POST.
   - `server/controllers/authController.js` — load-and-find the admin by username → `bcrypt.compare(password, hash)` → wrong match = `401 "Invalid credentials"` (**FR-030**); right match = sign a JWT ({ username } as payload, 2-h expiry) → return `{ token }` and generic failure message for wrong username vs. wrong password (don't tell attackers which guess was close).
2. **Create `server/middleware/auth.js`**:
   - Exports `requireAuth` — reads the `Authorization: Bearer` header, `jwt.verify` with `JWT_SECRET`; valid → `next()`; missing/tampered/expired → `401`.
   - Exports `signToken` used by the controller.
3. **Route registration** — mount `authRoutes` in `app.js`; the admin pages will exist after this iteration (show a "coming next iteration" placeholder).
5. **Client token service** — `client/src/services/auth.js`: `saveToken() / getToken() / clearToken()` around a tiny storage wrapper.
6. **Upgrade `client/src/services/api.js`** — attach `Authorization: Bearer ${token}` automatically when a token exists; on receiving a `401`, clear the token so the UI can show "please log in again."
7. **Admin page flow** — `client/src/pages/AdminPage.jsx`:
   - No valid token → show `components/admin/LoginForm.jsx` (username + password + error message).
   - Token present → show the dashboard shell with the admin's name and a Logout button (**FR-028, FR-029, FR-031**).
   - `App.jsx` / `main.jsx` shows AdminPage when the URL is `/admin`, else HomePage.
8. **Prove protection now** — with curl/PowerShell:
   ```powershell
   # Should be rejected
   curl.exe -X POST http://localhost:3000/api/places -H "Content-Type: application/json" -d "{\"name\":\"x\"}"
   # → 401

   # Login, get a token
   curl.exe -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
   ```

### ✅ Definition of Done

- [ ] Correct credentials → token received → dashboard shell visible
- [ ] Wrong credentials → "Invalid credentials" message, never a crash (**FR-030**)
- [ ] `requireAuth` on write routes returns `401` without a token (**FR-032, NFR-005**)
- [ ] Logout clears the token and returns to the login page (**FR-031**)
- [ ] An expired/fake token also returns `401`
- [ ] Password check runs against the bcrypt **hash**, never plain text (**NFR-006**)
- [ ] `git commit -m "Iteration 7: JWT admin login with protected routes"`

### 🎤 What you can demo now

Security. Trim the token's middle letters to paste a broken one and get an instant rejection; show a valid login and confirm a write request succeeds where an unauthenticated one fails with 401.

---

## ITERATION 8 — Admin powers: Create, Read, Update, Delete

### 🎯 The working product

The full admin dashboard: an existing-places table, **Add place** and **Edit place** forms, **Delete** with a confirmation. Two renders later the tourist page shows the same new place. With this iteration, **every FR in the SRS is switched on**.

### 🧠 New concepts

- **CRUD ↔ HTTP methods** — Create = `POST`, Read = `GET` (already built), Update = `PUT`, Delete = `DELETE`. Backend verb granularity and frontend intent map 1-to-1 via standard HTTP vocabulary.
- **Server-side validation is mandatory** — the HTML form is *for convenience*; the server's model validation (the Iteration-1 `buildPlace()`) is the one that matters, because anyone can call the API without your form (**FR-037, NFR-008**).
- **The 25 km business rule** — the admin creates a place far from Ganemulla; the server measures with the same Haversine helper and flags it (**FR-040, BR-001**).
- **Confirmation for destructive actions** — a "Delete this place?" modal before the DELETE fires (**FR-036**) — one accidental click should not delete shared data.
- **Same form, two uses** — one `PlaceForm` component handles *add* (empty fields) and *edit* (prefilled fields) — one component, two modes, no duplication.

### 🛠️ Build steps

1. **Backend CRUD endpoints** in `server/controllers/placeController.js`, all wired in `server/routes/placeRoutes.js` **behind `requireAuth`**:
   - `POST /api/places` → `buildPlace()` validation by hand → insert → `201` + the new place (**FR-033**)
   - `PUT /api/places/:id` → same validation → update → updated place (**FR-034**)
   - `DELETE /api/places/:id` → remove → `{ ok: true }` (**FR-035**)
   - Bad/missing data → `400` with a field-specific message; unknown id → `404`.
2. **25 km check inside those handlers** — distance from the Ganemulla origin; if over 25 km, reject with a warning-style message telling the admin how far away it is (**FR-040**).
3. **`components/admin/PlaceTable.jsx`** — every place as a row: name, category, distance, Edit/Delete buttons.
4. **`components/admin/PlaceForm.jsx`** — fields: name, category (select), description, lat, lng, openingHours (optional), travelTips (optional). Validated client-side as a convenience, but the server errors remain the truth.
5. **Delete confirmation modal** in PlaceTable before firing the API call (**FR-036**).
6. **Back to the dashboard after save**; reload the table; verify the fresh data appears.
7. **Prove end-to-end freshness** — add "Test Place" near Ganemulla → switch to `/` → it's in the grid with a distance, category filter picks it up → edit its name → the name updates in the tourist view → delete it → it disappears.
8. **Handle 401 gracefully** — if the token expired while the admin was idle, the UI says "Please log in again" and returns to login (**FR-032** closed loop).

### ✅ Definition of Done

- [ ] Create, edit, delete all work and survive a refresh (**FR-033–035**)
- [ ] Delete demands confirmation (**FR-036**)
- [ ] Submitting an incomplete form gets a clear "which field is wrong" answer (**FR-037**)
- [ ] A place >25 km from Ganemulla is prevented with a helpful message (**FR-040**)
- [ ] Write endpoints answer `401` without a valid token (**BR-002, FR-032**)
- [ ] Admin changes are visible on the tourist page without a custom piece of code
- [ ] `git commit -m "Iteration 8: full admin CRUD — every SRS FR now implemented"`

### 🎤 What you can demo now

The full loop. Log in, add a real new place with coordinates, show it live for tourists with correct distance, try to delete a place and watch the confirmation save you, then logout → attempt to write again → check the 401.

---

## ITERATION 9 — Trust your code: automated tests

### 🎯 The working product

`npm test` runs a suite that verifies the app's *brain* without a human clicking — model validation, distance math, controllers, and client hooks — and everything is green.

### 🧠 New concepts

- **Automated test** — a small program that calls your code with known inputs and asserts known outputs. Like fire drills: cheap, automatic, and it makes you *dare* to change code later.
- **Unit test** — verifies **one brick** in isolation (does `haversineKm` compute the famous case correctly?). Full flows are verified by hand in these iterations' demos.
- **Mocking** — tests don't touch your real Atlas database; a fake standing-in object **pretends** to be it and behaves how you tell it to. Fast, free, repeatable, no network.
- **Vitest** — the test runner (a Jest replacement that integrates with Vite); `test/setup.js` + `jsdom` simulate a browser for client tests.
- **Why bother** — the tests create confidence: every future edit re-runs the same verifications, i.e., a skeleton key to regression-free refactoring (NFR-010's spirit: "missing data must not crash us" now gets tested, not just hoped).

### 🛠️ Build steps

1. **Install and configure the runner:**
   ```bash
   npm install -D vitest jsdom @testing-library/react @testing-library/dom @vitest/coverage-v8
   ```
2. **`vitest.config.js`** — jsdom environment for files under `client/src`, node environment for `server/**`; ensure `npm test` points to `vitest run` (covered already by the scripts).
3. **Highest-value backend tests** (each file paired with the code it verifies):
   - `server/utils/distance.test.js` — known-route sanity: origin-to-origin = 0 (not NaN); a mapped landmark (Henarathgoda) ≈ its Appendix-A distance (≈ 4.1 km); distance survives lat/lng mix-up with a 2-line swap (`7.07` vs `79.99` is a *very* common beginner bug).
   - `server/models/place.test.js` — `buildPlace()`: rejects missing name, unknown categories, wrong lat/lng types; drops extra unknown fields (the anti-injection behavior).
   - `server/controllers/placeController.test.js` — with a mocked database client: list returns places with `distanceKm`; unknown id → 404-style path; admin create with valid data inserts; invalid rejected.
   - `server/middleware/auth.test.js` + `asyncHandler.test.js` — `requireAuth` accepts a good token / rejects missing & expired; async errors reach `next()`.
   - `server/config/db.test.js`, `server/seed/seedDatabase.test.js` — with mocks: no URI → clean failure; seed runs once when empty, skips when the collection has items.
4. **Highest-value client tests:**
   - `client/src/hooks/useDayPlan.test.js` — add → remove → reorder → clear → persistence logic, in minute-sized steps.
   - `client/src/hooks/usePlaces.test.js` — loading → data (mocked fetch), and error surface when the API broke.
   - `client/src/services/api.test.js` + `auth.test.js` — JSON handling, token attach/clear.
   - `client/src/lib/*` — constants & image helpers (tiny pure functions = instant tests).
5. **Coverage (one command, no extra code):**
   ```bash
   npm run test:coverage
   ```
   Look at `utils/`, `models/`, `middleware/` — those should be near 100%, since they hold the exacting logic. Numbers alone aren't the goal; the *units that hold the rules* matter most.

### ✅ Definition of Done

- [ ] `npm test` — all green, no console errors
- [ ] Tests don't need internet or real MongoDB (mocks everywhere)
- [ ] The distance test would have caught a lat/lng swap
- [ ] `buildPlace()` test covers: correct place accepted, unknown category rejected, extra junk fields dropped
- [ ] Coverage report highlights the pure-logic files as strongest
- [ ] `git commit -m "Iteration 9: automated test suite with Vitest"`

### 🎤 What you can demo now

Reliability. Run `npm test` live in about five seconds and say: "Every rule in my SRS is verified every time I change any code."

---

## ITERATION 10 — Ship it: polish, production build, deploy

### 🎯 The working product

One production build. One server. One **URL admitting anyone** — no laptop, no `npm run dev`. Plus the documentation needed to hand it to a supervisor.

### 🧠 New concepts

- **Dev vs production** — in dev, Vite transforms files on the fly during each request. In production we build **once**: Vite bundles and minimizes everything (Step 1) into plain, fast `public/` files, and its job is done. Your Express app then statically serves the folder, so **one URL serves both the app and the API on port 3000** (that's why `/` and `/admin` both return `index.html` plus the API).
- **Environment variables in the cloud** — the deployed server on Render has its own *dashboard-configured* env vars; you never commit `.env`, but the cloud holds the same values.
- **HTTPS for free** — Render issues a certificate automatically (the `https://` padlock satisfies **NFR-007**).
- **Documentation as a feature** — SRS §2.6 requires a user guide + admin guide → they're written inside the README.

### 🛠️ Build steps

1. **Responsive polish pass** (**UI-01**): Chrome DevTools → device toolbar → iPhone / tablet / desktop: check the header, grid, modal, and plan drawer. Fix widths with Tailwind responsive classes (`sm:` `lg:`).
2. **Static build:**
   ```bash
   npm run build
   npm start
   ```
   `http://localhost:3000` now serves the entire site *and* the API. Open `/admin` there too — all one server. This is what you'll deploy.
3. **Push to GitHub** — `.env` and `public/` already ignored, verify secrets aren't included anywhere (`git log --oneline`, `git grep admin123`).
4. **Deploy to Render** (free web service tier):
   - Create a Web Service from the GitHub repo.
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - In **Environment**: set `MONGODB_URI`, `DB_NAME`, `JWT_SECRET`, `ADMIN_USER`, `ADMIN_PASS` (same ones as your `.env`).
   - Also set Atlas **Network Access** to allow `0.0.0.0/0` (cloud servers have no fixed home IP).
5. **Post-deploy smoke test** — open the URL → places load? filter works? map tiles render? admin login? test place creation? (If something fails, Render **Logs** is where the backend error text lives.) `/api/health` should return its JSON live.
6. **Documentation** (satisfying SRS §2.6):
   - **README.md** — setup, how to run, project structure, API reference, SRS-coverage table.
   - **User guide** — for a tourist: browse → filter → details → plan.
   - **Admin guide** — how to login and manage places.
7. **Check NFRs that are checkable in a demo:**
   - NFR-001: first render comfortably under 3 s (cold cache test)
   - NFR-002: filter button → content updates in well under a second
   - NFR-004: the disclaimer is visible
   - NFR-007: address bar shows the padlock

**Optional extras in this repo (nice-to-have polish):** local place photos in `public/images/places/*` with `client/src/components/PlaceImage.jsx` + `lib/images.js` (image with fallback), small `Icons.jsx`, and the `TopoPattern.jsx` background texture.

### ✅ Definition of Done — final

- [ ] Live HTTPS URL anyone can open, no dev tools involved
- [ ] On that URL: browse, filter, search, details, map, planner all functional
- [ ] Admin login (default credentials) and full CRUD work in production
- [ ] `npm run build && npm start` locally → site + API on one port
- [ ] README has setup, scripts, API reference, and the user/admin guides
- [ ] Repo pushed; secrets not committed anywhere
- [ ] `git commit -m "Iteration 10: production build, deployed, documented — project complete"`

### 🎤 What you can demo now

**The whole project in two minutes:** open the live URL on your phone as the tourist, plan a day in thirty seconds, then switch to the laptop and log in as admin to add a brand-new place — and refresh the phone to show the updated page **on the internet**, not localhost.

---

## ITERATION 11 — The safety net: integration & regression testing

### 🎯 The working product

The finished app is no longer only unit-tested. One command proves — over **real HTTP
and a real MongoDB database** — that the whole stack works together, and that the six
critical user journeys cannot quietly break:

| Command | Verifies | Tests |
|---|---|---:|
| `npm test` | every logic module in isolation (offline, everything mocked) | 130 |
| `npm run test:integration` | the real Express app, end-to-end over HTTP | 26 |
| `npm run test:regression` | the six critical user journeys J1–J6 still hold | 6 |
| `npm run test:all` | all three layers, in order | **162** |

New files:
- `test/integration/helpers.js` — connects to a **test database** and wipes it between tests
- `test/integration/api.integration.test.js` — 26 HTTP integration tests through the real `server/app.js`
- `test/regression/journeys.regression.test.js` — journeys J1–J6
- `vitest.integration.config.js`, `vitest.regression.config.js` — one runner per suite, with network-friendly timeouts

Two production files change (both small and safe):
- `server/config/db.js` — new exported `closeDB()` lets the test runner exit cleanly.
- `server/app.js` — body-parser errors (e.g. malformed JSON) keep their correct **400** status instead of being masked as **500** — a real bug the new integration suite caught on day one.

### 🧪 How the test database stays safe

The suites never touch your real data:

1. `helpers.js` points `connectDB()` at your `TEST_DB_NAME` (default **`touristPlannerTest`**) **before** anything connects — the same Atlas cluster, a different database.
2. Every test starts from empty collections (`beforeEach`), like a fresh install each time.
3. At the end, the suite deletes only its own collections' documents and closes the socket.

**Integration tests** answer the question unit tests can't: *"if a browser really fetched `/api/places`, what would it get back?"* They send real HTTP requests with **supertest** — routing, middleware, validation, MongoDB and the error handlers all running at once. Highlights: the full admin CRUD cycle, 401s for missing/forged tokens, 400s for injection payloads, the >25 km warning, and *malformed JSON → 400*.

**Regression tests** answer a different question: *"if I change the code tomorrow, will everything that already works still work?"* Each journey is one whole user story — J1 seed-restart safety, J2 the tourist's 25 km radius integrity, J3 the complete admin edit-cycle as the tourist sees it, J4 safe failure on a forged token, J5 stable repeated reads, J6 an injection attempt that changes nothing.

### 🤔 Key concepts

- **Integration test** — parts working together: real request → Express → middleware → MongoDB → JSON response.
- **Regression test** — a guard for already-working features, re-run after every change.
- **Test DB** — a second database used only by tests; wiping it can never hurt the real one.
- **supertest** — a tiny library that fires real HTTP requests at your app from inside a test.

### 🎤 What you can demo now

Run `npm run test:all` and let the terminal tell the story: **130 offline unit tests**, then **26 integration tests with names a reviewer can read** ("the full CRUD cycle works end-to-end (FR-033 - FR-035)", "malformed JSON bodies are rejected with 400 (not a 500)"), then the **six regression journeys** — 162/162, all green.

Checklist for this iteration:

- [ ] `npm test` still passes offline (130 tests — the new layer broke nothing)
- [ ] `npm run test:integration` → 26/26 against Atlas
- [ ] `npm run test:regression` → 6/6 against Atlas
- [ ] `npm run test:all` → 162/162
- [ ] Malformed JSON on `POST /api/places` answers **400** (was 500)
- [ ] `result.md` updated (§9–§10); `package.json` has the three new scripts
- [ ] `git commit -m "Iteration 11: integration + regression testing — 162-test safety net"`

---

## THE FINISH LINE — SRS requirement map

Verify every requirement against the code after the final iteration:

| Requirement | Covering feature | Iteration | Key file |
|---|---|---|---|
| FR-001–002 | Place listing, card fields | 3 | `pages/HomePage.jsx`, `components/PlaceCard.jsx` |
| FR-003–004 | Details view, empty state | 4 | `components/PlaceDetails.jsx` |
| FR-005–006 | Category filter + list of categories | 4 | `components/CategoryFilter.jsx` |
| FR-007–008 | Distance in km from Ganemulla origin | 2 | `server/utils/distance.js` |
| FR-009 | "Distance unavailable" fallback | 3, 4 | `lib/constants.js` (`kmText`) |
| FR-010–011 | Details view: name, category, description | 4 | `components/PlaceDetails.jsx` |
| FR-012–013 | Opening hours + travel tips | 4 | `components/PlaceDetails.jsx` |
| FR-014–015 | Distance shown; "Not provided" fallbacks | 4 | `components/PlaceDetails.jsx` |
| FR-016–017 | Interactive map + marker | 5 | `components/MapView.jsx` |
| FR-018 | External map link | 5 | `components/PlaceDetails.jsx` |
| FR-019 | No-coords fallback | 5 | `components/MapView.jsx` |
| FR-020–021 | Plan add + remove | 6 | `hooks/useDayPlan.js` |
| FR-022 | No duplicate entries | 6 | `hooks/useDayPlan.js` |
| FR-023–024 | Reorder + ordered display | 6 | `components/PlanDrawer.jsx` |
| FR-025 | Summary count + cumulative km | 6 | `components/PlanDrawer.jsx` |
| FR-026 | Plan survives session (localStorage) | 6 | `hooks/useDayPlan.js` |
| FR-027 | Clear-all action | 6 | `components/PlanDrawer.jsx` |
| FR-028–029 | Admin gate + login form | 7 | `pages/AdminPage.jsx`, `admin/LoginForm.jsx` |
| FR-030–031 | Rejected logins + logout | 7 | `controllers/authController.js`, `services/auth.js` |
| FR-032 | Token-protected endpoints | 7 | `server/middleware/auth.js` |
| FR-033–035 | Create / update / delete places | 8 | `controllers/placeController.js` |
| FR-036 | Delete confirmation modal | 8 | `components/admin/PlaceTable.jsx` |
| FR-037 | Required-field validation | 8 | `server/models/place.js` |
| FR-038–039 | Structured categories + optional fields | 1, 8 | `server/models/place.js`, `admin/PlaceForm.jsx` |
| FR-040 | 25 km radius enforcement | 8 | `controllers/placeController.js` |
| NFR-004 | Disclaimer banner | 4 | `App.jsx` |
| NFR-005–006 | Auth middleware + bcrypt | 7 | `middleware/auth.js`, `seedDatabase.js` |
| NFR-007 | HTTPS in deployment | 10 | Render deployment |
| NFR-008 | Input sanitization/whitelisting | 1, 8 | `server/models/place.js` |
| NFR-010 | Missing fields never crash the app | 4–6 | fallbacks in details/planner |
| OR-001 | Data model fields | 1 | `server/models/place.js` |
| OR-002 | OSM attribution on the map | 5 | `components/MapView.jsx` |
| BR-001 | Places within 25 km | 8 | `placeController.js` |
| BR-002 | Only admins can write | 7–8 | `routes/placeRoutes.js` |
| BR-003 | ≥ 10 seed places | 1 | `server/data/seedPlaces.js` |
| Test safety net | 130 unit + 26 integration + 6 regression = **162 tests** | 9, 11 | `test/` suites, `vitest.*.config.js` |

---

## Appendix A — Command cheatsheet

| Command | When |
|---|---|
| `npm install` | After cloning the repo / adding a dependency |
| `npm run dev` | Daily development — starts **API (3000) + React (5173)** together |
| `npm run build` | Build React + Tailwind into `public/` (before `npm start` or deploy) |
| `npm start` | Serve **built app + API on port 3000** (what production runs) |
| `npm test` | Run the whole test suite once |
| `npm run test:watch` | Re-run tests on every save while writing them |
| `npm run test:coverage` | Coverage report |
| `npm run test:integration` | HTTP integration tests — real app vs real test database |
| `npm run test:regression` | Regression journeys J1–J6 (needs Atlas) |
| `npm run test:all` | Everything at once: unit (offline) + integration + regression |
| `node -v` / `npm -v` | Sanity check the Node environment |

## Appendix B — Glossary (all-in-one)

| Term | Meaning |
|---|---|
| API | URLs a server answers, so other programs (like your frontend) can request data |
| Atlas | MongoDB's official cloud hosting (free M0 tier used here) |
| Async | Work that finishes later (network, database); handled with `async/await` |
| bcrypt | One-way password scrambler — store the hash, never the plain password |
| Component | A reusable UI brick in React |
| Controller | The function doing the real work behind a route |
| CRUD | Create, Read, Update, Delete — the four basic database operations |
| Integration test | Parts working together: a real HTTP request through Express against a real (test) database |
| JSON | Text format that looks like JavaScript objects; the app's data language |
| JWT | Signed "hall pass" proving who you are, with an expiry time |
| Middleware | Code that runs before a request handler; e.g., login bouncer |
| Model | The code that defines + validates what a valid Place looks like |
| Props / State | Settings passed into a component / its own memory |
| Regression test | Re-checking already-working features after any change, so nothing breaks silently |
| REST | A style of API where URLs + HTTP verbs express everything (`GET /api/places`) |
| Route | One URL → one controller function |
| Seed | First-run script that pre-fills the database with starter data |
| supertest | The library that sends real HTTP requests to the Express app from inside a test |
| Tailwind | Styling via tiny utility classes instead of custom CSS files |
| Custom Hook | A `use...` function bundling reusable logic (e.g., `usePlaces`, `useDayPlan`) |

## Appendix C — Troubleshooting quick list

| Symptom | Likely fix |
|---|---|
| `MONGODB_URI is missing` | Fill in `.env` values, restart the server |
| DB connection timeout | Atlas → Network Access → allow `0.0.0.0/0` |
| `bad auth : authentication failed` | Wrong DB password, or special characters not URL-encoded |
| Page at 5173 loads but the list is empty | API isn't running — check the terminal running `npm run dev` |
| Styles missing / page looks plain | Tailwind failed to build — run `npm run build && npm start` (or restart `npm run dev`) |
| Map is grey / tiles missing | No internet to OSM tile servers, or the Leaflet CSS wasn't loaded |
| "Please log in again" on admin | Token expired (2 h) or `JWT_SECRET` changed — log in again |
| API returns 401 despite logging in | Token not attached — confirm the Authorization header is sent by `services/api.js` |

---

*Guide version 1.1 — matches this repo's file layout; adds Iteration 11 (integration + regression testing). Every iteration's end product is demoable; every requirement above is cross-checkable against one file.*
