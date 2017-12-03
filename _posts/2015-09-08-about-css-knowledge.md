---
layout: post
title: css的一些规范
author: xlaoyu
categories: [css]
tags: [css, css书写规范]
description: css书写规范，css书写技巧，css书写顺序
---

* content
{:toc}

关于css的书写规范的一些学习记录。

之前在网上看到一篇文章，是讨论css BEM的，一个没听过的名词，遂google之~~发现这是一种css的**<span class="text-info">命名方法论</span>**。╰(*°▽°*)╯突然发现一直以来看到大多数关于css的讨论都是如何实现一个效果：实现一个布局，显示一个动画，用纯css实现一些交互效果等等，没见过讨论关于css命名和书写规范的东西。（*虽然LESS,SASS等预编译css的工具可以一定程度上提高书写css的可阅读性，逻辑性，但是里面书写时候的顺序和命名都是没有强制要求的*）。



关于BEM篇幅太长，我也还没了解透彻，就不在这里叙说了，最后在附录给出链接，这里主要说说简单的css书写顺序和命名较好的实践。*其实大多数都是从网上摘录*
↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

## **CSS书写顺序**

1. 位置属性(position, top, right, z-index, display, float等)
2. 大小(width, height, padding, margin)
3. 文字系列(font, line-height, letter-spacing, color- text-align等)
4. 背景(background, border等)
5. 其他(animation, transition等)

![pic1]({{ site.BASE_PATH }}/images/postImg/2015-09-08/pic1.png)

## **CSS书写规范**

1. **使用CSS缩写属性**
    CSS有些属性是可以缩写的，比如padding,margin,font等等，这样精简代码同时又能提高用户的阅读体验。
    ![pic2]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic2.png)

2. **去掉小数点前的“0”**
    一个是不需要写，因为css能正确解析 “.5” 就是 “0.5”。另一个就是能减少书写的字数。
    ![pic3]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic3.png)

3. **简写命名**
    简写但是不能失去本来的意义，使用“div1”、“div2”、“a2”这样的命名，这么做可以同时减少html和css的文件大小。
    ![pic4]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic4.png)

4. **16进制颜色代码缩写**
    有些颜色代码是可以缩写的，我们就尽量缩写吧，提高用户体验为主。
    ![pic5]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic5.png)

5. **连字符CSS选择器命名规范**
  1. 长名称或词组可以使用中横线来为选择器命名。
  2. 不建议使用“_”下划线来命名CSS选择器，为什么呢？
    • 输入的时候少按一个shift键；
    • 浏览器兼容问题 （比如使用_tips的选择器命名，在IE6是无效的）
    • 能良好区分JavaScript变量命名（JS变量命名是用“_”）
  ![pic6]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic6.png)

6. **不要随意使用Id**
    id在JS是唯一的，不能多次使用，而使用class类选择器却可以重复使用，另外id的优先级优先与class，所以id应该按需使用，而不能滥用。
    ![pic7]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic7.png)

7. **为选择器添加状态前缀**
    有时候可以给选择器添加一个表示状态的前缀，让语义更明了，比如下图是添加了“.is-”前缀。
    ![pic8]({{ size.BASE_PATH }}/images/postImg/2015-09-08/pic8.png)

-------

## **附录**：

1. [https://en.bem.info/method/definitions/#bem-entity](https://en.bem.info/method/definitions/#bem-entity) css命名方法论BEM
2. [http://nicolasgallagher.com/about-html-semantics-front-end-architecture/](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/) 由Nicolas Gallagher改进的BEM方法论（个人目测Bootstrap就是这样的命名方法和写法）
3. [http://css.doyoe.com/](http://css.doyoe.com/)css参考手册，里面有包括所有css的介绍和兼容性列表和示例代码（css界的圣经，Amen）
4. [http://www.zhihu.com/question/20549293](http://www.zhihu.com/question/20549293) 查看浏览器内置样式的方法
5. [http://segmentfault.com/a/1190000002629708](http://segmentfault.com/a/1190000002629708)关于浏览器渲染的reflow和repaint（提高性能需要了解的一个深入话题，其中关于content tree和render tree的详细概念自行百度）
