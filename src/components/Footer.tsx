import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-footer text-center text-white">
      <div className="flex items-center justify-center gap-3 px-5 py-12">
        <Image src="/images/logo.png" alt="Mu Epsilon Delta crest" width={32} height={32} className="h-8 w-8" />
        <span className="font-display text-base font-semibold tracking-tight">
          Mu Epsilon Delta
        </span>
      </div>
    </footer>
  );
}
