import type { ReactNode } from "react";
import type { FlowerType } from "@/components/garden/defs";
import { Flower } from "@/components/garden/flower";
import { LitText } from "./lit-text";
import { Reveal } from "./reveal";
import { RiseWords } from "./rise-words";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  /** Small flower that opens after the `// eyebrow` label. */
  bloom?: FlowerType;
  className?: string;
  /** Decoration behind the whole section (it fills it, under the content). */
  backdrop?: ReactNode;
  children: ReactNode;
};

/**
 * Home page section: `// eyebrow` with a small flower, a wide heading whose words rise in,
 * an optional intro that lights up while scrolling, then content. Sections are separated
 * by vines (VineDivider), not borders.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  bloom,
  className,
  backdrop,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative py-20 sm:py-24 ${className ?? ""}`}
    >
      {backdrop}
      <div className="relative page-wrap">
        <Reveal>
          <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted">
            <span className="text-accent-text">{"//"}</span> {eyebrow}
            {bloom && <Flower type={bloom} size={16} delay={300} />}
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
