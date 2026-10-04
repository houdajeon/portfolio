import type { Metadata } from "next";
import { defaultLocale, languageAlternates, localePath } from "@/i18n/config";
import { getSite } from "@/lib/content";

// A static host can't read the Accept-Language header, so "/" picks the language in the
// browser: the visitor's last choice first, then the browser language, then English.
// Relative URLs keep this working if the site is ever served from a sub-path.
const redirectScript = `(function(){var l;try{l=localStorage.getItem('locale')}catch(e){}if(l!=='en'&&l!=='fr'){l=/^fr\\b/i.test(navigator.language||'')?'fr':'en'}location.replace(l+'/')})();`;

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  alternates: {
    canonical: localePath(defaultLocale),
    languages: languageAlternates(),
  },
};

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=en/" />
      </noscript>
      <main className="grid min-h-dvh place-items-center p-6 font-mono text-sm text-muted">
        <p>
          {site.name} ·{" "}
          <a href="en/" className="text-fg underline underline-offset-4">
            English
          </a>{" "}
          ·{" "}
          <a href="fr/" lang="fr" className="text-fg underline underline-offset-4">
            Français
          </a>
        </p>
      </main>
    </>
  );
}
