// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDayPlan } from './useDayPlan.js';
import { PLAN_STORAGE_KEY } from '../lib/constants.js';

beforeEach(() => {
  localStorage.clear();
});

describe('useDayPlan - initial state (FR-020 - FR-027)', () => {
  it('starts with an empty plan', () => {
    const { result } = renderHook(() => useDayPlan());
    expect(result.current.ids).toEqual([]);
  });

  it('restores a previously saved plan from localStorage', () => {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(['b', 'a']));
    const { result } = renderHook(() => useDayPlan());
    expect(result.current.ids).toEqual(['b', 'a']);
  });

  it('recovers from corrupted (non-JSON) storage', () => {
    localStorage.setItem(PLAN_STORAGE_KEY, 'not-json{');
    const { result } = renderHook(() => useDayPlan());
    expect(result.current.ids).toEqual([]);
  });

  it('recovers from non-array JSON in storage', () => {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({ id: 'x' }));
    const { result } = renderHook(() => useDayPlan());
    expect(result.current.ids).toEqual([]);
  });
});

describe('useDayPlan - add / remove / clear', () => {
  it('adds an id', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => result.current.add('a'));
    expect(result.current.ids).toEqual(['a']);
  });

  it('does not add duplicates', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => result.current.add('a'));
    act(() => result.current.add('a'));
    expect(result.current.ids).toEqual(['a']);
  });

  it('removes an id', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => result.current.add('a'));
    act(() => result.current.add('b'));
    act(() => result.current.remove('a'));
    expect(result.current.ids).toEqual(['b']);
  });

  it('ignores removing an id that is not present', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => result.current.add('a'));
    act(() => result.current.remove('zzz'));
    expect(result.current.ids).toEqual(['a']);
  });

  it('clears the whole plan', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => result.current.add('a'));
    act(() => result.current.add('b'));
    act(() => result.current.clear());
    expect(result.current.ids).toEqual([]);
  });
});

describe('useDayPlan - move', () => {
  it('moves an item forward by swapping with its neighbour', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => ['a', 'b', 'c'].forEach((id) => result.current.add(id)));
    act(() => result.current.move(0, 1));
    expect(result.current.ids).toEqual(['b', 'a', 'c']);
  });

  it('moves an item backward', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => ['a', 'b', 'c'].forEach((id) => result.current.add(id)));
    act(() => result.current.move(2, -1));
    expect(result.current.ids).toEqual(['a', 'c', 'b']);
  });

  it('ignores a move past the end of the list', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => ['a', 'b'].forEach((id) => result.current.add(id)));
    act(() => result.current.move(1, 1));
    expect(result.current.ids).toEqual(['a', 'b']);
  });

  it('ignores a move before the start of the list', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => ['a', 'b'].forEach((id) => result.current.add(id)));
    act(() => result.current.move(0, -1));
    expect(result.current.ids).toEqual(['a', 'b']);
  });
});

describe('useDayPlan - retain (drop deleted places)', () => {
  it('drops ids that are no longer valid', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => ['a', 'b', 'c'].forEach((id) => result.current.add(id)));
    act(() => result.current.retain(['a', 'c']));
    expect(result.current.ids).toEqual(['a', 'c']);
  });

  it('keeps the same list reference when nothing is dropped', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => ['a', 'b'].forEach((id) => result.current.add(id)));
    const before = result.current.ids;
    act(() => result.current.retain(['a', 'b']));
    expect(result.current.ids).toBe(before);
  });
});

describe('useDayPlan - persistence', () => {
  it('writes the plan to localStorage whenever it changes', () => {
    const { result } = renderHook(() => useDayPlan());
    act(() => result.current.add('a'));
    expect(localStorage.getItem(PLAN_STORAGE_KEY)).toBe('["a"]');
    act(() => result.current.add('b'));
    expect(localStorage.getItem(PLAN_STORAGE_KEY)).toBe('["a","b"]');
    act(() => result.current.clear());
    expect(localStorage.getItem(PLAN_STORAGE_KEY)).toBe('[]');
  });
});
