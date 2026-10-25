import { describe, it, expect } from 'vitest';
import { HERO_IMAGE, imageForPlace } from './images.js';

describe('imageForPlace', () => {
  it('returns null for a missing place', () => {
    expect(imageForPlace(null)).toBeNull();
    expect(imageForPlace(undefined)).toBeNull();
  });

  it('uses the imageUrl stored on the place', () => {
    const img = imageForPlace({
      name: 'Dutch Canal',
      imageUrl: 'https://cdn.example.com/canal.jpg',
    });
    expect(img.src).toBe('https://cdn.example.com/canal.jpg');
    expect(img.alt).toBe('Photo of Dutch Canal');
  });

  it('accepts a local /images path as well as an absolute URL', () => {
    expect(imageForPlace({ name: 'X', imageUrl: '/uploads/photo.webp' }).src).toBe(
      '/uploads/photo.webp'
    );
  });

  it('trims surrounding whitespace', () => {
    expect(imageForPlace({ name: 'X', imageUrl: '  https://cdn.example.com/a.jpg  ' }).src).toBe(
      'https://cdn.example.com/a.jpg'
    );
  });

  it('returns null when the place has no imageUrl (placeholder band shows)', () => {
    expect(imageForPlace({ name: 'Brand New Spot', category: 'Dining' })).toBeNull();
    expect(imageForPlace({ name: 'test', category: 'Nature' })).toBeNull();
  });

  it('returns null for an empty or whitespace-only imageUrl', () => {
    expect(imageForPlace({ name: 'X', imageUrl: '' })).toBeNull();
    expect(imageForPlace({ name: 'X', imageUrl: '   ' })).toBeNull();
  });

  it('returns null for a non-string imageUrl (no crash on bad data)', () => {
    expect(imageForPlace({ name: 'X', imageUrl: { $ne: null } })).toBeNull();
    expect(imageForPlace({ name: 'X', imageUrl: 42 })).toBeNull();
  });

  it('falls back to an empty alt when the place has no name', () => {
    expect(imageForPlace({ imageUrl: 'https://cdn.example.com/a.jpg' }).alt).toBe('');
  });

  it('never borrows another place photo: no name or category lookup remains', () => {
    // A place named like a seed entry but with no imageUrl stays blank, so a
    // stale bundle can never resurface the old hardcoded photos.
    expect(imageForPlace({ name: 'Henarathgoda Botanical Garden', category: 'Nature' })).toBeNull();
  });
});

describe('static image metadata', () => {
  it('HERO_IMAGE exposes desktop, mobile and alt', () => {
    expect(HERO_IMAGE.desktop).toMatch(/\.webp$/);
    expect(HERO_IMAGE.mobile).toMatch(/\.webp$/);
    expect(HERO_IMAGE.alt).toBeTruthy();
  });
});
