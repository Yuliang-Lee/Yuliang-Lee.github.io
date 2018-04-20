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

[Github Pages](https://pages.github.com/) 是 *Github* 提供的一个**网站托管**服务，可以用于部署个人博客或者项目主页，使用的是 [jekyll](https://jekyllrb.com/) 框架作为文件解析转换为网页静态文件的载体。[PWA](https://developers.google.com/web/progressive-web-apps/)(Progressive Web Apps) 是近几年 *Google* 提出的概念，致力于使用原生 Web 技术快速打造可靠的、媲美原生应用体验的 Web App。




## 什么是 PWA

`PWA` 并没有特指某种技术或者工具，而是指**使用一系列最新的 Web 技术，但同时保证应用在不支持新特性的浏览器中的使用也不受影响的方法论，可以选择性只使用其中几项技术而不必使用全套技术**，这就是`渐进式(Progressive)`的意义所在。大多数 FEer 应该都听过这个词语，从大咖 *Google* 在大力推行开始这个技术迅速在前端圈里掀起了热潮，但是如果追寻这个概念最早的提出者，应该要追述到由 *Alex Russell* 大神的写的 [Progressive Web Apps: Escaping Tabs Without Losing Our Soul](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)，核心就是要在保留 Web 灵魂的基础上对网页进行增强。

<details style="margin-bottom: 16px">
<summary>Alex Russell</summary>
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

- [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#Service_worker_concepts_and_usage) - 实现应用离线访问的核心技术之一
- [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) - 实现应用离线访问的核心技术之二
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - 实现应用离线访问的核心技术之三
- [App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) - 实现应用添加到桌面的技术
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) - 实现服务器推送的主要技术之一
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/notification) - 实现服务器推送的主要技术之二

本篇幅不一一详细介绍各项技术的概念与使用了，有兴趣可自行了解。


## Github Pages + PWA

