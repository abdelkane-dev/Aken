// Aken — Service Worker v20.0 (12 pages articles SEO + sitemap)
const CACHE_NAME = 'aken-v22';

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
  '/js/communaute.js',
  '/css/communaute.css',
  '/communaute.html',
  '/articles/automatiser-business-mali.html',
  '/articles/paiement-mobile-mali.html',
  '/articles/app-connexion-lente.html',
  '/articles/papier-vers-logiciel.html',
  '/articles/cloud-vs-vps-mali.html',
  '/articles/securiser-donnees-mali.html',
  '/articles/pwa-vs-app-native.html',
  '/articles/ingenierie-donnees-excel.html',
  '/articles/devenir-freelance-tech-mali.html',
  '/articles/securiser-vps-mali.html',
  '/articles/boutique-en-ligne-mali.html',
  '/articles/design-premium-sombre.html',
  '/articles/choisir-base-donnees-pme.html',
  '/articles/structurer-donnees-pme.html',
  '/articles/securiser-boutique-commercant-mali.html',
  '/articles/fraude-mobile-money-commercant.html',
  '/manifest.json',
  '/offline.html',
  '/assets/logo.png',
  '/assets/logo-light.png',
  '/assets/logo-240.webp',
  '/assets/logo-320.webp',
  '/assets/logo-light-240.webp',
  '/assets/logo-light-320.webp',
  '/assets/logo.webp',
  '/assets/logo-light.webp',
  '/assets/fonts/fonts.css',
  '/assets/fonts/inter-latin.woff2',
  '/assets/fonts/montserrat-latin.woff2',
  '/assets/fonts/jetbrains-mono-latin.woff2',
  '/assets/mascot.svg',
  '/assets/pwa-192.png',
  '/assets/pwa-512.png',
  '/assets/pwa-maskable-512.png',
  '/assets/apple-touch-icon.png',
  '/assets/favicon.svg',
  '/assets/favoricon.png',
  '/assets/og-cover.png',
  '/assets/og-communaute.png',
  '/assets/og-blog.png',
  '/assets/blog/cover-1.svg',
  '/assets/blog/cover-2.svg',
  '/assets/blog/cover-3.svg',
  '/assets/blog/cover-4.svg',
  '/assets/blog/cover-5.svg',
  '/assets/blog/cover-6.svg',
  '/assets/blog/cover-7.svg',
  '/assets/blog/cover-8.svg',
  '/assets/blog/cover-9.svg',
  '/assets/blog/cover-10.svg',
  '/assets/blog/cover-11.svg',
  '/assets/blog/cover-12.svg',
  '/assets/blog/cover-13.svg',
  '/assets/blog/cover-14.svg',
  '/assets/blog/cover-15.svg',
  '/assets/blog/cover-16.svg',
  '/assets/og/og-article-1.png',
  '/assets/og/og-article-2.png',
  '/assets/og/og-article-3.png',
  '/assets/og/og-article-4.png',
  '/assets/og/og-article-5.png',
  '/assets/og/og-article-6.png',
  '/assets/og/og-article-7.png',
  '/assets/og/og-article-8.png',
  '/assets/og/og-article-9.png',
  '/assets/og/og-article-10.png',
  '/assets/og/og-article-11.png',
  '/assets/og/og-article-12.png',
  '/assets/og/og-article-13.png',
  '/assets/og/og-article-14.png',
  '/assets/og/og-article-15.png',
  '/assets/og/og-article-16.png',
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
