export default function CompassMark({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M16 9.4L7 27M16 9.4L25 27"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M10.6 21.5H21.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7" cy="27" r="1.2" fill="currentColor" />
      <circle cx="25" cy="27" r="1.2" fill="currentColor" />
    </svg>
  );
}
