import en from "@content/messages/en.json";
import fr from "@content/messages/fr.json";
import type { Locale } from "./config";

export type Messages = typeof en;

// Typing fr as `Messages` makes the build fail if a key exists in English but not in French.
const dictionaries: Record<Locale, Messages> = { en, fr };

export const getDictionary = (locale: Locale): Messages => dictionaries[locale];
