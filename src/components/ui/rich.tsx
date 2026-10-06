import { Fragment, type ReactNode } from "react";

// Content strings stay plain JSON, with two tiny conventions:
//   `code`          → inline code
//   [TODO: ...]     → a highlighted placeholder, so missing facts are impossible to miss
const TOKEN = /(`[^`]+`|\[TODO[^\]]*\])/g;

/** The pieces of a content string: plain text, `code` and [TODO] placeholders. */
export function richParts(text: string): string[] {
  return text.split(TOKEN).filter(Boolean);
}

export const isText = (part: string) =>
  !(part.length > 2 && part.startsWith("`") && part.endsWith("`")) && !part.startsWith("[TODO");

/** Renders one piece from `richParts`. */
export function richPart(part: string, key: number): ReactNode {
  if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
    return (
      <code key={key} className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.86em] text-fg">
        {part.slice(1, -1)}
      </code>
    );
  }
  if (part.startsWith("[TODO")) {
    return (
      <mark key={key} className="todo">
        {part}
      </mark>
    );
  }
  return <Fragment key={key}>{part}</Fragment>;
}

export function Rich({ text }: { text: string }) {
  return <>{richParts(text).map(richPart)}</>;
}

/** Plain-text version for metadata (no placeholders in Google results). */
export function plain(text: string): string {
  return text
    .replace(/\s*\[TODO[^\]]*\]/g, "")
    .replace(/`/g, "")
    .trim();
}
