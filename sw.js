// Panhandle Neighbors (protected) service worker – caches ONLY the lock-screen shell, the encrypted data.enc and static icons/manifest.
const CACHE='bmn-protected-2026-10-25T025314Z';const ASSETS=["./", "./index.html", "./data.enc", "./manifest.json", "./icons/apple-touch-icon.png", "./icons/favicon-32.png", "./icons/favicon-64.png", "./icons/favicon.ico", "./icons/favicon.svg", "./icons/icon-192.png", "./icons/icon-512-maskable.png", "./icons/icon-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>fetch(u,{credentials:'same-origin',cache:'no-cache'}).then(r=>{if(r.ok)return c.put(u,r);}).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const ALLOW=new Set(ASSETS.map(a=>new URL(a,self.registration.scope).pathname));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin||!ALLOW.has(u.pathname))return;
  // network first (fresh data after a rebuild), cached copy when offline; never cache error/401 responses
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(new Request(u.origin+u.pathname),c)).catch(()=>{});}
    return r.status===401?caches.match(e.request,{ignoreSearch:true}).then(m=>m||r):r;}).catch(()=>caches.match(e.request,{ignoreSearch:true})));});
