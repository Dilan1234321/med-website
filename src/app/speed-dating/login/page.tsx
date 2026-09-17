import { LoginForm } from "./LoginForm";

export default function SpeedDatingLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-muted px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-line bg-bg p-8">
        <h1 className="font-display text-xl font-semibold text-ink">Speed Dating</h1>
        <p className="-mt-4 text-center text-sm text-ink-muted">Enter the code brothers were given to start rating PNMs.</p>
        <LoginForm />
      </div>
    </div>
  );
}
