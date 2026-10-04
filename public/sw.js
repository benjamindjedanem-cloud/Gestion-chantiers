const CACHE_NAME = 'gestion-chantiers-v8';
const APP_SHELL = ['./', './index.html', './manifest.json', './favicon.ico', './icons/icon-16.png', './icons/icon-32.png', './icons/icon-48.png', './icons/icon-96.png', './icons/icon-144.png', './icons/icon-192.png', './icons/icon-256.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/app-logo.png', './icons/app-logo-ui.png'];

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
