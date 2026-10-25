// Place photos are not bundled with the frontend any more: each place stores
// its own `imageUrl` in MongoDB and the admin panel sets it.
// Only the header artwork ships with the app.

export const HERO_IMAGE = {
  desktop: '/images/hero-wetland-desktop.webp',
  mobile: '/images/hero-wetland-mobile.webp',
  alt: 'Wooden boardwalk winding through the mangroves at Beddagana Wetland Park',
};

// Returns { src, alt } for a place, or null when it has no photo.
// Null makes PlaceCard show its gradient + category icon placeholder.
export function imageForPlace(place) {
  if (!place) return null;

  const url = typeof place.imageUrl === 'string' ? place.imageUrl.trim() : '';
  if (!url) return null;

  return {
    src: url,
    alt: place.name ? `Photo of ${place.name}` : '',
  };
}
