---
layout: post
title: 看看同一种字体是如何对应不同的字体文件的
author: xlaoyu
date: 2017-12-17 12:42:00 +0800
categories: [css]
tag: [css]
description: '同一种字体的不同样式引用不同的字体文件'
keywords: cs,font,font-family
---

* content
{:toc}

说起在网页中引入字体文件，首先不得不提一个大多数前端至少用过或者听过的库`Font Awesome`。使用过这个库的都知道，只要引入一个 css 文件，然后通过给元素赋予指定的类，就可以展示出一个对应的图标，而且这个图标能使用 css 样式控制其表现，比传统的使用图片作为图标好太多了。
> [Font Awesome](https://fontawesome.com/) 是一种网页中使用的矢量字体图标解决方案，得益于 CSS3 中的 [CSS Fonts Module Level 3](https://www.w3.org/TR/css-fonts-3) 特性支持。



# 发现疑问

今天无意发现 `Font Awesome` 更新了，升级到 5.x 了之后多了一种 `svg with js` 的使用方式，尝试了下和 *Element-ui* 结合使用，发现这条路子行不通（因为使用这种方式的时候 `font awesome` 会把图标元素的载体元素转换成 `svg` 标签，从到导致了没法动态改变图标的问题，**如果没有动态改变图标的需求可以使用这种方式**）。

基于以上原因，所以还是使用引入 css 的老方法。然鹅，font5 给图标增加了分类，分为 `solid` 和 `regular`，即同一个图标可能会有两种样式，如下：

<iframe height='166' scrolling='no' title='dJYdxZ' src='//codepen.io/Yuliang-Lee/embed/dJYdxZ/?height=166&theme-id=dark&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/Yuliang-Lee/pen/dJYdxZ/'>dJYdxZ</a> by xlaoyu (<a href='https://codepen.io/Yuliang-Lee'>@Yuliang-Lee</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

此时打开控制面板查看两个元素的 css，可以😱的发现使用的字体和内容编码一模一样

![dom-css-content](https://user-images.githubusercontent.com/6936358/34071860-5096dfe6-e2b8-11e7-899b-7773e7365fab.png)

那么问题来了，为什么图标会不一样呢？

# 事出必有因

我们首先打开引入这两种图标的 css 的源码看看

```css
/* regular.css */
@font-face {
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 400;
  src: url('#{$fa-font-path}/fa-regular-400.eot');
  src: url('#{$fa-font-path}/fa-regular-400.eot?#iefix') format('embedded-opentype'),
  url('#{$fa-font-path}/fa-regular-400.woff2') format('woff2'),
  url('#{$fa-font-path}/fa-regular-400.woff') format('woff'),
  url('#{$fa-font-path}/fa-regular-400.ttf') format('truetype'),
  url('#{$fa-font-path}/fa-regular-400.svg#fontawesome') format('svg');
}

.far {
  font-family: 'Font Awesome 5 Free';
  font-weight: 400;
}

/* solid.css */
@font-face {
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 900;
  src: url('#{$fa-font-path}/fa-solid-900.eot');
  src: url('#{$fa-font-path}/fa-solid-900.eot?#iefix') format('embedded-opentype'),
  url('#{$fa-font-path}/fa-solid-900.woff2') format('woff2'),
  url('#{$fa-font-path}/fa-solid-900.woff') format('woff'),
  url('#{$fa-font-path}/fa-solid-900.ttf') format('truetype'),
  url('#{$fa-font-path}/fa-solid-900.svg#fontawesome') format('svg');
}

.fa,
.fas {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
}
```

可以看出 `font-face` 中的 `font-family` 确实一模一样，即可以表示当有元素使用到这个字体的时候，浏览器有能力识别出需要用的是哪个'`font`'。

google 之后在 StackOverflow 找到了一个相关的问答*（Stack Overflow 大法好）*。[How to use font-family with same name?](https://stackoverflow.com/a/33687499/4522157)

咳咳。。敲黑板，划重点👓
> When you describe a font with a name, imagine (in the most abstract of the explanations) that you create an object; but, when you create multiple font-rules with the same name, imagine you create an array. Now, to access and array, you have to use its index. The index here is the font-weight. So, to access different weights (technically, fonts), you use the weight. Continuing the analogy of the array above, you have to manually define the index, it's not automatically done.

原来乳此！如果出现了同样的字体，就是用 `font-weight` 这个属性来判断要用哪一个！这时候再回头去看上面的 `font awesome` 的css 定义，可以看出确实两个字体使用了不同的 `font-weight` 。一切都'水落石出'了。

# 不能听风就是雨

虽然上面回答说得很有道理，并且也符合我们观察到的现象，但是我们不能听风就是雨是不？！下定论要有证据！既然别人能说出来，必然我们能找到对应这块的规范标准。

果不其然，在另外一个[问答](https://stackoverflow.com/a/2436830/4522157)中看到，`font-weight` 和 `font-style` 属性都可以影响字体选择行为，并且出现了引领我们走向'真理'的评论：[CSS Fonts Module](https://www.w3.org/TR/css-fonts-3/#font-prop-desc)。作为描述字体的属性有三个

 - font-weight
 - font-style
 - font-stretch

> These descriptors define the characteristics of a font face and are used in the process of matching styles to specific faces. For a font family defined with several @font-face rules, user agents can either download all faces in the family or use these descriptors to selectively download font faces that match actual styles used in document. The values for these descriptors are the same as those for the corresponding font properties except that relative keywords are not allowed, ‘bolder’ and ‘lighter’. If these descriptors are omitted, initial values are assumed.

目前为止可以总结出几点：

1. 可以使用 `@font-face` 引入外部字字体
2. 使用 `@font-face` 引入相同名字的字体，可以通过设置 `font-weight`、`font-style`、`font-stretch` 属性控制浏览器根据使用样式命中不同的**字体文件**
3. ~~`font-weight` 设置为 `normal` 的定义必须放在最前面~~，经过在 chrome 上测试，并没有这个要求。但是在 Stack Overflow 上很多人都提出有这个限制，可能是旧浏览器的行为，需要注意一下兼容性。

# 参考连接

1. [How to use font-family with same name?
](https://stackoverflow.com/questions/33687468/how-to-use-font-family-with-same-name)
2. [How to add multiple font files for the same font?
](https://stackoverflow.com/questions/2436749/how-to-add-multiple-font-files-for-the-same-font)
3. [Style Linking](https://www.fontspring.com/support/using-webfonts/style-linking)
4. [CSS Fonts Module Level 3](https://www.w3.org/TR/css-fonts-3/#font-prop-desc)
5. [element2-fontawesome5](https://github.com/Yuliang-Lee/element2-fontawesome5)

-----

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.info](https://www.xlaoyu.info)”