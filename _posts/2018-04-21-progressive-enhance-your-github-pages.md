---
layout: post
title: "使用PWA增强你的github pages"
author: xlaoyu
categories: [web]
tag: [web,pwa,blog]
description: '使用PWA技术增强github pages'
keywords: pwa,blog,"service worker","app manifest"
---


* content
{:toc}

[Github Pages](https://pages.github.com/) 是 *Github* 提供的一个**网站托管**服务，可以用于部署个人博客或者项目主页，使用的是 [jekyll](https://jekyllrb.com/) 框架作为文件解析转换为网页静态文件的载体。[PWA](https://developers.google.com/web/progressive-web-apps/)(Progressive Web Apps) 是近几年 *Google* 提出的概念，致力于使用原生 Web 技术快速打造可靠的、媲美原生应用体验的 Web App。使用 `Github Pages` 搭建个人博客是非常快捷，方便以及免费的可靠的方式，再配合以 PWA 技术增强，能使我们的博客像一个应用那样被访问，增强用户粘度。




## 什么是 PWA

`PWA` 并没有特指某种技术或者工具，而是指**使用一系列最新的 Web 技术，但同时保证应用在不支持新特性的浏览器中的使用也不受影响的方法论，可以选择性只使用其中几项技术而不必使用全套技术**，这就是`渐进式(Progressive)`的意义所在。大多数 FEer 应该都听过这个词语，从大咖 *Google* 在大力推行开始这个技术迅速在前端圈里掀起了热潮，但是如果追寻这个概念最早的提出者，应该要追述到由 *Alex Russell* 大神的写的 [Progressive Web Apps: Escaping Tabs Without Losing Our Soul](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)，核心就是要在保留 Web 灵魂的基础上对网页进行增强。

<details style="margin-bottom: 16px">
<summary>关于Alex Russell</summary>
<span>
Ps：*Alex Russell* 是框架 [Dojo](https://dojo.io/) 的创始人之一，`Dojo` 是我出来工作后使用的第一款前端**框架**，前几年风风火火的 `AMD` 模块标准就是从 Dojo 中衍生出来的，里面的组件化、模块化和展现与逻辑分离等思想，深深影响了我对前端的认识和理解，使我受益匪浅，可惜由于是由 *IBM* 维护所以发展较慢，恰恰近几年前端发展速度堪比光速百花齐放，各种框架争妍斗艳，以致于这个框架越来越少人使用。不过最近 Dojo 2.0 马上要发布，结合最新的 TypeScript、Webpack 等技术重写了一遍，几乎是全新的一个框架，非常期待未来的表现。
</span>
</details>

**PWA 的带来的提升主要有：**

1. 可安装 - 允许用户把网页应用添加到设备主屏幕中，就像安装一个原生应用但是不用通过 *Apple Store* 或者其他应用商店。然后直接进入网页应用。
   *Ps: 其实 iOS 几乎是从一出生就支持了这个功能*
   ![ios-add-to-screen](https://user-images.githubusercontent.com/6936358/39057390-a5345778-44eb-11e8-9750-c2efa6b14dc8.jpg)
2. 离线能力 - Web应用一直无法比拟原生应用的重要一点其实就是离线访问能力，众所周知传统网页离开网络就无法生存。但是 PWA 能突破这个限制。
3. 唤回能力 - 传统网页，在用户不打开访问的时候，是无法主动给用户推送消息的，这导致了无法持续和用户进行互动从而无法提高用户留存率。PWA 使用最新的 API 能在用户不访问应用的时候进行消息推送，使 Web 应用和原生应用站在了同一起跑线上。
4. 易于发现 - 归根到底 Web应用 也是一个网页，所以它可被搜索引擎发现，并且拥有原生应用无法比拟的一个特点：可通过 URL 轻松分享给别人。上面提到的 `Web灵魂` 其中一点就是指这个**开放性**。

**目前开发 PWA 应用可以使用到的技术有：**

- [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - 实现应用离线访问的核心技术之一
- [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) - 实现应用离线访问的核心技术之二
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - 实现应用离线访问的核心技术之三
- [App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) - 实现应用添加到桌面的技术
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) - 实现服务器推送的主要技术之一
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/notification) - 实现服务器推送的主要技术之二

本篇幅不一一详细介绍各项技术的概念与使用，有兴趣可自行了解，本文说明如何在 Github Pages 中一步一步引入 PWA 中的各个特性。


## Github Pages + PWA

下面例子使用的是 Github Pages 默认使用的 `jekyll` 引擎，详情可以参考[这里](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/)。

### Service Worker

说起 PWA 不得不首先提起 `Service Worker`，其他特性的功效或多或少都依赖于首先启用了该功能。我们主要在**Service Worder**的三个生命周期期间（事件）`install`、`activate`和`fetch`里搞事情：

![sw-lifecycle](https://user-images.githubusercontent.com/6936358/39082390-11c9affc-4585-11e8-82b0-0213fff2cace.png)
(来自MDN)

#### **注册（register）**

`Service Worker` 和一般的脚本代码不一样，它的所有代码需要单独放在一个文件中，然后通过指定的接口**注册**到页面里。

假设现在有一个 `service-worker.js` 在项目根目录下，我们在根目录下的 `index.html` 里加入以下代码：
```html
<script>
// 注册 service worker
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
}
</script>
```

首先判断当前环境是否支持 Service Worder，记住我们的核心是 `Progressive`！`register` 方法的第二个参数 *scope* 用于指定Worker 可控制的范围（通过 URL 判断），举个🌰：如果 *scope* 设为 `/sub/`，那么网页中所有到`/other/`或`/other/foo`的请求都无法在 Worker 的 `fetch` 事件中拦截。默认值范围和 Service Worker 文件路径相同。


#### **安装（install）**

注册完成后，`Service Worker`开始执行，首先会接收到一次*install*事件，我们可以在*install*事件回调中进行**获取资源，然后放入缓存中**的操作：

假设我们的博客需要使用 `main.js` 和 `main.css` 两个文件，分别放置在 `js` 目录和 `css`目录下，Service Worker 可以这么写：

```js
const CACHE_NAME = 'xlaoyu_blog_1.0.0';

const URLS = [                // Add URL you want to cache in this list.
  // '/',                     // If you have separate JS/CSS files, add path to those files here
  '/index.html',
  '/css/main.css',
  '/js/main.js'
];

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS);
    }).then(_ => {
      return self.skipWaiting();
    });
  );
});
```

`e.waitUntil` - 表示等待传入的 *Promise* 完成之后才把**安装状态标记为完成**

`caches.open(chche_name)` - 打开一个缓存对象。一个域名下可以有多个缓存对象

`cache.addAll(urls)` - 根据传入的 URL 在后台自动请求获取资源，然后以 URL 为 key 资源内容为 value 存入上一条打开的 cache 对象中。

`self.skipWaiting()` - 直接跳过 `waiting` 阶段，下面会详细讲解。


#### **拦截请求（fetch）**

这个事件使得我们的 Service Worker 有能力对指定范围内的页面发出的所有请求进行滤或者替换。

```js
// Respond with cached resources
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // 如果缓存存在，直接返回缓存
        console.log('responding with cache : ' + e.request.url);
        return request;
      } else {
        // 缓存不存在，发起请求获取资源返回
        console.log('file is not cached, fetching : ' + e.request.url);
        return fetch(e.request);
      }
    });
  );
});
```

#### **激活（activate）**

这个阶段我们可以在这里进行旧或者不再使用的缓存的清理工作。

满足以下两个条件之一，才会进入此阶段：
- Service Worker 第一次注册
- Service Worker 有更新，同时已经没有页面使用旧的 Worker 或者 使用了 `skipWaiting` 跳过 *waiting* 阶段

> 如果 Service Worker 文件的内容有改动，当访问网站页面时浏览器获取了新的文件，它会认为有更新，于是会安装新的文件并触发 install 事件。但是此时已经处于激活状态的旧的 Service Worker 还在运行，新的 Service Worker 完成安装后会进入 waiting 状态。直到所有已打开的页面都关闭，旧的 Service Worker 自动停止，新的 Service Worker 才会在接下来打开的页面里生效。

```js
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
```

`clients.claim()` - 使页面立刻使用新的 Worker。一般情况下，新的 Service Worker 需要在页面重新打开后才生效，通过结合 `skipWaiting` 和此方法的组合拳，能使新 Worker 立即生效。

至此，一个简单的 Service Worker 流程已经走完，

#### 工具代替人手

上面我们模拟了最简单的一个页面使用 Service Worker 是如何操作的，非常简单快捷，但是仔细想想，在复杂的场景下事情就没那么简单了，我们需要考虑几个问题：

1. 一个大的项目包含的静态文件可能成百上千，显而易见，靠人工维护这份列表是不靠谱的；
2. 浏览器能在字节级别检查出 `Service-Worker.js` 文件的变化，然后进行对应的操作，但是 Service Worker 如果没变化，它是无法检测出被缓存的文件是否有改变而读取最新的文件的。其实无论是否使用 Service Worker 都会有这个问题，在传统场景下最常见的解决方案就是hash化文件名；这个方法也能使用在这里，不过结合第一点，显然不可能人手维护；

[sw-precache](https://github.com/GoogleChromeLabs/sw-precache) - 通过扫描指定的静态文件目录，计算文件hash然后生成service worker 文件的工具，能有效解决上述两个问题。打开方式参考官方文档即可，这里列一下我使用的配置：

```js
const prefix = '_site';

module.exports = {
  staticFileGlobs: [
    '!_site/assets/**/**.*',
    '!_site/service-worker.js',
    prefix + '/**/**.html',     // 所有页面，文章页面的html（必须包含）
    prefix + '/js/*.js',        // 所有 js 文件
    prefix + '/css/*.css',      // 所有 css 文件
    prefix + '/images/**/**.*', // 个人用于存放博客相关图片的文件夹，正常情况是没有的
    prefix + '/favicon.ico',
    prefix + '/**/*.json',
  ],
  stripPrefix: prefix
}
```

有几点需要说明：
1. 为什么扫描 `_site` 目录？  
  因为 github pages 页面访问的就是这个目录下的文件，如果曾经使用 jekyll 服务在本地启动编译 blog 的话，一定能看到项目根目录下会多出这个 `_site` 目录。
2. 为什么排除 `_site/assets`？
  因为本地会生成这个目录，但是经过测试在我发布到 github 上后，正式环境下并不会生成这个目录，所以如果不排除此目录的话 Service Worker 会尝试去缓存这目录下的文件，导致加载报错然后整个 Worker 都失效，这是我们不愿看到的。
3. 我们要缓存什么才能实现离线访问？
  **HTML文件**、所有页面必须使用到的没有使用 CDN 代理的 JS、CSS、图片、JSON等。

**实际效果：**

在联网状态下访问 [www.xlaoyu.info](https://www.xlaoyu.info)，然后把网络断开，在页面进行操作（非外链转跳）,可以看到在断网时交互并不受影响。


## App Manifest

App Manifest 是一项提升 Web 应用移动端能力的技术。就是让我们的网页能被添加到主屏幕中，拥有和原生应用几乎一致的表现。

首先，我们在页面 `head` 区域添加引入 *manifest* 文件的信息：

```html
<!-- APP Manifest -->
<link rel="manifest" href="/manifest.json">
```

下面是我的 `manifest.json` 文件配置

```json
{
  "scope": "/",
  "name": "xlaoyu-blog",
  "short_name": "xlaoyu-blog",
  "start_url": "/?from=homescreen",
  "display": "standalone",
  "description": "路漫漫其修远兮，吾将上下而求索",
  "dir": "ltr",
  "lang": "cn",
  "orientation": "portrait",
  "theme_color": "#70B7FD",
  "background_color": "#fff",
  "icons": [{
    "src": "images/icon-48x48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/apple-touch-icon-57×57.png",
    "sizes": "57x57",
    "type": "image/png"
  }, {
    "src": "images/apple-touch-icon-72x72.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "images/icon-96x96.png",
    "sizes": "96x96",
    "type": "image/png"
  }]
}
```

icons 怎么配置可以看 [这里](https://developer.chrome.com/apps/manifest/icons)。

**注意，添加到桌面的 Web 页面，需要先在联网状态下打开一次桌面的版本，才能实现离线访问，添加后如果一次都没打开过，断网之后这个“APP”还是无法使用的。**


## 其他技术

由于在 Github Pages 中不太可能需要用到推送等功能，这些属于真正的应用才需要的功能，所以这里不赘述。


## 总结

其实在大多数个人blog或者网页的场景下，是否支持离线访问，是否能添加到桌面模拟原生应用并没有那么的重要，能留住用户吸引别人来访问的核心需求是**文章的内容和质量**，这次尝试也只是作为练手目的。

以上只是 PWA 的其中一小点应用场景，结合这么多技术 + 非凡的创意一定会催生出更多令人惊喜的特性和功能。也许现在不是前端最好的时代，但是一定是越来越精彩的时代！


以上内容如有错漏，或者有其他看法，请留言共同探讨。

------------------

参考文章：

- [Using_Service_Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) - MDN
- [pwa-service-worker](https://lzw.me/a/pwa-service-worker.html) - 志文工作室
- [如何看待 Progressive Web Apps 的发展前景？](https://www.zhihu.com/question/46690207) - 知乎

--------------------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.info](https://www.xlaoyu.info)”