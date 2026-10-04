import type { ReactNode } from "react";
import "./globals.css";
import { fontVariables } from "./fonts";
import type { Locale } from "@/i18n/config";
import { themeScript } from "@/lib/theme-script";

/** The <html> document shared by the three root layouts: "/", "/en" + "/fr", and the 404 page. */
export function HtmlShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    // "dark" is the default; the head script swaps it before paint if the visitor chose light.
    <html
      lang={lang}
      className={`${fontVariables} dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased">{children}</body>
    </html>
  );
}
