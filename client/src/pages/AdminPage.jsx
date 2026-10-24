import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { getToken, saveToken, clearToken } from '../services/auth.js';
import LoginForm from '../components/admin/LoginForm.jsx';

// Iteration 7: authentication only - login, logout and the signed-in shell.
// The full place CRUD dashboard arrives in Iteration 8.
export default function AdminPage() {
  const [token, setToken] = useState(getToken);
  const [places, setPlaces] = useState([]);
  const [loginError, setLoginError] = useState('');
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (token) loadPlaces();
  }, [token]);

  async function loadPlaces() {
    try {
      setPlaces(await api('/api/places'));
    } catch (err) {
      setBanner({ type: 'error', text: err.message });
    }
  }

  function logout() {
    clearToken();
    setToken('');
  }

  async function login(creds) {
    setLoginError('');
    try {
      const data = await api('/api/login', { method: 'POST', body: creds });
      saveToken(data.token);
      setToken(data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-brand-900 text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <a href="/" className="leading-tight">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-brand-200">
              Management
            </span>
            <span className="block font-display text-lg font-semibold">Admin panel</span>
          </a>
          {token && (
            <button type="button" onClick={logout} className="btn-dark">
              Log out
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {banner && (
          <p className="card border-accent-300 bg-accent-50 px-4 py-3 text-sm text-accent-700">
            {banner.text}
          </p>
        )}

        {!token && <LoginForm onLogin={login} error={loginError} />}

        {token && (
          <section className="space-y-4">
            <p className="text-sm text-ink-600">
              Signed in. {places.length} places are online - add/edit/delete arrives in Iteration 8.
            </p>
            <ul className="card divide-y divide-sand-200">
              {places.map((place) => (
                <li key={place._id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-medium text-ink-900">{place.name}</span>
                  <span className="text-ink-500">{place.category}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
