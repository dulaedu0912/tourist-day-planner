import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';

// The middleware reads the secret at import time, so set it before the dynamic import.
process.env.JWT_SECRET = 'auth-middleware-test-secret';
const { requireAuth, signToken } = await import('./auth.js');

const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('signToken (FR-032 / NFR-005)', () => {
  it('returns a string token', () => {
    expect(typeof signToken('admin')).toBe('string');
  });

  it('produces a token that decodes back to the username', () => {
    const token = signToken('admin');
    const payload = jwt.verify(token, 'auth-middleware-test-secret');
    expect(payload.username).toBe('admin');
  });

  it('sets a 2-hour expiry', () => {
    const token = signToken('admin');
    const { exp, iat } = jwt.decode(token);
    expect(exp - iat).toBe(7200); // 2h in seconds
  });
});

describe('requireAuth', () => {
  it('accepts a valid Bearer token and sets req.admin', () => {
    const token = signToken('admin');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.admin.username).toBe('admin');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('accepts a raw token without the "Bearer " prefix (lenient parsing)', () => {
    const token = signToken('admin');
    const req = { headers: { authorization: token } };
    const next = vi.fn();
    requireAuth(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('rejects a request with no Authorization header', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Please log in again.' });
  });

  it('rejects an empty Authorization header', () => {
    const req = { headers: { authorization: '' } };
    const res = mockRes();
    requireAuth(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rejects a malformed token', () => {
    const req = { headers: { authorization: 'Bearer not-a-jwt' } };
    const res = mockRes();
    requireAuth(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rejects a token signed with the wrong secret', () => {
    const forged = jwt.sign({ username: 'admin' }, 'wrong-secret');
    const req = { headers: { authorization: `Bearer ${forged}` } };
    const res = mockRes();
    requireAuth(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rejects an expired token', () => {
    const expired = jwt.sign({ username: 'admin' }, 'auth-middleware-test-secret', { expiresIn: -10 });
    const req = { headers: { authorization: `Bearer ${expired}` } };
    const res = mockRes();
    requireAuth(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('default secret fallback (dev convenience)', () => {
  it('uses "dev-secret-change-me" when JWT_SECRET is unset', async () => {
    vi.resetModules();
    delete process.env.JWT_SECRET;
    const fresh = await import('./auth.js');
    const token = fresh.signToken('admin');
    expect(jwt.verify(token, 'dev-secret-change-me').username).toBe('admin');
  });
});
