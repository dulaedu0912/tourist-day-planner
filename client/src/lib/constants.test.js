import { describe, it, expect } from 'vitest';
import {
  CATEGORIES,
  FILTERS,
  BADGE,
  CATEGORY_META,
  DEFAULT_META,
  metaFor,
  PLAN_STORAGE_KEY,
  kmText,
  shortKmText,
} from './constants.js';

describe('category constants', () => {
  it('FILTERS prepends "All" to the category list', () => {
    expect(FILTERS).toEqual(['All', ...CATEGORIES]);
  });

  it('has a badge class and category meta for every category', () => {
    for (const cat of CATEGORIES) {
      expect(BADGE[cat]).toBeTruthy();
      expect(CATEGORY_META[cat]).toBeTruthy();
      expect(CATEGORY_META[cat].band).toBeTruthy();
    }
  });

  it('metaFor returns the category meta for a known category', () => {
    expect(metaFor('Nature')).toBe(CATEGORY_META.Nature);
  });

  it('metaFor falls back to DEFAULT_META for an unknown category', () => {
    expect(metaFor('Unknown')).toBe(DEFAULT_META);
    expect(metaFor(undefined)).toBe(DEFAULT_META);
  });

  it('PLAN_STORAGE_KEY matches the hook\'s storage key', () => {
    expect(PLAN_STORAGE_KEY).toBe('dayplan');
  });
});

describe('kmText / shortKmText (FR-009)', () => {
  it('formats a finite distance', () => {
    expect(kmText({ distanceKm: 5.2 })).toBe('~5.2 km from Ganemulla');
    expect(shortKmText({ distanceKm: 5.2 })).toBe('~5.2 km');
  });

  it('shows "Distance unavailable" when the distance is missing', () => {
    expect(kmText({})).toBe('Distance unavailable');
    expect(shortKmText({})).toBe('Distance N/A');
  });

  it('shows "Distance unavailable" for NaN', () => {
    expect(kmText({ distanceKm: NaN })).toBe('Distance unavailable');
  });

  it('treats a non-numeric distance as unavailable (Number.isFinite guard)', () => {
    expect(kmText({ distanceKm: '5.2' })).toBe('Distance unavailable');
    expect(shortKmText({ distanceKm: '5.2' })).toBe('Distance N/A');
  });

  it('treats a zero distance as valid (origin)', () => {
    expect(kmText({ distanceKm: 0 })).toBe('~0 km from Ganemulla');
  });
});
