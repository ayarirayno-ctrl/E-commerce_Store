// Service Worker for PWA - Offline Support & Caching
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `ecommerce-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_CACHE_URLS);
    }).then(() => {
      // Force the waiting service worker to become active
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then((response) => {
            // If page is in cache, return it
            if (response) {
              return response;
            }
            // Otherwise return offline page
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // Handle API requests (cache-first for GET, network-only for others)
  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET') {
      // Cache-first strategy for API GET requests
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response and update cache in background
            fetch(request).then((networkResponse) => {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse.clone());
              });
            }).catch(() => {
              // Network failed, but we have cache
            });
            return cachedResponse;
          }
          
          // No cache, fetch from network
          return fetch(request).then((response) => {
            // Cache the response
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response.clone());
            });
            return response;
          });
        })
      );
    } else {
      // Network-only for non-GET API requests (POST, PUT, DELETE)
      event.respondWith(fetch(request));
    }
    return;
  }

  // Handle static assets (JS, CSS, images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone and cache the response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // If it's an image, return a placeholder
        if (request.destination === 'image') {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="sans-serif" font-size="16">Image Unavailable</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }
        
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
  
  if (event.tag === 'sync-wishlist') {
    event.waitUntil(syncWishlist());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-96.png',
    vibrate: [200, 100, 200],
    tag: 'ecommerce-notification',
    requireInteraction: false,
  };
  
  event.waitUntil(
    self.registration.showNotification('E-Commerce Store', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Helper functions for background sync
async function syncCart() {
  // Sync cart data from localStorage to server
  console.log('[Service Worker] Syncing cart...');
  // Implementation would depend on your backend API
}

async function syncWishlist() {
  // Sync wishlist data from localStorage to server
  console.log('[Service Worker] Syncing wishlist...');
  // Implementation would depend on your backend API
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');
