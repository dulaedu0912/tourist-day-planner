import { useEffect, useState } from 'react';
import { PLAN_STORAGE_KEY } from '../lib/constants.js';

function readSavedPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// FR-020 - FR-027: the one-day plan, saved in localStorage.
export function useDayPlan() {
  const [ids, setIds] = useState(readSavedPlan);

  useEffect(() => {
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const add = (id) => setIds((list) => (list.includes(id) ? list : [...list, id])); // no duplicates
  const remove = (id) => setIds((list) => list.filter((x) => x !== id));
  const clear = () => setIds([]);

  const move = (index, step) => {
    setIds((list) => {
      const target = index + step;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  // Drop saved ids that no longer exist (place deleted by an admin).
  const retain = (validIds) =>
    setIds((list) => {
      const next = list.filter((id) => validIds.includes(id));
      return next.length === list.length ? list : next;
    });

  return { ids, add, remove, move, clear, retain };
}
