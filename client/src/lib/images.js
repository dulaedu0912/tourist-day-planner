// Local, licensed photography used across the site.
// Place photos are matched by name; anything new falls back to its category image.

export const HERO_IMAGE = {
  desktop: '/images/hero-wetland-desktop.webp',
  mobile: '/images/hero-wetland-mobile.webp',
  alt: 'Wooden boardwalk winding through the mangroves at Beddagana Wetland Park',
};

const PLACE_IMAGES = {
  'beddagana wetland park': {
    src: '/images/places/beddagana-wetland-park.webp',
    alt: 'A pond heron standing at the water\u2019s edge in Beddagana Wetland Park',
  },
  'colombo national museum': {
    src: '/images/places/colombo-national-museum.webp',
    alt: 'The white colonial facade of the Colombo National Museum',
  },
  'dutch canal': {
    src: '/images/places/dutch-canal.webp',
    alt: 'Boats and buildings along the Dutch Canal in Negombo',
  },
  'henarathgoda botanical garden': {
    src: '/images/places/henarathgoda-botanical-garden.webp',
    alt: 'Flower beds and mature trees at Henarathgoda Botanical Garden',
  },
  'kelaniya raja maha viharaya': {
    src: '/images/places/kelaniya-raja-maha-viharaya.webp',
    alt: 'A standing statue on the grounds of Kelaniya Raja Maha Viharaya',
  },
  'muthurajawela wetland visitor centre': {
    src: '/images/places/muthurajawela-wetland.webp',
    alt: 'Fishing boats on the Negombo lagoon at sunset',
    illustrative: true,
  },
  'pilikuttuwa forest & cave area': {
    src: '/images/places/pilikuttuwa-forest-caves.webp',
    alt: 'A cave temple beneath a rock overhang',
    illustrative: true,
  },
  'guruge nature park': {
    src: '/images/places/guruge-nature-park.webp',
    alt: 'A tree-lined fountain walk in a Colombo park',
    illustrative: true,
  },
  'paradise road the gallery cafe': {
    src: '/images/places/gallery-cafe.webp',
    alt: 'A spread of Sri Lankan rice and curry dishes',
    illustrative: true,
  },
  "upali's by nawaloka": {
    src: '/images/places/upalis.webp',
    alt: 'Close-up of a Sri Lankan chicken curry',
    illustrative: true,
  },
};

const CATEGORY_IMAGES = {
  Nature: {
    src: '/images/places/henarathgoda-botanical-garden.webp',
    alt: '',
    illustrative: true,
  },
  Religious: {
    src: '/images/places/kelaniya-raja-maha-viharaya.webp',
    alt: '',
    illustrative: true,
  },
  Dining: {
    src: '/images/places/gallery-cafe.webp',
    alt: '',
    illustrative: true,
  },
  Heritage: {
    src: '/images/places/pilikuttuwa-forest-caves.webp',
    alt: '',
    illustrative: true,
  },
  Recreation: {
    src: '/images/places/guruge-nature-park.webp',
    alt: '',
    illustrative: true,
  },
  'Eco-Tourism': {
    src: '/images/hero-wetland-desktop.webp',
    alt: '',
    illustrative: true,
  },
};

const normalize = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function imageForPlace(place) {
  if (!place) return null;
  return PLACE_IMAGES[normalize(place.name)] || CATEGORY_IMAGES[place.category] || null;
}
