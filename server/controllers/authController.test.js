import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

// Mock the DB module and fix the JWT secret before the controller is imported.
vi.mock('../config/db.js', () => ({ getDb: vi.fn() }));
process.env.JWT_SECRET = 'auth-controller-test-secret';

import { getDb } from '../config/db.js';
import jwt from 'jsonwebtoken';
const { login } = await import('./authController.js');

const REAL_HASH = await bcrypt.hash('correct-pass', 4);

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};
const findOne = vi.fn();
const collection = () => ({ findOne });
const body = (username, password) => ({ body: { username, password } });

beforeEach(() => {
  getDb.mockReturnValue({ collection });
  findOne.mockReset();
});

describe('login (FR-029 / FR-030)', () => {
  it('returns a signed token for valid credentials', async () => {
    findOne.mockResolvedValue({ username: 'admin', passwordHash: REAL_HASH });
    const res = mockRes();

    await login(body('admin', 'correct-pass'), res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledTimes(1);
    const { token } = res.json.mock.calls[0][0];
    expect(typeof token).toBe('string');
    expect(jwt.verify(token, 'auth-controller-test-secret').username).toBe('admin');
  });

  it('trims surrounding whitespace from the username before lookup', async () => {
    findOne.mockResolvedValue({ username: 'admin', passwordHash: REAL_HASH });
    await login(body('   admin  ', 'correct-pass'), mockRes());
    expect(findOne).toHaveBeenCalledWith({ username: 'admin' });
  });

  it('returns 401 for a wrong password', async () => {
    findOne.mockResolvedValue({ username: 'admin', passwordHash: REAL_HASH });
    const res = mockRes();
    await login(body('admin', 'wrong-pass'), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password.' });
  });

  it('returns 401 for an unknown user', async () => {
    findOne.mockResolvedValue(null);
    const res = mockRes();
    await login(body('nobody', 'x'), res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password.' });
  });

  it('uses an identical message for unknown-user and wrong-password (no user enumeration)', async () => {
    const a = mockRes();
    findOne.mockResolvedValue(null);
    await login(body('nobody', 'x'), a);

    const b = mockRes();
    findOne.mockResolvedValue({ username: 'admin', passwordHash: REAL_HASH });
    await login(body('admin', 'wrong'), b);

    expect(a.json.mock.calls[0][0]).toEqual(b.json.mock.calls[0][0]);
  });

  it('returns 401 when the username is missing (looked up as empty string)', async () => {
    findOne.mockResolvedValue(null);
    const res = mockRes();
    await login({ body: { password: 'x' } }, res);
    expect(findOne).toHaveBeenCalledWith({ username: '' });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('treats a non-string username as empty (type-check)', async () => {
    findOne.mockResolvedValue(null);
    const res = mockRes();
    await login(body({ $gt: '' }, 'x'), res);
    expect(findOne).toHaveBeenCalledWith({ username: '' });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when the password is missing', async () => {
    findOne.mockResolvedValue({ username: 'admin', passwordHash: REAL_HASH });
    const res = mockRes();
    await login({ body: { username: 'admin' } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 401 when there is no request body at all (optional-chaining guard)', async () => {
    findOne.mockResolvedValue(null);
    const res = mockRes();
    await login({}, res); // req.body is undefined
    expect(findOne).toHaveBeenCalledWith({ username: '' });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('propagates a database error (handled by asyncHandler -> 500)', async () => {
    findOne.mockRejectedValue(new Error('db down'));
    await expect(login(body('admin', 'x'), mockRes())).rejects.toThrow('db down');
  });
});
