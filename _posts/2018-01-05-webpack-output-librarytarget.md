---
layout: post
title: 详解webpack的out.libraryTarget属性
author: xlaoyu
date: 2018-01-05 23:00:00 +0800
categories: [pack]
tag: [webpack]
description: 'webpack配置out.libraryTarget详解'
keywords: webpack,output,libraryTarget,library
---

* content
{:toc}

[Webpack](https://webpack.js.org) 作为目前前端最热门的打包工具，相信很多人都在项目中使用过，其繁杂的配置项也确实“配”得上他老大的身份 o(╯□╰)o。`output.library`和`output.libraryTarget`属性可能大家都会比较陌生，因为一般如果只在项目中使用  webpack 不需要关注这两个属性，但是如果是开发类库，那么这两个属性就是必须了解的。



## 简介

回想一下，当我们引入别人开发的类库时有几种方式？下面假设我们引入一个`demo`方法：

- 传统方式：`script`标签
   ```html
  <script src="demo.js"></script>
  <script>demo();</script>
  ```

- AMD
  ```js
  define(['demo'], function(demo) {
    demo();
  });
  ```

- commonjs 方式
  ```js
  const demo = require('demo');
  
  demo();
  ```

- ES6 module
  ```js
  import demo from 'demo';

  demo();
  ```

大家思考一下，为什么这个类库能支持不同方式的引入？如何实现的？这就是 webpack 配置`output.library`和`output.libraryTarget`提供的功能。


## output.library

支持输入`string`或者`object`(从 webpack 3.1.0 版本开始支持; 限于 libraryTarget: "umd" 时使用)类型的值。

`output.library`的值被如何使用会根据`output.libraryTarget`的取值不同而不同。而默认`output.libraryTarget`的取值是`var`，如果如下配置：

```js
output: {
  library: "myDemo"
}
```

如果在 HTML 页面中使用`script`标签引入打包结果文件，那么变量`myDemo`对应的值将会是*入口文件(entry file)*的返回值。


## output.libraryTarget

支持输入`string`类型的值。默认值：`var`

此配置的作用是控制 webpack 打包的内容是如何暴露的。请注意这个选项需要和`output.library`所绑定的值一起产生作用。在以下的 demo 中，假设`output.library`值是`myDemo`。*`_entry_return_`表示入口点返回的值。在bundle中，它是webpack从入口点生成的函数的输出。*


### 暴露一个变量

以下选项会把打包返回的值（无论暴露的是什么）绑定到一个由`output.library`指定的变量上，无论包是被如何引用。

- **`libraryTarget: "var"`- (default)**

  使用这个配置，当库被加载时，那么库的返回值会被分配到使用用`var`申明的变量上。

  ```js
  var myDemo = _entry_return_;

  // In a separate script...
  myDemo();
  ```

  > 如果没有设置`output.library`值，那么将不会发生赋值行为。

- **`libraryTarget: "assign"`**

  使用这个设置，会把库返回值分配给一个没使用`var`申明的变量中，如果这个变量没有在引入作用域中提前申明过，那么将会挂载在全局作用域中。（注意，**这个行为有可能会覆盖全局作用域中的已有变量**）

  ```js
  myDemo = _entry_return_;
  ```

### 通过对象属性暴露

以下选项将库的返回值（无论返回值是什么）分配给特定对象的指定属性，属性由`output.library`指定，对象由`output.libraryTarget`指定。

当`output.library`没有指定为非空字符串，那么默认行为是将库返回值的所有属性(properties)都分配到对象中，代码如下：

```js
(function(e, a) { for(var i in a) e[i] = a[i]; }(${output.libraryTarget}, _entry_return_)
```

> 注意，发生这个行为的时候 webpack 并不会检查对象中是否已经存在这些属性值，也就是会发生覆盖行为。

- **`libraryTarget: "this"`** - 将库的返回值分配给`this`对象的由`output.library`指定的属性。其中`this`的意义由用户决定。
  ```js
  this["myDemo"] = _entry_return_;

  this.myDemo();
  myDemo(); // if this is window
  ```

- **`libraryTarget: "window"`** - 将库的返回值分配给`window`对象的由`output.library`指定的属性。
  ```js
  window["myDemo"] = _entry_return_;

  window.myDemo.doSomething();
  ```

- **`libraryTarget: "global"`** - 将库的返回值分配给`global`对象的由`output.library`指定的属性。
  ```js
  global["myDemo"] = _entry_return_;

  global.myDemo();
  ```

- **`libraryTarget: "commonjs"`** - 将库的返回值分配给`exports`对象的由`output.library`指定的属性。正如名字所指，这个选项可以使用在 CommonJS 环境。
  ```js
  exports["myDemo"] = _entry_return_;

  require("myDemo").doSomething();
  ```

### 模块定义系统

以下选项将产生一个包含更完整兼容代码的包，以确保与各种模块系统的兼容性。 此时`output.library`选项在不同的`output.libraryTarget`选项下具有不同的含义。

- **`libraryTarget: "commonjs2"`** - 将库的返回值分配给`module.exports`。正如名字所指，这个选项可以使用在 CommonJS 环境。
  ```js
  module.exports = _entry_return_;

  const myDemo = require("myDemo");
  myDemo();
  ```
  注意，在这个情况下`output.library`不是必须的，因为此时`output.library`选项将会被忽略。
  > *有没有注意到 CommonJS 和 CommonJS2 长的非常像？他们确实很相似，但是其中有微妙的区别，想了解更多可以参考[这个issue](https://github.com/webpack/webpack/issues/1114)*

- **`libraryTarget: "amd"`** - 这个选项会把库作为 AMD 模块导出。
  AMD模块要求输入脚本（例如由`<script>`标签加载的第一个脚本）被定义为具有特定属性，例如通常由 RequireJS 或任何兼容的加载器（诸如almond）提供的`require`和`define`属性。否则，直接加载生成的 AMD 捆绑包将导致类似`define is not defined`的错误。
  由此定义生成的代码会如下：
  ```js
  define("myDemo", [], function() {
    return _entry_return_;
  });
  ```
  以上的代码可以作为`script`标签引入代码的一部分被包含，然后在通过以下代码调用：
  ```js
  require(['myDemo'], function(myDemo) {
    // Do something with the library...
    myDemo();
  });
  ```
  如果`output.library`没有定义有效值，那么生成的代码将如下：
  ```js
  define([], function() {
    return _entry_return_;
  });
  ```
  如果直接使用`<script>`标签加载，该库将无法按预期生效，或者根本无法生效（在 almond 加载器的情况下）。它只能通过与 RequireJS 兼容的异步模块加载器通过该文件的实际路径进行引入，因此在这种情况下，如果这些由服务器直接提供，那么`output.path`和`output.filename`配置可能变得非常重要。

- **`libraryTarget: "umd"`** - 这个选项会尝试把库暴露给前使用的模块定义系统，这使其和`CommonJS`、`AMD`兼容或者暴露为全局变量。
  `output.library` 选项在这里是必须的。最终代码输出如下：
  ```js
  (function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
      module.exports = factory();
    else if(typeof define === 'function' && define.amd)
      define([], factory);
    else if(typeof exports === 'object')
      exports["MyLibrary"] = factory();
    else
      root["MyLibrary"] = factory();
  })(typeof self !== 'undefined' ? self : this, function() {
    return _entry_return_;
  });
  ```
  如果 `output.library` 没有输入有效值，那么对于*全局变量*的处理会和上面提到的 `暴露一个变量` 一致。代码输出如下：
  ```js
  (function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
      module.exports = factory();
    else if(typeof define === 'function' && define.amd)
      define([], factory);
    else {
      var a = factory();
      for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
    }
  })(this, function() {
    return _entry_return_;
  });
  ```
  从 webpack 3.10.0 版本开始，我们可以通过把 `output.library` 定义为对象来控制不同目标环境的输出值。详情可参考[这个Demo](https://github.com/webpack/webpack/tree/master/examples/multi-part-library)
  ```js
  output: {
    library: {
      root: "myDemo",
      amd: "my-demo",
      commonjs: "my-common-demo"
    },
    libraryTarget: "umd"
  }
  ```

### 其他类型

- **`libraryTarget: "jsonp"`** - 这个方法会使用 jsonp 的方式把结果包裹起来。
  ```js
  myDemo(_entry_return_);
  ```
  库的依赖由 [externals](https://webpack.js.org/configuration/externals/) 定义。

## 总结

以上所有栗子可以下载 [webpack-libraryTarget-demo](https://github.com/Yuliang-Lee/webpack-libraryTarget-demo) 项目，运行 `npm i` 安装依赖，接着 `npm run build-all` 命令执行打包，最后在 `dist` 目录下查看不同打包方式生成的代码。

- 主要看第一行
- `(function(modules) { // webpackBootstrap` 这一行开始，指代上述的 `_entry_return_` 部分

`output.libraryTarget`一共支持的值：

1. var - 默认值
2. assign
3. this
4. window
5. global
6. commonjs
7. commonjs2
8. amd
9. umd
10. jsonp

-------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”
