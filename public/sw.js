const CACHE_NAME = 'gestion-chantiers-v9';
const APP_SHELL = ['./', './index.html', './manifest.json', './gc-icon-v9.ico', './icons/gc-icon-v9-16.png', './icons/gc-icon-v9-32.png', './icons/gc-icon-v9-48.png', './icons/gc-icon-v9-96.png', './icons/gc-icon-v9-144.png', './icons/gc-icon-v9-192.png', './icons/gc-icon-v9-256.png', './icons/gc-icon-v9-512.png', './icons/gc-icon-v9-maskable-512.png', './icons/gc-logo-v9-header.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Réseau en priorité (toujours la dernière version en ligne), cache seulement en repli hors-ligne
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
