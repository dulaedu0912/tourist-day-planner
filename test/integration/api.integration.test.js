// ============================================================
// Integration tests - the real HTTP API against a real database
// ============================================================
// Layer: INTEGRATION (supertest). Unlike the unit suite, here routes,
// middleware, controllers, the model and MongoDB are tested TOGETHER through
// the real server/app.js, with real HTTP requests and a real connection.
//
// Database: `touristPlannerTest` on the same Atlas cluster (see helpers.js) -
// cleared before every test, wiped again at the end. The real data is safe.
//
// Needs internet + Atlas. Run with: `npm run test:integration`

// helpers.js must be the first import - it switches to the test database.
import {
  startApp,
  closeApp,
  clearCollections,
  createTestAdmin,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  placeFixture,
  insertPlace,
} from './helpers.js';
import request from 'supertest';
import { beforeAll, afterAll, beforeEach, describe, test, expect } from 'vitest';
import { distanceKm, MAX_KM } from '../../server/utils/distance.js';

let app;

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await closeApp();
});

beforeEach(async () => {
  // Every test starts from an empty test database - fully deterministic.
  await clearCollections();
});

describe('Health & unknown routes', () => {
  test('GET /api/health answers 200 { ok: true }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  test('unknown /api route answers a JSON 404, never an HTML page', async () => {
    const res = await request(app).get('/api/definitely-not-real');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body.error).toBe('Not found.');
  });
});

describe('Public reading API (FR-001 - FR-005, FR-010 - FR-015)', () => {
  test('GET /api/places returns every stored place with its distance', async () => {
    const a = await insertPlace();
    const b = await insertPlace({ name: 'IT Fixture Temple', category: 'Religious' });

    const res = await request(app).get('/api/places');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);

    const names = res.body.map((p) => p.name);
    expect(names).toEqual(expect.arrayContaining([a.name, b.name]));

    const clean = res.body.find((p) => p.name === a.name);
    expect(clean.distanceKm).toBe(distanceKm(placeFixture().lat, placeFixture().lng));
    expect(clean.openingHours).toBe('6:00 AM - 7:00 PM');
  });

  test('GET /api/places?category= filters by category (FR-005)', async () => {
    await insertPlace({ category: 'Dining' });
    await insertPlace({ name: 'IT Fixture Park', category: 'Recreation' });

    const res = await request(app).get('/api/places?category=Dining');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].category).toBe('Dining');
  });

  test('an unknown category returns an empty list (not an error)', async () => {
    await insertPlace();
    const res = await request(app).get('/api/places?category=Spaceship');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /api/places/:id returns the full single place (FR-003)', async () => {
    const place = await insertPlace({ travelTips: 'Early mornings are best.' });

    const res = await request(app).get(`/api/places/${place._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('IT Fixture Garden');
    expect(res.body.travelTips).toBe('Early mornings are best.');
    expect(res.body).toHaveProperty('createdAt');
  });

  test('a valid-looking but unknown id answers 404', async () => {
    const res = await request(app).get('/api/places/64f0c0c0c0c0c0c0c0c0c0c0');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Place not found.');
  });

  test('a malformed id answers 404 (no crash)', async () => {
    const res = await request(app).get('/api/places/not-an-objectid-at-all');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Place not found.');
  });
});

describe('Authentication endpoint (FR-029 / FR-030)', () => {
  test('wrong password answers 401', async () => {
    await createTestAdmin();
    const res = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: 'totally-wrong' });
    expect(res.status).toBe(401);
  });

  test('unknown username gets the SAME error as a wrong password (no user enumeration)', async () => {
    await createTestAdmin();

    const wrongName = await request(app)
      .post('/api/login')
      .send({ username: 'ghost-user', password: 'whatever' });
    const wrongPass = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: 'whatever' });

    expect(wrongName.status).toBe(401);
    expect(wrongPass.status).toBe(401);
    expect(wrongName.body.error).toBe(wrongPass.body.error);
  });

  test('login validates input types (object instead of password string)', async () => {
    await createTestAdmin();
    const res = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: { $gt: '' } });
    expect(res.status).toBe(401);
  });

  test('valid credentials answer 200 with a Bearer-ready token', async () => {
    await createTestAdmin();
    const res = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.token.split('.')).toHaveLength(3); // header.payload.signature
  });
});

describe('Protected writes (FR-032, FR-033 - FR-040, BR-002)', () => {
  let token;

  beforeEach(async () => {
    await createTestAdmin();
    const login = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    token = login.body.token;
  });

  test('creating without a token answers 401', async () => {
    const res = await request(app).post('/api/places').send(placeFixture());
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Please log in again.');
  });

  test('creating with a forged token answers 401', async () => {
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', 'Bearer not.a.real.jwt')
      .send(placeFixture());
    expect(res.status).toBe(401);
  });

  test('the full CRUD cycle works end-to-end (FR-033 - FR-035)', async () => {
    // Create -> 201 with a server-computed distance
    const created = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(placeFixture({ name: 'IT CRUD Cycle' }));
    expect(created.status).toBe(201);
    expect(created.body.name).toBe('IT CRUD Cycle');
    expect(created.body.distanceKm).toBeGreaterThan(0);
    expect(created.body.warning).toBe('');

    // Update -> changed name persists
    const updated = await request(app)
      .put(`/api/places/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(placeFixture({ name: 'IT CRUD Cycle v2' }));
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('IT CRUD Cycle v2');

    // Delete -> { ok: true }, and afterwards the place is really gone
    const deleted = await request(app)
      .delete(`/api/places/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleted.status).toBe(200);
    expect(deleted.body).toEqual({ ok: true });

    const gone = await request(app).get(`/api/places/${created.body._id}`);
    expect(gone.status).toBe(404);
  });

  test('deleting an already-deleted place answers 404', async () => {
    const place = await insertPlace();
    const first = await request(app)
      .delete(`/api/places/${place._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(first.status).toBe(200);

    const second = await request(app)
      .delete(`/api/places/${place._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(second.status).toBe(404);
  });

  test('updating an unknown id answers 404 (FR-034 error path)', async () => {
    const res = await request(app)
      .put('/api/places/64f0c0c0c0c0c0c0c0c0c0c0')
      .set('Authorization', `Bearer ${token}`)
      .send(placeFixture());
    expect(res.status).toBe(404);
  });
});

describe('Input hardening over HTTP (FR-037, FR-040, NFR-008)', () => {
  let token;

  beforeEach(async () => {
    await createTestAdmin();
    const login = await request(app)
      .post('/api/login')
      .send({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
    token = login.body.token;
  });

  test.each([
    ['missing fields', { lng: 79.99 }],
    ['unknown category', placeFixture({ category: 'Spaceship' })],
    ['latitude out of range', placeFixture({ lat: 91 })],
    ['longitude out of range', placeFixture({ lng: 181 })],
    ['NoSQL injection operator as name', placeFixture({ name: { $gt: '' } })],
  ])('rejects %s with 400', async (_label, body) => {
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  test('a place beyond the 25 km limit is accepted with a warning (FR-040/BR-001)', async () => {
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(placeFixture({ name: 'IT Far Away', lat: 20, lng: 80 }));
    expect(res.status).toBe(201);
    expect(res.body.distanceKm).toBeGreaterThan(MAX_KM);
    expect(res.body.warning).toContain('outside the 25 km limit');
  });

  test('a client-supplied distanceKm can never override the computed value', async () => {
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .send(placeFixture({ distanceKm: 9999 }));
    expect(res.status).toBe(201);
    expect(res.body.distanceKm).toBe(distanceKm(placeFixture().lat, placeFixture().lng));
  });

  test('malformed JSON bodies are rejected with 400 (not a 500)', async () => {
    const res = await request(app)
      .post('/api/places')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('{"name": broken json');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toContain('application/json');
  });
});

describe('Security regression: private fields never leak into responses', () => {
  test('the admins collection shape is never part of the places response', async () => {
    await createTestAdmin();
    await insertPlace();

    const res = await request(app).get('/api/places');
    const place = res.body[0];
    expect(place).not.toHaveProperty('passwordHash');
    expect(place).not.toHaveProperty('password');
  });
});
