self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('my-radio-pwa-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/script.js',
        '/styles.css',
      ]);
    })
  );
});