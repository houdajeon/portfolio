"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { isText, richPart, richParts } from "./rich";
import { useScrollFrame } from "./use-scroll-frame";

/**
 * Paragraphs whose words light up one after another as they move up the screen, like
 * reading along: one sweep through all of them, in order. JavaScript only sets --lit
 * (0 → 1: how far the block has travelled through the reading band); CSS turns it into each
 * word's brightness (lit-* in globals.css). Without JavaScript, or with reduced motion, the
 * text stays fully lit.
 */
export function LitText({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const block = ref.current;
    if (!block || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { top, height } = block.getBoundingClientRect();
    // 0 when the top of the block reaches 85% of the screen height, 1 when its bottom
    // reaches 45%: the words light up while the text crosses the middle of the screen.
    const lit = (innerHeight * 0.85 - top) / (height + innerHeight * 0.4);
    block.style.setProperty("--lit", Math.min(1, Math.max(0, lit)).toFixed(3));
    block.dataset.lit = "";
  });

  // Every word is one unit, numbered across all the paragraphs; `code` and [TODO] pieces
  // light up as a whole.
  let count = 0;
  const unit = (key: string, content: ReactNode) => (
    <span key={key} className="lit-word" style={{ "--i": count++ } as CSSProperties}>
      {content}
    </span>
  );
  const rendered = paragraphs.map((text) =>
    richParts(text).flatMap((part, p) =>
      isText(part)
        ? part
            .split(/(\s+)/)
            .filter(Boolean)
            .map((word, w) => (/^\s+$/.test(word) ? word : unit(`${p}-${w}`, word)))
        : [unit(`${p}`, richPart(part, p))],
    ),
  );

  return (
    <div
      ref={ref}
      className={`lit-text ${className ?? ""}`}
      style={{ "--n": count } as CSSProperties}
    >
      {rendered.map((units, i) => (
        <p key={paragraphs[i].slice(0, 24)}>{units}</p>
      ))}
    </div>
  );
}
