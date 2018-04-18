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

var precacheConfig = [["/2014/04/01/what-is-the-benefit-to-using-run-time-binding-with-lang-hitch/index.html","d7267996b9dd3b3095ad193bbc3fa5db"],["/2014/11/09/open-source-license-introduction/index.html","e544da9134003f3eb78a0ce646a497c7"],["/2015/06/10/liferay-download-Chinese-garbled-error/index.html","f744358f7eea962e11df5a4739622c6a"],["/2015/06/13/js-array-distinct/index.html","72595a71c86d10d9611223a59ea90ada"],["/2015/08/30/hello-world/index.html","ad7a3d6d2d000d99d4caebdbf3543bc3"],["/2015/09/08/about-css-knowledge/index.html","262255933c1fd3a377d5b92e74bd986e"],["/2015/09/10/high-performance-web-site/index.html","4c7b940c4ed0ef98d2dfab6e2493475b"],["/2015/09/15/html-meta-tags-and-Open-Graph-protocol/index.html","211aa3cbc07708daad0f94eecf78c510"],["/2015/09/25/dojo-widgets-lifecycle-about-destroy/index.html","04a076ac4d7a9f99067d13abcad8ab27"],["/2015/10/10/Getting-start-with-Karma-and-QUnit/index.html","79d5508b9fb611c4950e60937ce42429"],["/2015/10/22/dojo-aspect-AOP-implements/index.html","41ee995f843ccf1570bd1c0859843885"],["/2015/11/02/dojo-widgets-lifecycle-about-create/index.html","9cc612f2c0a5d837e2e9582c91c39dc7"],["/2016/01/14/express-upload-error/index.html","faa4efd54ef664468fca817db0b87bda"],["/2016/06/07/mysql-sql_mode-setting/index.html","338f43055cdd989a7cd81d06a2644bcd"],["/2016/06/28/python-pymysql-lost-db/index.html","f20e941ca00b5e2a7c7ca78f4ab3371f"],["/2016/09/10/ning-jsconf/index.html","83702ad29b151233d18e5f8cfe36ff79"],["/2017/11/05/pure-frontend-implement-download/index.html","f540e84f53575cd7a3e1af4b6cc4526a"],["/2017/11/15/invalid-active-developer-path/index.html","79be2b5531a91ad18aea07e20a60f69e"],["/2017/11/30/git-undo/index.html","b735ae13a579100552e58ca2176d5668"],["/2017/12/17/same-font-to-multi-font-files/index.html","542df2e012c2928159136e77087beff3"],["/2017/12/31/summarize-2017/index.html","43e622f87cd73e286429679ab0c5cf1e"],["/2018/01/05/webpack-output-librarytarget/index.html","c6076e783f59c3fd24a066a41a2571d6"],["/2018/01/14/unit-test-and-e2e-test/index.html","be5fa6628d7dc3d0b63b4060db8b6ccc"],["/2018/01/26/css3-transform-not-works/index.html","a4dd922c98850fba19f689d27d4f68f1"],["/2018/03/22/learning-webassembly/index.html","ca56b210dc3a5a73c8f41adfd6fd47cd"],["/2018/03/25/Creating-a-WebAssembly-module-instance-with-JavaScript/index.html","fad5e0acb303064b69498a9a219f0537"],["/2018/03/27/safer-memory-in-webassembly/index.html","b1423e84395ddd26fee4a21d0e4cd90a"],["/2018/03/31/webassembly-table-imports/index.html","cfd32d1682700af4a4fd43a255a45100"],["/2018/04/09/http2-basic-concept/index.html","67bc4abf372cd9ccc4aa326c7a799290"],["/about/index.html","014421d62efe7d4534a8a403922541ed"],["/archive/index.html","3b9337dff28dbd09c6c080602407b4db"],["/category/index.html","2d0ae603e8740e456815926a028a17ba"],["/collection/index.html","87b680c2b378da63eb5c236fc748e8d9"],["/collections/demo.json","ffe53d7266b11bc93dc4244184ebe2a2"],["/collections/direction-slide-animation/index.html","6efd5aef8fa07ed197ac56ac28dd6b37"],["/css/main.css","4607c73d533c7c1b9f7ce4e87426bcf3"],["/demo/index.html","095dede34e08b3a2dbd188f50440cf76"],["/favicon.ico","cb256f8a70464217992bb87933ed49a0"],["/images/apple-touch-icon-114×114.png","1a5a9cf3cea9484dc284100c2376f8f2"],["/images/apple-touch-icon-144×144.png","2eb96103a40f86f8b87ec9dca5393fe2"],["/images/apple-touch-icon-152×152.png","36d825bbc48d4052d9d44029904bca22"],["/images/apple-touch-icon-180×180.png","d81977a20bad9715502831344e6206bd"],["/images/apple-touch-icon-57×57.png","5215f59aec54ed1102fa3dbb176e5392"],["/images/apple-touch-icon-72×72.png","81039b9904ba7e6a18c65216e3ac351e"],["/images/demoImg/buttonSplit.png","8109726e5b72e1d1e4f14140b1e405c9"],["/images/demoImg/textEasingIn.png","16916d2c2d52609ca188a8e2341eb6d3"],["/images/icon-48x48.png","502634f5946c4427917771f49bfe0b25"],["/images/icon-96x96.png","269ec8eaefcb9fc305507b01eee41979"],["/images/portrait-small.png","7a237cc1ebc2062bc6eddd9929241ec6"],["/images/portrait.png","833a86cb8b2ef938238cbf55845372ac"],["/images/postImg/2015-08-30/pic1.png","7e35cf161a1d318d00c298df1ebacd26"],["/images/postImg/2015-09-08/pic1.png","e4a4a78a2eb82beb0c9be6e9938fc46a"],["/images/postImg/2015-09-08/pic2.png","a74c115ea1fa45b5292b9d950974888f"],["/images/postImg/2015-09-08/pic3.png","aac1a84b92adb1653060a3ee5308333e"],["/images/postImg/2015-09-08/pic4.png","460bbcdaab3ae800cdc44d4ded980796"],["/images/postImg/2015-09-08/pic5.png","280ddb6c949e13533b16c8c25ff4f84f"],["/images/postImg/2015-09-08/pic6.png","5d6d48160bc11526c52fde013ff0f7ab"],["/images/postImg/2015-09-08/pic7.png","e49dea30e93f022a29fc328f9a8e3938"],["/images/postImg/2015-09-08/pic8.png","b57c877d28cc75786b51dbe75c967f75"],["/images/postImg/2015-10-10/chromejiemian.png","1faeae38a77fc3fcd63e05846dfa361a"],["/images/postImg/2015-10-10/minglinghang.png","6eace9c2cccd358d541f5bf6c20884fa"],["/images/postImg/2015-10-10/testoutput.png","292d3f4cb89423ff9ebf6b268bc980ad"],["/images/postImg/2015-10-10/testoutputfail.png","b19844a414ae0af0d6abc6968b1a338c"],["/images/postImg/2015-10-22/aspect-procedure.png","a29740687196bc4047f2d69b94b5ff2f"],["/images/postImg/2015-10-22/dojo-aspect流程图.vsdx","034b93483ab802b040eec4fcffa6ba80"],["/images/postImg/2016-01-14/1.png","96d6acf9f4277ca70dc4cf41c05258ab"],["/images/postImg/2016-01-14/2.png","8e48dcb2e8645ee7f84502326e7a2f75"],["/images/postImg/2017-11-18/file-states.png","81f46ececd59470a2719d42bf5643f89"],["/images/postImg/2018-01-14/coverage.gif","fe6c736360f3b2acd73b2eb217d94522"],["/images/postImg/2018-03-22/01-01-perf_graph05.png","18f34b3ef5b08474c86c2e41fb3686a8"],["/images/postImg/2018-03-22/2018.01.18.WASM-diagram-v2-1000x483.png","9b6913d725eb6fe88d069dd4c0a90652"],["/images/postImg/2018-03-22/wb-js-excute.png","106fcbce592bd23b952b53ffc06b48d7"],["/images/postImg/2018-03-24/1-03-768x236.png","04321312d54a7cc4f1841968860ee9e0"],["/images/postImg/2018-03-24/1-04-768x356.png","8dc8a81c608b140a03c35408e482ecd9"],["/images/postImg/2018-03-24/1-05-768x461.png","cd2fefdbc441384b9527160aedff0f2f"],["/images/postImg/2018-03-24/1-07-768x457.png","61cd292fa09af3e455e906cb3d866529"],["/images/postImg/2018-03-24/1-08.png","ee4328012a85ea6e6cbd7a5a969e88c4"],["/images/postImg/2018-03-24/1-09-768x333.png","4bb203c59190f9753d26b7ff5c4eea91"],["/images/postImg/2018-03-24/1-1.png","559f1178f2c46a25f56ad7c70ef7fae7"],["/images/postImg/2018-03-24/1-2.png","8db5cb70bc07d1a37d131bc6c77ff29a"],["/images/postImg/2018-03-27/02-01-768x590.png","be170c4683c733ff5df59e2a54c5df30"],["/images/postImg/2018-03-27/02-02-768x569.png","1ebec1bcb8d8ffa0cdd1fdd83c64bb4e"],["/images/postImg/2018-03-27/02-03-768x569.png","5b61085b9f928bfda660652e334eb60d"],["/images/postImg/2018-03-27/02-04-768x560.png","17441291550f9546426d3d8af2df2ea3"],["/images/postImg/2018-03-27/02-05-768x594.png","fd9e80c42690cf229edacdab384e41c8"],["/images/postImg/2018-03-27/02-06-768x567.png","d533f23ae47470f28bb696525a054498"],["/images/postImg/2018-03-27/02-07-768x574.png","1038ae9dedd65fd98ccc5a3d50daed5d"],["/images/postImg/2018-03-27/02-08-768x570.png","11755e8fb0caed259f8c3b1cf19ff110"],["/images/postImg/2018-03-31/03-01-768x161.png","547011e7f325cca53e0f181dc2953a33"],["/images/postImg/2018-03-31/03-02-768x484.png","f0f0bf870ebeebd59587223338c38939"],["/images/postImg/2018-03-31/03-03-768x482.png","87c76dc9d6a4f02dfb4eda6a0701b45f"],["/images/postImg/2018-03-31/03-04-768x176.png","fdd35a9268c2ee431d075811509e6e21"],["/images/postImg/2018-03-31/03-05-768x245.png","8c4cec9461a241d749ac1f684b9fc2a1"],["/images/postImg/2018-03-31/03-06-768x497.png","75f15676461a4ec7362ffb35660ac7cd"],["/images/postImg/2018-03-31/03-07-768x217.png","435c565d65c1bd11c784d4a9f0e461c5"],["/images/postImg/2018-03-31/03-08-768x172.png","676155d57b1603f1e65bca5c20d0c81e"],["/images/postImg/2018-03-31/03-09-768x309.png","057f36191b6720faf36b22d8b8d2684c"],["/images/postImg/2018-04-09/frame.jpg","ce682d790f1aad9e5c6cc70ceed2a632"],["/images/postImg/2018-04-09/header-table.png","568cd8b42666a1bd04b9cde62ed57c0f"],["/images/postImg/2018-04-09/hpack-compare.jpg","68a71d56c8ef1fcabf91f6787ee42382"],["/images/postImg/2018-04-09/http1.jpg","87dab4bb2517a541d5b6a5e8e2c04c3f"],["/images/postImg/2018-04-09/http2-compatibility.png","2e9e8c46eca400bba067aca42359818f"],["/images/postImg/2018-04-09/http2.jpg","4f73de150d72183044e45c340da9cd2a"],["/images/postImg/2018-04-09/inline.png","10694d901a73ccd5eb3d1d976d49aeba"],["/images/postImg/2018-04-09/latency-vs-bandwidth.png","c2699c2849af3b9a352e5627318735f4"],["/images/postImg/2018-04-09/push.png","bdd897d89d60ee7f74eff1dd306a1fde"],["/images/postImg/2018-04-09/real-transport.graffle/data.plist","11b37af022837d932880d3ce61ebb098"],["/images/postImg/2018-04-09/real-transport.graffle/image1.pdf","5fd55583b53f97e08b9ae9b06d8f80ed"],["/images/postImg/2018-04-09/real-transport.graffle/image2.pdf","2bc2bdbffa74b287651d517475907aea"],["/images/postImg/2018-04-09/real-transport.png","78cec2337dc7e2cc41a67f76045a332b"],["/images/postImg/2018-04-09/steam.png","f8b1d327f4d4f9f247af0f3019e42e63"],["/images/postImg/2018-04-09/stream-request.graffle/data.plist","9860f7b07e30e7e9bfe2db1d0c1c412a"],["/images/postImg/2018-04-09/stream-request.graffle/image1.pdf","2bc2bdbffa74b287651d517475907aea"],["/images/postImg/2018-04-09/stream-request.graffle/image3.pdf","5fd55583b53f97e08b9ae9b06d8f80ed"],["/images/postImg/2018-04-09/stream-request.png","c036f280dbcd6d352afd8bb8de1d74c2"],["/images/postImg/2018-04-09/tradition.png","f2cc03eb30fcd3a4225df3a3858b023d"],["/index.html","d27b5048f9ed5075d733282bbde12780"],["/js/main.js","c883f86b36eb672fcb6a19d160aefbf7"],["/js/masonry.pkgd.min.js","c1bb50307286a416c448ddffe695af52"],["/js/pageContent.js","6bbae4db55a7e4c1c66f9ceb390a9bbe"],["/js/smooth-scroll.min.js","2c75e1b0d0b0d276bdf7d9b08ad8b3c4"],["/js/waterfall.js","ab91586dd3f822849258cdd488635237"],["/js/zepto.min.js","50a4556b0089cfa1cb61e88ea23bbcce"],["/manifest.json","0e2bfbeaddba8d0a6c6c0764a276d760"],["/page/resume/index.html","0bc2d0ffc7d4319c025efbbc0b438aff"],["/page2/index.html","b2b6a5a8938a39d4de6e7db2d95abde0"],["/page3/index.html","55c7edfe8607d60f59dd2fef4732bbbc"],["/tag/index.html","436c0f50cea442a0420f7f90b3994cef"]];
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







