---
layout: post
title: 高性能网站建设学习笔记（1）
author: xlaoyu
categories: [web]
tag: [javascript, web性能优化, 前端工程化]
description: web性能优化，前端工程化
keywords: web性能,高性能网站建设指南,web优化笔记
---

* content
{:toc}

> *只有10%~20%的最终用户响应时间花在了下载html文档上，其余的80%~90%时间花在了下载页面组件（图片，脚本，样式表，flash等）上。*
                                                                    ----*高性能网站建设指南*



我看过的几乎所有写web性能优化的文章都会出现这句话，我也要zhuangbility一次。早在08年雅虎出版《[高性能网站建设指南][1]》之前，国外的顶级互联网公司们就已经开始不同程度的前端工程化和web性能优化了，自从进入web2.0时代，前端开发（也称那个写页面的，那个切图的）也慢慢转变成了**前端工程狮**能在动物园（其中有产品狗、设计猫、测试牛、程序猿鼓励虱等）中拥有一定的话语权和决定权了。

这里记录一下我看完*高性能网站建设指南*和网络一些blog文章之后的一些细节知识点。最后会给出这些文章的连接（**`感谢大牛们的分享，让我们一些小狮子可以不至于落后太多`**）

------------------------------

这本书总结的14条优化原则被世人称为***雅虎14条***，后来还有更详细的[雅虎35条][2]。14条原则按方向分类，这里引用[fouber大神一篇文章][3]的表格

<table class="table">
   <thead>
      <tr>
         <th>优化方向</th>
         <th>优化手段</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>请求数量</td>
         <td>合并脚本和样式表，CSS Sprites，拆分初始化负载，划分主域</td>
      </tr>
      <tr>
         <td>请求带宽</td>
         <td>开启GZip，精简JavaScript，移除重复脚本，图像优化</td>
      </tr>
      <tr>
         <td>缓存利用</td>
         <td>使用CDN，使用外部JavaScript和CSS，添加Expires头，减少DNS查找，配置ETag，使AjaX可缓存</td>
      </tr>
      <tr>
         <td>页面结构</td>
         <td>将样式表放在顶部，将脚本放在底部，尽早刷新文档的输出</td>
      </tr>
      <tr>
         <td>代码校验</td>
         <td>避免CSS表达式，避免重定向</td>
      </tr>
   </tbody>
</table>

1、*HTTP是一种客户端/服务器协议，它基于TCP协议，由请求和相应组成。为了减少握手次数，通常使用请求头**Connection：keep-alive**来实现持久连接。*现在大多数浏览器都是使用HTTP 1.1版本，最新的HTTP版本是2.0。

2、减少HTTP请求的方法有：
    * CSS Sprites：把多张图片合成一张，而且一般合成之后的照片大小会比原来多张图片的总大小更**小**
    * 合并脚本和样式表；就是把原本多个资源文件合并成一个，这一点涉及到很多工程化的东西，详细建议看上面说提的fouber大神的文章或者自行百度
    * 内联图片：通过把比较小（通常8KB以下）的图片用base64来编码，然后通过 ``data:[<mediatype>][;base64],<data>`` 写在img的src属性中

3、使用CDN（Content Delivery Networks）除了能加速访问速度，还能提供备份、扩展存储能力、缓存、缓和峰值压力等好处。

4、使用Last-Modified或者Etag请求头能使浏览器发送“条件get请求”去检测是否需要重新加载资源，但是使用Expires和Cache-Control两种请求头能使浏览器在**一段**时间内强制使用缓存，连“条件get”都不会发送了。Expires需要浏览器和服务器时间强同步，而Cache-Control没有这个要求。

5、使用Vary：Accept-Encoding头能使*代理服务器*缓存压缩和未压缩两份数据。使用Vary：*或者Cache-Control：private能使代理服务器不缓存数据。使代理服务器不缓存数据能解决一些**边缘情况**

6、不同浏览器，并行下载的数量是不一样的。HTTP 1.1规范建议从**每个主机**并行下载数量是两个，所以能通过增加主机提高并行下载数量，但是这需要考虑CPU和带宽。**下载脚本时是不能并行下载的，只能一个一个来！因为脚本的执行是可能会有前后/依赖顺序**

7、CSS表达式只在旧的IE下会使用，希望广大前端er能早日摆脱IE大拿o(╯□╰)o

8、有一个很经典的前端面试题：``讲讲输入完网址按下回车，到看到网页这个过程中发生了什么。``了解一下这个过程会对为什么要减少DNS查找有比较完整的概念。[答案][4]

9、关于**减少重定向**这一点。我发现现在几乎所有大型公司的大型网页，都会用到重定向，因为现在是**大数据时代**，统计一切用户行为能带来无数的好处$_$。

10、配置Etag会在服务器是集群的情况下有问题，解决方法是修改Etag默认的生成方式，改为不和机器或服务器相关联的方式。

11、未来的网页是[SPA][5]的天下，这毫无疑问，所以尽管使用Ajax去获取数据，资源，也不能忘了网页优化这些概念。

-----------------------------

一些关于web性能的文章链接
[Web性能优化：What? Why? How? ](http://www.cnblogs.com/dojo-lzz/p/4591446.html)
[前端工程与性能优化](https://github.com/fouber/blog/issues/3)
[Best Practices for Speeding Up Your Web Site](https://developer.yahoo.com/performance/rules.html)
[消除疑问：CSS动画 VS JavaScript](https://github.com/classicemi/blog/issues/3) -----代码本来运行快才是硬道理


[1]: http://book.douban.com/subject/3132277/
[2]: https://developer.yahoo.com/performance/rules.html
[3]: https://github.com/fouber/blog/issues/3
[4]: http://www.cnblogs.com/dojo-lzz/p/3983335.html
[5]: http://baike.baidu.com/item/SPA/17536313#viewPageContent