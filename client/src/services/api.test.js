import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api.js';

const jsonResponse = (data, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
});

beforeEach(() => {
  globalThis.fetch = vi.fn();
});
afterEach(() => {
  delete globalThis.fetch;
});

describe('api() request shaping', () => {
  it('performs a GET with a JSON content-type header and no body', async () => {
    fetch.mockResolvedValue(jsonResponse([]));
    await api('/api/places');
    expect(fetch).toHaveBeenCalledWith('/api/places', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
  });

  it('sends method, Bearer token and a JSON body for a POST', async () => {
    fetch.mockResolvedValue(jsonResponse({ ok: true }));
    await api('/api/x', { method: 'POST', body: { a: 1 }, token: 'tok' });
    expect(fetch).toHaveBeenCalledWith('/api/x', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' },
      body: JSON.stringify({ a: 1 }),
    });
  });

  it('omits the Authorization header when no token is given', async () => {
    fetch.mockResolvedValue(jsonResponse({}));
    await api('/api/x', { method: 'POST', body: { a: 1 } });
    const [, opts] = fetch.mock.calls[0];
    expect(opts.headers).not.toHaveProperty('Authorization');
  });
});

describe('api() responses', () => {
  it('returns parsed JSON on success', async () => {
    fetch.mockResolvedValue(jsonResponse({ id: 1 }));
    await expect(api('/api/x')).resolves.toEqual({ id: 1 });
  });

  it('throws the server error message and attaches the status', async () => {
    fetch.mockResolvedValue(jsonResponse({ error: 'Nope.' }, { ok: false, status: 401 }));
    await expect(api('/api/x')).rejects.toThrow('Nope.');
    const err = await api('/api/x').catch((e) => e);
    expect(err.status).toBe(401);
  });

  it('falls back to a generic message when the server sends no error field', async () => {
    fetch.mockResolvedValue(jsonResponse({}, { ok: false, status: 500 }));
    const err = await api('/api/x').catch((e) => e);
    expect(err.message).toBe('Something went wrong.');
    expect(err.status).toBe(500);
  });

  it('handles a non-JSON error body without crashing', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.reject(new Error('not json')),
    });
    const err = await api('/api/x').catch((e) => e);
    expect(err.message).toBe('Something went wrong.');
    expect(err.status).toBe(502);
  });
});
