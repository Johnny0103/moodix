const CACHE_NAME = "moodix-v8";
const ASSETS = [
  "./",
  "index.html",
  "mood-check.html",
  "import.html",
  "result.html",
  "app-version.html",
  "refresh.html",
  "signup.html",
  "styles.css?v=7",
  "app.js?v=8",
  "manifest.webmanifest",
  "assets/moodix-hero.png",
  "assets/icon.svg",
  "assets/apple-touch-icon.svg"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
