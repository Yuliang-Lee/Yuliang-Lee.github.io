---
layout: post
title: Dojo widgets的生命周期-删除阶段
author: xlaoyu
categories: [dojo]
tag: [javascript,dojo,dojo widget]
description: Dojo widgets的生命周期删除阶段的介绍,结合源码作简单的说明
keywords: dojo,dojo widget,widget lifecycle,dijit
shortinfo: Dojo widgets的生命周期删除阶段的介绍,结合源码作简单的说明
---

* content
{:toc}

在前端飞速发展的今天，现在才来写关于Dojo的东西感觉很怪异，因为很多人都没用过甚至没听过这样一个JS库了，但是怎么说在公司用了1年多，也有一定的了解，把这些认识记录一下吧。结合源码作简单的说明，希望能帮到以后进DOJO这个坑的人。
*Ps：基于Dojo1.9.3版本,展现的源码都去掉大部分的原生注释*



> [Dojo Toolkit](http://dojotoolkit.org/)是一个非常强大的,基于[AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md)规范的js工具库,它包括提供基础功能的dojo包,提供UI组件的dijit包和第三方的dojox包.

我们通过全局方法define和``dojo/_base/declare``模块的declare方法定义继承自``dijit/_WidgetBase``类的一个模块，我们成为一个widget---包含某些功能一小块UI。dijit包里所有能new出来的都是一个widget，从我们实例化一个widget到销毁一个widget，中途dojo会调用一系列继承而来的方法，现在说说销毁阶段会执行的方法，**所有方法我们都能通过在define widget的时候重载加入我们自己的逻辑**。

* destroyRecursive
  * destroyDescendants
  * destroy
    * uninitialize
    * destroyRendering

（载自官网）
看一下destroyRecursive源码

```js
destroyRecursive: function(/*Boolean?*/ preserveDom){

    this._beingDestroyed = true;
    this.destroyDescendants(preserveDom);//销毁所有子孙节点(包含在containerNode里面的节点)
    this.destroy(preserveDom);//销毁本身
}
```

用一个属性_beingDestroyed表示已经开始销毁,preserveDom表示是否需要保留wdiget的依附节点(比如我们把widget**替换**到一个文档的一个已经存在的*div*上,在删除的时候是否保留并还原这个节点).
destroyDescendants：

```js
destroyDescendants: function(/*Boolean?*/ preserveDom){
    // 通过递归遍历所有孙节点销毁
    array.forEach(this.getChildren(), function(widget){
      if(widget.destroyRecursive){
        widget.destroyRecursive(preserveDom);
      }
    });
}
getChildren: function(){
    return this.containerNode ? registry.findWidgets(this.containerNode) : [];
}
```

把*destroyDescendants*里面用到的*getChildren*也拿出来了，``registry.findWidgets``是**找到传进去的节点的所有直接子widget(不包括孙widget)**，但是找到的直接子widget会调用*destroyRecursive*，这就相当于是遍历调用销毁。**注意:这里没有销毁当前widget的并且不属于containerNode子孙widget的子孙widget**((╯‵□′)╯︵┻━┻有点拗口)，因为这是在*destroy*方法里面做的事情。
比如:

```html
<div><!-- 这个是domNode -->
  <button data-dojo-type="dijit/form/Button">btn1</button>
  <button data-dojo-type="dijit/form/Button">btn2</button>
  <div data-dojo-attach-point="containerNode">
    <button data-dojo-type="dijit/form/Button">btn3</button>
    <button data-dojo-type="dijit/form/Button">btn4</button>
  </div>
</div>
```

这个时候调用*destroyDescendants*会把btn3和btn4销毁掉。
下面看destroy和destroyRendering两个方法。


```js
destroy: function(/*Boolean*/ preserveDom){
    // destroy any resources (including widgets) registered via this.own().
    //销毁所有注册到this.own上的资源,通常我们把事件句柄注册上去,
    //达到widget销毁自动销毁事件绑定的效果,防止内存泄露(memory leak)

    this._beingDestroyed = true;
    this.uninitialize();

    function destroy(w){
      if(w.destroyRecursive){
        w.destroyRecursive(preserveDom);
      }else if(w.destroy){
        w.destroy(preserveDom);
      }
    }

    // Destroy supporting widgets, but not child widgets under this.containerNode
    //这里就是刚才所说的,销毁非containerNode的其他子widget
    if(this.domNode){
      array.forEach(registry.findWidgets(this.domNode, this.containerNode), destroy);
    }

    this.destroyRendering(preserveDom);
    registry.remove(this.id);//从registry数组中去掉对这个widget的引用
    this._destroyed = true;
}
destroyRendering: function(/*Boolean?*/ preserveDom){
      if(this.bgIframe){
        this.bgIframe.destroy(preserveDom);
        delete this.bgIframe;
      }

      if(this.domNode){
        if(preserveDom){
          domAttr.remove(this.domNode, "widgetId");
        }else{
          domConstruct.destroy(this.domNode);
        }
        delete this.domNode;
      }

      if(this.srcNodeRef){
        if(!preserveDom){
          domConstruct.destroy(this.srcNodeRef);
        }
        delete this.srcNodeRef;
      }
    }
```

*destroyRendering*这个方法主要是销毁domNode和删除对domNode的引用，如果我们要在销毁阶段添加我们自己的逻辑，**强烈推荐**重载*destroy*方法，一般这样写：

```js
destroy: function() {
  this.inherited(arguments);//先让父类的方法执行了

  //开始自己的逻辑
}
```

到此，销毁阶段完成了。

**注意注意注意**

1. 在widget实例化过程中给widget中普通节点绑定的事件必须写在this.own()中，防止内存泄露。绑定在子孙widget的事件可以不写在里面，因为子孙widget销毁会销毁绑定到它自身的事件。
2. **在widget中实例化出来的``Tooltip、Dialog、Menu``等弹出类widget都必须手动销毁，因为他们是附着在body元素上的，销毁方法之一就是上面所说在重载destroy里面销毁。
3. dijit中和layout相关的一些widget（contentPane、BorderContainer、TabContainer等）都有更加复杂的创建和销毁机制，这里不展开详说，可以私下找我一起研究研究。
4. 真实场景中的RIA/SPA都非常的错综复杂纵横交错眼花缭乱，记得在销毁的时候要销毁干净（尤其对节点/widget的引用要销毁掉）才能杜绝内存泄露，导致网页越来越卡的问题。
5. 想到再补充

----------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.info](https://www.xlaoyu.info)”
