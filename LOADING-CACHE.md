> Reference for the included update. It is already applied in this full project; do not apply a patch again.

# RIGAT loading and caching patch

For the RIGAT-NextJS-AppRouter project. This contains only changed code, not the full project.

## Install

1. Back up your existing `lib/animation/app.js` and `lib/animation/rigat-intro.js`.
2. Copy this patch's `lib` folder into your project root and allow replacing the two files.
3. This also adds `lib/animation/frame-store.js`. Keep all three files together.
4. Restart `npm run dev`. For production run `npm run build` and redeploy the new output.

No dependencies, JSX/TSX, CSS, model images, or existing scroll settings need changing.
If you edited app.js or rigat-intro.js since the supplied Next.js ZIP, merge those custom edits before replacing them.

## What changes

- Preloads all 281 compressed frames for the screen size selected at startup.
- Prioritizes demanded frames over background downloads, with at most four concurrent frame requests.
- Reads/writes a versioned browser Cache Storage cache for later visits (HTTPS or localhost).
- Falls back to ordinary downloads if storage is unavailable or full.
- Keeps compressed images in memory and only a sliding window of decoded images (16 mobile / 28 desktop).
- The existing cinematic intro shows actual downloaded-frame progress, waits for completion, and reveals automatically after at most 8 seconds. Skip and Escape still work.
- Remaining downloads continue after skip or timeout; the timeout does not mean every frame is ready.
- Reduced motion and browser Data Saver disable full automatic prefetch. Nearby frames still load on demand.
- The selected mobile/desktop frame set stays fixed until reload, avoiding mixed-resolution cached frames during resizing.

## Adjust loading

Open `lib/animation/frame-store.js`. Settings are at the top:

```js
export const FRAME_LOADING = Object.freeze({
  assetVersion: '13',      // Change to '14', '15', etc. ONLY when replacing frames.
  preloadAll: true,       // true: preload entire animation; false: nearby frames only.
  connections: 4,         // Maximum simultaneous frame requests.
  requestTimeoutMs: 12000,
  introMinMs: 2100,       // Minimum cinematic intro duration.
  introMaxMs: 8000,       // Maximum wait, even if downloads are unfinished.
});
```

Your existing `public/rigat-settings.js` still controls scroll and zoom.
Changing loading code requires rebuilding production, unlike editing public/rigat-settings.js.

Caching reduces repeat downloads; it cannot eliminate first-visit download time or guarantee device playback performance. Browsers may clear stored images. When animation files change, increase assetVersion so old files are not reused.

## Optional check

On HTTPS or localhost, open browser developer tools > Application > Cache Storage.
A `rigat-sequence-13-frames-hd` or `rigat-sequence-13-frames-mobile-hd` cache should populate.
Reload normally and check that it reuses these files. To simulate a first visit, delete that cache.

## Validation performed

JavaScript syntax and TypeScript checks passed. Simulated checks passed for request deduplication, concurrency, foreground priority, persistent-cache reuse, mobile selection, storage denial, failed-request retry, reduced motion, Data Saver, real progress, skip, loading timeout, and scroll/inert restoration. Browser/device visuals and frame rate were not measured.
