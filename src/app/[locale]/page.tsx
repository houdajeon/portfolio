import { notFound } from "next/navigation";
import { About } from "@/components/sections/about";
import { Community } from "@/components/sections/community";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCommunity, getJourney, getProjects, getSite, getSkills } from "@/lib/content";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const site = getSite();
  const projects = getProjects();

  return (
    <>
      <Hero locale={locale} dict={dict} site={site} />
      <About dict={dict} site={site} />
      <Skills locale={locale} dict={dict} skills={getSkills()} />
      <Projects locale={locale} dict={dict} projects={projects} />
      <Journey locale={locale} dict={dict} journey={getJourney()} />
      <Community locale={locale} dict={dict} community={getCommunity()} />
      <Contact dict={dict} site={site} />
    </>
  );
}
