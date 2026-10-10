import { Newsreader, Press_Start_2P, VT323 } from "next/font/google";
import type { Vibe } from "@/lib/schemas";

// Fonts that only some case studies use. `preload: false`: a page downloads one of them only
// when its CSS actually asks for it, so the other project pages don't pay for it.

/** Pixel font of 8-bit games (Bomberman). */
const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
  preload: false,
});

/** Editorial serif, with italics (01Blog). */
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

/** Old CRT terminal font (0-shell, Linux server). */
const crt = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-crt",
  display: "swap",
  preload: false,
});

const byVibe: Partial<Record<Vibe, string>> = {
  game: pixel.variable,
  blog: serif.variable,
  shell: crt.variable,
  server: crt.variable,
};

/** The CSS variable class for the extra font of a vibe, if it has one. */
export const vibeFont = (vibe: Vibe) => byVibe[vibe] ?? "";
