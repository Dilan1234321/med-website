"use client";

import { FormEvent, useState } from "react";

type FieldErrors = Record<string, string>;

export function RushForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const next: FieldErrors = {};
    if (!String(data.name || "").trim()) next.name = "Name is required.";
    if (!String(data.email || "").trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email)))
      next.email = "Enter a valid email.";
    if (!String(data.year || "").trim()) next.year = "Class year is required.";
    if (!String(data.pathway || "").trim())
      next.pathway = "Select a pathway.";

    if (Object.keys(next).length) {
      setErrors(next);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/rush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors || {});
        setMessage(json.message || "Unable to submit. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setMessage(json.message || "You’re registered. We’ll be in touch.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6" noValidate>
      <Field
        label="Full name"
        name="name"
        error={errors.name}
        autoComplete="name"
        required
      />
      <Field
        label="Email"
        name="email"
        type="email"
        error={errors.email}
        autoComplete="email"
        required
      />
      <Field
        label="Class year"
        name="year"
        placeholder="e.g. 2028"
        error={errors.year}
        required
      />
      <div>
        <label htmlFor="pathway" className="mb-1.5 block text-sm font-medium">
          Pathway interest
        </label>
        <select
          id="pathway"
          name="pathway"
          className="w-full border border-line bg-bg px-3 py-2.5 text-ink"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.pathway)}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="MD">MD</option>
          <option value="DO">DO</option>
          <option value="PA">PA</option>
          <option value="Dental">Dental</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Nursing">Nursing</option>
          <option value="Other">Other pre-health</option>
        </select>
        {errors.pathway ? (
          <p className="mt-1 text-sm text-error" role="alert">
            {errors.pathway}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="w-full border border-line bg-bg px-3 py-2.5 text-ink"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting…" : "Register to Rush"}
      </button>
      {message ? (
        <p
          className={`text-sm ${status === "success" ? "text-success" : "text-error"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const next: FieldErrors = {};
    if (!String(data.name || "").trim()) next.name = "Name is required.";
    if (!String(data.email || "").trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email)))
      next.email = "Enter a valid email.";
    if (!String(data.reason || "").trim()) next.reason = "Select a reason.";
    if (!String(data.message || "").trim()) next.message = "Message is required.";

    if (Object.keys(next).length) {
      setErrors(next);
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors || {});
        setMessage(json.message || "Unable to send. Try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setMessage(json.message || "Message sent. We’ll reply soon.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4 p-6" noValidate>
      <Field label="Full name" name="name" error={errors.name} required />
      <Field
        label="Email"
        name="email"
        type="email"
        error={errors.email}
        required
      />
      <div>
        <label htmlFor="reason" className="mb-1.5 block text-sm font-medium">
          Reason for inquiry
        </label>
        <select
          id="reason"
          name="reason"
          className="w-full border border-line bg-bg px-3 py-2.5 text-ink"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.reason)}
        >
          <option value="" disabled>
            Select one
          </option>
          <option value="recruitment">Recruitment / rush</option>
          <option value="programming">Programming question</option>
          <option value="alumni">Alumni / mentorship</option>
          <option value="donation">Donation</option>
          <option value="other">Other</option>
        </select>
        {errors.reason ? (
          <p className="mt-1 text-sm text-error" role="alert">
            {errors.reason}
          </p>
        ) : null}
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full border border-line bg-bg px-3 py-2.5 text-ink"
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <p className="mt-1 text-sm text-error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      {message ? (
        <p
          className={`text-sm ${status === "success" ? "text-success" : "text-error"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  error,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  error?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = name;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="w-full border border-line bg-bg px-3 py-2.5 text-ink"
      />
      {error ? (
        <p className="mt-1 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
