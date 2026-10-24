import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('mongodb', () => ({ MongoClient: vi.fn() }));

const URI = 'mongodb://unit-test';
let dbModule;

// Reset the module registry each time so the module-level `db` is null again.
beforeEach(async () => {
  vi.resetModules();
  process.env.MONGODB_URI = URI;
  delete process.env.DB_NAME;
  dbModule = await import('./db.js');
});

describe('getDb before connecting', () => {
  it('throws a clear error when the DB is not connected yet', () => {
    expect(() => dbModule.getDb()).toThrow(/Database is not connected yet/);
  });
});

describe('connectDB', () => {
  it('connects the client and defaults to the "touristPlanner" database', async () => {
    const { MongoClient } = await import('mongodb');
    const fakeDb = { name: 'touristPlanner' };
    const fakeClient = {
      connect: vi.fn().mockResolvedValue(undefined),
      db: vi.fn().mockReturnValue(fakeDb),
    };
    MongoClient.mockImplementation(function () {
      return fakeClient;
    });

    const returned = await dbModule.connectDB();

    expect(MongoClient).toHaveBeenCalledWith(URI);
    expect(fakeClient.connect).toHaveBeenCalledTimes(1);
    expect(fakeClient.db).toHaveBeenCalledWith('touristPlanner');
    expect(returned).toBe(fakeDb);
    expect(dbModule.getDb()).toBe(fakeDb);
  });

  it('honours an explicit DB_NAME (Atlas links with no db in the URI)', async () => {
    process.env.DB_NAME = 'customDB';
    const { MongoClient } = await import('mongodb');
    const fakeDb = { name: 'customDB' };
    const fakeClient = {
      connect: vi.fn().mockResolvedValue(undefined),
      db: vi.fn().mockReturnValue(fakeDb),
    };
    MongoClient.mockImplementation(function () {
      return fakeClient;
    });

    await dbModule.connectDB();
    expect(fakeClient.db).toHaveBeenCalledWith('customDB');
  });

  it('exposes the connected DB through getDb() after connectDB()', async () => {
    const { MongoClient } = await import('mongodb');
    const fakeDb = { marker: 42 };
    MongoClient.mockImplementation(function () {
      return {
        connect: vi.fn().mockResolvedValue(undefined),
        db: vi.fn().mockReturnValue(fakeDb),
      };
    });

    await dbModule.connectDB();
    expect(dbModule.getDb()).toBe(fakeDb);
  });
});
