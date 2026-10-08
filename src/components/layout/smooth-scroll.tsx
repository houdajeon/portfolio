"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

let lenis: Lenis | null = null;

/** Scrolls to a position smoothly (through Lenis when it runs, natively otherwise). */
export function scrollToY(top: number) {
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: "smooth" });
}

/**
 * Smooth, gliding scroll for the mouse wheel and in-page links (Lenis). It still moves the
 * real page scroll, so everything that listens to scrolling keeps working. Touch screens
 * keep their native scroll, and Lenis turns itself off with reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      // The header offset already comes from scroll-margin-top (globals.css).
      anchors: true,
    });
    lenis = instance;
    return () => {
      instance.destroy();
      lenis = null;
    };
  }, []);
  return null;
}
