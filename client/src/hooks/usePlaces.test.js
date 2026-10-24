// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePlaces } from './usePlaces.js';
import { api } from '../services/api.js';

vi.mock('../services/api.js', () => ({ api: vi.fn() }));

beforeEach(() => {
  api.mockReset();
});

describe('usePlaces (FR-001)', () => {
  it('starts in a loading state and then resolves with places', async () => {
    api.mockResolvedValue([{ id: 1, name: 'A' }]);
    const { result } = renderHook(() => usePlaces());

    expect(result.current.loading).toBe(true);
    expect(result.current.places).toEqual([]);
    expect(result.current.error).toBe('');

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(api).toHaveBeenCalledWith('/api/places');
    expect(result.current.places).toEqual([{ id: 1, name: 'A' }]);
    expect(result.current.error).toBe('');
  });

  it('surfaces an error message and clears loading when the request fails', async () => {
    api.mockRejectedValue(new Error('Network down'));
    const { result } = renderHook(() => usePlaces());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network down');
    expect(result.current.places).toEqual([]);
  });

  it('does not update state when unmounted before the request resolves', async () => {
    let resolveApi;
    api.mockReturnValue(new Promise((resolve) => { resolveApi = resolve; }));
    const { result, unmount } = renderHook(() => usePlaces());

    unmount(); // triggers the `alive = false` cleanup guard
    resolveApi([{ id: 1 }]);
    await new Promise((r) => setTimeout(r, 0));

    expect(result.current.places).toEqual([]); // no post-unmount update
  });
});
