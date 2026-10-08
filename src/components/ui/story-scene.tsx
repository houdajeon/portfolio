"use client";

import { useRef, type ReactNode } from "react";
import { useScrollFrame } from "./use-scroll-frame";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** 0 → 1 while `value` goes from `start` to `end`. */
const phase = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start));

/**
 * Drives the Killua scene (Story) from the scroll position, like a video you scrub.
 * It only writes 0 → 1 values as CSS variables; globals.css (story-*) turns them into
 * light, scale and blur, and only on large screens with motion allowed. Elsewhere the
 * same markup is a normal, fully visible section.
 *
 * Timeline, in screen heights (vh) of scrolling:
 * - while the hero leaves, the scene comes up in the dark: only his eyes glow (--eyes)
 * - once it fills the screen: a purple flash (--flash), and Killua appears (--reveal)
 * - each text panel [data-panel] charges one hand (--h1, --h2) a little before it
 *   arrives, comes out of the light while it rises (--e on the panel, flash --f1/--f2),
 *   and the hand calms down once the panel has gone past.
 */
export function StoryScene({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const root = ref.current;
    if (!root) return;

    // Read every position first, then write: alternating would make the browser
    // recompute the layout several times in the same frame.
    const vh = innerHeight;
    const top = root.getBoundingClientRect().top;
    const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
    const rects = panels.map((panel) => panel.getBoundingClientRect());

    const enter = phase(vh - top, 0, vh); // 0: scene below the screen, 1: it fills it
    const pinned = -top / vh; // screens scrolled since the scene filled the screen
    const vars: Record<string, number> = {
      "--eyes": phase(enter, 0.3, 0.9),
      "--flash": phase(pinned, 0, 0.16) * (1 - phase(pinned, 0.16, 0.5)),
      "--reveal": phase(pinned, 0.1, 0.45),
    };

    rects.forEach((rect, i) => {
      const emerge = phase(vh - rect.top, 0, vh * 0.7);
      const charge = phase(vh - rect.top, -vh * 0.15, vh * 0.35);
      const gone = phase(vh * 0.55 - rect.bottom, 0, vh * 0.45);
      vars[`--h${i + 1}`] = charge * (1 - gone);
      vars[`--f${i + 1}`] = phase(emerge, 0.02, 0.25) * (1 - phase(emerge, 0.25, 0.65));

      const panel = panels[i];
      panel.style.setProperty("--e", emerge.toFixed(3));
      // No filter at all once sharp: a filter would stop the panel's frosted glass from
      // blurring what is behind it.
      const blur = (1 - emerge) * 12;
      panel.style.setProperty(
        "--emerge-filter",
        blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none",
      );
    });

    for (const [name, value] of Object.entries(vars)) {
      root.style.setProperty(name, value.toFixed(3));
    }
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
