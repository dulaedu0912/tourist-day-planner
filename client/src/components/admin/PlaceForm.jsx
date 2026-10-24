import { useState } from 'react';
import { CATEGORIES } from '../../lib/constants.js';
import { XIcon } from '../Icons.jsx';

const EMPTY = {
  name: '',
  category: 'Nature',
  description: '',
  lat: '',
  lng: '',
  openingHours: '',
  travelTips: '',
};

// FR-033 / FR-034 / FR-037 / FR-039: one form for both add and edit.
export default function PlaceForm({ place, error, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, ...place });

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    const { _id, createdAt, distanceKm, ...body } = form; // server recalculates distance
    onSave(body);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-ink-900/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl animate-rise-in flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-sand-200 bg-sand-50 px-5 py-4">
          <div>
            <p className="eyebrow text-brand-700">{place._id ? 'Edit record' : 'New record'}</p>
            <h2 className="mt-0.5 font-display text-xl font-semibold text-ink-900">
              {place._id ? 'Edit place' : 'Add place'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Close">
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="p-name" className="mb-1.5 block text-sm font-medium text-ink-700">
              Name *
            </label>
            <input
              id="p-name"
              name="name"
              className="field"
              value={form.name}
              onChange={change}
              required
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="p-category" className="mb-1.5 block text-sm font-medium text-ink-700">
              Category *
            </label>
            <select
              id="p-category"
              name="category"
              className="field"
              value={form.category}
              onChange={change}
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-lat" className="mb-1.5 block text-sm font-medium text-ink-700">
                Latitude *
              </label>
              <input
                id="p-lat"
                name="lat"
                inputMode="decimal"
                className="field"
                placeholder="7.0736"
                value={form.lat}
                onChange={change}
                required
              />
            </div>
            <div>
              <label htmlFor="p-lng" className="mb-1.5 block text-sm font-medium text-ink-700">
                Longitude *
              </label>
              <input
                id="p-lng"
                name="lng"
                inputMode="decimal"
                className="field"
                placeholder="79.9989"
                value={form.lng}
                onChange={change}
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="p-description" className="mb-1.5 block text-sm font-medium text-ink-700">
              Description *
            </label>
            <textarea
              id="p-description"
              name="description"
              className="field resize-y"
              rows={3}
              value={form.description}
              onChange={change}
              required
              maxLength={2000}
            />
          </div>

          <div>
            <label htmlFor="p-hours" className="mb-1.5 block text-sm font-medium text-ink-700">
              Opening hours
            </label>
            <input
              id="p-hours"
              name="openingHours"
              className="field"
              placeholder="8:00 AM - 5:00 PM"
              value={form.openingHours || ''}
              onChange={change}
            />
          </div>

          <div>
            <label htmlFor="p-tips" className="mb-1.5 block text-sm font-medium text-ink-700">
              Travel tips
            </label>
            <input
              id="p-tips"
              name="travelTips"
              className="field"
              placeholder="Visit early morning"
              value={form.travelTips || ''}
              onChange={change}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">
              {error}
            </p>
          )}

          <div className="flex gap-2 border-t border-sand-200 pt-4 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Save place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
