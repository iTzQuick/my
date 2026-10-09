/* Service worker di «my»: il gioco funziona anche offline e si aggiorna da solo.
   VERSIONE viene sostituita da build.py a ogni build: cambia il file → il telefono scarica la nuova versione. */
const VERSIONE='__VERSIONE__';
const CACHE='my-'+VERSIONE, FONT='my-font';
const GUSCIO=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icona-192.png','icona-512.png','icona-maskable-512.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(GUSCIO)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k!==CACHE&&k!==FONT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});

self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  // Google Fonts: dalla cache se c'è, altrimenti dalla rete (e li conserva)
  if(url.hostname.endsWith('fonts.googleapis.com')||url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.open(FONT).then(c=>c.match(req).then(h=>h||fetch(req).then(r=>{c.put(req,r.clone());return r}))));return;
  }
  if(url.origin!==location.origin)return;
  // la pagina: prima la rete (per avere gli aggiornamenti), senza rete la copia salvata
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html')));return;
  }
  e.respondWith(caches.match(req).then(h=>h||fetch(req)));
});
