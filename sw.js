/* Querious service worker — makes the web app installable & offline-capable.
   Cache-first: after the first online load, the app shell + the SQL/Python/pandas
   runtimes (from jsdelivr) are cached, so subsequent loads work offline. */
const CACHE = 'querious-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isDoc = req.mode === 'navigate' ||
    url.pathname.endsWith('/') || url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('manifest.webmanifest');

  if (isDoc) {
    // Network-first: always get the latest page when online; fall back to cache offline.
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((h) => h || caches.match('./index.html')))
    );
    return;
  }

  // Everything else (versioned CDN runtimes, icons, wasm): cache-first.
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        if (url.origin === location.origin || url.host.indexOf('cdn.jsdelivr.net') !== -1) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => undefined)
    )
  );
});
