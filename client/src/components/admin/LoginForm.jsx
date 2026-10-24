import { useState } from 'react';

// FR-029 / FR-030: username + password form.
export default function LoginForm({ onLogin, error }) {
  const [creds, setCreds] = useState({ username: '', password: '' });

  const submit = (event) => {
    event.preventDefault();
    onLogin(creds);
  };

  return (
    <section className="card mx-auto max-w-sm animate-rise-in p-6 sm:p-8">
      <p className="eyebrow text-brand-700">Admin access</p>
      <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink-900">Log in</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
        Sign in to add, edit or delete places.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-ink-700">
            Username
          </label>
          <input
            id="username"
            className="field"
            autoComplete="username"
            value={creds.username}
            onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="field"
            autoComplete="current-password"
            value={creds.password}
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
            required
          />
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
        )}

        <button type="submit" className="btn-primary w-full">
          Log in
        </button>
      </form>
    </section>
  );
}
