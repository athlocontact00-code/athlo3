// ATHLO Service Worker - PWA Implementation
const CACHE_NAME = 'athlo-v1';
const OFFLINE_URL = '/offline';

// Assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/calendar',
  '/diary',
  '/offline',
  '/manifest.json',
  // Core UI components that don't change often
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
];

// API endpoints to cache with network-first strategy
const API_CACHE_PATTERNS = [
  /^\/api\/user/,
  /^\/api\/workouts/,
  /^\/api\/calendar/,
  /^\/api\/checkin/,
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('ATHLO SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ATHLO SW: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('ATHLO SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('ATHLO SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If successful, clone and cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => {
          // If offline, try to serve from cache or fallback to offline page
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Serve offline page for navigation requests
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // Handle API requests - Network First strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('ATHLO SW: Serving API from cache:', request.url);
                return cachedResponse;
              }
              // Return a proper error response for API calls
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'This feature requires an internet connection.' 
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle static assets - Cache First strategy
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.includes('/icons/') ||
      url.pathname.includes('/_next/static/')) {
    
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache, fetch and cache
          return fetch(request)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(request, responseClone));
              }
              return response;
            });
        })
        .catch(() => {
          console.log('ATHLO SW: Failed to load asset:', request.url);
          // Return a fallback for failed asset requests
          return new Response('', { status: 404 });
        })
    );
    return;
  }

  // For all other requests, use network first with cache fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for offline actions (if needed)
self.addEventListener('sync', event => {
  console.log('ATHLO SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'checkin-sync') {
    event.waitUntil(
      // Handle offline check-ins when connection is restored
      syncOfflineCheckins()
    );
  }
});

// Push notification handler
self.addEventListener('push', event => {
  console.log('ATHLO SW: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-96.svg',
      tag: data.tag || 'athlo-notification',
      data: data.data,
      actions: data.actions,
      requireInteraction: data.requireInteraction || false,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('ATHLO SW: Notification clicked');
  
  event.notification.close();
  
  const clickAction = event.action;
  const notificationData = event.notification.data;
  
  let targetUrl = '/dashboard';
  
  if (clickAction === 'checkin') {
    targetUrl = '/diary?action=checkin';
  } else if (clickAction === 'workout') {
    targetUrl = '/dashboard?view=today';
  } else if (notificationData?.url) {
    targetUrl = notificationData.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Helper function for syncing offline check-ins
async function syncOfflineCheckins() {
  try {
    // This would integrate with your offline storage system
    console.log('ATHLO SW: Syncing offline check-ins...');
    // Implementation would depend on your offline storage solution
    // (e.g., IndexedDB, localStorage, etc.)
  } catch (error) {
    console.error('ATHLO SW: Failed to sync offline check-ins:', error);
  }
}

// Cache cleanup helper
function cleanupOldCaches() {
  return caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName !== CACHE_NAME) {
          return caches.delete(cacheName);
        }
      })
    );
  });
}