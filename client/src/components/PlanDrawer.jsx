import { useEffect } from 'react';
import PlaceImage from './PlaceImage.jsx';
import TopoPattern from './TopoPattern.jsx';
import {
  CategoryIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  RouteIcon,
  TrashIcon,
  XIcon,
} from './Icons.jsx';
import { metaFor } from '../lib/constants.js';

// FR-020 - FR-027: the day-plan drawer with reorder, remove, clear and summary.
export default function PlanDrawer({ open, items, onClose, onRemove, onMove, onClear }) {
  const total = items.reduce((sum, p) => sum + (Number.isFinite(p.distanceKm) ? p.distanceKm : 0), 0);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-30 animate-fade-in bg-ink-900/50 backdrop-blur-sm" />

      <aside
        aria-label="My day plan"
        className="fixed inset-y-0 right-0 z-40 flex w-full max-w-md animate-slide-in flex-col border-l border-sand-200 bg-sand-50 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-sand-200 bg-white px-5 py-4">
          <div>
            <p className="eyebrow text-brand-700">Your route</p>
            <h2 className="mt-0.5 font-display text-2xl font-semibold text-ink-900">My day plan</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close planner">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="relative mb-5 overflow-hidden rounded-2xl bg-brand-900 p-4 text-white">
            <TopoPattern className="pointer-events-none absolute inset-0 h-full w-full text-white/10" />
            <div className="relative grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-brand-200">Places</p>
                <p className="mt-1 font-display text-3xl font-semibold leading-none">{items.length}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-brand-200">Distance</p>
                <p className="mt-1 font-display text-3xl font-semibold leading-none">
                  {total.toFixed(1)}
                  <span className="ml-1 text-sm font-medium text-brand-200">km</span>
                </p>
              </div>
            </div>
            <p className="relative mt-3 border-t border-white/15 pt-2.5 text-[11px] leading-relaxed text-brand-100">
              Combined distance of each stop from Ganemulla town centre. Reorder stops to match your
              route.
            </p>
          </div>

          {items.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-sand-300 bg-white/60 px-5 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <RouteIcon className="h-6 w-6" />
              </span>
              <p className="mt-3 font-display text-lg font-semibold text-ink-900">Nothing planned yet</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-500">
                Open a place and choose &quot;Add to plan&quot; to start building your day.
              </p>
            </div>
          )}

          {items.length > 0 && (
            <ol className="space-y-2.5">
              {items.map((place, index) => {
                const meta = metaFor(place.category);

                return (
                  <li
                    key={place._id}
                    className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-3 shadow-sm"
                  >
                    <span
                      className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${meta.band}`}
                    >
                      {/* Fallback artwork shows if the photo is missing. */}
                      <CategoryIcon
                        category={place.category}
                        className="absolute inset-0 m-auto h-5 w-5 text-white/40"
                      />
                      <PlaceImage
                        place={place}
                        alt=""
                        sizes="48px"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute -left-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-900 px-1 font-display text-[10px] font-semibold text-sand-50 ring-2 ring-white">
                        {index + 1}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{place.name}</p>
                      <p className="text-xs text-ink-500">
                        {Number.isFinite(place.distanceKm)
                          ? `~${place.distanceKm} km from town`
                          : 'Distance unavailable'}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => onMove(index, -1)}
                        disabled={index === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-sand-200 text-ink-500 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Move ${place.name} up`}
                      >
                        <ChevronUpIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMove(index, 1)}
                        disabled={index === items.length - 1}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-sand-200 text-ink-500 transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Move ${place.name} down`}
                      >
                        <ChevronDownIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(place._id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${place.name}`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="space-y-3 border-t border-sand-200 bg-white px-5 py-4">
          <p className="text-sm text-ink-600">
            {items.length === 0
              ? 'No places added yet.'
              : `${items.length} place${items.length > 1 ? 's' : ''} · about ${total.toFixed(1)} km total distance`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClear}
              className="btn-ghost flex-1"
              disabled={items.length === 0}
            >
              Clear all
            </button>
            <button type="button" onClick={onClose} className="btn-primary flex-1">
              Done
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
