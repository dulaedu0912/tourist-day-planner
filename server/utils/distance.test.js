import { describe, it, expect } from 'vitest';
import { ORIGIN, MAX_KM, distanceKm } from './distance.js';

const toRad = (d) => (d * Math.PI) / 180;

// Independent cross-check using the spherical law of cosines (a different
// formula for the same great-circle distance) to guard against a shared bug.
function lawOfCosinesKm(lat, lng) {
  const R = 6371;
  const p1 = toRad(ORIGIN.lat);
  const p2 = toRad(lat);
  const dl = toRad(lng - ORIGIN.lng);
  const central = Math.acos(
    Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(dl)
  );
  return R * central;
}

describe('distance constants (FR-007/FR-008/BR-001)', () => {
  it('ORIGIN is the Ganemulla reference point', () => {
    expect(ORIGIN).toEqual({ lat: 7.0736, lng: 79.9989 });
  });

  it('MAX_KM is 25', () => {
    expect(MAX_KM).toBe(25);
  });
});

describe('distanceKm', () => {
  it('returns 0 for the origin itself', () => {
    expect(distanceKm(ORIGIN.lat, ORIGIN.lng)).toBe(0);
  });

  it('is ~11.1 km for 0.1 degrees of latitude (north and south)', () => {
    // 0.1 deg of latitude is ~11.12 km anywhere on Earth; rounds to 11.1.
    expect(distanceKm(ORIGIN.lat + 0.1, ORIGIN.lng)).toBe(11.1);
    expect(distanceKm(ORIGIN.lat - 0.1, ORIGIN.lng)).toBe(11.1);
  });

  it('rounds the result to exactly one decimal place', () => {
    // 0.1 deg lat computes to ~11.1195 km and must be reported as 11.1.
    const d = distanceKm(ORIGIN.lat + 0.1, ORIGIN.lng);
    expect(d).toBe(Math.round(d * 10) / 10);
  });

  it('matches an independent great-circle formula for several points', () => {
    const samples = [
      [7.2, 80.1],
      [6.9, 79.8],
      [7.5, 80.5],
      [6.5, 79.5],
      [7.0736, 80.5],
    ];
    for (const [lat, lng] of samples) {
      const actual = distanceKm(lat, lng);
      const expected = lawOfCosinesKm(lat, lng);
      // distanceKm is rounded to 0.1 km, so allow a small tolerance.
      expect(Math.abs(actual - expected)).toBeLessThan(0.2);
    }
  });

  it('is finite and positive for distant points (e.g. southern hemisphere)', () => {
    const d = distanceKm(-33.8688, 151.2093); // Sydney
    expect(Number.isFinite(d)).toBe(true);
    expect(d).toBeGreaterThan(MAX_KM);
  });

  it('treats a longitude offset as farther than the same latitude offset', () => {
    // 1 degree of longitude near the equator is ~110 km, much more than 0.1 deg lat.
    const latOffset = distanceKm(ORIGIN.lat + 1, ORIGIN.lng);
    const lngOffset = distanceKm(ORIGIN.lat, ORIGIN.lng + 1);
    expect(lngOffset).toBeLessThan(latOffset);
  });

  it('does not mutate the exported ORIGIN object', () => {
    distanceKm(90, 180);
    expect(ORIGIN).toEqual({ lat: 7.0736, lng: 79.9989 });
  });
});
