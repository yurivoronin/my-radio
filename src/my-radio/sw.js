self.addEventListener('install', event => {
  const BASE = '/my-radio';

  event.waitUntil(
    caches.open('my-radio-pwa-cache').then(cache => {
      return cache.addAll([
        `${BASE}/`,
        `${BASE}/index.html`,
        `${BASE}/main.js`,
        `${BASE}/styles.css`,
      ]);
    })
  );
});