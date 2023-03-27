---
layout: post
title: WebAssembly学习笔记
author: xlaoyu
date: 2018-03-22 22:50:00 +0800
categories: [web]
tag: [web,tech]
description: 'WebAssembly学习与介绍'
keywords: WebAssembly,web,performance
---

* content
{:toc}


`WebAssembly`是最近十年 web 技术发展中最重大的一个新技术。很多人可能都听说过它最重要的一个特性：性能好，运行快。那`WebAssembly`究竟是什么？是什么使得它性能好运行快的呢？



## WebAssembly是什么？

[WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts) 是一种能把**除了JavaScript**以外的编程语言编写的代码经过编译器编译转换为能在现代浏览器中运行的代码的技术。众所周知，`JavaScript`在 Web 中的地位一直独步天下，无 yan 能敌，所以`WebAssembly`所指的性能优势，是针对 JavaScript 而言的。`WebAssembly`并不是为了替代 JavaScript 出现的，而是希望与 JavaScript 并驾齐驱共同开发出性能更高的应用。

![](https://research.mozilla.org/files/2018/01/2018.01.18.WASM-diagram-v2-1000x483.png)


## 首先看看 JavaScript 的性能历史

`JavaScript`诞生于1995年，目的是为了给浏览器 HTML 网页增加动态交互功能，并没有考虑太多性能问题，事实证明在前十年里浏览器也不需要它有多快。一切变化发生在2005年，谷歌在多款交互应用中使用`Ajax`技术让交互体验得到了极大的提升，让人们认识到了原来网页能做的事情远远不是内容的展示和表单的提交。

到2008年，`JavaScript`在浏览器中低下的执行效率，已经成为限制程序猿们在网页施展拳脚的一大阻碍。突然，有个叫谷歌的厂商推出了一款叫`Chrome`的浏览器，它与以往浏览器最大的不同在于内置了一个 `JITs(just-in-time compilers)`，一个能在 js 代码执行时根据某些模式动态编译代码为能在浏览器中更高效执行的代码的技术，详细介绍可以看这篇文章: [a crash course in just in time(jit) compilers](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/)。从此拉开了浏览器性能大战的序幕。

![js performanc](https://user-images.githubusercontent.com/6936358/37716831-62159b58-2d5a-11e8-9e2f-1436c81600eb.png)

时间再推进10年到2018年，此时`JavaScript`的使用场景已经远远超过了原先的想象：服务端、网页游戏、WebVR/AR、图片/视频处理等等场景，JITs 都已经不能满足这些对性能日益严苛的场景了，此时我们需要更进一步的突破，这个就是 **WebAssembly**。


## 为什么WebAssembly更快？

就如第一部分所提，`WebAssembly`的性能优势是针对 JavaScript 而言的，下面我们分别从 JavaScript 和 WebAssembly 的执行过程一一对比优势到底在哪：

![js-wb-excute](https://user-images.githubusercontent.com/6936358/37770013-ecdf7106-2e0d-11e8-9bb4-0349b8326f38.png)


### 获取

由于 WebAssembly 是由编译器生产出来的，并且将被浏览器直接解析执行，可以节省那些为了给人类阅读而添加的不必要代码，从而可以做到文件大小甚至比经过压缩的 JS 代码更小。所以在相同的网络情况下，从服务器获取一个 WB 文件会比获取一个 JS 文件 更快。

### 解析

当 JS 文件成功到达浏览器之后，浏览器会将其解析成一棵`抽象语法树`(Abstract Syntax Tree)（但是只会先解析当前需要执行的那部分代码，而其余未执行的函数将会保存成存根），然后再转换为 JS 引擎识别的 IR（intermediate representation） 层字节码（认识 JAVA 的应该对这个词不陌生）。

反过来我们看 WebAssembly 本身已经是经过高级语言编译出来的 IR 层代码了，不需要在浏览器端进行解析而只需要把经过压缩的内容解码出来，节省了相当多的时间。


### 编译和优化

这个阶段是 `JITs` 负责做的事情，不同浏览器对 WebAssembly 的处理可能会有细微差别，我们以都使用 `JITs` 进行优化的场景来看看为何 WebAssembly 会比 JavaScript 更快，有以下三点：
（阅读下面内容需要先对 JIT 有一定认识，不清楚的可以先看 [这里](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/)

1. 由于 WebAssembly 的输入类型是固定的（byte），所以**不需要通过运行代码这种方式去检查输入类型来进行编译优化**；
2. 在 JavaScript 中相同一段代码可能因为输入值不同需要分别编译成不同的版本，而 WebAssembly 也不需要进行这种冗余的操作，原因如上；
3、 WebAssembly 在从高级语言（C/C++/Rust）编译而来的时候，已经经过编译器优化一次了，所以在 `JITs` 中需要做的事情更少；


### 重优化

还是由于 JavaScript 动态类型的原因，一段经过了深度优化的代码，可能因为这次执行的时候输入值类型变了，导致 `JITs` 需要根据输入值类型重新进行一次上一步的优化工作，这也需要花费一定的时间。

而 WebAssembly 输入值固定，`JITs` 不需要在每次代码执行时去计算输入值的类型，从而不会发生*重优化*这样的事情。


### 执行

JavaScript 代码一般是人写的，而 WebAssembly 是由编译器编译出来的，是直接针对机器产生的代码，会包含更多对机器性能优异的指令（instructions），这部分差异针对不同的功能代码 WebAssembly 可能会比 JavaScript 快 **10%~800%**。


### 垃圾回收

我们都知道在 JavaScript 中不必人工去执行变量的释放和内存的回收，因为 JS 引擎有自动垃圾回收功能，能自行判断该回收什么东西甚至足够智能知道在何时进行回收操作。但是这还是存在天花板可能会影响代码的执行。

在目前为止，WebAssembly 都不支持自动垃圾回收，内存由代码手动管理（由于使用了 C/C++编写），这将会加大开发者编码的难度，但能保证代码性能更可控。


## 总结

总的来说，大多数场景下 WebAssembly 比 JavaScript 性能更好是因为：

1. WebAssembly 代码更小的体积；
2. 解码 WebAssembly 比解析转译 JavaScript 用的时间更少；
3. 优化 WebAssembly 的用时比优化 JavaScript 的更短，因为前者是已经经过一次编译优化并且面向机器的代码；
4. WebAssembly **没有**重优化这个过程；
5. WebAssembly 包含对机器更友好的指令；
6. JavaScript 无法人为控制垃圾回收，而 WebAssembly 可以有效控制内存回收的时机；


=============

本文主要知识和灵感来源于：
1. [A cartoon intro to WebAssembly](https://hacks.mozilla.org/2017/02/a-cartoon-intro-to-webassembly/)系列文章，感谢作者。后续本博客会翻译几篇此作者编写的 WebAssembly 使用教程。
2. [WebAssembly Concepts](https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts)
3. [WebAssembly format](https://research.mozilla.org/webassembly/)


-------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”