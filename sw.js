const CACHE_NAME = 'vivek-portfolio-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/skills.html',
    '/projects.html',
    '/gallery.html',
    '/contact.html',
    '/offline.html',
    '/style.css',
    '/script.js',
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
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                
                if (response) {
                    return response;
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
                    
                    return caches.match('/offline.html');
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
    self.clients.claim();
});
