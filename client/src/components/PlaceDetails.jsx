import { useEffect, useRef } from 'react';
import MapView from './MapView.jsx';
import TopoPattern from './TopoPattern.jsx';
import { CategoryIcon, ClockIcon, CompassIcon, MapPinIcon, PlusIcon, XIcon } from './Icons.jsx';
import { kmText, metaFor } from '../lib/constants.js';

// FR-003, FR-010 - FR-019: details modal with map and "Not provided" fallbacks.
export default function PlaceDetails({ place, inPlan, onAdd, onClose }) {
  const hasCoords = Number.isFinite(place.lat) && Number.isFinite(place.lng);
  const meta = metaFor(place.category);
  const closeRef = useRef(null);

  // Close on Escape and keep the page behind the modal from scrolling.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${place.name} details`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-ink-900/60 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl animate-rise-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div
          className={`relative shrink-0 overflow-hidden bg-gradient-to-br ${meta.band} px-5 py-5 text-white`}
        >
          <TopoPattern className="absolute inset-0 h-full w-full text-white/20" />
          <CategoryIcon
            category={place.category}
            className="pointer-events-none absolute -bottom-3 -right-2 h-24 w-24 text-white/15"
          />

          <div className="relative pr-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ring-inset ring-white/25">
              <CategoryIcon category={place.category} className="h-3.5 w-3.5" />
              {place.category}
            </span>
            <h2 className="mt-2.5 font-display text-2xl font-semibold leading-tight sm:text-3xl">
              {place.name}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
              <MapPinIcon className="h-3.5 w-3.5" />
              {kmText(place)}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/25 text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm transition hover:bg-ink-900/45"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-[15px] leading-relaxed text-ink-700">{place.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-sand-200 bg-sand-50 p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                <ClockIcon className="h-3.5 w-3.5" />
                Opening hours
              </p>
              <p className="mt-1.5 text-sm text-ink-800">{place.openingHours || 'Not provided'}</p>
            </div>
            <div className="rounded-xl border border-sand-200 bg-sand-50 p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                <CompassIcon className="h-3.5 w-3.5" />
                Travel tips
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-800">
                {place.travelTips || 'Not provided'}
              </p>
            </div>
          </div>

          {hasCoords ? (
            <div>
              <MapView place={place} />
              <p className="mt-1.5 text-[11px] text-ink-400">&copy; OpenStreetMap contributors</p>
            </div>
          ) : (
            <p className="rounded-xl border border-accent-200 bg-accent-50 p-3.5 text-sm text-accent-700">
              This place has no map coordinates yet.
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-sand-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => onAdd(place)}
            disabled={inPlan}
            className="btn-primary"
          >
            <PlusIcon className="h-4 w-4" />
            {inPlan ? 'Already in plan' : 'Add to plan'}
          </button>

          {hasCoords && (
            <a
              href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=15/${place.lat}/${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Open in OpenStreetMap
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
