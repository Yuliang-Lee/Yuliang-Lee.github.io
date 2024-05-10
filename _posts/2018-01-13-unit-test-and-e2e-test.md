---
layout: post
title: 一步一步实现现代前端单元测试
author: xlaoyu
date: 2018-01-14 13:40:00 +0800
categories: [test]
tag: [前端测试,单元测试]
description: '使用karma+mocha+webpack+babel+power assert做前端单元测试和e2e测试，输出测试覆盖率'
keywords: karma,mocha,webpack,babel,'powser assert',test
---

* content
{:toc}

2年前写过一篇文章[用Karma和QUnit做前端自动单元测试]({% link _posts/2015-10-10-Getting-start-with-Karma-and-QUnit.md %})，只是大概讲解了 karma 如何使用，针对的测试情况是传统的页面模式。本文中题目中【现代】两字表明了这篇文章对比之前的最大不同，最近几年随着`SPA`(Single Page Application) 技术和各种组件化解决方案(Vue/React/Angular)的普及，我们开发的应用的组织方式和复杂度已经发生了翻天覆地的变化，对应我们的测试方式也必须跟上时代的发展。现在我们一步一步把各种不同的技术结合一起来完成页面的单元测试和 e2e 测试。



# 1 karma + mocha + power assert

- [karma](http://karma-runner.github.io/2.0/index.html) - 是一款**测试流程管理工具**，包含在执行测试前进行一些动作，自动在指定的环境（可以是真实浏览器，也可以是 PhantamJS 等 headless browser）下运行测试代码等功能。
- [mocha](https://mochajs.org/) - 测试框架，类似的有 *jasmine* 和 *jest* 等。个人感觉 mocha 对异步的支持和反馈信息的显示都非常不错。
- [power assert](https://www.npmjs.com/package/power-assert) - 断言库，特点是 **`No API is the best API`**。错误显示异常清晰，自带完整的自描述性。
  ```
  1) Array #indexOf() should return index when the value is present:
     AssertionError: # path/to/test/mocha_node.js:10

  assert(ary.indexOf(zero) === two)
         |   |       |     |   |
         |   |       |     |   2
         |   -1      0     false
         [1,2,3]

  [number] two
  => 2
  [number] ary.indexOf(zero)
  => -1
  ```

> 以下所有命令假设在 **test-demo** 项目下进行操作。

## 1.1 安装依赖及初始化

```bash
# 为了操作方便在全局安装命令行支持
~/test-demo $ npm install karma-cli -g

# 安装 karma 包以及其他需要的插件和库，这里不一一阐述每个库的作用
~/test-demo $ npm install karma mocha power-assert karma-chrome-launcher karma-mocha karma-power-assert karma-spec-reporter karma-espower-preprocessor cross-env -D

# 创建测试目录
~/test-demo $ mkdir test

# 初始化 karma
~/test-demo $ karma init ./test/karma.conf.js
```

执行初始化过程按照提示进行选择和输入

```bash
Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> mocha

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
>

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> no
```

生成的配置文件略作修改，如下（因篇幅原因，隐藏了注释）：
```js
module.exports = function(config) {
  config.set({
    basePath: '',

    // 表示可以在测试文件中不需引入即可使用两个库的全局方法
    frameworks: ['mocha', 'power-assert'],
    files: [
      '../src/utils.js',
      './specs/utils.spec.js.js'
    ],
    exclude: [
    ],
    preprocessors: {
      './specs/utils.spec.js': ['espower']
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
}
```

## 1.2 待测试代码

我们把源文件放在`src`目录下。
```js
// src/utils.js
function reverseString(string) {
  return string.split('').reverse().join('');
}
```

## 1.3 测试代码

测试代码放在`test/specs`目录下，每个测试文件以 **`.spec.js`** 作为后缀。

```js
// test/spes/utils.spec.js
describe('first test', function() {
  it('test string reverse => true', function() {
    assert(reverseString('abc') === 'cba');
  });

  it('test string reverse => false', function() {
    assert(reverseString('abc') === 'cba1');
  });
});
```

## 1.4 运行测试

回到项目根目录，运行命令 `npm run test` 开始执行测试，然后看到浏览器会自动打开执行测试，命令行输出结果如下：

```bash
[karma]: Karma v2.0.0 server started at http://0.0.0.0:9876/
[launcher]: Launching browser Chrome with unlimited concurrency
[launcher]: Starting browser Chrome
[Chrome 63.0.3239 (Mac OS X 10.13.1)]: Connected on socket HEw50fXV-d24BZGBAAAA with id 24095855

  first test
    ✓ test string reverse => true
    ✗ test string reverse => false
	AssertionError:   # utils.spec.js:9

	  assert(reverseString('abc') === 'cba1')
	         |                    |
	         "cba"                false

	  --- [string] 'cba1'
	  +++ [string] reverseString('abc')
	  @@ -1,4 +1,3 @@
	   cba
	  -1

Chrome 63.0.3239 (Mac OS X 10.13.1): Executed 2 of 2 (1 FAILED) (0.022 secs / 0.014 secs)
TOTAL: 1 FAILED, 1 SUCCESS
```

可以看出一个测试成功一个测试失败。

# 2 测试覆盖率(test coverage)

测试覆盖率是衡量测试质量的主要标准之一，含义是当前测试对于源代码的执行覆盖程度。在 `karma` 中使用 `karma-coverage` 插件即可输出测试覆盖率，插件底层使用的是 [istanbul](https://github.com/gotwarlost/istanbul)。

```bash
~/test-demo $ npm i karma-coverage -D
```

修改 `karma.conf.js` 文件：

```js
preprocessors: {
  '../src/utils.js': ['coverage'],
  './specs/utils.spec.js': ['espower']
},

reporters: ['spec', 'coverage'],
coverageReporter: {
  dir: './coverage', // 覆盖率结果文件放在 test/coverage 文件夹中
  reporters: [
    { type: 'lcov', subdir: '.' },
    { type: 'text-summary' }
  ]
},
```

再次运行测试命令，在最后会输出测试覆盖率信息
```bash
=============================== Coverage summary ===============================
Statements   : 100% ( 2/2 )
Branches     : 100% ( 0/0 )
Functions    : 100% ( 1/1 )
Lines        : 100% ( 2/2 )
================================================================================
```

打开 `test/coverage/lcov-report/index.html` 网页可以看到详细数据
![coverage.gif](https://i.loli.net/2018/01/14/5a5a68e108bd3.gif)

# 3 webpack + babel

上面的例子，只能用于测试使用传统方式编写的 js 文件。为了**模块化**和**组件化**，我们可能会使用`ES6`、`commonjs`、`AMD`等模块化方案，然后使用 webpack 的 [umd]({% link _posts/2018-01-05-webpack-output-librarytarget.md %}) 打包方式输出模块以兼容不同的使用方式。一般我们还需要使用`ES6+`的新语法，需要在 webpack 中加入`babel`作为转译插件。

> webpack 和 babel 的使用以及需要的依赖和配置，这里不做详细说明，因为主要是按照项目需要走，**本文仅指出为了测试而需要修改的地方**。

## 3.1 安装依赖

```bash
~/test-demo $ npm i babel-plugin-istanbul babel-preset-power-assert karma-sourcemap-loader karma-webpack -D
```

## 3.2 修改配置

**`.babelrc`**

把`power-assert`以及`coverage`的代码注入修改为在`babel`编译阶段进行，在`.babelrc` 文件中加入以下配置：
```js
{
  "env": {
    "test": {
      "presets": ["env", "babel-preset-power-assert"],
      "plugins": ["istanbul"]
    }
  }
}
```

**`test/index.js`**

在测试文件以及源码文件都非常多的情况下，或者我们想让我们的测试代码也使用上`ES6+`的语法和功能，我们可以建立一个**入口**来统一引入这些文件，然后使用 webpack 处理整个入口，在`test`目录下新建`index.js`：

```js
// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../src', true, /^\.\/(?!main(\.js)?$)/)
srcContext.keys().forEach(srcContext)
```

**`karma.conf.js`**

修改已经增加对应的配置
```js
{
  files: [
    './index.js'
  ],
  preprocessors: {
    './index.js': ['webpack', 'sourcemap'],
  },
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: false
  },
}
```

**`utils.spec.js`**

```js
import reverseString from '../../src/utils';

describe('first test', function() {
  it('test string reverse => true', function() {
    assert(reverseString('abc') === 'cba');
  });

  it('test string reverse => false', function() {
    assert(reverseString('abc') === 'cba1');
  });
});
```

## 3.3 运行测试

运行测试，能得到和第二步相同的结果。

# 4 vue

如果项目中使用了 vue，我们想对封装的组件进行测试，也非常简单。

首先 webpack 配置中添加处理 vue 的逻辑，安装需要的依赖，这里不再赘述。

在`src`目录下添加`HelloWorld.vue`：
```html
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
```

然后添加测试代码：

```js
// test/specs/vue.spec.js
import Vue from 'vue';
import HelloWorld from '@/HelloWorld';

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor().$mount()
    assert(vm.$el.querySelector('.hello h1').textContent === 'Welcome to Your Vue.js App')
  })

})
```

运行测试，可以看到命令行输出：
```bash
 first test
    ✓ test string reverse => true
    ✗ test string reverse => false
        AssertionError:   # test/specs/utils.spec.js:9

          assert(reverseString('abc') === 'cba1')
                 |                    |
                 "cba"                false

          --- [string] 'cba1'
          +++ [string] reverseString('abc')
          @@ -1,4 +1,3 @@
           cba
          -1

  HelloWorld.vue
    ✓ should render correct contents
```

这里 Vue 能替换为其他任意的前端框架，只需要按照对应框架的配置能正确打包即可。

# 结语

上面所有代码都放在了[这个项目](https://github.com/Yuliang-Lee/karma-mocha-power-assert-webpack-babel-test-boilerplate)，可以把项目下载下来手动执行查看结果。

以上大概讲解了现代前端测试的方法和过程，但是有人会问，我们为什么需要搞那么多事情，写那么多代码甚至测试代码比真实代码还要多呢？这里引用 Egg 官方一段话回答这个问题：

```
先问我们自己以下几个问题：
  - 你的代码质量如何度量？  
  - 你是如何保证代码质量？  
  - 你敢随时重构代码吗？  
  - 你是如何确保重构的代码依然保持正确性？  
  - 你是否有足够信心在没有测试的情况下随时发布你的代码？  

如果答案都比较犹豫，那么就证明我们非常需要单元测试。  
它能带给我们很多保障：  
  - 代码质量持续有保障  
  - 重构正确性保障  
  - 增强自信心  
  - 自动化运行   

Web 应用中的单元测试更加重要，在 Web 产品快速迭代的时期，每个测试用例都给应用的稳定性提供了一层保障。 API 升级，测试用例可以很好地检查代码是否向下兼容。 对于各种可能的输入，一旦测试覆盖，都能明确它的输出。 代码改动后，可以通过测试结果判断代码的改动是否影响已确定的结果。
```

是不是消除了很多心中的疑惑？

以上内容如有错漏，或者有其他看法，请留言共同探讨。

-------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.info](https://www.xlaoyu.info)”
