# Unit Test Report — Local Tourist Day-Visit Planner

**Role:** Senior QA Engineer
**Date:** 2026-10-23
**Codebase:** `tourist-day-planner` v1.0.0 (Express 5 + MongoDB backend, React 19 + Vite frontend)
**Test framework:** Vitest 4.1.12 (+ Testing Library 16 & jsdom for DOM/hook tests)
**Status:** ✅ **PASS — 130/130 tests green**

---

## 1. Executive Summary

A comprehensive unit-test suite was designed and implemented for the application's
testable logic. **130 tests across 14 test files all pass**, achieving
**100 % statement / function / line coverage** and **99 % branch coverage** over the
defined unit-test scope (backend business logic + frontend services, hooks and libs).

The suite is fully deterministic — every external dependency (MongoDB, `fetch`,
`bcrypt` hashing in seed paths, JWT secrets, `localStorage`) is mocked or controlled,
so it runs offline with zero flakiness. It validates both **functional behaviour**
(traceable to the SRS functional requirements FR-001…FR-037) and **security-relevant
behaviour** (JWT handling, NoSQL-injection/prototype-pollution defences, and
user-enumeration resistance).

---

## 2. Scope & Approach

### 2.1 In scope (unit-tested)
| Layer | Modules |
|---|---|
| Server – utilities | `utils/distance.js` (Haversine) |
| Server – model/validation | `models/place.js` (`buildPlace`) |
| Server – middleware | `middleware/auth.js`, `middleware/asyncHandler.js` |
| Server – controllers | `controllers/authController.js`, `controllers/placeController.js` |
| Server – config | `config/db.js` |
| Server – seeding | `seed/seedDatabase.js` |
| Client – services | `services/api.js`, `services/auth.js` |
| Client – hooks | `hooks/usePlaces.js`, `hooks/useDayPlan.js` |
| Client – libs | `lib/constants.js`, `lib/images.js` |

### 2.2 Explicitly out of scope (unit level)
- **React UI components & pages** (`components/**`, `pages/**`) — rendering concerns,
  better covered by component/E2E tests (see Recommendations).
- **Express wiring** (`app.js`, `routes/**`) and the entrypoint (`index.js`) — HTTP
  plumbing & side-effects; belongs to integration testing.
- **Seed data** (`data/seedPlaces.js`) — static data, only asserted indirectly.

Coverage is measured **only over the in-scope logic modules**, so the reported number
reflects genuine unit-test quality rather than being diluted by UI/infra glue.

---

## 3. Tooling & Infrastructure Added

- **`vitest`** (dev) — chosen natively over Jest because the project is already Vite + ESM (`"type": "module"`); zero-config ESM, top-level `await`, and a `vi.mock` model well-suited to controller/middleware testing.
- **`@vitest/coverage-v8`** (dev) — V8 coverage provider.
- **`jsdom`, `@testing-library/react`, `@testing-library/dom`** (dev) — DOM + React-hook testing.
- **`vitest.config.js`** — dedicated test config (separate from the `root: 'client'` Vite build config), Node environment by default with per-file `@vitest-environment jsdom` opt-in for DOM tests, plus coverage scope.
- **`test/setup.js`** — global setup that installs a spec-compliant in-memory `localStorage` (see §6, Environment Finding).
- **`package.json` scripts:** `test`, `test:watch`, `test:coverage`.
- **`.gitignore`:** `coverage/` added.

---

## 4. Test Summary

| Metric | Value |
|---|---|
| Test files | **14** (all passing) |
| Total tests | **130** (all passing) |
| Failing / skipped | **0 / 0** |
| Approx. duration | ~4 s |

### 4.1 Per-file breakdown & SRS traceability

| # | Test file | Tests | Area covered (FR refs) |
|---|---|---:|---|
| 1 | `server/utils/distance.test.js` | 9 | Haversine distance, 25 km origin (FR-007/008, BR-001) |
| 2 | `server/models/place.test.js` | 21 | Field whitelist/type-check, category whitelist, coord validation, 25 km warning (FR-008/009/033/037, NFR-008) |
| 3 | `server/middleware/auth.test.js` | 12 | Token sign/verify, 2 h expiry, reject malformed/expired/forged, dev-secret fallback (FR-032, NFR-005) |
| 4 | `server/middleware/asyncHandler.test.js` | 5 | Promise-rejection → `next(err)`; sync-throw semantics |
| 5 | `server/controllers/authController.test.js` | 10 | Login success/failure, trimming, no user-enumeration, type guards (FR-029/030) |
| 6 | `server/controllers/placeController.test.js` | 15 | CRUD list/get/create/update/remove, 400/404/201 paths, ObjectId handling (FR-001/003/005/010-015/033/034/035) |
| 7 | `server/config/db.test.js` | 4 | `getDb` guard, connect + DB-name selection |
| 8 | `server/seed/seedDatabase.test.js` | 6 | Seed 10 places when empty, admin bcrypt hashing, env/default creds (BR-003, NFR-006) |
| 9 | `client/src/services/api.test.js` | 7 | Fetch wrapper: headers, token, body, error handling |
| 10 | `client/src/services/auth.test.js` | 4 | Admin token persistence (FR-026 style) |
| 11 | `client/src/hooks/usePlaces.test.js` | 3 | Load/error states, unmount guard (FR-001) |
| 12 | `client/src/hooks/useDayPlan.test.js` | 16 | Add/remove/move/clear/retain, no duplicates, persistence, corrupted-storage recovery (FR-020-027) |
| 13 | `client/src/lib/constants.test.js` | 10 | Category meta, distance text fallback (FR-009) |
| 14 | `client/src/lib/images.test.js` | 8 | Image-by-name matching, category fallback, CC-credit shape |
| | **Total** | **130** | |

---

## 5. Coverage Summary (in-scope logic)

```
Statements   : 100.00 %  (177 / 177)
Branches     :  99.04 %  (104 / 105)
Functions    : 100.00 %  ( 50 /  50)
Lines        : 100.00 %  (146 / 146)
```

**Note on the single uncovered "branch":** V8's native instrumentation reports
104/105. The one residual is a short-circuit expression in `authController`
(`admin && bcrypt.compare(...)`); the Istanbul-mapped coverage output shows **100 %**
for that file, and *both* logical paths (admin found vs. not-found) are explicitly
asserted by tests. This is a coverage-tooling artefact, **not** an untested code path.

---

## 6. Environment Finding (found & fixed during testing)

**Node 22+/25 ships a native `localStorage` global that is *inert*** unless the
`--localstorage-file` flag is supplied — it exists but has **no `getItem` / `setItem` /
`clear`**. In jsdom tests this shadowed the browser-like storage, breaking every
DOM/hook test with `localStorage.clear is not a function`.

**Resolution:** `test/setup.js` detects the broken ambient storage and installs a
spec-compliant in-memory `Storage` implementation. This is applied globally and only
when the real thing is absent, so it will never mask a genuine browser environment.

---

## 7. QA Observations & Findings

These are **not test failures** — the suite passes — but behaviours a reviewer should be
aware of, each verified by a test:

| # | Severity | Observation | Status |
|---|---|---|---|
| O-1 | **Medium** | `auth.js` falls back to a **hard-coded JWT secret** (`'dev-secret-change-me'`) when `JWT_SECRET` is unset. In production this would allow **forged tokens**. | Documented & tested. **Recommend:** fail fast at startup if `JWT_SECRET` is missing in production (mirror the existing `MONGODB_URI` guard in `index.js`). |
| O-2 | Low | `asyncHandler` only catches **promise rejections**, not *synchronous* throws (`Promise.resolve(fn(...))` evaluates `fn` before `.catch` attaches). All controllers here are `async`, and Express 5 also catches sync errors, so this is safe in practice. | Documented & tested. |
| O-3 | Low | `requireAuth` accepts a token **without the `Bearer ` prefix** (`.replace(/^Bearer /,'')` is lenient). Not a vulnerability (the token must still verify) but deviates from strict RFC 6750. | Documented & tested. |
| O-4 | Info (positive) | Login returns an **identical error** for unknown-user vs wrong-password → **no user enumeration**. | Verified by test. |
| O-5 | Info (positive) | `buildPlace` **whitelists fields & type-checks inputs** → NoSQL-injection and prototype-pollution vectors (`{ $gt: '' }`, `__proto__`, injected `_id`/`isAdmin`/`distanceKm`) are neutralised. | Verified by test. |
| O-6 | Info (positive) | Over-radius places produce a **warning** (not a rejection) at >25 km, matching the SRS intent. | Verified by test. |

---

## 8. Security-Relevant Assertions Included

- **Authentication:** valid / malformed / expired / wrong-secret tokens all correctly yield `401`; token carries the username and a 2-hour expiry.
- **Input hardening:** non-string & object payloads rejected; over-long text truncated; category strictly whitelisted; latitude/longitude range-validated (boundaries `±90` / `±180` accepted, `91`/`-181` rejected).
- **Data-integrity:** user-supplied `distanceKm` cannot override the computed value; unknown fields are stripped.
- **Credential handling:** only a bcrypt hash is stored; seed honours `ADMIN_USER`/`ADMIN_PASS` with safe defaults.

---

## 9. How to Run

```bash
npm test              # run the full unit suite (130 tests)
npm run test:watch    # watch mode
npm run test:coverage # suite + coverage report
```

---

## 10. Recommendations (next testing layers)

1. **Integration tests** (e.g. `supertest`) for `app.js` routes — covers the JSON 404 handler, the error middleware, static `/admin` serving, and end-to-end request auth-guarding (currently unit-exempt).
2. **Component & E2E tests** (Testing Library / Playwright) for the React UI — no component tests exist today; the planner, admin CRUD flows and map view are the highest-value targets.
3. **Production hardening:** add a startup guard that aborts when `JWT_SECRET` is unset in production (addresses O-1).
4. **CI gating:** wire `npm run test:coverage` into CI with thresholds (e.g. `lines ≥ 90`), and fail the pipeline on any regression.
5. **Mutation testing** (e.g. Stryker) as a follow-up to confirm assertion strength on the validation/auth logic.

---

*Prepared as part of a formal QA pass. All figures above are reproducible by running `npm test` / `npm run test:coverage` on this commit.*
