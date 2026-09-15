const CACHE='evia3-v24';
const APP=['./','./index.html','./styles.css?v=17','./activity-tidy.css?v=15','./evia-task-flow.css?v=12','./evia-naxos.css?v=1','./avatar.js?v=15','./course.js?v=19','./evia-task-flow.js?v=12','./manifest.webmanifest?v=18'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match('./index.html'))));});
