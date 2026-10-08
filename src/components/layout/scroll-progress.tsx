"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useScrollFrame } from "@/components/ui/use-scroll-frame";

const VINE =
  "M0 7C40 2 80 12 120 7S200 2 240 7S320 12 360 7S440 2 480 7S560 12 600 7S680 2 720 7S800 12 840 7S920 2 1000 7";
/** Where leaves open along the vine (share of the page scrolled). */
const LEAVES = Array.from({ length: 13 }, (_, i) => 0.06 + i * 0.075);

/**
 * The reading progress under the header, as a vine: it grows with the scroll (--p), a
 * flower turns at its tip, and leaves open along it as you pass them.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useScrollFrame(() => {
    const element = bar.current;
    if (!element) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(1, scrollY / max) : 0;
    element.style.setProperty("--p", progress.toFixed(4));
    element.querySelectorAll<HTMLElement>("[data-at]").forEach((leaf) => {
      leaf.classList.toggle("is-open", progress >= Number(leaf.dataset.at));
    });
  });

  return (
    <div
      ref={bar}
      key={pathname}
      aria-hidden="true"
      className="vine-progress pointer-events-none absolute inset-x-0 -bottom-px h-0.5"
    >
      <svg viewBox="0 0 1000 14" preserveAspectRatio="none" className="vine-progress-line">
        <path pathLength={1} d={VINE} />
      </svg>
      {LEAVES.map((at, i) => (
        <span
          key={at}
          data-at={at}
          className="vine-progress-leaf"
          style={{
            left: `calc(${(at * 100).toFixed(1)}% - 4px)`,
            top: i % 2 ? "-12px" : "-2px",
            rotate: i % 2 ? "35deg" : "-145deg",
          }}
        >
          <svg viewBox="-10 -32 20 34" width="9" height="15">
            <use href="#leaf" x={-10} y={-32} width={20} height={34} />
          </svg>
        </span>
      ))}
      <span className="vine-progress-tip">
        <svg viewBox="-24 -24 48 48" width="22" height="22">
          <use href="#bl-pink" x={-24} y={-24} width={48} height={48} />
        </svg>
      </span>
    </div>
  );
}
