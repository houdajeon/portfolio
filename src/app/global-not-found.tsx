import type { Metadata } from "next";
import Link from "next/link";
import { HtmlShell } from "./html-shell";
import { buttonStyles } from "@/components/ui/button-styles";
import { Prompt } from "@/components/ui/terminal";
import { getSite } from "@/lib/content";

// Exported as out/404.html, which GitHub Pages serves for any unknown URL.
// It sits outside the /en and /fr layouts, so it speaks both languages.
export const metadata: Metadata = {
  title: `404 · ${getSite().name}`,
};

export default function GlobalNotFound() {
  return (
    <HtmlShell lang="en">
      <main className="grid min-h-dvh place-items-center px-4">
        <div className="w-full max-w-lg">
          <div className="rounded-xl border border-line bg-surface p-5 font-mono text-[13px] leading-relaxed">
            <Prompt>curl -I this-page</Prompt>
            <p>
              HTTP/1.1 <span className="text-accent-text">404 Not Found</span>
            </p>
          </div>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight stretch-wide">
            This page doesn&apos;t exist.
          </h1>
          <p lang="fr" className="mt-2 text-lg text-muted">
            Cette page n&apos;existe pas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/en/" className={buttonStyles.primary}>
              Home
            </Link>
            <Link href="/fr/" lang="fr" className={buttonStyles.ghost}>
              Accueil
            </Link>
          </div>
        </div>
      </main>
    </HtmlShell>
  );
}
