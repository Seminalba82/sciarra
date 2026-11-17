// Service worker di SCIARRA: permette l'installazione come app.
// La pagina si prende sempre da internet (così gli aggiornamenti arrivano subito); se manca la rete usa la copia salvata.
const VERSION = "v2.6";
const CACHE = "sciarra-" + VERSION;
const PRECACHE = ["/", "/musica.mp3", "/icons/icon-192.png", "/icons/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("sciarra-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)).catch(() => {}); return res; }).catch(() => caches.match(r).then((m) => m || caches.match("/"))));
});
