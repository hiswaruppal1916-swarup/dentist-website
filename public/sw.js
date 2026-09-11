// Service Worker for Dental Paradise PWA & Web Push Notifications
const CACHE_NAME = 'dental-paradise-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.ico',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/apple-touch-icon.png',
  '/manifest.webmanifest',
  '/images/dr-supriyo-sahu.jpg',
  '/images/dental-paradise-card.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Cache with Network Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Do not cache Supabase API calls or chrome-extensions
  if (url.origin.includes('supabase.co') || url.origin.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => caches.match('/'));
    })
  );
});

// Push Notification Handler with Clinic Favicon
self.addEventListener('push', (event) => {
  let data = {
    title: 'Dental Paradise',
    body: 'You have a new update from Dental Paradise clinic.',
    url: '/appointment-status'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      { action: 'open', title: 'View Details' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Dental Paradise', options)
  );
});

// Notification Click Handler - In-App SPA Navigation & Safe Fallback
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  let rawUrl = event.notification.data?.url || '/';
  let targetUrl = rawUrl;
  try {
    targetUrl = new URL(rawUrl, self.location.origin).href;
  } catch (e) {
    targetUrl = self.location.origin + '/';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a Dental Paradise tab is already open, focus it and tell it to navigate via SPA router
      for (const client of clientList) {
        if (client.url && client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'DP_NAVIGATE', url: targetUrl });
          return client.focus();
        }
      }
      // If no window is open, open the URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
