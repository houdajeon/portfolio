import { Fragment } from "react";

// Content strings stay plain JSON, with two tiny conventions:
//   `code`          → inline code
//   [TODO: ...]     → a highlighted placeholder, so missing facts are impossible to miss
const TOKEN = /(`[^`]+`|\[TODO[^\]]*\])/g;

export function Rich({ text }: { text: string }) {
  return (
    <>
      {text
        .split(TOKEN)
        .filter(Boolean)
        .map((part, i) => {
          if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={i}
                className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.86em] text-fg"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          if (part.startsWith("[TODO")) {
            return (
              <mark key={i} className="todo">
                {part}
              </mark>
            );
          }
          return <Fragment key={i}>{part}</Fragment>;
        })}
    </>
  );
}

/** Plain-text version for metadata (no placeholders in Google results). */
export function plain(text: string): string {
  return text
    .replace(/\s*\[TODO[^\]]*\]/g, "")
    .replace(/`/g, "")
    .trim();
}
