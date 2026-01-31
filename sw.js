const CACHE_NAME = 'suvatimih-cache-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/translations.js',
  '/thank-you.html',
  '/offline.html',
  '/images/icon-192.svg',
  '/images/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation requests: network first, fallback to offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Images: Cache-first with runtime caching
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images-cache').then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(networkResp => {
            cache.put(event.request, networkResp.clone());
            return networkResp;
          }).catch(() => caches.match('/images/icon-192.png'));
        })
      )
    );
    return;
  }

  // Other requests: cache-first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});