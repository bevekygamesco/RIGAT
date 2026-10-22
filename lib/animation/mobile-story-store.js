// Change assetVersion whenever you replace the animation image files.
export const FRAME_LOADING = Object.freeze({
  assetVersion: '1',
  preloadAll: true,
  connections: 2,
  requestTimeoutMs: 12000,
  introMinMs: 2100,
  introMaxMs: 8000,
});

/** Compressed files stay in memory; only nearby frames are decoded by app.js.
 * Cache Storage works without a service worker. Storage denial/quota failure
 * falls back to ordinary downloads and this visit's in-memory cache.
 */
export function createMobileStoryStore({ count, mobile, reduced }) {
  const folder = 'frames-mobile-story';
  const cacheName = `rigat-sequence-${FRAME_LOADING.assetVersion}-${folder}`;
  const blobs = new Map();
  const jobs = new Map();
  const queue = [];
  const errors = new Set();
  let active = 0;
  let persistent;
  let preloadStarted = false;
  const connection = navigator.connection;
  const canPreload = FRAME_LOADING.preloadAll && !reduced && !connection?.saveData && !['slow-2g','2g','3g'].includes(connection?.effectiveType);

  function url(index) {
    return `/assets/${folder}/frame_${String(index).padStart(4, '0')}.webp?v=${FRAME_LOADING.assetVersion}`;
  }

  function diskCache() {
    persistent ??= (async () => {
      try {
        if (!globalThis.isSecureContext || !globalThis.caches) return null;
        return await caches.open(cacheName);
      } catch { return null; }
    })();
    return persistent;
  }

  async function download(index) {
    const address = url(index);
    const disk = await diskCache();
    try {
      const hit = await disk?.match(address);
      if (hit?.ok) return await hit.blob();
    } catch { /* Storage is optional. */ }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FRAME_LOADING.requestTimeoutMs);
    try {
      const response = await fetch(address, { cache: 'force-cache', signal: controller.signal });
      if (!response.ok) throw new Error(`Frame ${index}: HTTP ${response.status}`);
      const blob = await response.blob();
      if (!blob.size) throw new Error(`Frame ${index}: empty image`);
      // Consume the network body before releasing the concurrency slot.
      // Persist separately so a slow disk never stalls the visible frame.
      if (disk) void disk.put(address, new Response(blob, {
        headers: { 'Content-Type': blob.type || 'image/webp' },
      })).catch(() => {});
      return blob;
    } finally { clearTimeout(timeout); }
  }

  function pump() {
    queue.sort((a, b) => a.priority - b.priority || a.index - b.index);
    while (active < FRAME_LOADING.connections && queue.length) {
      const job = queue.shift();
      active++;
      download(job.index).then(blob => {
        blobs.set(job.index, blob);
        errors.delete(job.index);
        job.resolve(blob);
      }, error => {
        errors.add(job.index);
        job.reject(error);
      }).finally(() => {
        jobs.delete(job.index);
        active--;
        pump();
      });
    }
  }

  function get(index, priority = 0) {
    if (blobs.has(index)) return Promise.resolve(blobs.get(index));
    const existing = jobs.get(index);
    if (existing) {
      existing.priority = Math.min(existing.priority, priority);
      pump();
      return existing.promise;
    }
    const job = { index, priority };
    job.promise = new Promise((resolve, reject) => {
      job.resolve = resolve;
      job.reject = reject;
    });
    jobs.set(index, job);
    queue.push(job);
    pump();
    return job.promise;
  }

  function preloadAll() {
    if (!canPreload || preloadStarted) return;
    preloadStarted = true;
    // One queue shared with playback: demanded frames always outrank prefetch.
    for (let i = 0; i < count; i++) void get(i, 1000).catch(() => {});
  }

  function status() {
    return {
      total: count,
      downloaded: blobs.size,
      failed: errors.size,
      active,
      complete: blobs.size === count,
      preloading: preloadStarted && blobs.size < count,
    };
  }

  return { get, preloadAll, status };
}
