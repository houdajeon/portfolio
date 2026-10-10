import type { ComponentType } from "react";
import type { Vibe } from "@/lib/schemas";
import { ApiHero } from "./api";
import { BlogHero } from "./blog";
import { ClusterHero } from "./cluster";
import { CloudHero } from "./cloud";
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
 * Rise, a terminal for the shell... in the colors of the rest of the site. The header is
 * drawn by the vibe's own component; the rest of the page is the same list of cards for every
 * project, restyled by vibes.css ([data-vibe] on the article).
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
  api: ApiHero,
  cloud: CloudHero,
};

export function VibeHero(props: HeroProps) {
  const Hero = HEROES[props.project.vibe];
  return <Hero {...props} />;
}
