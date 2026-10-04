"use client";

import { useSyncExternalStore } from "react";

// DEV ONLY: lets you try the palettes on the real site. Rendered only by `npm run dev`
// (see app/[locale]/layout.tsx). Once a palette is chosen it becomes the default in
// globals.css and this file is deleted.
const palettes = [
  { id: "blue", label: "Blue", swatch: "#6e9bff" },
  { id: "violet", label: "Violet", swatch: "#a78bfa" },
  { id: "teal", label: "Teal", swatch: "#2dd4bf" },
  { id: "coral", label: "Coral", swatch: "#ff8a7a" },
];

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-palette"],
  });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.dataset.palette ?? "blue";
const getServerSnapshot = () => "blue";

export function PalettePicker() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function choose(id: string) {
    const root = document.documentElement;
    if (id === "blue") root.removeAttribute("data-palette");
    else root.setAttribute("data-palette", id);
    try {
      if (id === "blue") localStorage.removeItem("palette");
      else localStorage.setItem("palette", id);
    } catch {
      // Storage blocked: the palette still applies until reload.
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-xl border border-line bg-surface/95 p-3 shadow-2xl backdrop-blur">
      <p className="font-mono text-[10px] tracking-wider text-muted uppercase">
        Palette · dev only
      </p>
      <div role="group" aria-label="Palette" className="mt-2 flex gap-2">
        {palettes.map((palette) => (
          <button
            key={palette.id}
            type="button"
            onClick={() => choose(palette.id)}
            aria-pressed={current === palette.id}
            title={palette.label}
            className="flex flex-col items-center gap-1 rounded-md px-1.5 py-1 font-mono text-[10px] text-muted aria-pressed:bg-raised aria-pressed:text-fg"
          >
            <span
              className="size-6 rounded-full border-2 border-transparent"
              style={{
                background: palette.swatch,
                borderColor: current === palette.id ? "var(--fg)" : "transparent",
              }}
            />
            {palette.label}
          </button>
        ))}
      </div>
    </div>
  );
}
