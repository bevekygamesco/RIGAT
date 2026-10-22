> Reference for the included update. It is already applied in this full project; do not apply a patch again.

# RIGAT — dedicated mobile edition (code-only patch)

Apply this to your existing RIGAT Next.js App Router project. No new dependencies or image downloads are required. Includes the frame-store helper from the previous loading/cache patch.

## Install

1. Back up your project.
2. Copy `app`, `components`, `lib`, and `styles` from this ZIP into your project root. Allow replacing the matching files. Keep all other files.
3. Run `npm run dev` for development, or `npm run build` and deploy your usual production output.

If you customized any replacement file, merge those changes rather than replacing your custom version blindly.

Your root layout, header/footer components, back-to-top component, public/rigat-settings.js, SEO metadata, model, Blender source, and animation images are not replaced.

## Mobile design

At 760px and below:
- Dedicated product hero with the original shutter, reflection, blue SVG forms, project CTA and direct call link.
- Normal native page scrolling. The desktop scroll animation is not initialized on a phone.
- Independent canvas player using your existing mobile animation frames: six chapters and a 12-second film. The page does not scroll while the film plays.
- No automatic video playback. Chapter taps animate between views; reduced-motion preference shows the selected view directly.
- Player pauses when offscreen or when the tab is hidden.
- Real loading progress and persistent versioned frame caching are retained.
- Larger typography, readable cards, clearer process, touch-friendly FAQ, contact form with 16px fields, and a redesigned footer layout.
- Three-by-two chapter controls on the smallest screens.

Above 760px:
- Existing desktop/tablet markup, CSS, model framing, and scrolling stay in use.
- The mobile interface is hidden and does not initialize its frame downloads or player.
- Added guards stop the desktop animation engine if the viewport changes to a phone width.

## Structure

`app/page.tsx` still contains section components only. Header and footer stay in your existing root layout.

New:
- components/mobile/MobileExperience.tsx — dedicated mobile hero and interactive model player.
- styles/rigat-mobile.css — mobile-only styling, imported last from globals.css.
- lib/animation/mobile-shell.js — mobile navigation and the existing local contact-summary dialog.

Updated:
- app/page.tsx
- app/globals.css
- components/experience/ExperienceRuntime.tsx
- lib/animation/app.js (mobile viewport guard only, on top of the cache patch)
- lib/animation/hero.js (mobile viewport guard only)
- lib/animation/story-scroll.js (native scrolling on phones)
- lib/animation/rigat-intro.js (mobile preload progress)

Included dependency:
- lib/animation/frame-store.js (from the previous loading/cache patch)

The contact form still prepares a local summary. It does not send an email automatically.

## Adjust later

- Mobile colors, spacing, type sizes: styles/rigat-mobile.css.
- Chapter names, descriptions and frame numbers: `chapters` at the top of MobileExperience.tsx.
- Mobile film duration: `* 12000` in the player's toggle() function (milliseconds).
- Cache/loading: FRAME_LOADING at the top of frame-store.js.
- Desktop scroll speed/zoom: your existing public/rigat-settings.js.

## Verification

Production build and strict TypeScript passed. Browser QA used 320px, 390px, 430px and 760px iframe viewports, plus the desktop viewport. Checked horizontal overflow, header/menu, chapter selection, model rendering, local form summary, FAQ, and desktop rendering. The mobile-only CSS scope and desktop player guard were checked programmatically.

Browser viewport checks do not substitute for touch-device testing on actual Android/iPhone hardware.
