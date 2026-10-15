const CACHE_NAME = 'gestion-chantiers-v13';
// Coquille minimale pré-cachée à l'installation. Le reste (JS/CSS générés, polices)
// est mis en cache au premier chargement par le gestionnaire fetch ci-dessous.
const APP_SHELL = ['./', './index.html', './manifest.json', './gc-icon-v12.ico', './icons/gc-icon-v12-32.png', './icons/gc-icon-v12-128.png', './icons/gc-icon-v12-180.png', './icons/gc-icon-v12-192.png', './icons/gc-icon-v12-512.png', './icons/gc-icon-v12-maskable-512.png'];
// Origines tierces dont on accepte de mettre les réponses en cache.
const CACHEABLE_ORIGINS = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

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

// Réseau en priorité ; cache seulement en repli hors-ligne.
// Les requêtes vers d'autres serveurs (API, authentification…) ne sont jamais interceptées.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin && !CACHEABLE_ORIGINS.includes(origin)) return;
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
