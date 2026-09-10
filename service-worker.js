const C='genshin-tracker-v5-1-cache';
const A=['./','./index.html','./styles.css','./app.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{
  const z=r.clone();caches.open(C).then(c=>c.put(e.request,z));return r;
 }).catch(()=>x)));
});