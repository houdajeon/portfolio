"use client";

import { useRef, useState } from "react";
import type { FlowerType } from "@/components/garden/defs";
import { Reveal } from "@/components/ui/reveal";
import { Rich } from "@/components/ui/rich";
import { useScrollFrame } from "@/components/ui/use-scroll-frame";

type Step = { key: string; date: string | null; title: string; body: string; current: boolean };

/** The flower each step opens into, in order. */
const BLOOMS: FlowerType[] = ["bl-violet", "bl-pink", "daisy", "bl-plum", "bl-violet", "rose-pink"];

/**
 * The journey as a stem that grows while you read: it reaches down to a "reading line" at
 * 60% of the screen height, and each step's bud opens into a flower once the line passes
 * it. The current step stays a glowing bud: still growing. Without JavaScript it is a
 * plain list with buds.
 */
export function Timeline({ steps, growing }: { steps: Step[]; growing: string }) {
  const list = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(-1);

  useScrollFrame(() => {
    const element = list.current;
    if (!element) return;

    // Every position is read before the style write below: reading after a write would
    // force the browser to recompute the layout a second time in the same frame.
    const readingLine = window.innerHeight * 0.6;
    const rect = element.getBoundingClientRect();
    let last = -1;
    element.querySelectorAll<HTMLElement>("[data-step]").forEach((step, index) => {
      if (step.getBoundingClientRect().top < readingLine) last = index;
    });

    const progress = Math.min(1, Math.max(0, (readingLine - rect.top) / rect.height));
    element.style.setProperty("--progress", progress.toFixed(3));
    setReached(last); // React skips the re-render when the value is unchanged
  });

  return (
    <ol ref={list} className="relative">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
      <span aria-hidden="true" className="tl-stem" />
      {steps.map((step, index) => {
        const open = index <= reached;
        return (
          <li
            key={step.key}
            data-step=""
            className={`tl-step relative pb-9 pl-10 last:pb-0 ${open ? "is-open" : ""} ${
              step.current ? "is-current" : ""
            }`}
          >
            <span aria-hidden="true" className="tl-bud">
              <svg className="size-full overflow-visible">
                <use href={step.current ? "#bud-pink" : "#bud-violet"} />
              </svg>
            </span>
            {!step.current && (
              <>
                <span aria-hidden="true" className="tl-bloom">
                  <svg className="size-full overflow-visible">
                    <use href={`#${BLOOMS[index % BLOOMS.length]}`} />
                  </svg>
                </span>
                <span
                  aria-hidden="true"
                  className="tl-leaf"
                  style={{ rotate: index % 2 ? "-30deg" : "30deg" }}
                >
                  <svg viewBox="-10 -32 20 34" width="9" height="15">
                    <use href="#leaf" x={-10} y={-32} width={20} height={34} />
                  </svg>
                </span>
              </>
            )}
            <Reveal>
              {step.date && (
                <p className="font-mono text-xs text-accent-text">
                  <Rich text={step.date} />
                </p>
              )}
              <h3 className={`${step.date ? "mt-1" : ""} text-lg font-bold stretch-semi`}>
                {step.title}
                {step.current && (
                  <span className="ml-2 font-mono text-[11px] font-medium whitespace-nowrap text-pink-400">
                    {growing}
                  </span>
                )}
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
