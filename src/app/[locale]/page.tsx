import { notFound } from "next/navigation";
import { About } from "@/components/sections/about";
import { Community } from "@/components/sections/community";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { VineDivider } from "@/components/garden/vine-divider";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCommunity, getJourney, getProjects, getSite, getSkills } from "@/lib/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const site = getSite();

  return (
    <>
      <Hero locale={locale} dict={dict} site={site} />
      <VineDivider index={0} />
      <About dict={dict} />
      <VineDivider index={1} />
      <Journey locale={locale} dict={dict} journey={getJourney()} />
      <VineDivider index={2} />
      <Skills locale={locale} dict={dict} skills={getSkills()} />
      <VineDivider index={3} />
      <Projects locale={locale} dict={dict} projects={getProjects()} />
      <VineDivider index={4} />
      <Community locale={locale} dict={dict} community={getCommunity()} />
      <VineDivider index={5} />
      <Contact dict={dict} site={site} />
    </>
  );
}
