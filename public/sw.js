const CACHE_NAME = 'gestion-chantiers-v12';
const APP_SHELL = ['./', './index.html', './manifest.json', './gc-icon-v12.ico', './icons/gc-icon-v12-16.png', './icons/gc-icon-v12-24.png', './icons/gc-icon-v12-32.png', './icons/gc-icon-v12-48.png', './icons/gc-icon-v12-64.png', './icons/gc-icon-v12-96.png', './icons/gc-icon-v12-128.png', './icons/gc-icon-v12-144.png', './icons/gc-icon-v12-180.png', './icons/gc-icon-v12-192.png', './icons/gc-icon-v12-256.png', './icons/gc-icon-v12-384.png', './icons/gc-icon-v12-512.png', './icons/gc-icon-v12-1024.png', './icons/gc-icon-v12-maskable-512.png', './icons/gc-logo-v12-header.png'];

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

// Réseau en priorité; cache seulement en repli hors-ligne.
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
