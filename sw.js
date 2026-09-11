// Aken — Service Worker v9.0 (Updated logo & separate favoricon)
const CACHE_NAME = 'aken-v9';

const APP_SHELL = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/blog.css',
  '/js/main.js',
  '/js/i18n.js',
  '/js/payment.js',
  '/js/sw-register.js',
  '/js/blog.js',
  '/manifest.json',
  '/offline.html',
  '/assets/logo.png',
  '/assets/favoricon.png',
  '/assets/og-cover.png',
  '/lang/fr.json',
  '/lang/en.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(APP_SHELL); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) { return name !== CACHE_NAME; })
                  .map(function(name) { return caches.delete(name); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/admin')) return; // Toujours réseau direct pour l'espace admin

  // Network-first for everything to ensure instant updates with offline support
  event.respondWith(networkFirst(event.request));
});

function cacheFirst(request) {
  return caches.match(request).then(function(cached) {
    if (cached) return cached;
    return fetch(request).then(function(response) {
      if (response.ok) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(request, clone); });
      }
      return response;
    });
  }).catch(function() { return caches.match('/offline.html'); });
}

function networkFirst(request) {
  return fetch(request).then(function(response) {
    if (response.ok) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(request, clone); });
    }
    return response;
  }).catch(function() {
    return caches.match(request).then(function(cached) {
      return cached || caches.match('/offline.html');
    });
  });
}

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
