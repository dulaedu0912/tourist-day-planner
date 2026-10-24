import TopoPattern from './TopoPattern.jsx';
import PlaceImage from './PlaceImage.jsx';
import { CategoryIcon, ClockIcon } from './Icons.jsx';
import { metaFor, shortKmText } from '../lib/constants.js';

// FR-002: name, category and distance on every card.
export default function PlaceCard({ place, onOpen }) {
  const meta = metaFor(place.category);

  return (
    <button
      type="button"
      onClick={() => onOpen(place)}
      className="card group flex flex-col overflow-hidden text-left transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
    >
      <div className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${meta.band}`}>
        {/* Fallback artwork sits behind the photo and shows if the image fails. */}
        <TopoPattern className="absolute inset-0 h-full w-full text-white/20" />
        <CategoryIcon
          category={place.category}
          className="absolute right-4 top-4 h-10 w-10 text-white/30"
        />

        <PlaceImage
          place={place}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-ink-900/30" />

        <span className="absolute left-4 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-ink-900/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
          <CategoryIcon category={place.category} className="h-3.5 w-3.5" />
          {place.category}
        </span>

        <span className="absolute bottom-3.5 left-4 rounded-full bg-ink-900/45 px-2.5 py-1 text-[11px] font-medium text-white/95 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
          {shortKmText(place)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-900 transition group-hover:text-brand-800">
          {place.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">{place.description}</p>

        <div className="mt-auto space-y-3 pt-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <ClockIcon className="h-3.5 w-3.5 text-ink-400" />
            <span className="truncate">{place.openingHours || 'Hours not listed'}</span>
          </p>
          <div className="flex items-center justify-between border-t border-sand-100 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
              View details
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
              &rarr;
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
