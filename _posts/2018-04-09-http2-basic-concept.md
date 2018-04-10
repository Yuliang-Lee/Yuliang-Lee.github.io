---
layout: post
title: "HTTP2基本概念学习笔记"
author: xlaoyu
date: 2018-04-10 12:00:00 +0800
categories: [web]
tag: [web,http2,tcp]
description: 'HTTP2基本概念介绍，以及在前端的应用场景'
keywords: HTTP2,http,tcp
---


* content
{:toc}


[HTTP2](http://httpwg.org/specs/rfc7540.html) 规范在2015年5月正式发布，至今大多数浏览器和服务器已经对此协议提供了支持：

![http2-compatibility](https://user-images.githubusercontent.com/6936358/38481571-06fbfdcc-3bfe-11e8-80b1-fae049ec7553.png)
<i style="display:block;margin-left: auto;margin-right:auto">(2018-04-09)</i>

作为一个对 HTTP1.x 进行了加强、补充和完善的更好的协议，值得我们好好的去了解它，然后使用它做出更美妙的事情。


## 1 过去和现在

HTTP1.1 自从1997年发布1999年最后一次修改以来，我们已经使用 HTTP1.x 相当长一段时间了，但是随着近十年互联网的爆炸式发展，当时协议规定的某些特性，已经无法满足现代网络的需求了。

![request body](https://raw.githubusercontent.com/bagder/http2-explained/master/images/transfer-size-growth.png)

HTTP1.x 有以下几点致命缺陷：（以浏览器至服务器为例）

- 协议规定客户端对同一域的并发连接最多只能2个（浏览器实现一般是2~8个），但是现代网页平均一个页面需要加载 **40个资源**
- 线头阻塞（Head of line blocking）问题：同一个连接中的请求，需要一个接一个串行发送和接收
- 基于文本协议，请求和响应的头信息非常大，并且无法压缩。
- 不能控制响应优先级，必须按照请求顺序响应。
- 只能单向请求，也就是客户端请求什么，服务器只能返回什么。

就是以上问题严重影响了现代互联网信息交互的效率和灵活性，此时更现代更高效的通讯协议 HTTP2 应运而生。

HTTP2 使用了`多路复用`、`HPACK头压缩`、`流 + 二进制帧`和`流优先级`等技术手段解决上述问题。


## 2 HTTP2

[HTTP2](http://httpwg.org/specs/rfc7540.html) 的前身是 [SPDY协议](https://baike.baidu.com/item/SPDY/3399551?fr=aladdin)（一个 Google 主导推行的应用层协议，作为对 HTTP1 的增强），第一版草稿就是基于 SPDY3 规范修改制定而来。**HTTP2必须在维持原来 HTTP 的范式（不改动 HTTP/1.x 的语义、方法、状态码、URI 以及首部字段等等）前提下，实现突破性能限制，改进传输性能，实现低延迟和高吞吐量。**

HTTP2 的特性包括：

1. 传输内容使用**二进制协议**
2. 使用**帧**作为最小传输单位
3. 多路复用
4. 头压缩
5. 服务器推送
6. 优先级与依赖性
7. 可重置
8. 流量控制


### 2.1 二进制

在 HTTP1.x 时代，无论是传输内容还是头信息，都是文本/ASCII编码的，虽然这有利于直接从请求从观察出内容，但是却使得想要实现并发传输异常困难（存在空格或其他字符，很难判断消息的起始和结束）。使用二进制传输可以避免这个问题，因为传输内容只有1和0，通过下面第二点的“帧”规范规定格式，即可轻易识别出不同类型内容。同时使用二进制有一个显而易见的好处是：**更小的传输体积。**

### 2.2 二进制分帧

HTTP2 在维持原有 HTTP 范式的前提下，实现*突破性能限制，改进传输性能，实现低延迟和高吞吐量*的其中一个关键是：**在应用层（HTTP2）和传输层（TCP or UDP）之间增加了`二进制分帧层`**。

![frame](https://user-images.githubusercontent.com/6936358/38498327-a736e742-3c36-11e8-9f32-1a9099774e51.jpg)

帧（Frame）是 HTTP2 通讯中的最小传输单位，所有帧以固定的 **9** 个八位字节头部开头，随后是一个可变长度的有效载荷


```
帧结构图
 +-----------------------------------------------+
 |                 长度Length (24)                |
 +---------------+---------------+---------------+
 |   类型Type (8)    |   标志Flags (8)   |
 +-+-------------+---------------+-------------------------------+
 |R|                 流标识符Stream Identifier (31)               |
 +=+=============================================================+
 |                   帧载荷Frame Payload (0...)                 ...
 +---------------------------------------------------------------+
```

规范中一共定义了 10 种不同的帧，其中最基础的两种分别对应于 HTTP1.x 的 DATA 和 HEADERS。

一个真正的 HTTP2 请求类似下图：

![steam](https://user-images.githubusercontent.com/6936358/38499147-430df410-3c39-11e8-8130-28d9ac96f400.png)


### 2.3 多路复用（Multiplexing）和流

> 上一节提到的 `Stream Identifier` 将 HTTP2 连接上传输的每个帧都关联到一个“流”。流是一个独立的，双向的帧序列，可以通过一个 HTTP2 的连接在服务端与客户端之间不断的交换数据。  
> 每个单独的 HTTP2 连接都可以包含多个并发的流，这些流中交错的包含着来自两端的帧。流既可以被客户端/服务器端单方面的建立和使用，也可以被双方共享，或者被任意一边关闭。在流里面，每一帧发送的顺序非常关键。接收方会按照收到帧的顺序来进行处理。

上面是[《HTTP2 讲解》](https://http2-explained.haxx.se/content/en/part6.html)对流的解释，下面接着是一个小火车的例子，但是个人觉得这个例子有一定的偏差，并且并不能让人直观的理解 `帧-流-连接` 之间的关系，以下是个人理解：

> A "stream" is an independent, bidirectional sequence of frames exchanged between the client and server within an HTTP/2 connection. --[rfc7540 StreamsLayer](http://httpwg.org/specs/rfc7540.html#FramingLayer)

“流”是一个逻辑上的概念（没有真正传输流这么个东西），是 HTTP2 连接中在客户端和服务器之间交换的独立双向帧序列，这就是为什么在规范中的 *stream* 也是用双引号括起来的原因。从上一节我们可以知道，HTTP2 的传输单位是**帧**，流其实就是一个**帧的分组集合**的概念，为什么需要这个逻辑集合呢？答案就在`多路复用`。

多路复用是解决 HTTP1.x 缺陷第一点（并发问题）和第二点（HOLB线头问题）的核心技术点。这里需要举个🌰来说明：

假设已经建立了 TCP 连接，现在需要客户端发起了两个请求，从流的角度看是这样的：

![stream-request](https://user-images.githubusercontent.com/6936358/38507828-2aa58494-3c50-11e8-8e7a-213e4d1f18b6.png)

但是实际 TCP 连接只有一个，两个帧是不可能真的“同时”到达服务器的，**多路复用更像是 CPU 处理任务概念中的 `并发`，而不是并行**，从规范中使用术语 [Stream Concurrency](http://httpwg.org/specs/rfc7540.html#n-stream-concurrency) 而不是 `Stream Parallelism` 也可得出此结论，所以实际传输时是下图：

![real-transport](https://user-images.githubusercontent.com/6936358/38508780-aa31a10a-3c52-11e8-91b8-27dd051a1cd7.png)

上图需要注意三点：

1. 同一个流中的帧是交错传输的！
2. **Header 帧必须在 data 帧前面**，因为无论是客户端还是服务端，都依赖 header 帧的信息解析 data 帧的数据！
3. 先到的帧不一定先返回，快的可以先返回！

正是由于上述第一点特性，解释了为什么需要“流”这个逻辑集合。同时，通过这种 `帧-流-连接` 的组合，解决了请求并发（一次连接多个请求）和HOLB线头问题（并发发送，异步响应）。

进入 [HTTP/2: the Future of the Internet](https://http2.akamai.com/demo) 由 Akamai 公司建立的官方 Demo，可以看出 HTTP2 相比于之前的 HTTP1.1 在性能上的大幅度提升。

HTTP1.1  
![http1](https://user-images.githubusercontent.com/6936358/38531864-b652ce8a-3ca4-11e8-9104-a71118fe0a79.jpg)

HTTP2  
![http2](https://user-images.githubusercontent.com/6936358/38531865-b6fce12c-3ca4-11e8-9105-d5b40e47cbe4.jpg)

在过去，我们发现 HTTP 性能优化的**关键不在于高宽带**，而是**低延迟**。

![latency-vs-bandwidth](https://user-images.githubusercontent.com/6936358/38510089-7ebb53fa-3c56-11e8-9f48-ad74b65b2e34.png)

从上图可见，当带宽到达一定的速度之后，对页面加载速度的提升已经很少了，但是随着延迟的减少，页面加载时间会对应持续的减少。由于 TCP 连接存在一种称为「调谐」的慢启动（slow start）特性，让原本就具有突发性和短时性的 HTTP 连接变的十分低效。而 HTTP2 通过让所有数据流共用同一个连接，可以更有效地使用 TCP 连接，让高带宽也能真正的服务于 HTTP 的性能提升。

以上纯属个人理解，如有不对请不吝指出共同讨论，感谢！


### 2.4 头压缩

我们都知道 **HTTP协议本身是无状态（stateless）** 的：每个请求之间**互不关联**，每个请求都需要携带服务器所需要的所有细节信息。比如说请求1发送给服务器信息“我是用户A”，然后请求二发送信息“修改我的用户名为XX”，这时如果请求二没有携带“我是用户A”的信息，那么服务器是不知道要修改哪个用户的用户名的。

这显然是不符合当前 web 应用系统架构的，因为一般系统都需要进行鉴权，日志记录，安全校验等限制，所以需要获取当前操作用户的信息，出于安全和性能考虑我们不能在消息体中明文包含这些信息，HTTP2 之前的解决方案一般是使用 Cookies 头、服务器session 等方式模拟出“状态”。而使用 Cookies 头的缺点就是每个请求都需要携带庞大的重复的信息并且无法压缩，假设一个请求的 header 是2kb，那么一百个请求就是重复的 200Kb 信息，这是一个巨大的带宽浪费。

HTTP2 增加了两个特性解决上述问题：

- [HPACK](http://http2.github.io/http2-spec/compression.html)，专门为头部压缩设计的算法，还被指定成单独的草案中。
  ![hpack](https://user-images.githubusercontent.com/6936358/38495840-b94c6942-3c2d-11e8-9a93-c3c50d6f5836.jpg)
- 首部表，HTTP2 在户端和服务器端使用“首部表”来跟踪和存储之前发送的键-值对，对于相同的数据，不再通过每次请求和响应发送；通信期间几乎不会改变的通用键-值对（用户代理、可接受的媒体类型，等等）只需发送一次。
  ![header-table](https://user-images.githubusercontent.com/6936358/38496135-fd503686-3c2e-11e8-9d59-de0853c03f4d.png)


### 2.5 服务器推送

这个功能通常被称作“缓存推送（cache push）”。主要的思想是：当一个客户端请求资源X，而服务器知道它很可能也需要资源Z的情况下，服务器可以在客户端发送请求Z前，主动将资源Z推送给客户端。这个功能帮助客户端将Z放进缓存以备将来之需。

服务器推送需要客户端显式的允许服务器提供该功能。但即使如此，客户端依然能自主选择是否需要中断该推送的流。如果不需要的话，客户端可以通过发送一个 `RST_STREAM` 帧来中止推送。

我们来看一下实际场景：现在我们访问一个网站，第一个请求一般是获取 Document 页面，然后浏览器解析这个页面，在遇到需要资源获取的时候（css、js、图片等），再去发起资源获取请求，如下图：

【传统做法】
![tradition](https://user-images.githubusercontent.com/6936358/38531967-3994c74e-3ca5-11e8-8746-57d5cb0d1178.png)

为了加速这个过程，减少白屏时间，传统的做法是把首页需要的资源都内联到 Document 中，还有合并资源比如 CSS sprites，js 压缩合并等。如下图：

![inline](https://user-images.githubusercontent.com/6936358/38532386-2628e9a4-3ca7-11e8-8cfa-8811e7aee286.png)


【HTTP2】

在 HTTP2 的场景下，客户端在请求 Document 的时候，服务器如果知道页面需要的资源有哪些，就可以把那些资源也一同返回了：

![push](https://user-images.githubusercontent.com/6936358/38533052-103532d0-3caa-11e8-847a-6648af201a64.png)

注意：**主动推送的资源是能被浏览器缓存的！**

那么问题来了，如果客户端已经缓存了资源，此时服务器每次都还推送同样的资源给客户端，这不是很大的浪费吗？

答：原来确实会存在这种情况，所以 IETF 小组正在拟定一个名为 [cache-digest](http://httpwg.org/http-extensions/cache-digest.html)的技术规范，用于帮助客户端主动告诉服务端哪些资源已经缓存了，不需要重复发送。

关于服务端推送对网页性能的影响，和对于 CDN 的使用的比较，可以参考下面两篇文章：

1. [measuring-server-push-performance](https://www.smashingmagazine.com/2017/04/guide-http2-server-push/#measuring-server-push-performance)
2. http://www.ruanyifeng.com/blog/2018/03/http2_server_push.html

结论：使用 HTTP2 的多路复用和服务器推送功能，并不意味着可以减少甚至抛弃使用 CDN，因为 CDN 带来的现实地理位置上延迟减少是 HTTP2 所不能解决的，反而我们应该思考的是如何把 HTTP2 和 CDN 结合起来，进一步提升网络服务的效率和稳定性，减少延迟。

### 2.6 优先级与依赖性

每个流都包含一个优先级（也就是“权重”），它被用来告诉对端哪个流更重要。当资源有限的时候，服务器会根据优先级来选择应该先发送哪些流。

借助于PRIORITY帧，客户端同样可以告知服务器当前的流依赖于其他哪个流。该功能让客户端能建立一个优先级“树”，所有“子流”会依赖于“父流”的传输完成情况。

优先级和依赖关系可以在传输过程中被动态的改变。这样当用户滚动一个全是图片的页面的时候，浏览器就能够指定哪个图片拥有更高的优先级。或者是在你切换标签页的时候，浏览器可以提升新切换到页面所包含流的优先级。

### 2.7 可重置

HTTP1.x 的有一个缺点是：当一个含有确切值的 `Content-Length` 的 HTTP 消息被送出之后，你就很难中断它了。当然，通常你可以断开整个 TCP 链接（但也不总是可以这样），但这样导致的代价就是需要通过三次握手来重新建立一个新的TCP连接。

一个更好的方案是只终止当前传输的消息并重新发送一个新的。在http2里面，我们可以通过发送 RST_STREAM 帧来实现这种需求，从而避免浪费带宽和中断已有的连接。

### 2.8 流量控制

每个http2流都拥有自己的公示的流量窗口，它可以限制另一端发送数据。如果你正好知道SSH的工作原理的话，这两者非常相似。

对于每个流来说，两端都必须告诉对方自己还有足够的空间来处理新的数据，而在该窗口被扩大前，另一端只被允许发送这么多数据。

**只有数据帧会受到流量控制。**

-----------------------------------

本文主要是学习笔记和个人理解，部分图片和文字引用网络，侵删。

参考文章：

1. [Ideal HTTP Performance](https://www.mnot.net/blog/2016/04/22/ideal-http) 作者是 Mark Nottingham，IETF HTTP Working Group 的主席，Akamai 公司的首席架构师。
2. [TCP那些事](https://kb.cnblogs.com/page/209101/)
3. [HTTP2概述](https://www.cnblogs.com/ghj1976/p/4552583.html)
4. [HTTP2讲解](https://www.gitbook.com/book/ye11ow/http2-explained)
5. [HTTP/2 is here, let’s optimize!](https://docs.google.com/presentation/d/1r7QXGYOLCh4fcUq0jDdDwKJWNqWK1o4xMtYpKZCJYjM/edit#slide=id.p19) Ilya Grigorik, Velocity SC 2015
6. [rfc7540](http://httpwg.org/specs/rfc7540.html)
7. [HTTP2的总结](http://www.liyaoli.com/2015-04-18/HTTP-2.0.html)
8. [HTTP2.0 的奇妙日常](http://www.alloyteam.com/2015/03/http2-0-di-qi-miao-ri-chang/) -- alloyteam