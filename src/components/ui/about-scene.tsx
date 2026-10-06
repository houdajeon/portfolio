"use client";

import { useRef, type ReactNode } from "react";
import { useScrollFrame } from "./use-scroll-frame";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** 0 → 1 while `progress` goes from `start` to `end`. */
const phase = (progress: number, start: number, end: number) =>
  clamp01((progress - start) / (end - start));

/** Large screens with room for the whole scene, and visitors who accept motion. */
const SCENE_MEDIA =
  "(min-width: 64rem) and (min-height: 40rem) and (prefers-reduced-motion: no-preference)";

/**
 * The About section as a scroll-driven scene: while it is pinned on screen, scrolling plays
 * it forwards (and backwards): Killua appears, lightning leaves his hand, the About text
 * comes out of the light, then its words light up. This sets one 0 → 1 value per step on
 * the section (--appear, --bolt, --flash, --emerge, --calm); the CSS does the rest
 * (about-scene in globals.css). Elsewhere (phones, reduced motion) the section is a normal
 * one: no data-scene, so the CSS shows everything in place.
 */
export function AboutScene({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useScrollFrame(() => {
    const section = ref.current;
    if (!section) return;
    if (!matchMedia(SCENE_MEDIA).matches) {
      delete section.dataset.scene;
      return;
    }
    section.dataset.scene = "";

    // 0 when the top of the section reaches the middle of the screen, 1 when the pinned
    // stage is released at the bottom of the section.
    const { top, height } = section.getBoundingClientRect();
    const progress = clamp01((innerHeight * 0.5 - top) / (height - innerHeight * 0.5));

    const steps = {
      "--appear": phase(progress, 0, 0.2),
      "--bolt": phase(progress, 0.22, 0.45),
      "--flash": phase(progress, 0.38, 0.46) * (1 - phase(progress, 0.46, 0.58)),
      "--emerge": phase(progress, 0.42, 0.66),
      "--calm": phase(progress, 0.68, 0.8),
    };
    for (const [name, value] of Object.entries(steps)) {
      section.style.setProperty(name, value.toFixed(3));
    }

    // The stage does not move while pinned, so the text cannot light up from its own
    // position (LitText): the scene drives it instead, as the last step.
    const text = section.querySelector<HTMLElement>(".lit-text");
    if (text) {
      text.style.setProperty("--lit", phase(progress, 0.62, 0.95).toFixed(3));
      text.dataset.lit = "";
    }
  });

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className={className}>
      {children}
    </section>
  );
}
