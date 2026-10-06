// Shared by <Link>, <a> and <button>, so the class strings live here instead of a component.
const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition active:translate-y-px";

/** Rounded, uppercase: the hero's buttons, like its headline. */
const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-bold tracking-wider uppercase transition-[background-position,border-color,box-shadow,translate] duration-500 active:translate-y-px";

export const buttonStyles = {
  primary: `${base} bg-accent text-on-accent hover:brightness-110`,
  ghost: `${base} border border-line bg-surface text-fg hover:border-muted`,
  /** Gradient pill for the main call to action; the gradient slides on hover. */
  bloom: `${pillBase} bg-bloom text-white ring-1 ring-accent/60 hover:bg-right hover:shadow-glow`,
  pill: `${pillBase} border border-line text-fg hover:border-muted`,
  /** Square, borderless: header controls (theme, menu). */
  icon: "grid size-9 place-items-center rounded-md text-muted transition hover:bg-raised hover:text-fg",
} as const;
