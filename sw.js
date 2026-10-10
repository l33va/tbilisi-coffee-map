/* Tbilisi Coffee Map — offline support
   - App files are saved on first visit, so the app opens with no signal.
   - The page and shops.json are fetched fresh when online (with a short
     timeout for bad signal), so edits to shops.json show up right away.
   - Map tiles you've looked at are kept (up to MAX_TILES) for offline use.
   Bump VERSION whenever you change index.html, icons or vendor files. */

const VERSION = "v13";
const SHELL = `shell-${VERSION}`;
const FONTS = "fonts";
const TILES = "tiles";
const MAX_TILES = 400;
const NETWORK_TIMEOUT_MS = 3000;

const SHELL_FILES = [
  "./",
  "index.html",
  "shops.json",
  "manifest.json",
  "vendor/leaflet/leaflet.js",
  "vendor/leaflet/leaflet.css",
  "vendor/fonts/fonts.css",
  "vendor/fonts/archivo-black-latin-400-normal.woff2",
  "vendor/fonts/ibm-plex-mono-latin-400-normal.woff2",
  "vendor/fonts/ibm-plex-mono-latin-500-normal.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("shell-") && k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Page and shop list: fresh when possible, saved copy when not
  if (req.mode === "navigate" || (url.origin === location.origin && url.pathname.endsWith("/shops.json"))) {
    event.respondWith(networkFirst(req));
    return;
  }
  // Map tiles: keep what's been viewed
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(cacheFirst(req, TILES, MAX_TILES));
    return;
  }
  // Google Fonts: use saved copy, refresh in background
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(staleWhileRevalidate(req, FONTS));
    return;
  }
  // Everything else from this site: saved copy first
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req, SHELL));
  }
});

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), NETWORK_TIMEOUT_MS)),
    ]);
    if (res.ok) cache.put(req.mode === "navigate" ? "index.html" : req, res.clone());
    return res;
  } catch (e) {
    const saved = req.mode === "navigate"
      ? (await cache.match("index.html")) || (await cache.match("./"))
      : await cache.match(req, { ignoreSearch: true });
    return saved || Response.error();
  }
}

async function cacheFirst(req, name, limit) {
  const cache = await caches.open(name);
  const saved = await cache.match(req);
  if (saved) return saved;
  try {
    const res = await fetch(req);
    if (res.ok || res.type === "opaque") {
      await cache.put(req, res.clone());
      if (limit) trim(cache, limit);
    }
    return res;
  } catch (e) {
    return Response.error();
  }
}

async function staleWhileRevalidate(req, name) {
  const cache = await caches.open(name);
  const saved = await cache.match(req);
  const fresh = fetch(req).then(res => {
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  }).catch(() => saved || Response.error());
  return saved || fresh;
}

async function trim(cache, limit) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - limit; i++) await cache.delete(keys[i]);
}
