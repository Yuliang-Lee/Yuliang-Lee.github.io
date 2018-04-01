---
layout: post
title: "[译]使用JavaScript创建WebAssembly模块实例"
author: xlaoyu
date: 2018-03-25 22:00:00 +0800
categories: [web]
tag: [web,webassembly,javascript]
description: '创建WebAssembly模块实例'
keywords: WebAssembly,module,instance
excerpt: 上一篇文章介绍了 WebAssembly 的基本概念，现在我们来看看如何使用它们。
---

* content
{:toc}


> 作者：Lin Clark  
  译者：xlaoyu  
  英文原文：[Creating a WebAssembly module instance with JavaScript](https://hacks.mozilla.org/2017/07/creating-a-webassembly-module-instance-with-javascript/)

转载请注明出处，保留原文链接以及作者信息

-----------------

这是 WebAssembly 使用系列介绍的第一篇文章：

1. 使用JavaScript创建WebAssembly模块实例
2. [安全的WebAssembly内存操作]({% link _posts/2018-03-27-safer-memory-in-webassembly.md %})
3. [WebAssembly的导入类型 table 到底是什么？]({% link _posts/2018-03-31-webassembly-table-imports.md %})


WebAssembly 是一种[在浏览器中运行代码的新方法](https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/)。通过这项新技术，我们可以使用 C 或 C++ 等语言编写模块然后运行在浏览器中运行它们。

尽管当前这些模块无法直接运行，但是随着浏览器对 ES6 模块规范的逐步支持，这将会有所改变。一旦这一天到来，我们将可以像[加载 ES 模块那样](https://github.com/WebAssembly/design/issues/1087)去加载 WebAssembly 模块，比如使用`<script type="module">`标签加载。

目前为止，我们需要使用 JavaScript 来启动 WebAssembly 模块。首先创建一个模块实例，然后通过再调用该 WebAssembly 模块实例上的函数。

*（原文提供了一个在 React 中使用 WebAssembly 的视频，因为需要梯子才能观看，这里忽略了）*

浏览器会先下载 JS 文件，然后在 js 中去加载 `.wasm` 文件（包含 WebAssembly 代码的二进制文件）。

![file-download](https://i.loli.net/2018/03/24/5ab649eb3d1c1.png)

文件加载回来后，我们调用 `WebAssembly.instantiate` 方法去实例化 WebAssembly 模块得到一个**[WebAssembly实例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)**。

![](https://i.loli.net/2018/03/24/5ab649ed7e1a7.png)

我们来详细看看 [WebAssembly.instantiate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate)方法的使用，

```js
Promise<ResultObject> WebAssembly.instantiate(bufferSource, importObject);

// or
Promise<WebAssembly.Instance> WebAssembly.instantiate(module, importObject);
```

第一种情况的返回结果**`ResultObject`**对象包含两个字段：

- `module` - [WebAssembly 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Module)对象表示经过编译的 WebAssembly 模块，可以重复实例化。
- `instance` - [WebAssembly 实例](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)包含了 WebAssembly 模块所有的输出函数。**第二种方式的返回值就是这个对象。**

**bufferSource**是我们准备实例化的包含 .wasm 模块二进制代码的 [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) 或 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

译者注：新版 WebAssembly 新增了 `instantiateStreaming()` 方法，可以直接使用流进行实例化，配合 `Fetch API` 一起使用可以更进一步提升性能。

![instantiate](https://i.loli.net/2018/03/25/5ab79447bd69d.png)

JS 引擎会把模块代码编译为针对当前浏览器运行机器的代码。显而易见的是，我们不希望这个过程在主线程中发生，因为主线程就像一个全栈开发那样需要处理 JavaScript 代码、DOM 事件和页面重绘，我们不能让编译阻塞了主线程的执行，所以 `WebAssembly.instantiate` 是返回一个 promise。

![promise](https://i.loli.net/2018/03/25/5ab79657b0d73.png)

通过使用 promise 异步编译，主线程可以继续执行其余的工作。编译工作一旦完成，promise 会通知主线程从 promise 结果中获取实例。

从上面 `instantiate` 方法的使用用例可以看到，模块源代码并不是创建实例唯一需要的东西，还有第二个参数 `importObject`。我们可以把 WebAssembly 模块看做是一本说明书，实例对象是一个人，此时人需要根据说明书去做某些事情，所以对应的，他们还需要原材料。

![book](https://i.loli.net/2018/03/25/5ab79d649a11c.png)

我们直接把 WebAssembly 模块看作 ES6 模块，这个模块暴露了很多方法，而这些方法有些需要`入参`，而在 WebAssembly 模块中，我们把这些参数放在 `importObject` 中传入。 *(原文作者在这里举了一个在宜家买东西组装的🌰，因为过于抽象，译者替换为使用 ES6 模块来说明)*

![meterial](https://i.loli.net/2018/03/25/5ab7a16031996.png)

所以当我们实例化一个模块时，我们把需要传入模块的内容挂在 `importObject` 上，这些内容可以是以下四种类型之一：

- values
- function closures
- memory
- tables

Ps：这里四个单词不作翻译了，感觉强行翻译就类似于要把 JAVA 翻译成中文一样，o(╯□╰)o。

**Values**

普通值，一般来说是全局变量。目前 WebAssembly 模块只接收整数和浮点数，所以值必须是这两种类型之一。将来有可能会增加支持更多的类型。


**Function closures**

闭包函数，这表示能把 JavaScript 函数传进去，然后在 WebAssembly 调用这些函数。

在当前 WebAssembly 版本中这个特性尤其有用，因为当前我们不能在 WebAssembly 代码中直接进行 DOM 操作。此特性可能未来会加入，但是现在还没有支持。


**Memory**

memory 对象使 WebAssembly 代码可以模拟手动内存管理。由于这个对象的概念比较容易让人产生困惑，尤其是没有接触过内存管理的纯前端开发人员，所以将在[下一篇文章]()（第二篇系列文章）中详细讲解。


**Table**

最后一个类型是与安全相关的，它能使我们去操作一种叫 `函数指针` 的东西，将在[第三篇文章]()中详细说明。


![all](https://i.loli.net/2018/03/25/5ab7a643c0db8.png)


一旦 `WebAssembly.instantiate` 执行完成，我们从已经 resolved 的 promise 中可以获取到两样东西：实例(instance)和编译完成的模块对象(module)。

编译模块的好处是可以快速创建同一模块的其他实例。你所做的就是将模块作为 `source` 参数传入。模块本身没有任何状态（全部附加到实例）。这意味着实例可以共享已编译的模块代码。

你的实例现在已经装备齐全并准备好了。它有它的指导手册，它是编译的代码，以及它的所有输入对象。我们终于可以调用它的方法了。🎉🎉

![run](https://i.loli.net/2018/03/25/5ab7a91892402.png)


[下篇文章]({% link _posts/2018-03-27-safer-memory-in-webassembly.md %})主要解释 `Memory` 到底是什么东西以及怎么使用。