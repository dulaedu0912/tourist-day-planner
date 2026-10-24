// Iteration 3: simple header. The hero version lands with the planner (Iteration 6).
export default function Header({ placeCount = 0 }) {
  return (
    <header className="bg-brand-900 text-sand-50">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex flex-wrap items-center justify-between gap-2 py-4">
          <a href="/" className="leading-tight">
            <span className="block font-display text-base font-semibold">Ganemulla Day Trips</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-sand-200/80">
              Local tourist planner
            </span>
          </a>
          <p className="text-sm text-sand-100/80">{placeCount} places nearby</p>
        </nav>
      </div>
    </header>
  );
}
