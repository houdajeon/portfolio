// Shared by <Link>, <a> and <button>, so the class strings live here instead of a component.
const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition active:translate-y-px";

export const buttonStyles = {
  primary: `${base} bg-accent text-on-accent hover:brightness-110`,
  ghost: `${base} border border-line bg-surface text-fg hover:border-muted`,
  /** Square, borderless: header controls (theme, menu). */
  icon: "grid size-9 place-items-center rounded-md text-muted transition hover:bg-raised hover:text-fg",
} as const;
