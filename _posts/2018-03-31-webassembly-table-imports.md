---
layout: post
title: "[译]WebAssembly的导入类型 table 到底是什么？"
author: xlaoyu
date: 2018-03-31 22:00:00 +0800
categories: [web]
tag: [web,webassembly,javascript]
description: 'WebAssembly的table类型到底是什么'
keywords: WebAssembly,module,memory,table
excerpt: 来认识 JavaScript 编程中从未听说过的 table 类型。
---

* content
{:toc}

> 作者：Lin Clark  
  译者：xlaoyu  
  英文原文：[WebAssembly table imports… what are they?](https://hacks.mozilla.org/2017/07/webassembly-table-imports-what-are-they/)

转载请注明出处，保留原文链接以及作者信息

-----------------

这是 WebAssembly 使用系列介绍的第二篇文章：

1. [使用JavaScript创建WebAssembly模块实例](../2018-03-25-Creating-a-WebAssembly-module-instance-with-JavaScript.md)
2. [安全的WebAssembly内存操作](../2018-03-27-safer-memory-in-webassembly.md)
3. WebAssembly 的 table 对象是什么

在[第一篇文章](../2018-03-25-Creating-a-WebAssembly-module-instance-with-JavaScript.md)中已经介绍过可以导入 WebAssembly 模块实例中四种不同类型的值了：

- values
- function imports
- memory
- tables

前三种我们都见过用过或者在之前的文章介绍了，但是对于最后一个可能大家都会疑惑：它到底是什么和有什么作用？

在 JS 中，我们都知道函数表达式能赋值给一个变量，换一种说法即是**变量指向了函数**。然后我们可以使用这个变量（函数表达式）做一些事情，比如将它传递给另外一个函数作为回调函数：

![callback](https://i.loli.net/2018/03/31/5abf75d9d59eb.png)

在 C 语言中这个变量被称为**函数指针(function pointers)**。函数保存在内存中，而这个变量（函数指针）仅仅保存的是指向该函数的**内存地址(memory address)**。

![memory address](https://i.loli.net/2018/03/31/5abf7846e63cd.png)

这个指针变量能根据我们的需要在不同时间指向不同的函数（也就是不同的内存地址），如果学过 C 或者 C++ 对这个概念应该不陌生。

![pointer other](https://i.loli.net/2018/03/31/5abf78e649d08.png)

在网页中，我们都知道所有函数实际也是一个 JavaScript 对象，并且由于这个特性，所以它们所使用的内存地址在 WebAssembly 的内存区域外。

![function in outside](https://i.loli.net/2018/03/31/5abf7a14bc423.png)

如果我们想在 WebAssembly 中拥有一个指向该函数的变量，那么我们需要获取到该函数的地址并且放入 WebAssembly 内存中。

![webassembly point outside](https://i.loli.net/2018/03/31/5abf7fa2bb14c.png)

但是保证网页安全的其中一点就是需要保持内存地址的不可见性，我们不希望页面中的代码能够查看并且修改那些内存地址。想象一下，如果页面中存在恶意代码并且能修改内存，那么它们将可以利用内存相关知识去制造漏斗。

举个🌰，它可以去把某个指向函数地址的变量改为指向另外一个函数的地址（一个恶意函数），那么当用户尝试去调用该变量（函数）时，就触发了攻击者的指定的任何内容了。

![attack](https://i.loli.net/2018/03/31/5abf82446d136.png)

恶意代码可能会以任何方式插入到页面中，也许就在某个字符串里。这时候我们需要一种机制来实现安全的函数指针 -- [table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table)。

WebAssembly 的 table 类型能使我们在避免遭受各种攻击的方式下使用函数指针特性。

`table` 是一个位于 WebAssembly 内存之外的数组，它的值就是对函数的引用。

![table](https://i.loli.net/2018/03/31/5abf84f93465e.png) 

在底层，引用就是内存地址。但由于它不在 WebAssembly 的内存中，因此 WebAssembly 无法看到这些地址，但是它可以访问到数组索引。

![table index](https://i.loli.net/2018/03/31/5abf859a2e390.png)

当 WebAssembly 模块想要去调用这些函数的时候，可以使用数组索引通过所谓的 `间接调用(call_indirect)`[Table.prototype.get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Table/get) 去调用函数。

Ps：一下是译者引用 MDN 上的一段代码和注释

```js
var tbl = new WebAssembly.Table({initial:2, element:"anyfunc"});
console.log(tbl.length);  // "2"
console.log(tbl.get(0));  // "null"
console.log(tbl.get(1));  // "null"

var importObj = {
  js: {
    tbl:tbl
  }
};

// 假设 table2.wasm 包含两个函数（一个返回42，另一个返回43）然后把两个函数存储在 table 的 0 和 1 索引位置中
WebAssembly.instantiateStreaming(fetch('table2.wasm'), importObject)
.then(function(obj) {
  console.log(tbl.length);
  console.log(tbl.get(0)()); // 42
  console.log(tbl.get(1)()); // 43
});
``` 

> element - A string representing the type of value to be stored in the table. At the moment this can only have a value of "anyfunc" (functions).
  initial - The initial number of elements of the WebAssembly Table.

![](https://i.loli.net/2018/03/31/5abf88b693753.png)

现在，表格的用例非常有限。它们被添加到规范中以支持这些函数指针，因为 C 和 C++ 非常依赖这些函数指针。

正因为如此，目前我们可以放入表中的唯一引用是对函数的引用。但是随着WebAssembly功能的扩展（例如，当添加对DOM的直接访问时）,我们能看到 table 上保存更多类型的引用以及执行除了间接引用外其他的操作。

