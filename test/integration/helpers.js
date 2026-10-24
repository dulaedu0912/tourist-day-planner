// Shared setup for the integration & regression suites.
//
// These tests exercise the REAL stack: the real Express app (server/app.js)
// against a REAL MongoDB database - a separate `touristPlannerTest` database on
// the SAME Atlas cluster, so the suite can never touch the real places data.

// NOTE: this import must come FIRST, before any other file touches process.env.
import 'dotenv/config';

// ---- Test-database isolation ----------------------------------------------
// `process.env.DB_NAME` is read inside connectDB() at call time, so setting it
// at module import time (here) is enough - every suite that imports this file
// connects to the test database, not to the production one.
process.env.DB_NAME = process.env.TEST_DB_NAME || 'touristPlannerTest';

import { connectDB, getDb, closeDB } from '../../server/config/db.js';
import bcrypt from 'bcryptjs';
import { distanceKm } from '../../server/utils/distance.js';
import app from '../../server/app.js';

let appReady = null;

/** Connects to Atlas once and returns the real Express app (for supertest). */
export function startApp() {
  if (!appReady) appReady = connectDB().then(() => app);
  return appReady;
}

export { getDb, closeDB };

export const ADMIN_USERNAME = 'it-admin';
export const ADMIN_PASSWORD = 'it-password-123';

/** Drops every document from the test collections (never the real database). */
export async function clearCollections() {
  const db = getDb();
  await db.collection('places').deleteMany({});
  await db.collection('admins').deleteMany({});
}

/** Same as clearCollections, but also closes the Mongo socket (end of run). */
export async function closeApp() {
  await clearCollections();
  await closeDB();
}

/** Creates one admin (bcrypt-hashed) directly in the test database. */
export async function createTestAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await getDb().collection('admins').insertOne({ username: ADMIN_USERNAME, passwordHash });
  return { username: ADMIN_USERNAME, password: ADMIN_PASSWORD };
}

/** Base place for tests, ~1 km from the Ganemulla origin. */
export function placeFixture(overrides = {}) {
  return {
    name: 'IT Fixture Garden',
    category: 'Nature',
    description: 'A place created for integration tests near Ganemulla.',
    lat: 7.08,
    lng: 79.99,
    openingHours: '6:00 AM - 7:00 PM',
    travelTips: 'Bring water.',
    ...overrides,
  };
}

/** Inserts a fixture with a computed distanceKm (exactly like the seed does). */
export async function insertPlace(overrides = {}) {
  const place = placeFixture(overrides);
  const doc = { ...place, distanceKm: distanceKm(place.lat, place.lng), createdAt: new Date() };
  const { insertedId } = await getDb().collection('places').insertOne(doc);
  return { ...doc, _id: insertedId };
}
