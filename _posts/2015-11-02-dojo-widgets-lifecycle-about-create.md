---
layout: post
title: Dojo widgets的生命周期-创建
author: xlaoyu
categories: [dojo]
tag: [javascript,dojo,dojo widget]
description: Dojo widgets的生命周期创建阶段的介绍,结合源码作简单的说明
keywords: dojo,dojo widget,widget lifecycle,dijit
shortinfo: Dojo widgets的生命周期创建阶段的介绍,结合源码作简单的说明
---

* content
{:toc}

删除篇：[Dojo widgets的生命周期-删除阶段](http://www.xlaoyu.me/dojo/2015/09/25/dojo-widgets-lifecycle-about-destroy.html)



# 简介

Dojo widget的生命周期包括创建阶段和销毁阶段，其中创建阶段又称为实例化(instantiation)阶段，这篇文章主要介绍创建阶段。

--------

# 方法分步介绍

一般情况下，我们在Dojo中通过继承``dijit/_WidgetBase``来定义一个widget时都会同时继承``dijit/_TemplateMixin``，_TemplateMixin的``buildRendering``方法会覆盖掉_WidgetBase的``buildRendering``方法（在实例化widget过程中会调用到这个方法）。

先来看看整体过程；

* constructor(所有原型上存在，实例化时被调用)
* postscript(所有用``declare``构建的模块原型都存在这个方法)
  * create
    * postMixInProperties
    * buildRendering
    * postCreate
* startup

## constructor

当widget被使用``new myWidget()``这样的形式创建时，首先就会调用到constructor方法，由于js的值的传递特殊性，通常在Dojo中我们会在constructor中初始化对象类型的变量，比如现在定义的widget有一个数组类型的``myArr``和对象类型的``myObj``两个属性，如果像下面这样写：

```js
var myWidget = declare([ _WidgetBase, _TemplateMixin ], {

    myArr: [],

    myObj: {},

    constructor: function() {
        this.inherited(arguments);
    }

});

var my1 = new myWidget()
var my2 = new myWidget()
alert(my1.myArr === my2.myArr)   // true
alert(my1.myObj === my2.myObj)   // true

```

由此可见，每个实例化出来的对象对属性的引用，都是指向了同一个数组，一般情况下这并不是我们期望的，所以要改成：

```js
var myWidget = declare([ _WidgetBase, _TemplateMixin ], {

    myArr: null,

    myObj: null,

    constructor: function() {
        this.inherited(arguments)

        this.myArr = []
        this.myObj = {}
    }

});

var my1 = new myWidget()
var my2 = new myWidget()
alert(my1.myArr === my2.myArr)   // false
alert(my1.myObj === my2.myObj)   // false

```

这样就不会引用到同一个对象变量了。``this.inherited``表示先执行父类（这里是指_WidgetBase和_TemplateMixin）的constructor方法。

## postscript

在使用``declare``方法来定义模块的时候，会自动包装constructor方法然后执行一些额外的操作，最后调用postscript方法。``_WidgetBase``的postscript方法内部什么都没做，直接调用了create方法，看一下源码：

```js
postscript: function(/*Object?*/params, /*DomNode|String*/srcNodeRef){
    // summary:
    //      Kicks off widget instantiation.  See create() for details.
    // tags:
    //      private

    // Note that we skip calling this.inherited(), i.e. dojo/Stateful::postscript(), because 1.x widgets don't
    // expect their custom setters to get called until after buildRendering().  Consider changing for 2.0.

    this.create(params, srcNodeRef);
},
```

### create

create方法的核心是在不同的**时机**分别调用``postMixInProperties``、``buildRendering``和``postCreate``，这三个方法能被重写。

```js
create: function(params, srcNodeRef){

    ...做一些其他事情

    // mix in our passed parameters
    if(params){
        this.params = params;
        lang.mixin(this, params);
    }
    // 在把实例化时的参数mixin进this对象之后调用
    this.postMixInProperties();

    // Generate an id for the widget if one wasn't specified, or it was specified as id: undefined.
    // Do this before buildRendering() because it might expect the id to be there.
    if(!this.id){
        this.id = registry.getUniqueId(this.declaredClass.replace(/\./g, "_"));
        if(this.params){
            // if params contains {id: undefined}, prevent _applyAttributes() from processing it
            delete this.params.id;
        }
    }

    // 添加对 document 对象 和 <body>节点的引用
    this.ownerDocument = this.ownerDocument || (this.srcNodeRef ? this.srcNodeRef.ownerDocument : document);
    this.ownerDocumentBody = win.body(this.ownerDocument);

    // 在registry数组中添加这个widget
    registry.add(this);

    // 指定 domNode，把模板字符串实例化成 DOM树，通常由_TemplateMixin来实现
    this.buildRendering();

    var deleteSrcNodeRef;

    if(this.domNode){

        this._applyAttributes();

        // 注意这里只有在实例化的时候指定了 srcNodeRef 才会执行
        var source = this.srcNodeRef;
        if(source && source.parentNode && this.domNode !== source){
            source.parentNode.replaceChild(this.domNode, source);
            deleteSrcNodeRef = true;
        }

        this.domNode.setAttribute("widgetId", this.id);
    }

    // 通常在自定义widget时候都会重载此方法
    this.postCreate();

    // 如果有指定 srcNodeRef 并且执行了上面的代码，则消除对 srcNodeRef的引用以便垃圾回收
    if(deleteSrcNodeRef){
        delete this.srcNodeRef;
    }

    this._created = true;
}
```

#### postMixInProperties

```js
postMixInProperties: function(){
    // summary:
    //      Called after the parameters to the widget have been read-in,
    //      but before the widget template is instantiated. Especially
    //      useful to set properties that are referenced in the widget
    //      template.
    // tags:
    //      protected
}
```

由注释可知，在参数被写入实例之后，模板被实例化成DOM树之前被调用。通常是被用来设置模板需要引用到的变量————因为模板中是可以通过``${attribute}``这种写法引用widget中的属性的。比如现在有一个模板：

```js
<div>
    <span>${name}</span>
</div>
```

最后生成的模板就会把``${name}``替换成真实的值。

> 值得注意的一点：在执行完buildRendering之后且在执行postCreate方法之前会执行_applyAttributes方法，而_applyAttributes方法中会将创建组件对象时传递的参数再一次覆盖到组件对象中（在执行postMixinProperties方法前已经覆盖过一次）， 所以在执行_applyAttributes之前做的相关属性修改都会失效。

#### buildRendering

在执行buildRendering之前还会做一些事情，就是生成widget的ID（如果用户没有指定）、保存对Document和<body>标签的引用和把widget添加进registry列表。buildRendering方法主要看_TemplateMixin里的，用途是把模板String渲染成真正的DOM节点。

```js
buildRendering: function(){

    if(!this._rendered){
        if(!this.templateString){
            // 如果没有templateString属性，尝试从templatePath属性中去获取模板字符串
            this.templateString = cache(this.templatePath, {sanitize: true});
        }

        // 从缓存中读取模板，或者下载模板并缓存起来。
        // 获取到的模板有可能是字符串有可能是DOM节点，主要取决于模板是否带有 “${}”
        var cached = _TemplatedMixin.getCachedTemplate(this.templateString, this._skipNodeCache, this.ownerDocument);

        var node;
        if(lang.isString(cached)){  // 如果是模板字符串，则转化为DOM节点
            // this._stringRepl 负责把模板字符串中的 ${foo}转化成实际的值
            node = domConstruct.toDom(this._stringRepl(cached), this.ownerDocument);
            if(node.nodeType != 1){
                // 如果nodeType不是1，表示不是node节点，抛出异常
                throw new Error("Invalid template: " + cached);
            }
        }else{
            // cached如果是一个DOM节点，直接复制就行。
            node = cached.cloneNode(true);
        }

        this.domNode = node;
    }

    // 调用 _WidgetBase.buildRendering() 方法
    this.inherited(arguments);

    if(!this._rendered){
        this._fillContent(this.srcNodeRef);
    }

    this._rendered = true;
}

```

_fillContent这个方法需要特别说明一下，当我们自定义的widget被用声明式使用的时候，有可能会有子节点存在，如：

```js

<div data-dojo-type="dijit/myCustomerWidget">
    <a>click me</a>
    <span>I'm serious</span>
</div>

```

我们都知道最终``<div data-dojo-type="dijit/myCustomerWidget">``会被替换成我们的模板字符串，那子节点会怎样呢？这时候_fillContent的用途就体现出来了，它就是能把子节点放到我们widget的containerNode里面去(如果没有指定containerNode？那么子节点就没了！)
注意：

1. 如果没有指定templateString或者templatePath，会自动生成一个div节点并且domNode指向这个节点；
2. 代码中的srcNodeRef就是我们一般编程式创建widget时 ``new ContentPane({}, "someNode")``中的第二个参数，这时候domNode指向这个节点；

#### postCreate

这个方法是我们自定义组件时一个最被重写的方法，按照[官方文档](http://dojotoolkit.org/documentation/tutorials/1.10/understanding_widgetbase/index.html)的说法，这个方法会在**模板已经被实例化成DOM节点，但是还没有添加进文档DOM树前被调用**；但是根据代码可以看出来，**如果使用编程式实例化，指定了第二个参数``srcNodeRef``，那么postCreate会在widget添加进DOM树之后才被调用**。
由于上述原因，如果在postCreate中发生尺寸相关的计算，有可能会发生问题，因为这时候可能donNode还没被添加进文档树
见过的问题有：

1. 在postCreate中new layout类型的widget
2. 在postCreate中new dgrid

这些widget有共同点就是都会在内部计算父节点的尺寸，就有可能会发生上述的错误。

## startup

startup方法会在widget的domNode加入文档树之后执行，在postCreate中提到的尺寸相关的问题可以放到这里来解决，因为DOM片段已经加入到文档中了。一般来说自定义的widget需要手动去调用，有两种情况会自动触发startup方法：

1. 使用其他的容器类widget(Dialog、ContentPane、BorderContainer、TabContainer等)调用addChild把自定义widget添加成子widget，并且父widget已经startup过了；
2. 调用自定义widget的``placeAt()``方法把widget“放”到另外一个widget/dom节点中，如果这个父widget/通过dom节点获取到的parentWidget已经startup，则会触发此widget的startup；

默认_WidgetBase里的startup方法除了会startup自身之外，还会自动把所有没有start的子孙widget逐个调用startup方法，无论这些子孙widget是通过编程式还是声明式被包含的。

# 其他

1. 很多时候我们重载这几个原生方法的时候，是需要在原本的基础上加上一些我们自己的行为的，这时候需要用到 inherited(arguments)方法，直接在我们写的方法中写``this.inherited(arguments)``就行。
2. 很多时候我们的widget或者原生Dojo的一些widget在加入页面之后，显示的效果很奇怪或没有出现预期的行为，这时候很大原因可能是因为在实例化的错误时间点做了需要计算尺寸的行为，一般来说在最后调用一下父widget的``resize()``方法即可。


相关连接：
[Understanding _WidgetBase](http://dojotoolkit.org/documentation/tutorials/1.10/understanding_widgetbase/index.html)
[Creating Template-based Widgets](http://dojotoolkit.org/documentation/tutorials/1.10/templated/index.html)
[DOJO组件生命周期（the life cycle of dojo widget）](http://blog.csdn.net/notejs/article/details/8745226)

-------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”
