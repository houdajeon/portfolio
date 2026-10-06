import type { ReactNode } from "react";
import { LitText } from "./lit-text";
import { Reveal } from "./reveal";
import { RiseWords } from "./rise-words";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

/**
 * Home page section: `// eyebrow`, a wide heading whose words rise in, an optional intro
 * that lights up while scrolling, then content.
 */
export function Section({ id, eyebrow, title, intro, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-t border-line py-20 sm:py-28"
    >
      <div className="page-wrap">
        <Reveal>
          <p className="font-mono text-xs tracking-wider text-muted">
            <span className="text-accent-text">{"//"}</span> {eyebrow}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight stretch-wide sm:text-4xl"
          >
            <RiseWords text={title} />
          </h2>
          {intro && <LitText paragraphs={[intro]} className="mt-4 max-w-2xl text-lg text-muted" />}
        </Reveal>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
