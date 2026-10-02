const CACHE_NAME = 'vivek-portfolio-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/skills.html',
    '/projects.html',
    '/gallery.html',
    '/developer-guide.html',
    '/iot.html',
    '/terminal.html',
    '/contact.html',
    '/offline.html',
    '/style.css',
    '/terminal.css',
    '/script.js',
    '/skills.js',
    '/terminal.js',
    '/scroll-jacking.css',
    '/manifest.json',
    '/photos/logo.png',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);

    // CRITICAL: Do NOT intercept video or audio streaming requests!
    // Video streaming requires HTTP 206 Partial Content and Range headers.
    // Intercepting video requests breaks media playback and corrupts cache.
    if (
        event.request.headers.get('range') ||
        event.request.destination === 'video' ||
        event.request.destination === 'audio' ||
        url.pathname.endsWith('.mp4') ||
        url.pathname.endsWith('.webm') ||
        url.pathname.endsWith('.wav') ||
        url.pathname.endsWith('.ogg')
    ) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                }).catch(() => {
                    // CRITICAL FIX: Only return offline.html for HTML page navigation!
                    // Returning HTML for aborted/queued image requests causes the browser
                    // to receive HTML text for <img> tags, rendering broken image placeholders.
                    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
                        return caches.match('/offline.html');
                    }
                    return new Response('', { status: 408, statusText: 'Request Timeout' });
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
        }).then(() => self.clients.claim())
    );
});
