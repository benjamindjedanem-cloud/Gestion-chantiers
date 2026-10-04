const CACHE_NAME = 'gestion-chantiers-v10';
const APP_SHELL = ['./', './index.html', './manifest.json', './gc-icon-v10.ico', './icons/gc-icon-v10-16.png', './icons/gc-icon-v10-32.png', './icons/gc-icon-v10-48.png', './icons/gc-icon-v10-96.png', './icons/gc-icon-v10-144.png', './icons/gc-icon-v10-192.png', './icons/gc-icon-v10-256.png', './icons/gc-icon-v10-384.png', './icons/gc-icon-v10-512.png', './icons/gc-icon-v10-1024.png', './icons/gc-icon-v10-180.png', './icons/gc-icon-v10-maskable-512.png', './icons/gc-logo-v10-header.png'];

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
