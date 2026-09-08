import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-muted px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-line bg-bg p-8">
        <h1 className="text-xl font-semibold text-ink">MED Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
}
