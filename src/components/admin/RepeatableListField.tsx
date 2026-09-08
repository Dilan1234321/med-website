"use client";

import type { ReactNode } from "react";

type RepeatableListFieldProps<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel: string;
  emptyLabel: string;
};

export function RepeatableListField<T>({
  items,
  onChange,
  createItem,
  renderItem,
  addLabel,
  emptyLabel,
}: RepeatableListFieldProps<T>) {
  function updateAt(index: number, patch: Partial<T>) {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeAt(index: number) {
    if (!confirm("Remove this entry? This can't be undone from here.")) return;
    onChange(items.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = items.slice();
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveDown(index: number) {
    if (index === items.length - 1) return;
    const next = items.slice();
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-line p-4 text-sm text-ink-muted">{emptyLabel}</p>
      )}
      {items.map((item, index) => (
        // Index as key is fine here: rows are swapped in place (moveUp/moveDown)
        // or removed outright, never reordered by insertion — no key-stability
        // bugs result, only a minor loss of focus on remove, which is acceptable
        // for this internal tool.
        <div key={index} className="rounded-xl border border-line bg-bg-elevated p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">#{index + 1}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveUp(index)} disabled={index === 0} className="admin-icon-button" aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                disabled={index === items.length - 1}
                className="admin-icon-button"
                aria-label="Move down"
              >
                ↓
              </button>
              <button type="button" onClick={() => removeAt(index)} className="admin-icon-button admin-icon-button-danger">
                Remove
              </button>
            </div>
          </div>
          {renderItem(item, index, (patch) => updateAt(index, patch))}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, createItem()])} className="admin-button-secondary">
        {addLabel}
      </button>
    </div>
  );
}
