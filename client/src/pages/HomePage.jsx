import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import PlaceDetails from '../components/PlaceDetails.jsx';
import { InfoIcon, SearchIcon, XIcon } from '../components/Icons.jsx';
import { CATEGORIES } from '../lib/constants.js';
import { usePlaces } from '../hooks/usePlaces.js';

// Iteration 4: full browsing - category chips, search, count strip, details
// modal and the NFR-004 disclaimer banner.
export default function HomePage() {
  const { places, error, loading } = usePlaces();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

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

  return (
    <div className="min-h-screen">
      <Header placeCount={places.length} />

      {/* NFR-004 disclaimer */}
      <div className="border-b border-accent-200/70 bg-accent-50">
        <p className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-2.5 text-xs leading-relaxed text-accent-700">
          <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Opening hours, entry rules and travel tips can change. Please verify details before you
          travel.
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="mt-4 border-b border-sand-200/80 pb-4">
          <div className="relative w-full lg:max-w-md">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category or description"
              aria-label="Search places"
              className="field pl-11 pr-10"
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

          <div className="mt-3">
            <CategoryFilter value={category} onChange={setCategory} counts={counts} />
          </div>
        </section>

        <div className="mb-5 mt-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Places to explore
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            <span className="font-semibold text-ink-800">{shown.length}</span> of {places.length}{' '}
            places shown.
          </p>
        </div>

        {loading && <p className="text-sm text-ink-500">Loading places&hellip;</p>}

        {error && (
          <div className="card px-6 py-10 text-center">
            <p className="font-display text-xl font-semibold text-ink-900">Could not load places</p>
            <p className="mt-1 text-sm text-ink-500">{error}</p>
          </div>
        )}

        {!loading && !error && shown.length === 0 && (
          <div className="card px-6 py-10 text-center">
            <p className="font-display text-xl font-semibold text-ink-900">No places match</p>
            <p className="mt-1 text-sm text-ink-500">
              Try another keyword or set the category back to &laquo;All&raquo;.
            </p>
          </div>
        )}

        {!loading && shown.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Places">
            {shown.map((place) => (
              <PlaceCard key={place._id} place={place} onOpen={setSelected} />
            ))}
          </section>
        )}
      </main>

      {selected && <PlaceDetails place={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
