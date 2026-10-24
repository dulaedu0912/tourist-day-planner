import { describe, it, expect } from 'vitest';
import { HERO_IMAGE, imageForPlace } from './images.js';

describe('imageForPlace', () => {
  it('returns null for a missing place', () => {
    expect(imageForPlace(null)).toBeNull();
    expect(imageForPlace(undefined)).toBeNull();
  });

  it('matches a place by its exact name', () => {
    const img = imageForPlace({ name: 'Dutch Canal', category: 'Heritage' });
    expect(img.src).toBe('/images/places/dutch-canal.webp');
    expect(img.alt).toBeTruthy();
  });

  it('normalizes case, padding and repeated whitespace when matching', () => {
    const img = imageForPlace({ name: '  BEDDAGANA    WETLAND  PARK ', category: 'Eco-Tourism' });
    expect(img.src).toBe('/images/places/beddagana-wetland-park.webp');
  });

  it('matches names containing punctuation (apostrophes)', () => {
    const img = imageForPlace({ name: "Upali's by Nawaloka", category: 'Dining' });
    expect(img.src).toBe('/images/places/upalis.webp');
  });

  it('falls back to the category image when the name is unknown', () => {
    const img = imageForPlace({ name: 'Some Brand New Attraction', category: 'Religious' });
    expect(img.src).toBe('/images/places/kelaniya-raja-maha-viharaya.webp');
    expect(img.illustrative).toBe(true);
  });

  it('returns null when neither the name nor the category is known', () => {
    expect(imageForPlace({ name: 'Unknown', category: 'Unlisted' })).toBeNull();
  });

  it('returns null when the place has no name and no known category', () => {
    expect(imageForPlace({ category: 'Nope' })).toBeNull();
  });
});

describe('static image metadata', () => {
  it('HERO_IMAGE exposes desktop, mobile and alt', () => {
    expect(HERO_IMAGE.desktop).toMatch(/\.webp$/);
    expect(HERO_IMAGE.mobile).toMatch(/\.webp$/);
    expect(HERO_IMAGE.alt).toBeTruthy();
  });
});
