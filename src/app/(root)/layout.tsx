import type { ReactNode } from "react";
import { HtmlShell } from "../html-shell";

// Root layout for "/" only. The real site lives under /en and /fr, each with its own
// <html lang>, so this is a second root layout (Next.js allows several).
export default function RedirectLayout({ children }: { children: ReactNode }) {
  return <HtmlShell lang="en">{children}</HtmlShell>;
}
