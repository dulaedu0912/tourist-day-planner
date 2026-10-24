import TopoPattern from './TopoPattern.jsx';
import { ArrowRightIcon, MapPinIcon, RouteIcon } from './Icons.jsx';
import { HERO_IMAGE } from '../lib/images.js';

export default function Header({ planCount, placeCount = 0, onOpenPlan }) {
  return (
    <header className="relative isolate overflow-hidden bg-brand-900 text-sand-50">
      <picture>
        <source media="(max-width: 767px)" srcSet={HERO_IMAGE.mobile} />
        <img
          src={HERO_IMAGE.desktop}
          alt={HERO_IMAGE.alt}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-900/95 via-brand-900/75 to-brand-900/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-900/85 via-transparent to-brand-900/30 sm:hidden" />

      <div className="relative mx-auto max-w-6xl px-4">
        <nav className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 py-4 sm:gap-3">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sand-50 ring-1 ring-inset ring-white/25">
              <MapPinIcon className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold text-sand-50">
                Ganemulla Day Trips
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-sand-200/80">
                Local tourist planner
              </span>
            </span>
          </a>

          <div className="flex items-center gap-2">
            <a
              href="/admin"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-sand-100/80 underline-offset-4 transition hover:text-white hover:underline sm:inline"
            >
              Admin
            </a>
            <button
              type="button"
              onClick={onOpenPlan}
              className="btn bg-sand-50 px-3 text-brand-900 shadow-sm hover:bg-white sm:px-4"
            >
              <RouteIcon className="h-4 w-4" />
              My plan
              <span className="rounded-full bg-brand-900/10 px-2 py-0.5 text-xs font-semibold">
                {planCount}
              </span>
            </button>
          </div>
        </nav>

        <div className="grid gap-8 pb-10 pt-8 lg:grid-cols-[1.55fr_1fr] lg:items-end lg:pb-14">
          <div>
            <p className="eyebrow flex items-center gap-2 text-brand-100">
              <span className="inline-block h-px w-6 bg-brand-200/70" />
              Ganemulla &middot; Western Province &middot; 25 km radius
            </p>

            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-sand-50 sm:text-5xl lg:text-[3.4rem]">
              Good days start in Ganemulla.
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-sand-100/90">
              Gardens, temples, wetlands and family stops within a short ride of town. Browse what&apos;s
              nearby, build a route for the day, and take it easy.
            </p>

            <dl className="mt-7 flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-10">
              {[
                { label: 'Places to visit', value: placeCount || '—' },
                { label: 'Categories', value: 6 },
                { label: 'Search radius', value: '25 km' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-sand-200/70">{stat.label}</dt>
                  <dd className="mt-0.5 font-display text-xl font-semibold text-sand-50">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md lg:block">
            <TopoPattern className="pointer-events-none absolute inset-0 h-full w-full text-white/10" />
            <div className="relative">
              <p className="eyebrow text-brand-100">Your day</p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-4xl font-semibold leading-none text-sand-50">
                    {planCount}
                  </p>
                  <p className="mt-1 text-sm text-sand-100/80">
                    {planCount === 1 ? 'place' : 'places'} in your plan
                  </p>
                </div>
                <button type="button" onClick={onOpenPlan} className="btn-dark">
                  Open
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 border-t border-white/15 pt-3 text-xs leading-relaxed text-sand-200/75">
                Your plan is saved in this browser. Add stops, reorder them, then head out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
