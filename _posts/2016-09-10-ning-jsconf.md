---
layout: post
title: 2016南京 jsconf 参会记录
author: xlaoyu
date: 2016-09-10 20:19:18 +0800
categories: [life]
tag: [js]
description: '2016南京 jsconf 参会记录'
keywords: js,jsconf,'ning jsconf'
---

* content
{:toc}

第二次参加JSConf，南京实在是比深圳远多了，还记得上一年周五下班后慢慢悠悠的去坐高铁然后去酒店check in，而这次提早下班赶飞机，然后赶在晚上12点前到酒店，周居劳顿终于1点躺在了酒店的床上。由于没有带笔记本做详细的会议记录，所以本文涉及的是主要是部分话题简略记录和参会的感想心得。

Ning JS总体感觉比上一年深js的干货少了，毕竟js不可能一直都保持那么快速的发展。现阶段js除了再往其他领域（AR、VR、硬件等）扩张，在前/后端中可创新的能让人眼前一亮的东西已经不多了，据我了解最近一年来没有出现颠覆性的思想和创新，总体方向大概一致，主要都在寻求最佳实践和稳定高性能方面钻研。前端方面主要在组件化的方面继续发力，使用组件的思想组织前端代码和提高效率，使用 virtual-dom 提升渲染性能，使用数据驱动来去掉或者减少DOM操作。而且上一年号称的三大前端框架--Angular、react、polymer，其中Angular和polymer已经鲜有人提起，崛起的是上一年开始崭露头角的Vue，发展速度相当的快。js后端（NodeJS）主要在基础设施方面继续发展：测试、性能调优、问题排查、集群管理、配套设施（如egg等企业框架）。由于自[ES2015](http://www.ecma-international.org/ecma-262/6.0/)(ES6)标准正式发布之后，Ecma决定以后的ES新草案会按照在各大浏览器商中的实现程度来决定是否正式发布，所以js新feature也缓了下来，导致今年也没有人讲纯代码技术上的话题了（如上一年讲了ES6的generator）。

### 简介
上面是自己的一些思绪和会后感觉，下面回到大会主题上来。这次两天的会议一共有19个话题，和历届JSConf相比基本变化不大。。
![历届话题量.png](http://upload-images.jianshu.io/upload_images/2991594-bf2db6de2345fdde.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


今年的参会人数是800+，下图展示了历年人数变化。从图可以看出JS社区活跃度和开发者数量都是增长非常快的。
![历年人数.png](http://upload-images.jianshu.io/upload_images/2991594-1995547896e5c339.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
(图片来自http://2016.jsconf.cn/)

我根据话题所讨论的内容大概做了一个分类（定位不一定准确，有的话题可能涉及了几种类型但只放在一种分类里）：

- 框架/库
  - Vue.js: the Past and the Future
  - egg - 企业级 node 框架
  - GridControl: Networked PM2 for Microservices applications
  - Managing Async with RxJS 5 at Netflix
- 测试
  - 聊聊 JS 测试框架
  - 面向未来的自动化测试-Macaca
- 实践
  - How to build a compiler
  - 3D on the Web
  - Building Virtual Reality on the Web
  - Building a Unified Frontend and Mobile Team
  - 单页应用“联邦制”实践
  - 前端 DevOps 实践
  - Node.js在线性能调优与故障排查
  - 移动海量服务下基于React的高性能同构实践
- 其他
  - Building asynchronous micro-services that get along
  - Learning design patterns from modern JavaScript frameworks
  - Build a Better App with Mapbox
  - DevTools for the Progressive Web（使用vscode连接各个浏览器调试）
  - Using nodejs to count 30 billion requests per day（使用nodejs做数据分析）

----

### 主题

#### Vue.js: the Past and the Future

[Vue.js](https://vuejs.org/)（下面简称Vue）是在14年初正式发布，15年JSConf开始广为人知的一个 MVVx 框架，作者是[尤雨溪](https://github.com/yyx990803)（下面简称尤），之前在google任职现在专职维护Vue。这次话题主要介绍了 Vue 的发展历程，尤给 Vue 定位的是**progressive framework**（渐进式的框架），意思是通过增加各种功能的工具类/库补充Vue的核心功能使得Vue越来越强大而又不失灵活性。如下图：

![Vue.png](http://upload-images.jianshu.io/upload_images/2991594-d61fb4062bf71d6e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
（图片来自尤大大的演讲slide）

在需要做规模比较大的应用时，可以选择 vue-router、vuex 等工具加强系统，在只需要开发短平快的小应用时，可以只使用 Vue core 部分，这点和 react 不同的是不需要像后者那样为了选择配套的工具类库而焦头烂额无从下手。而 Angular2.0 是豪华整容五虎上将精通十八班武艺，代价就是如果用它来开发规模并不大的应用时会感觉在用屠龙刀杀鸡（PS：有人说Angular2就是JS界的django）。

还有一点值得注意的是：Vue 和 [weex](http://alibaba.github.io/weex/) 的合作，Vue 为 weex 的js运行时支持，对三端的一些操作例如DOM操作做一种抽象，服务端不用去判断这是IOS还是Android还是H5页面发出来的事件。如果我们部门以后需要做跨三端的移动应用，那么使用 weex 是一个不错的选择，有以下几点好处：
- 减少学习成本（**Write Once Run Everywhere**）
- 这是集团内部的项目，在需要获取技术支持的时候应该会比使用其他框架方便
- 对融入大集团的技术体系有帮助，在我们需要使用集团的一些基础服务的时候，可以减少很多时间和精力去研究如何操作

----

#### How to build a compiler

一个来自facebook的极客[James Kyle](http://thejameskyle.com/)，个人网站和演讲slide都亮瞎了我们的dog眼。题目定为非常准确，因为虽然Demo代码是使用js来编写compiler，但是讲的内容是一个compiler的总体架构和组成，对compiler的各个环节讲解都深入浅出，然后使用了200多行代码演示了一个最简单的编译器从0到1的整个过程：
- 解析(parsing)：把源代码解析为更加抽象的表示
  - 词法分析(lexical analysis)
  - 语法分析(syntax analysis)
  - 抽象语法树(AST)
- 转换(transformation)：进行你的compiler需要做的一切操作
  - 遍历(traversal)：遍历生成的AST
  - visitor：遍历AST获取的不同类型的节点进行不同的处理
- code generation：生成新的代码

这是一个拓展技术深度的好话题，演讲者讲解也非常浅显易懂，是今年JSConf里不多的干货之一。

----

#### 3D on the Web、Building Virtual Reality on the Web

这两个话题都是讲解了JS在最新领域(3D、VR)的一些应用，介绍了 [Three.js](http://threejs.org/)和[A-Frame](https://aframe.io/)，非常炫酷。一个VR Demo--[snow](http://www.shiyaluo.com/three.js-samples/three-particles/snowing.html)（用手机打开网页）。

----

#### egg - 企业级 node 框架

集团内部开源出去的企业及框架，基于[koa](http://koajs.com/)（为了解决js的callback hell问题开发的web框架）。egg目前已经作为阿里集团内部的基础设施，围绕集团的其他基础服务提供了很多封装好的模块供我们使用，如果我们使用nodejs开发系统而不使用egg的话，那么如果想接入集团的其他基础服务或者接口，需要非常大的工作量（因为需要自行封装）。[egg ali git](http://gitlab.alibaba-inc.com/egg/egg)
使用egg的优势：
- 集团内产品，技术支持不是问题
- 内置强大的安全机制
- 跨语言RPC（重点，之前尝试在node中接入阿里的某些服务（java开发），非常麻烦而且蛋疼）
- 基于koa解决回调地狱问题
- 非常多的配套plugin，并且还会继续增加
缺点：
从benchmarks来看性能比koa稍低，技术选型时需要在性能、稳定性、开发复杂度和系统复杂度上取舍。

----

#### GridControl: Networked PM2 for Microservices applications

演讲者是[Alexandre Strzelewicz](https://github.com/Unitech)，这哥们的英语口音比较重，很难听懂，在QA环节也没有什么人会提问他- -。上一年他来讲了[PM2](http://pm2.keymetrics.io/)--一个进程管理模块，可以用来管理Nodejs应用。我在推荐系统中尝试使用过PM2，因为系统规模不大，除了有可视化界面查看应用在每个进程中的内存和cpu使用情况，没有发现其他优点，所以没有继续使用。因为演讲听不懂所以只能靠PPT来大概理解GridControl是干什么的：一个服务管理工具，把多个服务统一进行管理维护，形成一个Grid（我理解为一个服务矩阵的意思）。具体怎么使用还需要去仔细研究，并且这个项目是开会的时候当场开源的，估计还有很多坑要填，有待观望。
思考：像我们现在的系统已经有好十几二十个了，每个都单独分而治之，没有一个可以统一查看和管理状态的地方，应该考虑用一个工具可以统一管理这些系统。

----

#### Building a Unified Frontend and Mobile Team

这个话题主要说的是为什么和如何使用react、react-native来打造一个跨三端的团队。其实这个实践方向和weex像达成的目标是同样的，都是为了减少成本（人力成本，学习成本），减少重复劳动，提高产品成形速度，提高开发效率。因为现在团队并没有涉及移动产品，所以不多讨论。但是从现在的发展趋势来看，前端的定义会越来越广泛，不再仅仅是“做页面的”。这对前端工程师来说是一件好事，因为这代表了能力的不断提升，在团队中角色定位的提升等等。

----

第二天并没有多少干货，大多数都是演讲者在推广自己公司的产品（包括微软的讲师因为飞机延误问题从美国到南京花了2天时间也是在介绍vs code）。主要有一个RxJS比较值得关注。

#### Managing Async with RxJS 5 at Netflix

TODO

