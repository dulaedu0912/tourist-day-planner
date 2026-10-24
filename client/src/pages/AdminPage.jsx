import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { getToken, saveToken, clearToken } from '../services/auth.js';
import LoginForm from '../components/admin/LoginForm.jsx';
import PlaceTable from '../components/admin/PlaceTable.jsx';
import PlaceForm from '../components/admin/PlaceForm.jsx';
import TopoPattern from '../components/TopoPattern.jsx';
import { MapPinIcon } from '../components/Icons.jsx';

export default function AdminPage() {
  const [token, setToken] = useState(getToken);
  const [places, setPlaces] = useState([]);
  const [loginError, setLoginError] = useState('');
  const [banner, setBanner] = useState(null);
  const [editing, setEditing] = useState(null); // null = closed, {} = new place
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (token) loadPlaces();
  }, [token]);

  async function loadPlaces() {
    try {
      setPlaces(await api('/api/places'));
    } catch (err) {
      if (err.status === 401) logout('Your session ended. Please log in again.');
      else setBanner({ type: 'error', text: err.message });
    }
  }

  function logout(message = '') {
    clearToken();
    setToken('');
    setLoginError(message);
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

  function openForm(place = null) {
    setFormError('');
    setBanner(null);
    setEditing(place || {}); // empty object = "add new"
  }

  async function save(body) {
    try {
      const saved = editing._id
        ? await api(`/api/places/${editing._id}`, { method: 'PUT', body, token })
        : await api('/api/places', { method: 'POST', body, token });

      setEditing(null);
      await loadPlaces();
      if (saved.warning) setBanner({ type: 'warning', text: saved.warning });
    } catch (err) {
      if (err.status === 401) logout('Your session ended. Please log in again.');
      else setFormError(err.message);
    }
  }

  async function remove(place) {
    if (!confirm(`Delete "${place.name}"? This cannot be undone.`)) return;

    try {
      await api(`/api/places/${place._id}`, { method: 'DELETE', token });
      await loadPlaces();
    } catch (err) {
      if (err.status === 401) logout('Your session ended. Please log in again.');
      else setBanner({ type: 'error', text: err.message });
    }
  }

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden bg-brand-900 text-white">
        <TopoPattern className="pointer-events-none absolute inset-0 h-full w-full text-white/10" />
        <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sand-50">
              <MapPinIcon className="h-4 w-4" />
            </span>
            <span className="leading-tight">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-brand-200">Management</span>
              <span className="block font-display text-lg font-semibold">Admin panel</span>
            </span>
          </a>
          <a href="/" className="btn-dark">
            View site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!token && <LoginForm onLogin={login} error={loginError} />}

        {token && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow text-brand-700">Directory</p>
                <h2 className="mt-0.5 font-display text-2xl font-semibold tracking-tight text-ink-900">
                  Places
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  {places.length} place{places.length === 1 ? '' : 's'} in the database
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openForm()} className="btn-primary">
                  + Add place
                </button>
                <button type="button" onClick={() => logout()} className="btn-ghost">
                  Log out
                </button>
              </div>
            </div>

            {banner && (
              <p
                className={`rounded-xl border p-3 text-sm ${
                  banner.type === 'error'
                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                    : 'border-accent-200 bg-accent-50 text-accent-700'
                }`}
              >
                {banner.text}
              </p>
            )}

            <PlaceTable places={places} onEdit={openForm} onDelete={remove} />
          </section>
        )}
      </main>

      {editing && (
        <PlaceForm
          key={editing._id || 'new'}
          place={editing}
          error={formError}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
