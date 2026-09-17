"use client";

import { useState, useTransition } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login(code);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-ink">
          Brotherhood access code
        </label>
        <input
          id="code"
          type="password"
          autoComplete="off"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="rounded-lg border border-line bg-bg px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-maroon">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60">
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
