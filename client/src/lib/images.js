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

const commons = 'https://commons.wikimedia.org/wiki/';

// Shown in the footer credits panel. Required by the CC licences.
export const PHOTO_CREDITS = [
  {
    label: 'Beddagana boardwalk',
    author: 'Rashod Sithumka',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:Bridge_over_Nature.jpg`,
  },
  {
    label: 'Beddagana heron',
    author: 'Malitha Daminda',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:At_the_Beddagana_Wetlands_IMG_1568a.jpg`,
  },
  {
    label: 'Colombo National Museum',
    author: 'Hasindu2008',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: `${commons}File:Colombo_National_Museum_Sri_Lanka.JPG`,
  },
  {
    label: 'Dutch Canal, Negombo',
    author: 'Steffen Schmitz',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:Negombo,_Dutch_Canal,_2025-07_CN-01.jpg`,
  },
  {
    label: 'Henarathgoda Botanical Garden',
    author: 'L Manju',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:Henarathgoda_Botanical_Garden.jpg`,
  },
  {
    label: 'Kelaniya Raja Maha Viharaya',
    author: 'Jorge L\u00e1scar',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    source: `${commons}File:Kelaniya_Temple_(Kelaniya_Raja_Maha_Vihara)_(5439887839).jpg`,
  },
  {
    label: 'Negombo lagoon at sunset',
    author: 'Sahan177',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:Sunsets_at_negombo_lagoon.jpg`,
  },
  {
    label: 'Dambulla cave temple',
    author: 'Philip Nalangan',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    source: `${commons}File:Dambulla_Cave_1.jpg`,
  },
  {
    label: 'Viharamahadevi Park',
    author: 'Alexey Komarov',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    source: `${commons}File:Viharamahadevi_Park,_Colombo_-_panoramio.jpg`,
  },
  {
    label: 'Sri Lankan rice and curry',
    author: 'Lankan Foodie',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:Sri_Lankan_Rice_and_Curry.jpg`,
  },
  {
    label: 'Sri Lankan chicken curry',
    author: 'Swarnamala Priyadarshani',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    source: `${commons}File:Sri_lankan_chicken_curry.jpg`,
  },
];
