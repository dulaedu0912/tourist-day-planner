import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from './asyncHandler.js';

const req = {};
const res = {};

describe('asyncHandler (FR-032 plumbing)', () => {
  it('invokes the wrapped function with (req, res, next)', () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const next = vi.fn();
    asyncHandler(fn)(req, res, next);
    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('does NOT call next when the handler resolves', async () => {
    const next = vi.fn();
    const wrapped = asyncHandler(async () => 'ok');
    await wrapped(req, res, next);
    await Promise.resolve(); // flush any trailing microtask
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with the error when an async handler rejects', async () => {
    const err = new Error('boom');
    const next = vi.fn();
    const wrapped = asyncHandler(async () => {
      throw err;
    });
    await wrapped(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('calls next with the error for a handler returning a rejected promise', async () => {
    const err = new Error('rejected');
    const next = vi.fn();
    await asyncHandler(() => Promise.reject(err))(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('documents behaviour: a synchronous throw propagates synchronously (not via next)', () => {
    // Promise.resolve(fn(...)) evaluates fn(...) first, so a *synchronous* throw
    // escapes before .catch attaches. Express catches sync throws itself, so this
    // is not a bug, but the behaviour is asserted here to make it explicit.
    const err = new Error('sync boom');
    const next = vi.fn();
    const wrapped = asyncHandler(() => {
      throw err;
    });
    expect(() => wrapped(req, res, next)).toThrow(err);
    expect(next).not.toHaveBeenCalled();
  });
});
