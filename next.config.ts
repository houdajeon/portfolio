import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages only serves static files, so every page is rendered to HTML at build time (`out/`).
  output: "export",
  // GitHub Pages serves this repo under `/portfolio/`. Only `npm run deploy` sets it, so
  // `npm run dev` and `npm start` keep working at the root.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  // `/en/` is emitted as `/en/index.html`, which static hosts resolve without rewrites.
  trailingSlash: true,
  // The default image optimizer needs a server; images are pre-sized by hand instead.
  images: { unoptimized: true },
  experimental: {
    // One 404 page for the whole site, outside the `[locale]` layouts.
    globalNotFound: true,
  },
};

export default nextConfig;
