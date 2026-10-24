import { describe, it, expect } from 'vitest';
import { CATEGORIES, buildPlace } from './place.js';
import { distanceKm } from '../utils/distance.js';

// A fully valid body used as the base for the happy-path tests.
const validBody = () => ({
  name: '  Henarathgoda Botanical Garden  ',
  category: 'Nature',
  description: 'A historic garden.',
  lat: '7.0936',
  lng: '80.0026',
  openingHours: '8:00 AM - 6:00 PM',
  travelTips: 'Bring water.',
});

describe('CATEGORIES whitelist', () => {
  it('contains exactly the six allowed categories', () => {
    expect(CATEGORIES).toEqual([
      'Nature',
      'Religious',
      'Dining',
      'Heritage',
      'Recreation',
      'Eco-Tourism',
    ]);
  });
});

describe('buildPlace - happy path (FR-033)', () => {
  it('builds a sanitized place and returns no warning for an in-range point', () => {
    const { place, warning, error } = buildPlace(validBody());
    expect(error).toBeUndefined();
    expect(warning).toBe('');
    expect(place).toEqual({
      name: 'Henarathgoda Botanical Garden', // trimmed
      category: 'Nature',
      description: 'A historic garden.',
      lat: 7.0936,
      lng: 80.0026,
      distanceKm: distanceKm(7.0936, 80.0026),
      openingHours: '8:00 AM - 6:00 PM',
      travelTips: 'Bring water.',
    });
  });

  it('whitelists fields - extra/unsafe keys are dropped (NoSQL-injection guard)', () => {
    const body = {
      ...validBody(),
      _id: 'should-not-appear',
      isAdmin: true,
      __proto__: { polluted: true },
      distanceKm: 9999, // computed value must win, not user input
      createdAt: 'nope',
    };
    const { place } = buildPlace(body);
    expect(Object.keys(place).sort()).toEqual(
      ['category', 'description', 'distanceKm', 'lat', 'lng', 'name', 'openingHours', 'travelTips'].sort()
    );
    expect(place.distanceKm).toBe(distanceKm(7.0936, 80.0026));
  });

  it('defaults optional openingHours/travelTips to empty strings', () => {
    const body = validBody();
    delete body.openingHours;
    delete body.travelTips;
    const { place } = buildPlace(body);
    expect(place.openingHours).toBe('');
    expect(place.travelTips).toBe('');
  });

  it('truncates over-long text fields to 2000 characters', () => {
    const body = { ...validBody(), name: 'N'.repeat(2500), description: 'D'.repeat(2500) };
    const { place } = buildPlace(body);
    expect(place.name).toHaveLength(2000);
    expect(place.description).toHaveLength(2000);
  });
});

describe('buildPlace - required fields (FR-037)', () => {
  it('rejects a missing name', () => {
    const body = validBody();
    delete body.name;
    expect(buildPlace(body).error).toBe('Name, category and description are required.');
  });

  it('rejects an empty/whitespace name', () => {
    expect(buildPlace({ ...validBody(), name: '   ' }).error).toMatch(/required/);
  });

  it('rejects a missing category', () => {
    const body = validBody();
    delete body.category;
    expect(buildPlace(body).error).toMatch(/required/);
  });

  it('rejects a missing description', () => {
    const body = validBody();
    delete body.description;
    expect(buildPlace(body).error).toMatch(/required/);
  });

  it('rejects a non-string name (type-check blocks injected objects)', () => {
    expect(buildPlace({ ...validBody(), name: { $gt: '' } }).error).toMatch(/required/);
  });
});

describe('buildPlace - category whitelist', () => {
  it('rejects a category outside the whitelist', () => {
    const { error } = buildPlace({ ...validBody(), category: 'Nightlife' });
    expect(error).toContain('Category must be one of');
    expect(error).toContain('Nature');
  });

  it('is case-sensitive (lowercase "nature" is rejected)', () => {
    expect(buildPlace({ ...validBody(), category: 'nature' }).error).toMatch(/Category must be one of/);
  });
});

describe('buildPlace - coordinate validation (FR-008)', () => {
  it('rejects non-numeric latitude', () => {
    expect(buildPlace({ ...validBody(), lat: 'abc' }).error).toMatch(/valid latitude/);
  });

  it('rejects missing latitude', () => {
    const body = validBody();
    delete body.lat;
    expect(buildPlace(body).error).toMatch(/valid latitude/);
  });

  it('rejects non-finite latitude (Infinity)', () => {
    expect(buildPlace({ ...validBody(), lat: 'Infinity' }).error).toMatch(/valid latitude/);
  });

  it('rejects latitude out of range (91)', () => {
    expect(buildPlace({ ...validBody(), lat: '91' }).error).toMatch(/valid latitude/);
  });

  it('rejects longitude out of range (-181)', () => {
    expect(buildPlace({ ...validBody(), lng: '-181' }).error).toMatch(/valid latitude/);
  });

  it('accepts the exact range boundaries (lat 90, lng -180)', () => {
    const { error, place } = buildPlace({ ...validBody(), lat: '90', lng: '-180' });
    expect(error).toBeUndefined();
    expect(place.lat).toBe(90);
    expect(place.lng).toBe(-180);
  });

  it('rejects an injected object as latitude (NoSQL guard)', () => {
    expect(buildPlace({ ...validBody(), lat: { $gt: 0 } }).error).toMatch(/valid latitude/);
  });
});

describe('buildPlace - distance warning (FR-009 / 25 km limit)', () => {
  it('adds a warning when the place is beyond MAX_KM', () => {
    const { warning } = buildPlace({ ...validBody(), lat: '7.5', lng: '80.5' });
    expect(warning).toMatch(/outside the 25 km limit/);
    expect(warning).toMatch(/km away/);
  });

  it('returns no warning for a place inside MAX_KM', () => {
    const { warning } = buildPlace(validBody());
    expect(warning).toBe('');
  });
});
