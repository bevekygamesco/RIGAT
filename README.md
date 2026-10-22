# RIGAT — Full latest project

This package merges the Next.js App Router project and all updates supplied in this conversation. No patch ZIPs need to be applied.

Included: original desktop design and scroll animation, white/blue theme, component labels, cinematic loading, frame preloading and browser caching, back-to-top button, refresh-to-top behavior, and the dedicated mobile hero and six-chapter model player. The Blender 4.3 source and all desktop/mobile frames are included.

The manual settings shared in the conversation are applied in `public/rigat-settings.js`: scrollSpeed 1.2, introDurationMs 500, zoomExtraTravel 0.03, scrollSeconds 12, scrollSmoothingMs 50, finalZoomTravel 0.07, finalZoomDurationMs 1200.

Edits made only on another computer and never shared in this conversation cannot be included in this archive.

## Start on another computer

Install Node.js with support for this project's Next.js version (Node 20.9 or newer; Node 22 works). Extract the ZIP, open a terminal in the `RIGAT-Full-Latest` folder, then run:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. These commands also work in Windows PowerShell. Do not open the TSX files directly in a browser.

For production:

```bash
npm run build
npm start
```

No `.next`, `out`, or `node_modules` directories are included; these are generated on your computer. The lockfile is included.

The mobile edition activates at 760px and below. Larger screens use the original desktop/tablet layout. See `MOBILE-EDITION.md`, `LOADING-CACHE.md`, and `BACK-TO-TOP.md` for adjustment details. The contact form prepares a local summary; it does not automatically send emails.

Production build and TypeScript passed for the integrated code. Browser viewport checks covered mobile and desktop; physical-phone performance has not been measured.

---

## Original project reference

The approved RIGAT website, converted into server-rendered TSX section components with Next.js App Router, React, TypeScript and Tailwind CSS 4. The original frames, model, blue focus, component labels, scroll pacing and 3D loading intro are preserved.

## Run locally

Install Node.js 22 LTS (Next.js requires Node >=20.9), then run:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Windows PowerShell supports the same commands.

## Production

```bash
npm run build
npm start
```

`npm run build` generates the static website in `out/`. `npm start` serves that output locally. Upload the contents of `out/` to static hosting, or deploy this source using a Next.js hosting provider. `output: "export"` deliberately avoids requiring a Node server for this single-page website.

## Structure

| Location | Responsibility |
| --- | --- |
| `app/page.tsx` | Only section component imports and composition |
| `app/layout.tsx` | Shared header, footer, metadata, intro, icons, dialog and runtime |
| `components/home/HeroBanner.tsx` | Banner, supplied product image, SVG forms and phone CTA |
| `components/home/ScrollStory.tsx` | Sticky story composition |
| `components/home/MechanismSequence.tsx` | Canvas, six story chapters and blue component callouts |
| `components/home/` | Craftsmanship, expertise, process, FAQ and closing CTA |
| `components/layout/` | Header, footer, icons and LocalBusiness structured data |
| `components/experience/` | Loading intro, contact dialog and typed client runtime bridge |
| `lib/animation/` | Existing browser-only JavaScript render/scroll engines exposed as initializers |
| `styles/` | Approved design and specialized animation CSS |
| `app/globals.css` | Tailwind theme/utilities plus shared design CSS |
| `public/assets/` | Original logos, fonts, product images and desktop/mobile frame sequences |
| `public/rigat-settings.js` | Editable scroll/zoom timing settings |
| `source/` | Blender 4.3 project, rendering scripts and original animation metadata |

All visible section markup is real TSX rendered into HTML at build time. It is not injected as an HTML string or loaded in an iframe. The performance-sensitive animation engine remains in JavaScript to preserve its established behavior. `ExperienceRuntime.tsx` starts those modules only in the browser, once per root-layout lifetime, including development Strict Mode. The page is designed as one route with in-page section navigation. Tailwind is configured without Preflight so its reset does not change the approved design; custom motion and exact visual styling remain in CSS.

## Change content

Edit the corresponding component under `components/`. Header and footer are referenced by `app/layout.tsx`, never duplicated in `app/page.tsx`. Keep element IDs and `data-*` animation hooks when editing story markup.

The hero now uses a handset icon and **04 91 98 32 80**, linking to `tel:+33491983280`. Film controls within the mechanical story remain available.

Business metadata and the shared phone configuration are in `lib/site.ts`. Footer editorial content is in `components/layout/Footer.tsx`.

## Change animation speed

Edit `public/rigat-settings.js`, save and hard-refresh with Ctrl + F5. During development changes are served immediately. After export, rebuild, or update `out/rigat-settings.js` directly on your host.

| Setting | Current | Adjustment |
| --- | ---: | --- |
| `scrollSpeed` | 1.2 | Higher = faster global input/pacing |
| `introDurationMs` | 500 | Lower = faster banner-to-title transition |
| `zoomExtraTravel` | 0.03 | Higher = longer hold in the blue close-up |
| `scrollSeconds` | 12 | Higher = slower maximum story pace |
| `scrollSmoothingMs` | 50 | Higher = softer input response |
| `finalZoomTravel` | 0.07 | Lower = less physical scroll for final enlargement |
| `finalZoomDurationMs` | 1200 | Higher = slower paced final enlargement without more travel |

These values match your last screenshot and approved adjustments. Film playback keeps its existing timeline.

## SEO configuration

Copy `.env.example` to `.env.local`, then replace `NEXT_PUBLIC_SITE_URL` with your final public domain before building. Its default is the current deployed preview address. This value supplies canonical, Open Graph, sitemap and structured-data URLs.

Included: French document language, one H1, semantic sections/headings, title/description, canonical, Open Graph/Twitter metadata, vector favicon, image alt text, font/hero preloads, `app/robots.ts`, `app/sitemap.ts`, and LocalBusiness JSON-LD with the supplied address, phone and opening hours. No reviews or ratings are invented.

Contact information is transcribed from your reference. Quote buttons prepare a copyable summary in the browser; they do not automatically send email. Legal/contact and privacy disclosures preserve the previous site's content.

## Verification

- Next.js optimized static production build passed.
- Strict TypeScript validation passed.
- Exported HTML, IDs, local references, phone links, structured data, sitemap and robots checked.
- Source animation frames and model preserved.
- Browser visual verification was unavailable in this environment; device-specific smoothness and layout need a final browser check.

```bash
npm run typecheck
npm run format
```
