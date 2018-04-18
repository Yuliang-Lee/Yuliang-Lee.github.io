/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/2014/04/01/what-is-the-benefit-to-using-run-time-binding-with-lang-hitch/index.html","d7267996b9dd3b3095ad193bbc3fa5db"],["/2014/11/09/open-source-license-introduction/index.html","e544da9134003f3eb78a0ce646a497c7"],["/2015/06/10/liferay-download-Chinese-garbled-error/index.html","f744358f7eea962e11df5a4739622c6a"],["/2015/06/13/js-array-distinct/index.html","72595a71c86d10d9611223a59ea90ada"],["/2015/08/30/hello-world/index.html","ad7a3d6d2d000d99d4caebdbf3543bc3"],["/2015/09/08/about-css-knowledge/index.html","262255933c1fd3a377d5b92e74bd986e"],["/2015/09/10/high-performance-web-site/index.html","4c7b940c4ed0ef98d2dfab6e2493475b"],["/2015/09/15/html-meta-tags-and-Open-Graph-protocol/index.html","211aa3cbc07708daad0f94eecf78c510"],["/2015/09/25/dojo-widgets-lifecycle-about-destroy/index.html","04a076ac4d7a9f99067d13abcad8ab27"],["/2015/10/10/Getting-start-with-Karma-and-QUnit/index.html","79d5508b9fb611c4950e60937ce42429"],["/2015/10/22/dojo-aspect-AOP-implements/index.html","41ee995f843ccf1570bd1c0859843885"],["/2015/11/02/dojo-widgets-lifecycle-about-create/index.html","9cc612f2c0a5d837e2e9582c91c39dc7"],["/2016/01/14/express-upload-error/index.html","faa4efd54ef664468fca817db0b87bda"],["/2016/06/07/mysql-sql_mode-setting/index.html","338f43055cdd989a7cd81d06a2644bcd"],["/2016/06/28/python-pymysql-lost-db/index.html","f20e941ca00b5e2a7c7ca78f4ab3371f"],["/2016/09/10/ning-jsconf/index.html","83702ad29b151233d18e5f8cfe36ff79"],["/2017/11/05/pure-frontend-implement-download/index.html","f540e84f53575cd7a3e1af4b6cc4526a"],["/2017/11/15/invalid-active-developer-path/index.html","79be2b5531a91ad18aea07e20a60f69e"],["/2017/11/30/git-undo/index.html","b735ae13a579100552e58ca2176d5668"],["/2017/12/17/same-font-to-multi-font-files/index.html","542df2e012c2928159136e77087beff3"],["/2017/12/31/summarize-2017/index.html","43e622f87cd73e286429679ab0c5cf1e"],["/2018/01/05/webpack-output-librarytarget/index.html","c6076e783f59c3fd24a066a41a2571d6"],["/2018/01/14/unit-test-and-e2e-test/index.html","be5fa6628d7dc3d0b63b4060db8b6ccc"],["/2018/01/26/css3-transform-not-works/index.html","a4dd922c98850fba19f689d27d4f68f1"],["/2018/03/22/learning-webassembly/index.html","ca56b210dc3a5a73c8f41adfd6fd47cd"],["/2018/03/25/Creating-a-WebAssembly-module-instance-with-JavaScript/index.html","fad5e0acb303064b69498a9a219f0537"],["/2018/03/27/safer-memory-in-webassembly/index.html","b1423e84395ddd26fee4a21d0e4cd90a"],["/2018/03/31/webassembly-table-imports/index.html","cfd32d1682700af4a4fd43a255a45100"],["/2018/04/09/http2-basic-concept/index.html","67bc4abf372cd9ccc4aa326c7a799290"],["/about/index.html","014421d62efe7d4534a8a403922541ed"],["/archive/index.html","3b9337dff28dbd09c6c080602407b4db"],["/assets/css/style.css","dfadb9c8f851cddab1c701f56a5a55b4"],["/assets/javascript/anchor-js/anchor.js","8bb7c1f211e97a83a018f7e8315d0bd8"],["/assets/javascript/anchor-js/anchor.min.js","59ccbcf40597fdbf5a3a5f88de29c39e"],["/assets/javascript/anchor-js/banner.js","3b8d2c34e88a474253d442d26d6b48bd"],["/assets/javascript/anchor-js/docs/anchor.js","8bb7c1f211e97a83a018f7e8315d0bd8"],["/assets/javascript/anchor-js/docs/favicon.ico","eb7d6540e44979cc8db83de000b5e829"],["/assets/javascript/anchor-js/docs/fonts/anchorjs-extras.eot","776d340df77acfe0cf790c4ad5540186"],["/assets/javascript/anchor-js/docs/fonts/anchorjs-extras.svg","e80fd28adf760930cc8bf394f56c3b69"],["/assets/javascript/anchor-js/docs/fonts/anchorjs-extras.ttf","54026353a31bbc514aed6973b80f3d06"],["/assets/javascript/anchor-js/docs/fonts/anchorjs-extras.woff","c94f4e937f99760edcea7fd62dba5ce9"],["/assets/javascript/anchor-js/docs/fonts/fonts.css","6fbc46de9dbbd7a9907fb3a4d96917a6"],["/assets/javascript/anchor-js/docs/grunticon/grunticon.loader.js","d74e1458e694a9ddafdeea8cf57ae7d6"],["/assets/javascript/anchor-js/docs/grunticon/icons.data.png.css","fc4856fbb93aadae89512d6836e584b9"],["/assets/javascript/anchor-js/docs/grunticon/icons.data.svg.css","6fafa6ceca4538458f39497fe7f94cdb"],["/assets/javascript/anchor-js/docs/grunticon/icons.fallback.css","aafaf27c58364910a17189bdd3698b19"],["/assets/javascript/anchor-js/docs/img/gh-link.svg","83e7e2ab30a9c57957d18d689f793ba2"],["/assets/javascript/anchor-js/docs/img/gh_link.svg","552f57729fc60cbfc133c7948f0a1cef"],["/assets/javascript/anchor-js/docs/img/hyperlink.svg","05bf10bebb30faa6f706d90150bf7d8e"],["/assets/javascript/anchor-js/docs/img/link.svg","96a09712688742fded5321c7e080dde3"],["/assets/javascript/anchor-js/docs/scripts.js","235cae35d7b87cf4080119118e25374d"],["/assets/javascript/anchor-js/docs/styles.css","08baea441a911bc647cbb767ce86c8ca"],["/category/index.html","2d0ae603e8740e456815926a028a17ba"],["/collection/index.html","87b680c2b378da63eb5c236fc748e8d9"],["/collections/demo.json","ffe53d7266b11bc93dc4244184ebe2a2"],["/collections/direction-slide-animation/css/default.css","7eda69c39bc7c6c12d8e138207727f0e"],["/collections/direction-slide-animation/css/normalize.css","3bc2f546340fb700ab9a155ff6bf45ab"],["/collections/direction-slide-animation/css/styles.css","2b8e1e59350161a832c2883c1277ef9f"],["/collections/direction-slide-animation/fonts/icomoon.eot","3891455c55b76ce7f7c86bfc33cd6493"],["/collections/direction-slide-animation/fonts/icomoon.svg","bb97ed129aa43f69280d3085cd269102"],["/collections/direction-slide-animation/fonts/icomoon.ttf","e46c36b6f94cf81311ffb383f6d32bec"],["/collections/direction-slide-animation/fonts/icomoon.woff","d1117ddce10d8c7ca18ac089764da08d"],["/collections/direction-slide-animation/index.html","6efd5aef8fa07ed197ac56ac28dd6b37"],["/css/main.css","4607c73d533c7c1b9f7ce4e87426bcf3"],["/demo/index.html","095dede34e08b3a2dbd188f50440cf76"],["/favicon.ico","cb256f8a70464217992bb87933ed49a0"],["/index.html","d27b5048f9ed5075d733282bbde12780"],["/js/main.js","a503e2419830814647c303d2c0a136d8"],["/js/masonry.pkgd.min.js","c1bb50307286a416c448ddffe695af52"],["/js/pageContent.js","6bbae4db55a7e4c1c66f9ceb390a9bbe"],["/js/smooth-scroll.min.js","2c75e1b0d0b0d276bdf7d9b08ad8b3c4"],["/js/waterfall.js","ab91586dd3f822849258cdd488635237"],["/js/zepto.min.js","50a4556b0089cfa1cb61e88ea23bbcce"],["/manifest.json","0e2bfbeaddba8d0a6c6c0764a276d760"],["/package-lock.json","fcc8d42f003f0647500473caa09f9987"],["/package.json","235da241333284384aaa0aed92e6748f"],["/page/resume/index.html","0bc2d0ffc7d4319c025efbbc0b438aff"],["/page2/index.html","b2b6a5a8938a39d4de6e7db2d95abde0"],["/page3/index.html","55c7edfe8607d60f59dd2fef4732bbbc"],["/service-worker.js","49c854c91b6e4ab064a2cedd077d268a"],["/tag/index.html","436c0f50cea442a0420f7f90b3994cef"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







