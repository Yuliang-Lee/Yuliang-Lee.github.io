---
layout: post
title: 纯前端实现文件下载功能
author: xlaoyu
categories: [javascript]
tag: [javascript]
description: 纯前端实现文件下载功能
keywords: javascript,下载,download
---

* content
{:toc}

一般情况下，想要实现文件下载/导出功能，需要在前端把数据发到服务端或者发送下载请求到服务端，然后由服务端通过`获取数据 -> 生成数据 -> 生成文件`三个步骤生成数据，在响应请求头中包含`Content-disposition: attachment`用于指定文件类型、文件名和文件编码等，浏览器接收到响应后就会触发下载行为。



但是有时候这种交互是一种多余的资源和带宽消耗，比如需要下载的是用户生成的内容（在线作图等）或者内容已经全部返回到客户端了。如果这时候能不经过服务端而直接生成下载任务，能节省不少的资源和时间开销。下面就说说实现的几种方法。

# 1 生成数据

导出的数据，必须先转换成浏览器支持的类型的值，然后再通过特定的方式导出。

## 1.1 data: URLs

[data: URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)是前缀为`data:`的 URL 字符串，格式为

> data:[\<mediatype>][;base64],\<data>

`mediatype` 是个 MIME 类型的字符串，例如 "`image/jpeg`" 表示 JPEG 图像文件。如果被省略，则默认值为 `text/plain;charset=US-ASCII`

如果数据是文本类型，你可以直接将文本嵌入 (根据文档类型，使用合适的实体字符或转义字符)。如果是二进制数据，你可以将数据进行base64编码之后再进行嵌入。

在浏览器一般可以这样对字符串进行base64编码

```js
var str = 'some file string';
var dataUrl = btoa(str);
// output => c29tZSBmaWxlIHN0cmluZw==
```

这种编码方式有一个非常大的缺点，就是每个浏览器对它的长度大小支持都不一样，尤其 **chrome** 只支持**2MB**大小，详细查看stackoverflow的回答[data-protocol-url-size-limitations](https://stackoverflow.com/questions/695151/data-protocol-url-size-limitations)。其余缺点可以查看 MDN。

注：DataURLs 还有一个很常用的场景是在 css 中嵌入图片

浏览器兼容性

| Feature |	Chrome | Edge |	Firefox |	Internet | Explorer | Opera | Safari |
|--|--|--|--|--|--|--|--|
| Basic | support |	Yes |	12 |	Yes |	8 |	7.2 |	Yes |
| CSS files |	Yes |	12 | Yes | 8,9 | 7.2 |Yes |
| HTML files | ? |No | ? |No | ? | ? |
| JavaScript files | Yes | 12 |	Yes | 9 |	7.2 |	Yes


## 1.2 blob:URLs

[blob: URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)是**URL.createObjectURL()** 静态方法创建的一个 [DOMString](https://developer.mozilla.org/en-US/docs/Web/API/DOMString)，其中包含一个表示参数中给出的对象的URL。其中涉及到的`File`对象和`Blob`对象不再这里展开，有兴趣可以去查阅 MDN。

语法
```js
var objectURL = URL.createObjectURL(blob);
```

**注意**
创建出来的`BlobURLs`需要手动调用`URL.revokeObjectURL()`销毁，否则会一直保留到页面关闭，为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。

浏览器兼容性

| Chrome | Firefox (Gecko) | Internet Explorer | Opera |Safari (WebKit) |
|--|--|--|--|--|
| 23 | 4.0 | 10	| 15 | 7 |

## 1.3 FileReader

如果浏览器不支持下载 `BlobURLs`,则可以尝试使用`FileReader`把 `Blob`或者`File`对象转化成`DataURLs`。

通过以下代码获取
```js
var reader = new FileReader();
reader.onloadend = function() {
  var dataUrl = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
  console.log(dataUrl);
};
reader.readAsDataURL(blob);
```

# 2 导出方式

## 2.1 HTML5 a.download

`<a>`标签的*download*是HTML5标准新增的属性，作用是**指示浏览器下载URL而不是导航到URL，因此将提示用户将其保存为本地文件**。由于是HTML5新增的属性，所以不是所有浏览器都支持，从 [caniuse](https://caniuse.com/#search=a.download) 中可以看到兼容性对比。使用此属性的时候 `href` 属性支持 [blob: URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) 和 [data: URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)两种类型的值。`download` 属性的值用于指定文件名。

## 2.2 location.href

这个方法是直接把 `DataURLs` 或者 `BlogURLs` 传到浏览器地址中触发下载。有两种方式：

```js
window.location.href = urls; // 本窗口打开下载

window.open(urls, '_blank'); // 新开窗口下载
```

兼容性：

- safari 不支持`BlogURLs`触发下载，所以一定要转成`DataURLs`


## 2.3 msSaveOrOpenBlob（IE10+)

这是 IE 特有的方法。

```js
navigator.msSaveOrOpenBlob(blob, fileName);
```

## 2.4 iframe(IE <= 9)

其他更现代的浏览器也支持此方法，不过此方法效率和安全性较低，所以一般只在 IE <= 9 时使用。

```js
// Internet Explorer (<= 9) workaround by Darryl (https://github.com/dawiong/tableExport.jquery.plugin)
// based on sampopes answer on http://stackoverflow.com/questions/22317951
// ! Not working for json and pdf format !
var frame = document.createElement("iframe");

if ( frame ) {
  document.body.appendChild(frame);
  frame.setAttribute("style", "display:none");
  frame.contentDocument.open("txt/html", "replace");
  frame.contentDocument.write(data); // data 是 string 类型
  frame.contentDocument.close();
  frame.focus();

  frame.contentDocument.execCommand("SaveAs", true, filename);
  document.body.removeChild(frame);
}
```

参考连接
1. [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
2. [bootstrap-table 的 export 插件](https://github.com/wenzhixin/bootstrap-table/tree/master/src/extensions/export)
3. [MDN](https://developer.mozilla.org/en-US/)

-------------

版权声明：本文为博主原创文章，未经博主允许不得转载，本文首发于[xlaoyu](https://www.xlaoyu.info)