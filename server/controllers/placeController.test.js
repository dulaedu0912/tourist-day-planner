import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ObjectId } from 'mongodb';

vi.mock('../config/db.js', () => ({ getDb: vi.fn() }));
import { getDb } from '../config/db.js';
import { list, getOne, create, update, remove } from './placeController.js';

const collection = vi.fn();
const find = vi.fn();
const findOne = vi.fn();
const insertOne = vi.fn();
const updateOne = vi.fn();
const deleteOne = vi.fn();

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const validBody = () => ({
  name: 'Test Place',
  category: 'Nature',
  description: 'A place.',
  lat: '7.1',
  lng: '80.0',
  openingHours: '9-5',
  travelTips: 'tips',
});

beforeEach(() => {
  collection.mockReturnValue({ find, findOne, insertOne, updateOne, deleteOne });
  getDb.mockReturnValue({ collection });
  find.mockReset();
  findOne.mockReset();
  insertOne.mockReset();
  updateOne.mockReset();
  deleteOne.mockReset();
});

const chainResult = (value) => ({ sort: vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue(value) }) });

describe('list (FR-001 / FR-005)', () => {
  it('returns all places sorted by name', async () => {
    const places = [{ name: 'A' }, { name: 'B' }];
    const sortSpy = vi.fn().mockReturnValue({ toArray: vi.fn().mockResolvedValue(places) });
    find.mockReturnValue({ sort: sortSpy });
    const res = mockRes();

    await list({ query: {} }, res);

    expect(find).toHaveBeenCalledWith({});
    expect(sortSpy).toHaveBeenCalledWith({ name: 1 });
    expect(res.json).toHaveBeenCalledWith(places);
  });

  it('filters by category when provided', async () => {
    find.mockReturnValue(chainResult([]));
    await list({ query: { category: 'Nature' } }, mockRes());
    expect(find).toHaveBeenCalledWith({ category: 'Nature' });
  });

  it('truncates a long category filter to 50 characters', async () => {
    find.mockReturnValue(chainResult([]));
    const long = 'x'.repeat(80);
    await list({ query: { category: long } }, mockRes());
    expect(find).toHaveBeenCalledWith({ category: 'x'.repeat(50) });
  });
});

describe('getOne (FR-003 / FR-010 - FR-015)', () => {
  it('404s on an invalid ObjectId', async () => {
    const res = mockRes();
    await getOne({ params: { id: 'not-an-id' } }, res);
    expect(findOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Place not found.' });
  });

  it('404s when the place does not exist', async () => {
    findOne.mockResolvedValue(null);
    const res = mockRes();
    await getOne({ params: { id: new ObjectId().toString() } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns the place when found', async () => {
    const place = { _id: new ObjectId(), name: 'A' };
    findOne.mockResolvedValue(place);
    const res = mockRes();
    await getOne({ params: { id: place._id.toString() } }, res);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(place);
  });
});

describe('create (FR-033)', () => {
  it('400s on an invalid body without touching the DB', async () => {
    const res = mockRes();
    await create({ body: { name: '', category: 'Nope' } }, res);
    expect(insertOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error).toBeTruthy();
  });

  it('inserts and returns 201 with the new _id and a warning field', async () => {
    const insertedId = new ObjectId();
    insertOne.mockResolvedValue({ insertedId });
    const res = mockRes();

    await create({ body: validBody() }, res);

    const [doc] = insertOne.mock.calls[0];
    expect(doc.name).toBe('Test Place');
    expect(doc.createdAt).toBeInstanceOf(Date);
    expect(res.status).toHaveBeenCalledWith(201);
    const payload = res.json.mock.calls[0][0];
    expect(payload._id).toBe(insertedId);
    expect(payload.warning).toBe('');
  });
});

describe('update (FR-034)', () => {
  const id = () => new ObjectId().toString();

  it('404s on an invalid ObjectId', async () => {
    const res = mockRes();
    await update({ params: { id: 'bad' }, body: validBody() }, res);
    expect(updateOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('400s on an invalid body without touching the DB', async () => {
    const res = mockRes();
    await update({ params: { id: id() }, body: { name: '', category: 'x' } }, res);
    expect(updateOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('404s when nothing matched', async () => {
    updateOne.mockResolvedValue({ matchedCount: 0 });
    const res = mockRes();
    await update({ params: { id: id() }, body: validBody() }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates and returns the new values', async () => {
    updateOne.mockResolvedValue({ matchedCount: 1 });
    const _id = new ObjectId();
    const res = mockRes();

    await update({ params: { id: _id.toString() }, body: validBody() }, res);

    const [filter, updateDoc] = updateOne.mock.calls[0];
    expect(filter).toEqual({ _id });
    expect(updateDoc.$set.name).toBe('Test Place');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json.mock.calls[0][0]._id).toEqual(_id);
  });
});

describe('remove (FR-035)', () => {
  const id = () => new ObjectId().toString();

  it('404s on an invalid ObjectId', async () => {
    const res = mockRes();
    await remove({ params: { id: 'bad' } }, res);
    expect(deleteOne).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('404s when nothing was deleted', async () => {
    deleteOne.mockResolvedValue({ deletedCount: 0 });
    const res = mockRes();
    await remove({ params: { id: id() } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('deletes and returns { ok: true }', async () => {
    deleteOne.mockResolvedValue({ deletedCount: 1 });
    const _id = new ObjectId();
    const res = mockRes();

    await remove({ params: { id: _id.toString() } }, res);

    expect(deleteOne).toHaveBeenCalledWith({ _id });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});
