---
layout: post
title: 【译】使用dojo的lang.hitch方法有什么好处
categories: [dojo]
tag: [javascript,dojo]
description: 函数上下文环境 这个概念经常会让很多刚接触javascript的开发者感到疑惑，尤其当其和this联系在一起说的时候。例如：Java 中的方法是在编译时绑定到类，其中的this在调用方法的时候总是会指向包含此方法的类的实例。
keywords: dojo,lang.hitch,js this,js context
shortinfo: 函数上下文环境 这个概念经常会让很多刚接触javascript的开发者感到疑惑，尤其当其和this联系在一起说的时候。例如：Java 中的方法是在编译时绑定到类，其中的this在调用方法的时候总是会指向包含此方法的类的实例。
---

原文地址: [What is the benefit to using run-time binding with lang.hitch?](https://www.sitepen.com/blog/2013/09/25/dojo-faq-what-is-the-benefit-to-using-run-time-binding-with-lang-hitch/?utm_source=tuicool)

函数上下文环境 这个概念经常会让很多刚接触javascript的开发者感到疑惑，尤其当其和this联系在一起说的时候。例如：Java中的方法是在编译时绑定到类，其中的this在调用方法的时候总是会指向包含此方法的类的实例。另一方面，JavaScript函数的上下文环境不是由函数在哪里定义而决定的，而是由它的调用方式决定的。

Javascript函数被调用的方式一般有两种，作为一个对象的方法被调用和单独调用。当一个方法作为一个方法被函数调用，像 foo.bar()，this 会指向调用这个方法的对象（例如：foo）。当一个函数单独调用，像 bar()， this  会指向全局作用域。

考虑下面的代码，注册了一个回调函数来响应DOM节点的点击事件
{% highlight js %}
var myObject = {
  stateValue: false,

  handleClick: function(event) {
    alert(this.stateValue);
  }
};

require([ 'dojo/on' ], function(on) {
  on(someElement, 'click', myObject.handleClick);
});
{% endhighlight %}
这代码看起来非常直观。当 someElement 被点击，myObject.handleClick 会被调用并且会弹出一个框显示myObject.stateValue的内容.然而,当用户真正点击这个元素的时候,弹出框显示的却是"undefined"...发生了什么事?

第一眼看过来, on  就像和 myObject andhandleClick 组合在一起了,并且开发者会期待调用它的结果就像myObject.handleClick() 调用一样.然而,思考一下下面的等同代码:

{% highlight js %}
var handleClick = myObject.handleClick;
on(someElement, 'click', handleClick);
{% endhighlight %}

实际上,只有 handleClick 方法被传递给了 on 。当最终 handleClick 被一个点击事件调用的时候,并不会调用  myObjecct.

幸运的是,Dojo有一个解决方法来确保一个函数总会被自己所期望的上下文调用:lang.hitch.指定一个上下文对象和一个函数,lang.hitch 会根据给定的上下文对象创建一个函数来调用原始的方法,就像ECMAScript 5 的Function.prototype.bind一样(这句话翻译不太准确..).就像Function.prototype.bind,  lang.hitch允许你去指定额外的参数,这些参数会传递给原始的函数.我们可以利用 lang.hitch 去确保 this 像我们期待的一样去引用myObject的值

{% highlight js %}
require([ 'dojo/on' ], function(on) {
  on(someElement, 'click', lang.hitch(myObject, myObject.handleClick);
});
{% endhighlight %}

与Function.prototype.bind不同的是,lang.hitch支持利用函数名作为第二个参数而不是一个函数这一种额外的绑定方法.

{% highlight js %}
require([ 'dojo/on' ], function(on) {
  on(someElement, 'click', lang.hitch(myObject, 'handleClick');
});
{% endhighlight %}

当lang.hitch利用这种方法绑定,外围函数在每次被调用的时候会根据方法名从myObject中取出handleClick方法. 除了会使代码更紧凑了之外,这样组成的lang.hitch函数会自动适应上下文对象的改变,例如，如果向myObject 的handleClick属性分配了一个新的函数，用函数名称绑定的lang.hitch 将自动使绑定使用的新功能，然而用一个函数对象的绑定将需要重新创建。

现在一个上下文对象已经被正确绑定到点击的回调函数中了,上面的例子会按照期待中的运行.就是这么简单!lang.hitch仅仅是其中一个利用Dojo的特点来使复杂的应用变简单的例子
* In ECMAScript 5 strict mode,this is undefined if the function is called without a context.

译者注：其实lang.hitch就相当于是ES5中的Function.prototype.bind方法。hitch之后返回一个新的指定了运行时上下文的函数，hitch方法的第三个参数开始作为新函数从左到右的形参传到函数中。