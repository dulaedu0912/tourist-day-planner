import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import PlaceDetails from '../components/PlaceDetails.jsx';
import PlanDrawer from '../components/PlanDrawer.jsx';
import { AlertIcon, CompassIcon, InfoIcon, SearchIcon, XIcon } from '../components/Icons.jsx';
import { CATEGORIES } from '../lib/constants.js';
import { usePlaces } from '../hooks/usePlaces.js';
import { useDayPlan } from '../hooks/useDayPlan.js';

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="h-28 animate-pulse bg-sand-200" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-sand-200" />
        <div className="h-3 w-full animate-pulse rounded-full bg-sand-100" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-sand-100" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-sand-100" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { places, error, loading } = usePlaces();
  const plan = useDayPlan();

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [planOpen, setPlanOpen] = useState(false);

  // Remove plan entries for places that were deleted by an admin.
  useEffect(() => {
    if (places.length) plan.retain(places.map((p) => p._id));
  }, [places]);

  // FR-005 + search: filtering is pure client-side, so it is instant (NFR-002).
  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return places.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term)
    );
  }, [places, category, search]);

  // Counts follow the search term but ignore the active category, so chips stay useful.
  const counts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matching = places.filter((p) =>
      `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term)
    );

    return {
      All: matching.length,
      ...Object.fromEntries(
        CATEGORIES.map((name) => [name, matching.filter((p) => p.category === name).length])
      ),
    };
  }, [places, search]);

  const planPlaces = plan.ids.map((id) => places.find((p) => p._id === id)).filter(Boolean);
  const hasFilters = category !== 'All' || search.trim() !== '';

  const clearFilters = () => {
    setCategory('All');
    setSearch('');
  };

  return (
    <div className="min-h-screen">
      <Header planCount={plan.ids.length} placeCount={places.length} onOpenPlan={() => setPlanOpen(true)} />

      {/* NFR-004 disclaimer */}
      <div className="border-b border-accent-200/70 bg-accent-50">
        <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2.5 text-xs leading-relaxed text-accent-700">
          <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Opening hours, entry rules and travel tips can change. Please verify details before you travel.
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="sticky top-0 z-20 -mx-4 border-b border-sand-200/80 bg-sand-50/90 px-4 py-4 backdrop-blur-md">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category or description"
                aria-label="Search places"
                className="field pl-11 pr-10 [&::-webkit-search-cancel-button]:hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 transition hover:bg-sand-100 hover:text-ink-700"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>

            <p className="text-sm text-ink-500 lg:text-right">
              <span className="font-semibold text-ink-800">{shown.length}</span> of {places.length} places
              {category !== 'All' && (
                <>
                  {' '}
                  in <span className="font-medium text-ink-700">{category}</span>
                </>
              )}
            </p>
          </div>

          <div className="mt-3">
            <CategoryFilter value={category} onChange={setCategory} counts={counts} />
          </div>
        </section>

        <div className="mb-5 mt-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
              Places to explore
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Open a card for hours, travel tips and a map.
            </p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-brand-700 underline-offset-4 transition hover:text-brand-900 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading places">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </section>
        )}

        {error && (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertIcon className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-ink-900">Could not load places</p>
            <p className="mt-1 max-w-md text-sm text-ink-500">{error}</p>
            <p className="mt-3 text-xs text-ink-400">Check your connection and refresh the page.</p>
          </div>
        )}

        {!loading && !error && shown.length === 0 && (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <CompassIcon className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-ink-900">No places found</p>
            <p className="mt-1 max-w-md text-sm text-ink-500">
              Try another category or a shorter search term.
            </p>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-ghost mt-5">
                Clear filters
              </button>
            )}
          </div>
        )}

        {!error && shown.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((place) => (
              <PlaceCard key={place._id} place={place} onOpen={setSelected} />
            ))}
          </section>
        )}
      </main>

      <footer className="border-t border-sand-200 bg-sand-100">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-base font-semibold text-ink-900">Ganemulla Day Trips</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">
              A simple planner for a slow day out around town.
            </p>
          </div>
          <div>
            <p className="eyebrow text-ink-500">Good to know</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Distances are measured from Ganemulla town centre. Hours and entry rules are checked
              before you travel.
            </p>
          </div>
          <div>
            <p className="eyebrow text-ink-500">Credits</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Map data &copy; OpenStreetMap contributors.
            </p>
            <a
              href="/admin"
              className="mt-2 inline-block text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
            >
              Admin panel
            </a>
          </div>
        </div>
      </footer>

      <PlanDrawer
        open={planOpen}
        items={planPlaces}
        onClose={() => setPlanOpen(false)}
        onRemove={plan.remove}
        onMove={plan.move}
        onClear={plan.clear}
      />

      {selected && (
        <PlaceDetails
          place={selected}
          inPlan={plan.ids.includes(selected._id)}
          onAdd={() => plan.add(selected._id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
