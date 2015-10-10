---
layout: post
title: 用Karma和QUnit做前端自动单元测试
categories: [testing]
tag: [javascript,test,Karma,QUnit]
description: 用Karma结合QUnit配置前端自动化单元测试环境
keywords: javascript,test,Karma,QUnit
shortinfo: 用Karma结合QUnit配置前端自动化单元测试环境，介绍Karma的配置文件简单说明
---

## 什么是Karma和QUnit

* **Karma**是一个前端测试运行环境，具有监听文件变化自动执行测试、在不同浏览器环境下执行测试等特点。
* **QUnit**是由JQuery团队创建的一个强大、易用的前端单元测试框架。

-----------

## 安装和配置Karma和QUnit

### 安装

*假设已经进入要测试的项目文件夹根目录*
```
//安装Karma,--save-dev作用是把安装插件记录在package.json中
npm install karma --save-dev
//安装Karma插件
npm install karma-qunit --save-dev
npm install karma-phantomjs-launcher --save-dev
//在全局安装karma命令行插件
npm install -g karma-cli
//如果在node_modules文件夹下没有qunitjs,再安装qunit
npm install qunitjs --save-dev
```

### 配置

继续输入命令`karma init`,命令行会提示配置步骤,按照提示选择/输入配置项:

```
Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
选择需要使用的测试框架，一般可选Jasmine、mocha、qunit等
> qunit

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
是否需要使用requirejs
> yes or no

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
选择使用什么环境测试js，可以选各种浏览器/phantomjs等，可以多选，最后输入空字符串跳到下一项。
> PhantomJS
>

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
定义被测文件和测试文件的路径。
> src/js/**/*.js
> test/js/**/*.js
>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
添加要排除的文件，
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
是否需要监听上面定义的文件的变化，一旦变化立即运行测试。
> no
```

经过这个初始化过程，会在根目录生成一个`karma.conf.js`文件:

```
// Karma configuration
// Generated on Sat Oct 10 2015 14:23:08 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit'],

    // list of files / patterns to load in the browser
    files: [
      'src/被测试的js.js',
      'test/写有测试代码的js.js',
      'test/写有测试代码的js2.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    // 定义端口,一般不用改
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    // 是否监听文件变化自动运行测试
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    // 是否运行完一次测试之后自动关闭浏览器
    singleRun: true
  })
}
```

**注意，如果singleRun和autoWatch都设为false，则在karma start之后不会运行测试，不知道是本来就如此还是我没配置对，请高手指教**
Browsers设置了Chrome或者Phantomjs或者其他的，都要安装相应的插件`npm install karma-*-launcher`，*号替换成Chrome等，可选插件看[这里](http://karma-runner.github.io/0.12/config/browsers.html)。

配置成功后在命令行输入`karma start`，命令行会显示：
![命令行显示]({{ site.BASE_PATH }}/images/postImg/2015-10-10/minglinghang.png)
弹出来的Chrome界面：
![Chorme界面]({{ site.BASE_PATH }}/images/postImg/2015-10-10/chromejiemian.png)

-----------

## 开始测试

在src文件夹下创建test.js，内容如下：

```
// 一个字符串翻转函数
function stringReverse(str) {
    return typeof str === "string" && str.split("").reverse().join("");
}
```

在test文件夹下创建string.json，内容如下：

```
(function() {

    QUnit.module('string-test');

    test("reverse string", function(assert) {
        assert.equal(stringReverse("abc"), "cba", "test success");
    });
}());
```
修改配置文件:

```
files: [
  'src/test.js',
  'test/string.js'
]
```

在命令行输入`karma start`，可以看到输出：
![test输出]({{ site.BASE_PATH }}/images/postImg/2015-10-10/testoutput.png)
在Chrome和PhantomJS下都方法都返回正确。
如果把string.js改成:

```
(function() {

    QUnit.module('string-test');

    test("reverse string", function(assert) {
        assert.equal(stringReverse("ccc"), "cba", "abc reverse to cba");
    });
}());
```

则函数返回值和我们预期的不一样，会提示错误：
![test输出]({{ site.BASE_PATH }}/images/postImg/2015-10-10/testoutputfail.png)

## 总结

* 这里主要说明了一下karma和qunit之间配合搭建前端自动化测试环境，不详细说明qunit的使用。
* karma还可以配合很多其他测试框架一起使用，比如[Jasmine](http://jasmine.github.io/)和[mocha](https://mochajs.org/)等。
* karma可以和[grunt](http://gruntjs.com/)或者[gulp](http://gulpjs.com/)配合使用，再和IDE比如sublime结合，能做到敲完代码立即自动化执行任务触发运行测试，非常便捷。

**参考**
[QUnit](http://qunitjs.com/)
[Karma](http://karma-runner.github.io/0.13/index.html)
[Karma和一些测试的知识介绍](http://www.douban.com/note/334051223/) 由于里面写的原文链接我访问不了，所以贴上此链接了。