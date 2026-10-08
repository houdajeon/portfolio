"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { useScrollFrame } from "@/components/ui/use-scroll-frame";

type Step = { key: string; date: string | null; title: string; body: string; current: boolean };

/**
 * Vertical timeline that fills in as you scroll: the accent line grows down to a "reading
 * line" at 60% of the screen height, and each step lights up once that line reaches it.
 * Without JavaScript it is simply a static list.
 */
export function Timeline({ steps }: { steps: Step[] }) {
  const list = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(-1);

  useScrollFrame(() => {
    const element = list.current;
    if (!element) return;

    // Every position is read before the style write below: reading after a write would
    // force the browser to recompute the layout a second time in the same frame.
    // Inside the pinned Killua scene the list does not move on screen, so the scene gives
    // the line (data-reading-line, in px from the top of the screen).
    const readingLine = element.dataset.readingLine
      ? Number(element.dataset.readingLine)
      : window.innerHeight * 0.6;
    const rect = element.getBoundingClientRect();
    let last = -1;
    element.querySelectorAll<HTMLElement>("[data-dot]").forEach((dot, index) => {
      if (dot.getBoundingClientRect().top < readingLine) last = index;
    });

    const progress = Math.min(1, Math.max(0, (readingLine - rect.top) / rect.height));
    element.style.setProperty("--progress", String(progress));
    setReached(last); // React skips the re-render when the value is unchanged
  });

  return (
    <ol ref={list} className="relative ml-2 max-w-3xl">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-0 w-px bg-line" />
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-0 w-px origin-top bg-gradient-to-b from-accent to-accent-text"
        style={{ transform: "scaleY(var(--progress, 0))" }}
      />
      {steps.map((step, index) => {
        const lit = index <= reached;
        return (
          <li key={step.key} className="relative pb-12 pl-9 last:pb-0">
            <span
              data-dot=""
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-3.5 -translate-x-1/2 rounded-full border-2 transition-all duration-500 ${
                lit
                  ? step.current
                    ? "border-ok bg-ok shadow-[0_0_0_5px_color-mix(in_srgb,var(--ok)_22%,transparent)]"
                    : "border-accent bg-accent shadow-[0_0_0_5px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
                  : "border-line bg-bg"
              }`}
            />
            <Reveal>
              {step.date && (
                <p
                  className={`font-mono text-xs ${lit ? "text-accent-text" : "text-muted"} transition-colors duration-500`}
                >
                  <Rich text={step.date} />
                </p>
              )}
              {/* Without a date line, the title sits level with the dot */}
              <h3 className={`${step.date ? "mt-1" : ""} text-lg font-bold stretch-semi`}>
                {step.title}
              </h3>
              <p className="mt-1 text-muted">
                <Rich text={step.body} />
              </p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
