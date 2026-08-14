"use client";

import { useId, useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-serif text-lg text-ink"
                onClick={() => setOpen(isOpen ? null : index)}
              >
                {item.q}
                <span aria-hidden className="text-accent">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-4 text-ink-muted"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
