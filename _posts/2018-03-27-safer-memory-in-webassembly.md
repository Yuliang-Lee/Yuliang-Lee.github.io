---
layout: post
title: "[译]安全的WebAssembly内存操作"
author: xlaoyu
date: 2018-03-27 23:50:00 +0800
categories: [web]
tag: [web,webassembly,javascript]
description: '安全的WebAssembly内存操作'
keywords: WebAssembly,module,memory
excerpt: 这篇文章我们来看看为什么在 WebAssembly 中操作内存是非常安全的。
---

* content
{:toc}

> 作者：Lin Clark  
  译者：xlaoyu  
  英文原文：[Memory in WebAssembly (and why it’s safer than you think)](https://hacks.mozilla.org/2017/07/memory-in-webassembly-and-why-its-safer-than-you-think/)

转载请注明出处，保留原文链接以及作者信息

-----------------

这是 WebAssembly 使用系列介绍的第二篇文章：

1. [使用JavaScript创建WebAssembly模块实例](../2018-03-25-Creating-a-WebAssembly-module-instance-with-JavaScript.md)
2. 安全的WebAssembly内存操作
3. [WebAssembly的导入类型 table 到底是什么？](../2018-03-31-webassembly-table-imports.md)


[Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory)（内存，内存都以**内存**称呼）在 WebAssembly 中的使用和在 JavaScript 中稍有不同。在 WebAssembly 里，我们可以直接访问原始字节，这可能会让一些人感到担忧，但它实际上比你想象的更安全。


## 什么是内存对象？

当一个WebAssembly模块被实例化时，它需要一个内存对象。我们可以创建一个新 `WebAssembly.Memory` 对象并将其传入。或者如果我们没传，那么引擎将创建一个内存对象并自动将其附加到该实例上。

所有 JS 引擎都会在内部创建一个ArrayBuffer。ArrayBuffer 是 JS 引用的 JavaScript 对象，JS 替我们为它分配内存。我们告诉它需要多少内存，它会创建我们需要大小的 ArrayBuffer 对象。

![arraybuffer](https://i.loli.net/2018/03/27/5aba59cc32c88.png)

数组的索引可以看作是内存地址。如果以后我们需要更多的内存空间，可以执行一种叫做 *增长* 的操作来扩大数组。

使用 JavaScript 的对象 `ArrayBuffer` 来操控 WebAssembly 的内存，达成了两个目的：

1. 使在 JS 和 WebAssembly 之间互相传递数据更简单
2. 有助于内存管理的安全性


## 在 JS 和 WebAssembly 之间传递数据

因为 ArrayBuffer 也只是一个 JavaScript 对象，这意味着 JavaScript 有足够的能力可以去操作内存里的字节。基于这种方式，WebAssembly 和 JavaScript 可以共享内存并来回传递值。

**它们使用数组下标去定位内存块，而不是使用内存地址。**

例如，WebAssembly 可以把一个字符串放进内存里。首先把字符串编码为字节。。

![encode](https://i.loli.net/2018/03/27/5aba5d32cb8fe.png)

然后把字节放进数组中。

![put-array](https://i.loli.net/2018/03/27/5aba5df72bd2e.png)

然后它会将第一个索引（整数）返回给 JavaScript，所以 JavaScript 可以将字节取出来并使用它们。

![return-index](https://i.loli.net/2018/03/27/5aba5e79453f4.png)

目前为止，大多数 JavaScript 引擎都无法直接使用字节来工作，所以我们需要在 JS 这边使用某些方法把字节转化为有用的数据类型，比如字符串。

在某些浏览器中，我们可以使用 [TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder) 和 [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder) API。或者我们可以像 [Emscripten](https://github.com/kripken/emscripten) 那样在代码中加入辅助函数，帮助我们完成这件事情。

![use-bytes](https://i.loli.net/2018/03/27/5aba604e13626.png)

以上是使用 JS 对象操作 WebAssembly 内存的第一个优点：**可以直接通过内存互相传递数据**。


## 让内存访问更安全

使用 JavaScript 对象处理 WebAssembly 内存的另外一个好处就是：**安全性**。通过帮助防止浏览器级内存泄漏并提供内存隔离，它使事情更安全。

### 内存泄漏

当我们自己手动管理内存时，随时可能忘记清除它。这可能会导致系统内存不足最终内存溢出。

我们想象一下，如果一个 WebAssembly 模块实例可以直接访问内存，并且在该实例执行完成退出上下文时忘记释放该内存，那么将会导致内存泄露。但是现在由于内存对象是一个 JavaScript 对象，它的存在将由垃圾回收器追踪着（尽管并没有控制内容）。这意味着当 WebAssembly 模块实例离开执行上下文时，整个内存数组将会被回收掉。

![gc](https://i.loli.net/2018/03/27/5aba63136d572.png)

### 内存隔离

当人们得知 WebAssembly 模块可以直接访问内存时，这可能会让我们有点紧张。我们可能会以为 WebAssembly 模块可以定位和访问到它们本该不能访问的内存，但事实并非如此。

ArrayBuffer 对象边界会提供一个限制，这是 WebAssembly 模块能直接接触到的内存边界。

![boundary](https://i.loli.net/2018/03/27/5aba65062dc07.png)

WebAssembly 可以直接获取该数组内部的字节，但它不能看到超出此数组边界的任何内容。

例如，内存中的任何其他JS对象（如全局window）都不能被 WebAssembly 访问。这对安全性非常重要。

无论何时在 WebAssembly 中进行读取或写操作时，引擎都会执行数组边界检查以确保地址位于 WebAssembly 实例的内存中。

如果代码尝试访问超出界限的地址，则引擎将引发异常，这保护了其余的内存。

![](https://i.loli.net/2018/03/27/5aba65fb5cc58.png)


---------

下篇文章，我们一起来看看什么是 WebAssembly 的 `table` 对象。