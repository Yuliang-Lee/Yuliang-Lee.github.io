---
layout: post
title: express使用multer处理上传报错Boundary not found
author: xlaoyu
categories: [nodejs]
tag: [javascript,nodejs,upload,express]
description: nodejs服务端处理上传请求报错Boundarynotfound
keywords: nodejs,javascript,upload,express
shortinfo: nodejs服务端处理上传请求报错Boundary not found
---

* content
{:toc}

在用nodejs + expressjs + multer做服务端上传处理的时候，控制台一直报错
![错误]({{ site.BASE_PATH }}/images/postImg/2016-01-14/1.png)



谷歌之后发现`Boundary`这个东西大概用途是在上传体中用来分割每个值的一个分隔符，如：
![Boundary用途]({{ site.BASE_PATH }}/images/postImg/2016-01-14/2.png)
的红框中的内容，上图上传正确的样子。

为什么会缺少这一部分呢？？？？
问题出在了我前端是使用jquery直接使用ajax来发送formData作为上传的手段，但是jquery的ajax做了很多兼容性的包装，其中影响了请求的有`contentType`和`processData`这两个属性:

* contentType:默认使用`application/x-www-form-urlencoded; charset=UTF-8`格式来发送消息体，但是上传的时候需要使用`multipart/form-data`类型，但是我们**不**能把它写死为`multipart/form-data`，因为这样就会出现上述的找不到Boundary的错误，正确的做法是把这个设置为**false**。
* processData：这个属性的作用是默认把我们的消息体转换成默认的`x-www-form-urlencoded`格式，但是前面已经说明了我们上传的时候是不会使用这种格式的，所以把这个属性设置为**false**。

参考链接
[SIMPLE FILE UPLOADS USING JQUERY & AJAX](http://abandon.ie/notebook/simple-file-uploads-using-jquery-ajax)

-------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”
