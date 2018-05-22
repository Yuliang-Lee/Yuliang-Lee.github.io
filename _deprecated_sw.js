// Identifier for this app (this needs to be consistent across every cache update)
const APP_PREFIX = 'xlaoyu_blog_';

// Version of the off-line cache (change this value everytime you want to update cache)
const VERSION = 'version_1.0.4';

const CACHE_NAME = APP_PREFIX + VERSION;
const URLS = [                // Add URL you want to cache in this list.
  // '/',                     // If you have separate JS/CSS files,
  '/index.html',              // add path to those files here
  '/css/main.css',
  '/js/main.js',
  'js/zepto.min.js',
  'js/smooth-scroll.min.js',
  'js/pageContent.js',
  'js/waterfall.js',
  'js/masonry.pkgd.min.js'
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    }).then(_ => {
      return self.skipWaiting()
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      // 以 app_prefix 开头这里会返回0，会被过滤掉
      // 所以 cacheWhitelist 只包含当前脚本最新的key或者其他脚本添加的 cache
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }));
    }).then(function () {
      // 更新客户端
      clients.claim();
    })
  );
});