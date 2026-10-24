// ================================================================
// Regression tests - the critical user journeys that must survive
// ================================================================
// A regression suite does not test new code - it re-verifies the FLOWS the app
// is already famous for, so no future change can quietly break them. Each
// `test` below is one end-to-end journey through the real app + real database.
//
// Journeys (traceable to the SRS):
//   J1  Seeding is idempotent (BR-003)
//   J2  Tourist listing shows every seeded place inside the 25 km limit (FR-001/007, BR-001)
//   J3  Admin lifecycle: login -> create -> edit -> delete -> gone (FR-028-035)
//   J4  Broken auth degrades safely, public data stays available (FR-032)
//   J5  Stored data is stable across reads (FR-010-015)
//   J6  Injection attempts cannot pollute stored data (NFR-008)
//
// Same runtime contract as the integration suite: real app + touristPlannerTest
// database on Atlas. Run with: `npm run test:regression`

// helpers.js must be the first import - it switches to the test database.
// (It lives in test/integration/ because it is shared by both suites.)
import {
  startApp,
  getDb,
  closeApp,
  clearCollections,
  createTestAdmin,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  insertPlace,
} from '../integration/helpers.js';
import request from 'supertest';
import { beforeAll, afterAll, describe, test, expect } from 'vitest';
// The REAL seeder and seed data - regression checks the actual startup path.
import { seedDatabase } from '../../server/seed/seedDatabase.js';
import { SEED_PLACES } from '../../server/data/seedPlaces.js';
import { MAX_KM } from '../../server/utils/distance.js';

let app;

beforeAll(async () => {
  app = await startApp();
  await clearCollections();
});

afterAll(async () => {
  await closeApp();
});

describe('Regression journeys', () => {
  test('J1 - seeding twice never duplicates anything (BR-003)', async () => {
    await clearCollections();
    await seedDatabase(getDb());
    await seedDatabase(getDb()); // restart-simulation: the seed runs again

    expect(await getDb().collection('places').countDocuments()).toBe(SEED_PLACES.length);
    expect(await getDb().collection('admins').countDocuments()).toBe(1);
  });

  test('J2 - tourists see every seeded place inside the 25 km radius (FR-001/007, BR-001)', async () => {
    await clearCollections();
    await seedDatabase(getDb());

    const res = await request(app).get('/api/places');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(SEED_PLACES.length);

    for (const place of res.body) {
      expect(Number.isFinite(place.distanceKm)).toBe(true);
      expect(place.distanceKm).toBeLessThanOrEqual(MAX_KM); // BR-001
      expect(typeof place.description).toBe('string');
      expect(place.description.length).toBeGreaterThan(0);
    }
  });

  test('J3 - admin lifecycle: login, create, edit, delete, tombstone (FR-028-035)', async () => {
    await clearCollections();
    await seedDatabase(getDb());
    await createTestAdmin();

    const login = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    const token = login.body.token;
    expect(login.status).toBe(200);

    // 1. create
    const created = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'IT Journey Bistro',
        category: 'Dining',
        description: 'Created during the regression journey.',
        lat: 7.09,
        lng: 79.98,
      });
    expect(created.status).toBe(201);
    const id = created.body._id;

    // 2. a tourist immediately sees it in the list
    let list = await request(app).get('/api/places');
    expect(list.body.some((p) => p.name === 'IT Journey Bistro')).toBe(true);

    // 3. admin edits it, and the tourist list reflects the new name
    const updated = await request(app)
      .put(`/api/places/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'IT Journey Bistro Renamed',
        category: 'Dining',
        description: 'Created during the regression journey.',
        lat: 7.09,
        lng: 79.98,
      });
    expect(updated.status).toBe(200);

    list = await request(app).get('/api/places');
    expect(list.body.some((p) => p.name === 'IT Journey Bistro Renamed')).toBe(true);
    expect(list.body.some((p) => p.name === 'IT Journey Bistro' && p._id === id)).toBe(false);

    // 4. delete, and the place disappears everywhere
    const removed = await request(app)
      .delete(`/api/places/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(removed.status).toBe(200);

    list = await request(app).get('/api/places');
    expect(list.body.some((p) => p._id === id)).toBe(false);

    const tombstone = await request(app).get(`/api/places/${id}`);
    expect(tombstone.status).toBe(404);
  });

  test('J4 - a broken token degrades safely; public data stays online (FR-032)', async () => {
    await clearCollections();
    await seedDatabase(getDb());

    const guarded = await request(app)
      .post('/api/places')
      .set('Authorization', 'Bearer forged.token.value')
      .send({
        name: 'IT Should Never Exist',
        category: 'Dining',
        description: 'Must not be stored.',
        lat: 7.09,
        lng: 79.98,
      });
    expect(guarded.status).toBe(401);

    // the rejected write never reached the database
    const list = await request(app).get('/api/places');
    expect(list.status).toBe(200);
    expect(list.body.some((p) => p.name === 'IT Should Never Exist')).toBe(false);
  });

  test('J5 - place data is stable across repeated reads (FR-010-015)', async () => {
    await clearCollections();
    const place = await insertPlace({ name: 'IT Stability Garden' });

    const first = await request(app).get(`/api/places/${place._id}`);
    const second = await request(app).get(`/api/places/${place._id}`);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(JSON.stringify(first.body)).toBe(JSON.stringify(second.body));
    expect(first.body.name).toBe('IT Stability Garden');
  });

  test('J6 - an injection attempt cannot pollute the collection (NFR-008)', async () => {
    await clearCollections();
    await seedDatabase(getDb());
    await createTestAdmin();

    const before = await getDb().collection('places').countDocuments();

    const login = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });

    const attack = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({
        name: { $gt: '' },
        category: { $ne: null },
        description: 'injection',
        lat: 7.09,
        lng: 79.98,
      });
    expect(attack.status).toBe(400);

    const after = await getDb().collection('places').countDocuments();
    expect(after).toBe(before); // nothing was stored
  });
});
