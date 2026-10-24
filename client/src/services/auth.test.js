// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { getToken, saveToken, clearToken } from './auth.js';

beforeEach(() => {
  localStorage.clear();
});

describe('admin token storage (FR-026 style persistence)', () => {
  it('returns an empty string when no token is stored', () => {
    expect(getToken()).toBe('');
  });

  it('saves and reads back a token', () => {
    saveToken('abc123');
    expect(getToken()).toBe('abc123');
  });

  it('overwrites an existing token', () => {
    saveToken('first');
    saveToken('second');
    expect(getToken()).toBe('second');
  });

  it('clears the stored token', () => {
    saveToken('abc123');
    clearToken();
    expect(getToken()).toBe('');
  });
});
