const CACHE_NAME = 'vivek-portfolio-v8';
const urlsToCache = [
    '/',
    '/index.html',
    '/index.md',
    '/llms.txt',
    '/about.html',
    '/skills.html',
    '/projects.html',
    '/gallery.html',
    '/developer-guide.html',
    '/iot.html',
    '/terminal.html',
    '/contact.html',
    '/terms.html',
    '/offline.html',
    '/style.css',
    '/terminal.css',
    '/script.js',
    '/webmcp.js',
    '/skills.js',
    '/terminal.js',
    '/scroll-jacking.css',
    '/manifest.json',
    '/favicon.ico',
    '/photos/logo-opt.webp',
    '/photos/hero-portrait.webp',
    '/photos/hero-scratch.webp',
    '/photos/logo.png',
    '/photos/apple-touch-icon.png',
    '/photos/favicon-32x32.png',
    '/photos/favicon-64x64.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;700&family=Outfit:wght@400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.allSettled(
                urlsToCache.map(url =>
                    cache.add(url).catch(err => {
                        console.warn('SW cache pre-fetch skipped for:', url);
                    })
                )
            );
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

    // Serve Markdown representation when agents request text/markdown
    const acceptHeader = event.request.headers.get('accept') || '';
    if (acceptHeader.includes('text/markdown')) {
        if (url.pathname === '/' || url.pathname === '/index.html') {
            event.respondWith(
                caches.match('/index.md').then(cached => cached || fetch('/index.md'))
            );
            return;
        }
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then(response => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                }).catch(() => {
                    // For document navigation, return offline page
                    if (event.request.mode === 'navigate' || event.request.destination === 'document') {
                        return caches.match('/offline.html');
                    }
                    // For image requests, try matching without query params or return cached image
                    if (event.request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|webp|ico)$/i)) {
                        return caches.match(event.request).then(imgMatch => {
                            if (imgMatch) return imgMatch;
                            // Fallback to logo or empty transparent image
                            return caches.match('/photos/logo.png');
                        });
                    }
                    return caches.match(event.request);
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
