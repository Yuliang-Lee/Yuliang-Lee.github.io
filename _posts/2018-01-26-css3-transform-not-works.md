---
layout: post
title: 为什么css3的transform属性在inline等元素不生效？
author: xlaoyu
date: 2018-01-26 13:00:00 +0800
categories: [css]
tag: [css3,transform]
description: 'css3的transform属性无法应用在 inline 等元素上的问题'
keywords: css3,transform,'inline-element','not works'
---

* content
{:toc}

最近做的项目使用的图标库从 [fontawesome](http://fontawesome.io/icons/) 改成了 [icon font](http://www.iconfont.cn/)。然后所有原来使用`transform`做的小动效都神奇的失效了，百思不得其姐。。。



## 问题定位

这里顺便说一下使用`iconfont`的好处有：

- 提供了**更多**的图标，到编写此文章为止，有`2,051,771`个图标
- 通过使用 **`项目`** 特性，能有效的控制图标文件的大小和管理项目图标
- 多种使用方式，css/SVG/unicode（5.x的fontawesome 也支持多种使用方式）
- **支持 cdn 引入**


扯回原题，动画失效的元素是应用了`transform: rotate(90deg)`属性，在发现失效之后，尝试了 transform 属性其余几个常用的变换属性，居然通通没生效！

被变换的元素内心os：我在哪我是谁我在干嘛o(╯□╰)o...

继续尝试普通css属性的`transition`效果，可以生效。那么问题应该是发生在`transform`上。每当遇到这种摸不着头脑莫名其妙的问题，只有一个人是靠谱的--谷哥☺️

`css3 transform rotate not working`

😮原因很黄很暴力。。

> **ransformable element**  
  A transformable element is an element in one of these categories:  
  an element whose layout is governed by the CSS box model which is either a block-level or atomic inline-level element, or whose display property computes to table-row, table-row-group, table-header-group, table-footer-group, table-cell, or table-caption [CSS2]  
  an element in the SVG namespace and not governed by the CSS box model which has the attributes transform, patternTransform or gradientTransform [SVG11].

规范说明了，一个元素在两种情况下才是*可变换的元素*：

1. 元素盒子模型是`block`或者规范中指定的类型
2. 不受`CSS盒子模型`支配的设置了`transform`、`patternTransform`和`gradientTransform`属性的`SVG`元素

知道了这点之后，现在我们来看看`iconfont`和`fontawosome`图标样式的区别：

**iconfont**
```css
.iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```

**fontawesome**
```css
.fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```

事情的真相已经出来：**fontawesome**设置了`display: inline-block`属性。

这里有一点值得注意：上述规范中描述的 **`atomic inline-level boxes`** 和 `inline boxes` 是不一样的，

> An inline box is one that is both inline-level and whose contents participate in its containing inline formatting context. A non-replaced element with a 'display' value of 'inline' generates an inline box. Inline-level boxes that are not inline boxes (such as replaced inline-level elements, inline-block elements, and inline-table elements) are called atomic inline-level boxes because they participate in their inline formatting context as a single opaque box.

## 解决问题

给 iconfont 的图标加上display 属性即可
```css
.iconfont {
  display: inline-block;
}
```

## 参考链接

1. [atomic inline-level boxes](https://www.w3.org/TR/CSS2/visuren.html#x13)
2. [transformable element](https://drafts.csswg.org/css-transforms-1/#terminology)


以上内容如有错漏，或者有其他看法，请留言共同探讨。

-------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”