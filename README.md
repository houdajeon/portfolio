# Houda Hdili · Portfolio

Personal portfolio: full-stack developer with a DevOps focus.
Next.js (App Router) + TypeScript + Tailwind CSS, exported as a static site for GitHub Pages.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /en/ or /fr/
```

| Command             | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                                |
| `npm run build`     | Static export to `out/` (fails if any content is invalid) |
| `npm start`         | Serves `out/` locally, as GitHub Pages would              |
| `npm run deploy`    | Builds for `/portfolio/` and publishes to `gh-pages`      |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | TypeScript, no output                                     |
| `npm run format`    | Prettier (also sorts Tailwind classes)                    |

## Where things live

```
content/                     ← all text and data, no code
  site.json                  name, links, email, photo, CV paths, form key
  messages/en.json, fr.json  interface text (the French file must have every English key)
  skills.json  journey.json  community.json
  projects/<slug>/
    meta.json                facts shared by both languages: stack, team size, links, diagram
    en.json, fr.json         case-study copy
src/
  app/[locale]/              pages for /en and /fr (home, projects/[slug])
  app/(root)/                "/" → picks the language in the browser
  app/global-not-found.tsx   404 page (out/404.html)
  components/                layout, home sections, architecture diagram, UI pieces
  lib/schemas.ts             Zod schemas: every content file is validated at build time
  lib/content.ts             reads content/ from disk at build time
```

## Common edits

- **Add a project:** copy a folder in `content/projects/`, rename it (the folder name is the URL), edit the three files. No component changes needed.
- **Fill a placeholder:** search for `[TODO` in `content/`. Placeholders are highlighted on the site until they are replaced.
- **Add your photo or CV:** put the file in `public/` (e.g. `public/images/profile.webp`, `public/cv/houda-hdili-cv-en.pdf`) and set its path in `content/site.json`.
- **Inline code in text:** wrap it in backticks, e.g. `` `java.nio` ``.

## Design decisions

- **Static export** (`output: "export"`): GitHub Pages only serves files, so every page is rendered to HTML at build time. The same `out/` folder also works on Vercel, Netlify or behind nginx.
- **Content as validated JSON:** components never contain copy. Zod checks every file during the build, so a typo fails CI instead of breaking the live site.
- **Diagrams as data:** architecture diagrams are described in `meta.json` and drawn as SVG at build time. That means no JavaScript in the browser, and they follow the dark/light theme.
- **Theme:** dark by default. A small inline script applies the saved choice before the first paint, so there is no flash.
- **i18n without a library:** two typed JSON dictionaries and `/en/…` `/fr/…` folders generated at build time.
