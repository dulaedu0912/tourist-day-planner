import Header from '../components/Header.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import { usePlaces } from '../hooks/usePlaces.js';

// Iteration 3: the browse page skeleton - live places in a responsive grid.
// Category filter, search and the details modal arrive in Iteration 4.
export default function HomePage() {
  const { places, error, loading } = usePlaces();

  return (
    <div className="min-h-screen">
      <Header placeCount={places.length} />

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-5 mt-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Places to explore
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Gardens, temples, wetlands and family stops within 25 km of Ganemulla.
          </p>
        </div>

        {loading && <p className="text-sm text-ink-500">Loading places&hellip;</p>}

        {error && (
          <div className="card px-6 py-10 text-center">
            <p className="font-display text-xl font-semibold text-ink-900">Could not load places</p>
            <p className="mt-1 text-sm text-ink-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Places">
            {places.map((place) => (
              <PlaceCard key={place._id} place={place} onOpen={() => {}} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
