import { FILTERS } from '../lib/constants.js';
import { CategoryIcon, CompassIcon } from './Icons.jsx';

// FR-005 / FR-006: category filter buttons with live counts.
export default function CategoryFilter({ value, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((name) => {
        const active = name === value;
        const count = counts[name];

        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            aria-pressed={active}
            className={`chip ${active ? 'chip-active' : ''}`}
          >
            {name === 'All' ? (
              <CompassIcon className="h-3.5 w-3.5" />
            ) : (
              <CategoryIcon category={name} className="h-3.5 w-3.5" />
            )}
            {name}
            {typeof count === 'number' && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  active ? 'bg-white/20 text-white' : 'bg-sand-100 text-ink-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
