import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

// Loads all places once (FR-001). Filtering happens in the page, so it is instant.
export function usePlaces() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    api('/api/places')
      .then((data) => alive && setPlaces(data))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  return { places, error, loading };
}
