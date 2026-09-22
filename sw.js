/* オフライン対応（https で配信したときだけ有効。http://192.168... では登録されない）
   方針:
   - 画像・音声（assets/ 配下の png/mp3）: キャッシュ優先（変わらないので速く）
   - それ以外（HTML/JS/CSS/JSON）: ネット優先、失敗したらキャッシュ（更新がすぐ届く） */
const CACHE = 'asobi-202609222341';
const CORE = ['./', './index.html', './common.css', './common.js', './catalog.js', './games.js', './game.css', './manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const isAsset = (url) => /\/assets\/.*\.(png|mp3|jpg|webp)$/.test(url.pathname);

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (isAsset(url)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    })));
  } else {
    // ブラウザの HTTP キャッシュに古い JS が残ることがあるので、必ずサーバーに確認する
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request)));
  }
});
