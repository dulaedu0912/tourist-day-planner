import { metaFor, shortKmText } from '../lib/constants.js';

// FR-002: name, category and distance on every card.
// Iteration 3 version: text-only artwork; photos arrive with the visual polish pass.
export default function PlaceCard({ place, onOpen }) {
  const meta = metaFor(place.category);

  return (
    <button
      type="button"
      onClick={() => onOpen(place)}
      className="card group flex flex-col overflow-hidden text-left transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <div className={`bg-gradient-to-br px-4 py-5 ${meta.band}`}>
        <span className="inline-flex items-center rounded-full bg-ink-900/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
          {place.category}
        </span>
        <p className="mt-2 text-[11px] font-medium text-white/90">{shortKmText(place)}</p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900">{place.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">{place.description}</p>

        <div className="mt-auto border-t border-sand-100 pt-3 text-right">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
            View details
          </span>
        </div>
      </div>
    </button>
  );
}
