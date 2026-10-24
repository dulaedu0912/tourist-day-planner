import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { seedDatabase } from './seedDatabase.js';
import { SEED_PLACES } from '../data/seedPlaces.js';
import { distanceKm } from '../utils/distance.js';

vi.mock('bcryptjs', () => ({ default: { hash: vi.fn() } }));

function makeDb({ placeCount, adminExists }) {
  const places = {
    countDocuments: vi.fn().mockResolvedValue(placeCount),
    insertMany: vi.fn().mockResolvedValue({}),
  };
  const admins = {
    findOne: vi.fn().mockResolvedValue(adminExists ? { username: 'admin' } : null),
    insertOne: vi.fn().mockResolvedValue({}),
  };
  const db = { collection: vi.fn((name) => (name === 'places' ? places : admins)) };
  return { db, places, admins };
}

beforeEach(() => {
  vi.stubEnv('ADMIN_USER', 'admin');
  vi.stubEnv('ADMIN_PASS', 'admin123');
  bcrypt.hash.mockResolvedValue('HASHED');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('seedDatabase - places (BR-003)', () => {
  it('seeds all 10 places with computed distance + createdAt when the collection is empty', async () => {
    const { db, places } = makeDb({ placeCount: 0, adminExists: true });

    await seedDatabase(db);

    expect(places.insertMany).toHaveBeenCalledTimes(1);
    const [docs] = places.insertMany.mock.calls[0];
    expect(docs).toHaveLength(SEED_PLACES.length); // 10
    expect(docs).toHaveLength(10);

    docs.forEach((doc, i) => {
      expect(doc.name).toBe(SEED_PLACES[i].name);
      expect(doc.category).toBe(SEED_PLACES[i].category);
      expect(doc.distanceKm).toBe(distanceKm(SEED_PLACES[i].lat, SEED_PLACES[i].lng));
      expect(doc.createdAt).toBeInstanceOf(Date);
    });
  });

  it('does NOT reseed when places already exist', async () => {
    const { db, places } = makeDb({ placeCount: 5, adminExists: true });
    await seedDatabase(db);
    expect(places.insertMany).not.toHaveBeenCalled();
  });
});

describe('seedDatabase - admin (NFR-006)', () => {
  it('creates the admin with a bcrypt hash when missing', async () => {
    const { db, admins } = makeDb({ placeCount: 1, adminExists: false });

    await seedDatabase(db);

    expect(bcrypt.hash).toHaveBeenCalledWith('admin123', 10);
    expect(admins.findOne).toHaveBeenCalledWith({ username: 'admin' });
    expect(admins.insertOne).toHaveBeenCalledWith({ username: 'admin', passwordHash: 'HASHED' });
  });

  it('respects custom ADMIN_USER / ADMIN_PASS env values', async () => {
    vi.stubEnv('ADMIN_USER', 'root');
    vi.stubEnv('ADMIN_PASS', 'super-secret');
    const { db, admins } = makeDb({ placeCount: 1, adminExists: false });

    await seedDatabase(db);

    expect(admins.findOne).toHaveBeenCalledWith({ username: 'root' });
    expect(bcrypt.hash).toHaveBeenCalledWith('super-secret', 10);
    expect(admins.insertOne).toHaveBeenCalledWith({ username: 'root', passwordHash: 'HASHED' });
  });

  it('does NOT create the admin when one already exists', async () => {
    const { db, admins } = makeDb({ placeCount: 1, adminExists: true });

    await seedDatabase(db);

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(admins.insertOne).not.toHaveBeenCalled();
  });

  it('falls back to the default admin/admin123 when the env vars are unset', async () => {
    vi.unstubAllEnvs(); // remove the ADMIN_* stubs applied in beforeEach
    const { db, admins } = makeDb({ placeCount: 1, adminExists: false });

    await seedDatabase(db);

    expect(admins.findOne).toHaveBeenCalledWith({ username: 'admin' });
    expect(bcrypt.hash).toHaveBeenCalledWith('admin123', 10);
    expect(admins.insertOne).toHaveBeenCalledWith({ username: 'admin', passwordHash: 'HASHED' });
  });
});
