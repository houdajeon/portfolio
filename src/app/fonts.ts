import { Archivo, JetBrains_Mono } from "next/font/google";

// next/font downloads the fonts at build time and serves them from this site:
// no request to Google from the visitor's browser, and no layout shift while they load.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${archivo.variable} ${jetbrainsMono.variable}`;
