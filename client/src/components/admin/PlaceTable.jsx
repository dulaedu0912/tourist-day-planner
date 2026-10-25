import { BADGE } from '../../lib/constants.js';
import { CategoryIcon } from '../Icons.jsx';
import PlaceImage from '../PlaceImage.jsx';

// FR-035 / FR-036: the place list with Edit and Delete actions.
export default function PlaceTable({ places, onEdit, onDelete }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-sand-200 bg-sand-100 text-[10px] uppercase tracking-[0.14em] text-ink-500">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Name</th>
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Distance</th>
              <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-sand-100">
            {places.map((place) => (
              <tr key={place._id} className="transition hover:bg-sand-50/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <PlaceImage
                      place={place}
                      className="h-9 w-9 shrink-0 rounded-lg border border-sand-200 object-cover"
                    />
                    <span className="font-medium text-ink-900">{place.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      BADGE[place.category] || 'bg-sand-100 text-ink-600'
                    }`}
                  >
                    <CategoryIcon category={place.category} className="h-3.5 w-3.5" />
                    {place.category}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-ink-600">
                  {Number.isFinite(place.distanceKm) ? `${place.distanceKm} km` : '—'}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => onEdit(place)} className="btn-ghost px-3 py-1.5">
                      Edit
                    </button>
                    <button type="button" onClick={() => onDelete(place)} className="btn-danger px-3 py-1.5">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {places.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-ink-500">
                  No places yet. Add the first one with the button above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
