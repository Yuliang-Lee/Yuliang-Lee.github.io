---
layout: post
title: liferay二次开发部署在weblogic上的文件下载中文名问题解决
author: xlaoyu
categories: [portal]
tag: [liferay,中文乱码]
description: liferay二次开发部署在weblogic上的文件下载中文名问题
keywords: liferay,download,Chinese garbled
shortinfo: liferay二次开发系统，部署在tomcat时不会出现下载文件中文乱码问题，但是部署在weblogic会出现乱码问题。
---

* content
{:toc}

liferay二次开发系统，部署在tomcat时不会出现下载文件中文乱码问题，但是部署在weblogic会出现乱码问题。



### 问题
在liferray上开发portlet，下载文件时候使用portlet的ResourceRequest做请求代理访问后台，在下载文件名字时使用URL类来打开连接，获取InpurtStream，比如连接为：`http:/xxx.com/xxx/xxx/中文文件名.txt`。如果项目部署在tomcat中的时候，使用代码

```java
String url = "http://xxx.com/xxx/xxx/中文文件名.txt";
URL urls = new URL(url);
InputStream input = urls.openStream();
```

后台能接收到请求并且返回流文件，然后下载成功。
**当把项目部署在weblogic11g的时候，后台接收到的url文件名部分会出现乱码情况，导致无法正确返回文件，执行到`urls.openStream()`的时候报错。**

---------

### 解决方法

把中文名部分编码成[URL编码][1]格式(也叫[百分号编码][1])：

```java
String url = "http://xxx.com/xxx/xxx/中文文件名.txt";
int index = url.lastIndexOf("/");
String path = url.substring(0, index + 1);
String fileName = url.substring(index + 1);
String encodeName = URLEncoder.encode(fileName, "UTF-8");
URL urls = new URL(path  + encodeName);
InputStream input = urls.openStream();
```

这样编码之后后端就能接收到中文文件的下载请求，然后正确返回数据了。

--------
[1]: http://baike.baidu.com/view/204662.htm

----------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.info](https://www.xlaoyu.info)”