const CACHE_NAME = 'cipta-karya-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './js/utils.js',
  './js/components.js',
  './js/store.js',
  './js/app.js',
  './js/supabase-client.js',
  './js/pages/login.js',
  './js/pages/landing.js',
  './js/pages/dashboard.js',
  './js/pages/documents.js',
  './js/pages/projects.js',
  './js/pages/users.js',
  './js/pages/activity.js',
  './js/pages/settings.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  // Ignore external API requests (e.g. Supabase)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) return response;
        
        // Clone request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          // Jika offline dan me-request HTML/navigasi, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
