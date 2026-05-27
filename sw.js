const CACHE_NAME = "moodix-v2";
const ASSETS = [
  "./",
  "index.html",
  "mood-check.html",
  "import.html",
  "app-version.html",
  "signup.html",
  "styles.css",
  "app.js?v=2",
  "manifest.webmanifest",
  "assets/moodix-hero.png",
  "assets/icon.svg",
  "assets/apple-touch-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
