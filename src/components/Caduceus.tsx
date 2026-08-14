export function Caduceus({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M60 28v118"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M48 22c0-8 5.5-14 12-14s12 6 12 14c0 5-3 9-7 11l-5 3-5-3c-4-2-7-6-7-11z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M52 18c2-4 5-6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M68 18c-2-4-5-6-8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M60 42c-18 8-28 18-28 30s14 18 28 22c14-4 28-10 28-22s-10-22-28-30z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 62c18 8 28 14 28 24s-12 16-28 20c-16-4-28-10-28-20s10-16 28-24z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M60 86c-14 6-22 12-22 20s10 14 22 17c12-3 22-9 22-17s-8-14-22-20z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M34 36c-10-2-18 4-18 14s10 16 20 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M86 36c10-2 18 4 18 14s-10 16-20 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="50" r="3" fill="currentColor" />
      <circle cx="104" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}
