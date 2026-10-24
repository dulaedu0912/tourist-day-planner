// Decorative contour lines used behind hero panels and category bands.
export default function TopoPattern({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
      className={className}
    >
      <ellipse cx="330" cy="34" rx="128" ry="72" />
      <ellipse cx="330" cy="34" rx="94" ry="51" />
      <ellipse cx="330" cy="34" rx="60" ry="30" />
      <ellipse cx="330" cy="34" rx="26" ry="11" />
      <path d="M-30 168c70-30 120-5 170-20s80-45 140-30 80 55 150 30" />
      <path d="M-30 188c70-30 120-5 170-20s80-45 140-30 80 55 150 30" />
      <path d="M-30 148c70-30 120-5 170-20s80-45 140-30 80 55 150 30" />
      <path d="M-20 40c50-25 100 5 150-10s90-30 140-10" />
    </svg>
  );
}
