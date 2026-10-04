import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HtmlShell } from "../html-shell";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PalettePicker } from "@/components/layout/palette-picker";
import { hasLocale, languageAlternates, localePath, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSite } from "@/lib/content";

// Static export: build /en and /fr, and nothing else.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const dict = getDictionary(locale);
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s · ${site.name}` },
    description: dict.meta.description,
    alternates: {
      canonical: localePath(locale),
      languages: languageAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      title: dict.meta.title,
      description: dict.meta.description,
      url: localePath(locale),
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const site = getSite();

  return (
    <HtmlShell lang={locale}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        {dict.nav.skip}
      </a>
      <Header locale={locale} dict={dict} />
      <main id="main">{children}</main>
      <Footer dict={dict} site={site} />
      {process.env.NODE_ENV === "development" && <PalettePicker />}
    </HtmlShell>
  );
}
