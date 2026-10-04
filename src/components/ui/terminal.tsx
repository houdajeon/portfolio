import type { CSSProperties, ReactNode } from "react";

/** Window frame shared by every terminal on the site (hero, skills, community). */
export function TerminalWindow({
  title,
  children,
  className = "",
  style,
  decorative = false,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** true when the content only repeats text found elsewhere (hidden from screen readers) */
  decorative?: boolean;
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      style={style}
      className={`overflow-hidden rounded-xl border border-line bg-surface/90 shadow-2xl shadow-black/10 backdrop-blur dark:shadow-black/40 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-raised/60 px-4 py-2.5">
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
        <div className="ml-2 min-w-0 truncate font-mono text-xs text-muted">{title}</div>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed sm:p-5">
        {children}
      </div>
    </div>
  );
}

/** `houda:~$ command` — decorative, so screen readers skip it. */
export function Prompt({ children }: { children?: ReactNode }) {
  return (
    <p aria-hidden="true">
      <span className="text-ok">houda</span>
      <span className="text-muted">:~</span>
      <span className="text-accent-text">$</span> <span className="text-fg">{children}</span>
    </p>
  );
}

export function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-accent"
    />
  );
}

/** Index for the "lines print one by one" effect (see .term-row in globals.css). */
export const row = (index: number) => ({ "--i": index }) as CSSProperties;
