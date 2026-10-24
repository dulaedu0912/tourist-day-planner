// Haversine distance from the Ganemulla reference point (FR-007, FR-008, BR-001).
export const ORIGIN = { lat: 7.0736, lng: 79.9989 };
export const MAX_KM = 25;

export function distanceKm(lat, lng) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat - ORIGIN.lat);
  const dLng = rad(lng - ORIGIN.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(ORIGIN.lat)) * Math.cos(rad(lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
}
