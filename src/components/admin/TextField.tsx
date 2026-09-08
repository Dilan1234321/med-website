"use client";

import { useId } from "react";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "number" | "date";
  required?: boolean;
  helperText?: string;
};

export function TextField({ label, value, onChange, type = "text", required = false, helperText }: TextFieldProps) {
  const uid = useId();
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const id = `field-${uid}-${slug}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-maroon"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-bg px-3 py-2 text-base text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
      {helperText && <p className="text-xs text-ink-muted">{helperText}</p>}
    </div>
  );
}
