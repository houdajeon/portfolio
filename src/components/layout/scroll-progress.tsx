"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/components/ui/use-scroll-frame";

/** Thin bar under the header showing how far down the page the visitor is. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
  });

  return (
    <div
      ref={bar}
      aria-hidden="true"
      // Initial value inline (not a Tailwind scale class): Tailwind scales with the CSS `scale`
      // property, which would stack with the `transform` set on scroll and hide the bar.
      style={{ transform: "scaleX(0)" }}
      className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-accent to-accent-text"
    />
  );
}
