import type { ComponentType } from "react";
import type { Vibe } from "@/lib/schemas";
import { BlogHero } from "./blog";
import { ClusterHero } from "./cluster";
import { ContainersHero } from "./containers";
import { GameHero } from "./game";
import { HttpHero } from "./http";
import { NetworkHero } from "./network";
import { ServerHero } from "./server";
import type { HeroProps } from "./shared";
import { ShellHero } from "./shell";
import { SocialHero } from "./social";
import "./vibes.css";

export { vibeFont } from "./fonts";

/**
 * Each case study looks like the thing it is about: a game for Bomberman, a blog article for
 * 01Blog, a terminal for the shell... The header is drawn by the vibe's own component; the
 * rest of the page keeps one structure and is restyled by vibes.css ([data-vibe] on the
 * article), which also redefines the color tokens so every part follows the vibe.
 */
const HEROES: Record<Vibe, ComponentType<HeroProps>> = {
  social: SocialHero,
  blog: BlogHero,
  cluster: ClusterHero,
  http: HttpHero,
  shell: ShellHero,
  game: GameHero,
  containers: ContainersHero,
  server: ServerHero,
  network: NetworkHero,
};

export function VibeHero(props: HeroProps) {
  const Hero = HEROES[props.project.vibe];
  return <Hero {...props} />;
}
