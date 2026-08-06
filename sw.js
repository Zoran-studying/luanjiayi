const CACHE = "pushmian-buddy-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./css/styles.css",
  "./js/data-profile.js",
  "./js/data-questions.js",
  "./js/data-qa.js",
  "./js/data-vocab.js",
  "./js/data-docs.js",
  "./js/core.js",
  "./js/views.js",
  "./js/flashcards.js",
  "./js/voice.js",
  "./js/interview.js",
  "./js/app.js"
];

self.addEventListener("install", ev => {
  ev.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// network-first（在线优先）：保证升级后立即拿到新代码；离线时回退缓存
self.addEventListener("fetch", ev => {
  if(ev.request.method !== "GET") return;
  const url = new URL(ev.request.url);
  if(url.origin !== location.origin) return;
  ev.respondWith(
    fetch(ev.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(ev.request, copy));
      return res;
    }).catch(() => caches.match(ev.request).then(hit => hit || caches.match("./")))
  );
});