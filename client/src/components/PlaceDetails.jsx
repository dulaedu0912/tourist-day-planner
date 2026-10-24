import { useEffect, useRef } from 'react';
import MapView from './MapView.jsx';
import { kmText } from '../lib/constants.js';

// FR-003, FR-010 - FR-018: details modal with "Not provided" fallbacks and the
// interactive OpenStreetMap view (added in Iteration 5).
export default function PlaceDetails({ place, onClose }) {
  const hasCoords = Number.isFinite(place.lat) && Number.isFinite(place.lng);
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/60 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="shrink-0 bg-brand-900 px-5 py-4 text-sand-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200">
                {place.category}
              </span>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight">{place.name}</h2>
              <p className="text-sm text-sand-200/90">{kmText(place)}</p>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} className="btn-dark">
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-[15px] leading-relaxed text-ink-700">{place.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-sand-200 bg-sand-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                Opening hours
              </p>
              <p className="mt-1.5 text-sm text-ink-800">{place.openingHours || 'Not provided'}</p>
            </div>
            <div className="rounded-xl border border-sand-200 bg-sand-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
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
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[11px] text-ink-400">&copy; OpenStreetMap contributors</p>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=15/${place.lat}/${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-brand-700 underline"
                >
                  Open in OpenStreetMap
                </a>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-accent-200 bg-accent-50 p-3.5 text-sm text-accent-700">
              This place has no map coordinates yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
