export function Crest({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M18 44V20h8.2c4.6 0 7.4 2.4 7.4 6.2 0 2.6-1.4 4.6-3.7 5.5 2.8.8 4.5 3.1 4.5 6.1 0 4.3-3.1 6.2-8.1 6.2H18zm5.1-14.2h3.2c2.1 0 3.3-1 3.3-2.7s-1.2-2.6-3.3-2.6h-3.2v5.3zm0 4.2v5.6h3.8c2.3 0 3.6-1.1 3.6-2.9s-1.3-2.7-3.7-2.7h-3.7z"
        fill="currentColor"
      />
      <path
        d="M38 20h5.1l6.9 24h-5.4l-1.2-4.6H37l-1.2 4.6H30.5L38 20zm1.2 15.1h5.1l-2.5-9.4-2.6 9.4z"
        fill="currentColor"
      />
      <circle cx="32" cy="10" r="1.6" fill="currentColor" />
      <path
        d="M32 12.5v6M29 14.5h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
