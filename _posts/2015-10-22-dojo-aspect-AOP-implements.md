---
layout: post
title: Dojo面向切面编程之aspect源码分析
author: xlaoyu
categories: [dojo]
tag: [javascript,dojo,aspect,AOP]
description: Dojo中aspect模块的源码原理介绍
keywords: javascript,dojo,aspect,AOP
shortinfo: 如果学过JAVA的spring框架，对于两个词语肯定不会陌生：面向切面（AOP）和控制反转（IOC）。面向切面编程，是可以通过预编译方式和运行期动态代理实现在不修改源代码的情况下给程序动态统一添加功能的一种技术。
---

* content
{:toc}

### AOP的概念

如果学过JAVA的spring框架，对于两个词语肯定不会陌生：面向切面（AOP）和控制反转（IOC）。

> 面向切面编程，是可以通过预编译方式和运行期动态代理实现在不修改源代码的情况下给程序动态统一添加功能的一种技术。这里“统一添加的功能”主要是指给一系列函数统一添加某段功能代码，让所有调用这个函数的地方在执行这个函数是都会在开始，或者结束时执行那段功能代码；当然，这种类似嵌入的代码是不会写在函数内部的，即函数的实现是不会有任何改变的。[^1]。



### Dojo aspect

但是这个灵活又强大的技术在js中很容易被忽略掉。本文主要介绍Dojo的aspect模块如何实现AOP，aspect模块除去注释大概只有100行代码，可见其实现是相当简洁的。
aspect模块主要有三个方法`before`、`after`和`around`，先看看效果：

<a class="jsbin-embed" href="http://jsbin.com/lozazi/5/embed?js,console">JS Bin on jsbin.com</a><script src="http://static.jsbin.com/js/embed.min.js?3.35.2"></script>

before(target,methodName,advice)：在原方法被调用前先执行advice方法
after(target,methodName,advice,receiveArguments)：在原方法被调用后调用advice方法
around(target,methodName,advice)：把原方法作为参数传进advice函数中，advice函数会return一个函数，在return的函数中我们可以随时调用原方法。
*源码版本是Dojo1.10.0*

```js
define([], function(){
    "use strict";
    var undefined, nextId = 0;

    function advise(dispatcher, type, advice, receiveArguments){...
    }
    function aspect(type){...}

    var after = aspect("after");

    var before = aspect("before");

    var around = aspect("around");

    return {
        before: before,
        around: around,
        after: after
    };
});
```

aspect模块返回的就是这三个方法，而这三个方法都是调用了内部一个aspect(type)函数，而aspect函数会根据不同的type参数返回不同的函数。下面再看一下aspect函数的实现：

```js
function aspect(type){
    // receiveArguments这个参数只有在after方法会用到，是一个Boolean值，true表示advice方法会只使用原方法的形参作为参数，false表示使用上一个after/原方法的返回值 加上 原方法形参作为参数（这是默认行为）。
    return function(target, methodName, advice, receiveArguments){
        var existing = target[methodName], dispatcher;

        // 如果是第一次进行aspect包装，则一定会进入if
        if(!existing || existing.target != target){

            // 对象的原方法会被内部定义的函数所替换，也就是替换成dispatcher函数
            target[methodName] = dispatcher = function(){
                var executionId = nextId;
                var args = arguments;

                // 目标方法执行前先执行前置方法
                var before = dispatcher.before;
                while(before){
                    args = before.advice.apply(this, args) || args;
                    before = before.next;
                }
                // 环绕方法，就算没有经过around包装，目标方法也会通过这样执行一次，也就是说会默认被around一层
                if(dispatcher.around){
                    var results = dispatcher.around.advice(this, args);
                }
                // 在目标方法和around方法都执行完之后会执行后置方法
                var after = dispatcher.after;
                while(after && after.id < executionId){
                    if(after.receiveArguments){
                        var newResults = after.advice.apply(this, args);
                        // 如果after方法没有返回值，则使用原方法的返回值
                        results = newResults === undefined ? results : newResults;
                    }else{
                        results = after.advice.call(this, results, args);
                    }
                    after = after.next;
                }
                return results;
            };
            if(existing){
                dispatcher.around = {advice: function(target, args){
                    return existing.apply(target, args);
                }};
            }
            dispatcher.target = target;
        }
        var results = advise((dispatcher || existing), type, advice, receiveArguments);
        advice = null;
        return results;
    };
}
```

原有的目标方法在经过aspect的方法包装后会被替换成内部的dispatcher函数，dispatcher函数会根据dispatcher的三个静态属性`dispatcher.after`、`dispatcher.before`和`dispatcher.around`依次调用advice方法，这三个属性定义在advise函数中：

```js
function advise(dispatcher, type, advice, receiveArguments){
    var previous = dispatcher[type];
    var around = type == "around";
    var signal;
    if(around){
        var advised = advice(function(){
            return previous.advice(this, arguments);
        });
        signal = {
            remove: function(){
                if(advised){
                    advised = dispatcher = advice = null;
                }
            },
            advice: function(target, args){
                return advised ?
                    advised.apply(target, args) :  // called the advised function
                    previous.advice(target, args); // cancelled, skip to next one
            }
        };
    }else{
        // create the remove handler
        signal = {
            remove: function(){
                if(signal.advice){
                    var previous = signal.previous;
                    var next = signal.next;
                    if(!next && !previous){
                        delete dispatcher[type];
                    }else{

                    // 改变链的顺序，删除当前advice
                        if(previous){
                            previous.next = next;
                        }else{
                            dispatcher[type] = next;
                        }
                        if(next){
                            next.previous = previous;
                        }
                    }

                    // remove the advice to signal that this signal has been removed
                    dispatcher = advice = signal.advice = null;
                }
            },
            id: nextId++,
            advice: advice,
            receiveArguments: receiveArguments
        };
    }
    if(previous && !around){
        if(type == "after"){
            // after和before就像一个链式结构，next和previous指示所有注册上来的signal对象的位置顺序，一个signal对象包含一个advice方法。
            // 新加入的after advice会添加到“after链”的最后
            while(previous.next && (previous = previous.next)){}
            previous.next = signal;
            signal.previous = previous;
        }else if(type == "before"){
            // 新加入的before advice会添加到“before链”的最前面
            dispatcher[type] = signal;
            signal.next = previous;
            previous.previous = signal;
        }
    }else{
        // 如果是around或者第一次绑定before/after，把signal赋给dispatcher
        dispatcher[type] = signal;
    }
    return signal;
}
```

被aspect包装过的目标方法调用过程大概如下图：
![经过aspect包装的方法调用的内部过程]({{ site.BASE_PATH }}/images/postImg/2015-10-22/aspect-procedure.png)

### 总结：

1. before的advice函数、after的advice函数和around返回的advice函数的执行上下文是都是**target**对象，从最上面的demo直接在advice函数内打印this.a的值不是undefined可以看出。但是around是特殊的，如果在around返回的匿名函数中直接调用originFun，originFun的执行上下文是window对象。
2. 实现过程大量运用了闭包、curry化等比较高级的知识点，不懂得需要自行去百度学习一下~
3. AOP主要可以用在给公共组件添加业务系统自身需要额外执行的一些方法功能，而不改变源程序的情况下使用，比如：一个公司有一个request组件，负责包装所有用ajax和后端交互的细节，只需要传设定好的参数，公司所有系统都会使用这个组件，但是某个CRM系统需要收集所有ajax请求的时候系统的运行情况，这时候如果去改基础组件肯定不行，通过AOP来实现这样的功能是最合适的。

如有不足或错漏的地方，请联系本人^_^
版权所有，转载请注明！


[^1]: [http://www.ibm.com/developerworks/cn/web/1203_zhouxiang_dojoaop/](http://www.ibm.com/developerworks/cn/web/1203_zhouxiang_dojoaop/)