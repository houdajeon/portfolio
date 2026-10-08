"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { SCENE_CHANGE, useScrollFrame } from "./use-scroll-frame";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** 0 → 1 while `value` goes from `start` to `end`. */
const phase = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start));

/** Must match the media query of the scene rules in globals.css (story-*). */
const SCENE_MEDIA =
  "(min-width: 64rem) and (min-height: 38rem) and (prefers-reduced-motion: no-preference)";

/*
 * The scene's script, in "screens scrolled" × 100 (s): s = 0 when the scene starts coming
 * up under the hero, 100 when it fills the screen and pins, 660 at the end (the scene is
 * 660vh tall in globals.css, so it stays pinned for s = 100 → 660).
 *
 * Video time (seconds) at each point; in between, it is interpolated:
 *   0 → 100   eyes in the dark (0 → 2.6 s), while the hero leaves
 *   100 → 155 Killua appears, white flash (→ 5.6 s)
 *   155 → 210 his right hand charges (→ 7.2 s); About comes out of it (s 180 → 240)
 *   210 → 400 About stays: its words light up, long text scrolls inside the panel
 *   400 → 445 second flash, his left hand charges (→ 9 s); Journey comes out (s 415 → 475)
 *   445 → 640 both panels stay: the timeline scrolls inside its panel, lightning crackles
 */
const VIDEO_KEYS: [number, number][] = [
  [0, 0],
  [100, 2.6],
  [155, 5.6],
  [210, 7.2],
  [400, 7.9],
  [445, 9],
  [640, 12],
];
const PANELS = [
  { emerge: [180, 240], scroll: [250, 390] }, // About
  { emerge: [415, 475], scroll: [480, 630] }, // Journey
];
const ABOUT_LIT = [240, 360];

/**
 * The video's own flashes (start, strength, fade time in seconds), measured from its
 * frames: the whole picture turns light, then fades out quickly. The scene lights the whole
 * stage the same way (--flash), a little stronger and longer than the video, so the light
 * covers the video's edges instead of stopping at them.
 */
const FLASHES = [
  [4.2, 0.72, 0.2],
  [5.7, 0.53, 0.15],
  [8.0, 1, 0.2],
];
const flashAt = (t: number) =>
  Math.max(
    0,
    ...FLASHES.map(([start, peak, fade]) => (t < start ? 0 : peak * Math.exp(-(t - start) / fade))),
  );

function videoTime(s: number) {
  if (s <= VIDEO_KEYS[0][0]) return VIDEO_KEYS[0][1];
  for (let i = 1; i < VIDEO_KEYS.length; i++) {
    const [s1, t1] = VIDEO_KEYS[i];
    if (s <= s1) {
      const [s0, t0] = VIDEO_KEYS[i - 1];
      return t0 + ((s - s0) / (s1 - s0)) * (t1 - t0);
    }
  }
  return VIDEO_KEYS[VIDEO_KEYS.length - 1][1];
}

/**
 * Drives the Killua scene (Story): the scroll position picks the video frame, like
 * scrubbing a timeline, and the text panels come out of his hands and stay. Only on large
 * screens with motion allowed; elsewhere Story is a normal section with a still picture.
 * The video is only downloaded in that case, once the page has loaded (or on first scroll).
 */
export function StoryScene({
  children,
  className,
  video: videoSrc,
}: {
  children: ReactNode;
  className?: string;
  video: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef(0); // video time the scroll asks for
  const shown = useRef(0); // video time on screen, easing towards the target
  const ease = useRef<() => void>(() => {});
  const written = useRef(""); // panel positions last written, to tell the timeline

  const load = () => {
    const video = ref.current?.querySelector("video");
    if (video && !video.src && matchMedia(SCENE_MEDIA).matches) video.src = videoSrc;
  };

  // Seeks the video towards the target a little every frame (smooth even when the scroll
  // jumps), never starting a new seek before the previous one has finished.
  useEffect(() => {
    const video = ref.current?.querySelector("video");
    if (!video) return;
    let frame = 0;
    const tick = () => {
      frame = 0;
      const goal = target.current;
      const next = shown.current + (goal - shown.current) * 0.2;
      shown.current = Math.abs(goal - next) < 0.004 ? goal : next;
      const flash = flashAt(shown.current);
      ref.current?.style.setProperty("--flash", flash < 0.01 ? "0" : flash.toFixed(3));
      if (video.readyState >= 1 && !video.seeking) {
        if (Math.abs(video.currentTime - shown.current) > 0.01) video.currentTime = shown.current;
      }
      if (shown.current !== goal || video.seeking) frame = requestAnimationFrame(tick);
    };
    ease.current = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    video.addEventListener("loadedmetadata", ease.current);
    video.addEventListener("seeked", ease.current);

    // Download the video once the page itself is done, so it never slows the first view.
    const idle = () => {
      if ("requestIdleCallback" in window) requestIdleCallback(load);
      else setTimeout(load, 300);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", ease.current);
      video.removeEventListener("seeked", ease.current);
      window.removeEventListener("load", idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load only reads refs
  }, []);

  useScrollFrame(() => {
    const root = ref.current;
    if (!root) return;
    const scene = matchMedia(SCENE_MEDIA).matches;
    const panels = [...root.querySelectorAll<HTMLElement>("[data-panel]")];
    const marks = [...root.querySelectorAll<HTMLElement>("[data-mark]")];

    // Read every position first, then write: alternating would make the browser
    // recompute the layout several times in the same frame.
    const rootTop = root.getBoundingClientRect().top;
    const panelRects = panels.map((panel) => panel.getBoundingClientRect());
    const cards = panels.map((panel) => panel.querySelector<HTMLElement>(".story-card"));
    const cardRects = cards.map((card) => card?.getBoundingClientRect());
    const overflow = panels.map((panel, i) => {
      const content = panel.querySelector<HTMLElement>(".story-content");
      const card = cards[i];
      return content && card ? Math.max(0, content.scrollHeight - card.clientHeight) : 0;
    });
    const timeline = panels[1]?.querySelector<HTMLElement>("ol");

    if (!scene) {
      // Plain section: the #about / #journey markers sit on their panels.
      delete root.dataset.scene;
      if (timeline) delete timeline.dataset.readingLine;
      marks.forEach((mark, i) => {
        mark.style.top = `${panelRects[i].top - rootTop}px`;
        mark.style.height = `${panelRects[i].height}px`;
      });
      return;
    }
    root.dataset.scene = "";
    marks.forEach((mark) => mark.style.removeProperty("top"));
    marks.forEach((mark) => mark.style.removeProperty("height"));

    const s = ((innerHeight - rootTop) / innerHeight) * 100;
    if (s > -60) load();
    target.current = videoTime(s);
    ease.current();

    const positions: string[] = [];
    panels.forEach((panel, i) => {
      const { emerge, scroll } = PANELS[i];
      const e = phase(s, emerge[0], emerge[1]);
      panel.style.setProperty("--e", e.toFixed(3));
      // No filter at all once sharp: a filter would stop the card's frosted glass from
      // blurring what is behind it.
      const blur = (1 - e) * 12;
      panel.style.setProperty(
        "--emerge-filter",
        blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none",
      );
      const content = panel.querySelector<HTMLElement>(".story-content");
      const progress = phase(s, scroll[0], scroll[1]);
      const shift = progress * overflow[i];
      if (content) content.style.translate = `0 ${(-shift).toFixed(1)}px`;
      // Soft edges where more text is hidden above or below.
      panel.dataset.fade = [shift > 2 ? "top" : "", shift < overflow[i] - 2 ? "bottom" : ""]
        .join(" ")
        .trim();
      positions.push(shift.toFixed(0));

      // The timeline lights its steps as they cross a line that moves down the panel
      // while its text scrolls, so the last step lights up at the end.
      const rect = cardRects[i];
      if (i === 1 && timeline && rect) {
        const line = rect.top + rect.height * (0.55 + 0.45 * progress);
        timeline.dataset.readingLine = line.toFixed(0);
        positions.push(line.toFixed(0));
      }
    });

    // The About text does not move on screen while pinned, so the scene lights its words.
    const lit = panels[0]?.querySelector<HTMLElement>(".lit-text");
    if (lit) {
      lit.style.setProperty("--lit", phase(s, ABOUT_LIT[0], ABOUT_LIT[1]).toFixed(3));
      lit.dataset.lit = "";
    }

    // Content inside the panels moved: let the timeline (and the rest) update once more.
    const key = positions.join(",");
    if (key !== written.current) {
      written.current = key;
      window.dispatchEvent(new Event(SCENE_CHANGE));
    }
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
