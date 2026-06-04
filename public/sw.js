/**
 * Minimal service worker — does just enough for ExamGrind to qualify
 * as an installable PWA without breaking dynamic content.
 *
 * Why minimal:
 *  - The app is mostly server-rendered with per-user state (exam_choice,
 *    quiz progress, mastery). Aggressive caching would show one user's
 *    home screen to the next — bad.
 *  - All we strictly need for installability is a registered SW with a
 *    fetch handler. We let everything pass through to the network with
 *    a tiny offline fallback for the start_url so the installed app
 *    doesn't open to a Chrome error when the user has no signal.
 *
 * If we add complex caching later, do it here — version the cache name
 * and call self.skipWaiting() so updates roll out cleanly.
 */

const CACHE_VERSION = "examgrind-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.add(new Request(OFFLINE_URL, { cache: "reload" }))
    )
  );
});

self.addEventListener("activate", (event) => {
  // Clean up old cache versions on upgrade
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only network-first for navigations; everything else (API calls,
  // auth, Razorpay, Supabase) goes straight through.
  if (req.mode !== "navigate") return;

  event.respondWith(
    fetch(req).catch(() =>
      caches.match(OFFLINE_URL).then((resp) => resp ?? Response.error())
    )
  );
});
