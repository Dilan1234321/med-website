import Link from "next/link";

function Paperclip() {
  return (
    <svg
      viewBox="0 0 40 90"
      className="absolute -top-8 left-10 h-16 w-auto -rotate-6 drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)] md:-top-10 md:h-20"
      aria-hidden
    >
      <path
        d="M20 4 C29 4 36 11 36 20 L36 62 C36 74 27 83 15 83 C6 83 0 76 0 68 L0 26 C0 20 5 15 11 15 C17 15 22 20 22 26 L22 60"
        fill="none"
        stroke="#c7ccd4"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M20 4 C29 4 36 11 36 20 L36 62 C36 74 27 83 15 83 C6 83 0 76 0 68 L0 26 C0 20 5 15 11 15 C17 15 22 20 22 26 L22 60"
        fill="none"
        stroke="#9aa0aa"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FolderHero() {
  return (
    <header className="pattern-maroon relative flex h-[100svh] items-center justify-center overflow-hidden">
      <div className="relative aspect-[3/4] w-[min(82vw,380px)] md:w-[min(48vw,480px)]">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-[10px] px-6 text-center"
          style={{
            backgroundColor: "var(--folder-cream)",
            backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0) 70%, var(--folder-cream-shadow) 100%)",
            boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
          }}
        >
          <p className="font-display text-[clamp(1.9rem,6vw,3.2rem)] leading-[1.05] text-[color:var(--maroon-pattern-base)]">
            The Future of
          </p>
          <p className="font-display text-[clamp(1.9rem,6vw,3.2rem)] leading-[1.05] text-[color:var(--maroon-pattern-base)]">
            Medicine
          </p>
          <p
            className="mt-4 text-2xl font-bold tracking-wide text-[#8a3b3b]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            ΜΕΔ
          </p>
          <div className="mt-7 flex justify-center">
            <Link
              href="/membership#register"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[color:var(--maroon)] px-8 text-sm font-bold tracking-wide text-white shadow-[0_10px_24px_rgba(28,7,7,0.3)] transition hover:bg-[color:var(--maroon-rich)]"
            >
              Register for Recruitment
            </Link>
          </div>
          <div
            className="absolute -right-2 top-1/3 h-16 w-4 rounded-l-md"
            style={{ backgroundColor: "var(--folder-cream)" }}
            aria-hidden
          />
        </div>

        <Paperclip />
      </div>
    </header>
  );
}
