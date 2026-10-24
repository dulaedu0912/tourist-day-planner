// The place "model": the allowed categories and the validation used by every write.
import { distanceKm, MAX_KM } from '../utils/distance.js';

export const CATEGORIES = ['Nature', 'Religious', 'Dining', 'Heritage', 'Recreation', 'Eco-Tourism'];

const text = (value) => (typeof value === 'string' ? value.trim().slice(0, 2000) : '');

// FR-037 / NFR-008: type-check and whitelist every field (blocks NoSQL injection).
export function buildPlace(body = {}) {
  const name = text(body.name);
  const category = text(body.category);
  const description = text(body.description);
  const lat = Number(body.lat);
  const lng = Number(body.lng);

  if (!name || !category || !description) {
    return { error: 'Name, category and description are required.' };
  }
  if (!CATEGORIES.includes(category)) {
    return { error: `Category must be one of: ${CATEGORIES.join(', ')}.` };
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return { error: 'Enter a valid latitude (-90 to 90) and longitude (-180 to 180).' };
  }

  const distance = distanceKm(lat, lng);

  return {
    place: {
      name,
      category,
      description,
      lat,
      lng,
      distanceKm: distance,
      openingHours: text(body.openingHours),
      travelTips: text(body.travelTips),
    },
    warning: distance > MAX_KM ? `This place is ${distance} km away, outside the ${MAX_KM} km limit.` : '',
  };
}
