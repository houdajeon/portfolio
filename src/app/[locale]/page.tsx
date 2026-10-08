import { notFound } from "next/navigation";
import { Community } from "@/components/sections/community";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Story } from "@/components/sections/story";
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
      <Story locale={locale} dict={dict} journey={getJourney()} />
      <Skills locale={locale} dict={dict} skills={getSkills()} />
      <Projects locale={locale} dict={dict} projects={projects} />
      <Community locale={locale} dict={dict} community={getCommunity()} />
      <Contact dict={dict} site={site} />
    </>
  );
}
