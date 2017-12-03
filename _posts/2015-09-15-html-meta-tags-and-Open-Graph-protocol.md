---
layout: post
title: HTML meta标签和Open Graph protocol
author: xlaoyu
categories: [html]
tag: [html, SEO, meta标签]
description: HTML的meta标签简单介绍,包括Open Graph protocol(开放内容协议)的简单介绍
keywords: html,meta,Open Graph protocol,开放内容协议
shortinfo: HTML的meta标签简单介绍,包括Open Graph protocol(开放内容协议)的简单介绍
---

* content
{:toc}

HTML的meta标签简单介绍,包括Open Graph protocol(开放内容协议)的简单介绍



## meta标签的定义

> ``<meta>``元素可提供有关页面的元信息（meta-information），比如针对搜索引擎和更新频度的描述和关键词,**还可用作模拟HTTP协议的响应头报文**。
    ``<meta>``标签**必须**位于文档的头部，不包含任何内容。``<meta>``标签的属性定义了与文档相关联的名称/值对。

## meta标签的用法

常用的属性：

* charset(HTML5)
  这个属性设置网页使用的字符编码。这个属性的值必须使用[MIME](http://www.iana.org/assignments/character-sets/character-sets.xhtml)定义好的字符类型，一般使用utf-8。
  ``<meta charset="utf-8">``
* http-equiv
  常用的值有：
  1. content-type：``<meta http-equiv="Content-Type" content="text/html";charset=gb2312">``
  2. expires：``<meta http-equiv="Expires" content="Mon,12 May 2001 00:20:00 GMT">``可以网页缓存的到期时间，一旦过期则必须到服务器上重新下载。需要注意的是必须使用GMT时间格式。
  3. refresh：``<meta http-equiv="Refresh" content="n;url=http://yourlink">``定时让网页在指定的时间n内，跳转到页面http://yourlink
  4. set-cookie：``<meta http-equiv="set-cookie" content="Mon,12 May 2001 00:20:00 GMT">``cookie设定，如果网页过期，存盘的cookie将被删除。需要注意的也是必须使用GMT时间格式
  5. X-UA-Compatible: ``<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">``设置浏览器使用最新的浏览器渲染引擎或者含有webkit内核的浏览器使用webkit内核
* name
  常用的值有：
  1. author：``<meta name="author" content="">``网页的作者
  2. description：``<meta name="description：" content="">``网页的主要内容
  3. keywords：``<meta name="keywords：" content="">``网页的关键字
  4. robots：``<meta name="robots：" content="">``告诉搜索引擎爬虫如何处理网页
  **以下是移动端使用的**
  1. viewport: ``<meta name="viewport" content="">``用于告诉移动端浏览器如何处理网页，一般的值有
    width：宽度（数值 / device-width）（范围从200 到10,000，默认为980 像素）
    height：高度（数值 / device-height）（范围从223 到10,000）
    initial-scale：初始的缩放比例 （范围从>0 到10）
    minimum-scale：允许用户缩放到的最小比例
    maximum-scale：允许用户缩放到的最大比例
    user-scalable：用户是否可以手动缩 (no,yes)
  2. mobile-web-app-capable 把网页添加到桌面,模仿app离线应用,content=yes/no
  3. apple-mobile-web-app-capable: ``<meta name="apple-mobile-web-app-capable" content="yes" />``同上,但是是IOS的safari专用
  4. apple-mobile-web-app-status-bar-style: 在上面开启的前提下有用,content值是``default|black|black-translucent``
  5. apple-mobile-web-app-title 在capable开启的前提下有用,content=自己想显示的标题
  6. ``<meta content="telephone=no" name="format-detection" />`` 忽略将数字自动识别为电话号码
  7. ``<meta content="email=no" name="format-detection" />`` 忽略识别邮箱,这两个元素可以合在一起写


## Open Graph protocol

### Meta Property=og标签是什么?

og是一种新的HTTP头部标记，即Open Graph Protocol.

> The Open Graph protocol enables any web page to become a rich object in a social graph.

即这种协议可以让网页成为一个“富媒体对象”。

用了Meta Property=og标签，就是你同意了网页内容可以被其他社会化网站引用等，目前这种协议被SNS网站如Fackbook、renren采用。

SNS已经成为网络上的一大热门应用，优质的内容通过分享在好友间迅速传播。为了提高站外内容的传播效率，2010年F8会议上Facebook公布了一套开放内容协议(Open Graph Protocol)，任何网页只要遵守该协议，SNS就能从页面上提取最有效的信息并呈现给用户。

### Open Graph Protocol应用指南

#### 参与到Open Graph Protocol的好处

* 能够正确的分享您的内容到SNS网站
* 帮助您的内容更有效的在SNS网络中传播

#### MetaProperty标签的应用

* 按照您网页的类型，在<head>中添加入meta标签,并填上相应的内容
* 可以重复meta标签，将认为og:type 标签是每一段内容的起始处，例如：

  ```
    &ltmeta property="og:title" content="The Rock" />
    &ltmeta property="og:type" content="video.movie" />
    &ltmeta property="og:url" content="http://www.imdb.com/title/tt0117500/" />
    &ltmeta property="og:image" content="http://ia.media-imdb.com/images/rock.jpg" />
    &ltmeta property="og:audio" content="http://example.com/bond/theme.mp3" />
    &ltmeta property="og:description" content="Sean Connery found fame and fortune as the suave, sophisticated British agent, James Bond." />
    &ltmeta property="og:determiner" content="the" />
    &ltmeta property="og:locale" content="en_GB" />
    &ltmeta property="og:locale:alternate" content="fr_FR" />
    &ltmeta property="og:locale:alternate" content="es_ES" />
    &ltmeta property="og:site_name" content="IMDb" />
    &ltmeta property="og:video" content="http://example.com/bond/trailer.swf" />
  ```

#### 注意事项

Meta Property=og代码的功能并不等同于网页的meta name标签，两者针对的对象不一致，功能不同。如果网站上要使用open graph protocol，那么，Meta Property=og和Meta Name、Title标签应同时赋值。

#### Open Graph Protocol对SEO的影响

有些人使用所谓的网站质量在线检测，检测后结果提示Meta Property=og这段代码有问题，特别是一些SEO的检测，更是提示“特别错误”！然后删除Meta Property=og代码，检测正常。
因此担心Meta Property=og这段代码会对网站照成不良影响。
其实Open Graph Protocol并不会对SEO照成不良影响，相反，应用的合理，非常有利于网站的推广。


"深"入了解
1. [http://www.w3school.com.cn/tags/tag_meta.asp](http://www.w3school.com.cn/tags/tag_meta.asp) w3school对meta tag的解释
2. [http://www.w3schools.com/tags/tag_meta.asp](http://www.w3schools.com/tags/tag_meta.asp)需要“翻山越岭”，更详细的介绍
3. [https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta) MDN对meta标签的介绍（完整，标准）
4. [http://ogp.me/](http://ogp.me/) Open Graph Protocol官网
5. [http://segmentfault.com/a/1190000002407912](http://segmentfault.com/a/1190000002407912) 常用meta整理
6. [http://fex.baidu.com/blog/2014/10/html-head-tags/?qq-pf-to=pcqq.c2c](http://fex.baidu.com/blog/2014/10/html-head-tags/?qq-pf-to=pcqq.c2c) HTML head 头标签