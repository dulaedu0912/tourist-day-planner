// Shared values used by more than one component.

export const CATEGORIES = ['Nature', 'Religious', 'Dining', 'Heritage', 'Recreation', 'Eco-Tourism'];

export const FILTERS = ['All', ...CATEGORIES];

export const BADGE = {
  Nature: 'bg-emerald-100 text-emerald-800',
  Religious: 'bg-amber-100 text-amber-800',
  Dining: 'bg-rose-100 text-rose-800',
  Heritage: 'bg-stone-100 text-stone-800',
  Recreation: 'bg-sky-100 text-sky-800',
  'Eco-Tourism': 'bg-teal-100 text-teal-800',
};

// Visual identity for each category (gradient band on cards and modals).
export const CATEGORY_META = {
  Nature: { band: 'from-emerald-600 to-emerald-800', chip: 'bg-emerald-100 text-emerald-800' },
  Religious: { band: 'from-amber-500 to-amber-700', chip: 'bg-amber-100 text-amber-800' },
  Dining: { band: 'from-rose-500 to-rose-700', chip: 'bg-rose-100 text-rose-800' },
  Heritage: { band: 'from-stone-500 to-stone-700', chip: 'bg-stone-100 text-stone-800' },
  Recreation: { band: 'from-sky-500 to-sky-700', chip: 'bg-sky-100 text-sky-800' },
  'Eco-Tourism': { band: 'from-teal-500 to-teal-700', chip: 'bg-teal-100 text-teal-800' },
};

export const DEFAULT_META = { band: 'from-brand-600 to-brand-800', chip: 'bg-brand-100 text-brand-800' };

export const metaFor = (category) => CATEGORY_META[category] || DEFAULT_META;

export const PLAN_STORAGE_KEY = 'dayplan';

// FR-009: "Distance unavailable" when the number is missing.
export const kmText = (place) =>
  Number.isFinite(place.distanceKm) ? `~${place.distanceKm} km from Ganemulla` : 'Distance unavailable';

// Short version for compact badges.
export const shortKmText = (place) =>
  Number.isFinite(place.distanceKm) ? `~${place.distanceKm} km` : 'Distance N/A';
