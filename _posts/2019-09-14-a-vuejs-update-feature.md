---
layout: post
title: "从一次性能优化看Vue的一个“feature”"
author: xlaoyu
categories: [web]
tag: [vue,性能优化]
description: 'Vue.js的组件更新DIFF流程细节探索'
keywords: Vue,性能优化,diff
---


* content
{:toc}

使用过 Vue 的人都知道，Vue 数据驱动视图是基于`getter`和`setter`的实现的依赖收集，实现数据变动精准更新视图，然后修改 DOM 节点，但是实际上真的那么“精准”吗？




### 背景知识

首先，我们都知道 *Vue* 或者 *React* 得以高效更新的一个核心是使用了 `virtual dom`（下面称 `vdom`），当有数据变动的时候，通过对组件新旧 `vdom` 的 **diff** 操作，计算出需要实际修改的 DOM 节点然后进行增删改操作。从这可以知道，**diff** 的准确性和性能，是整体更新性能的一个关键环节。

而 *Vue* 比 *React* 优秀（不是指整体，单指 diff 这一块）的原因是 *Vue* 使用了 `getter` 和 `setter` 实现的视图对数据依赖的精确收集，即：**当数据更新时，可以精确触发使用了该数据的组件进行更新过程。**

但是事实真的如此吗？


### 业务场景

当前业务要做的是一个 Web 版的 *逐字歌词制作器*，顾名思义，我们平时在 QQ音乐 上看到的 **逐字** 歌词就是使用这个工具是做出来的，大概样子如图：

![逐字歌词(只要你喜欢这首歌，我们就是好朋友)](https://user-images.githubusercontent.com/6936358/64906132-da1a8680-d714-11e9-80d6-bacbb8de5ccb.png)

之前无论是 QQ 音乐、酷狗还是酷我的逐字歌词制作器都是内嵌在桌面版客户端中的一个工具，虽然各个工具略有差异，但是核心交互都是一样的，如下图：

![制作器界面](https://user-images.githubusercontent.com/6936358/64906135-e868a280-d714-11e9-9036-ed372a79bf12.png)

简单来说就是我们给歌词的每个字**“打标”**，通过键盘 *上下左右* 等操作控制游标（蓝色框框）的移动，给一个字标记上 *开始时间* 和 *持续时间*。

这里面的实现细节不赘述，是一个有趣但异常复杂的过程。最后实现出来上线正常使用了一段时间，直到某个节目某些歌的出现，打破了这个功能已经完美实现了的“梦想”。

### 问题出现
那是一个月黑风高，雷电交加的夜晚，测试在群里反馈了一个问题：

![](https://user-images.githubusercontent.com/6936358/64906222-3df17f00-d716-11e9-9890-9675e6c066fd.png)

点开发现如下面这样，第一行第二个字开始，后面全部卡住了大概两秒，直接跳到了第二行

![](https://user-images.githubusercontent.com/6936358/64906256-b2c4b900-d716-11e9-91f9-d26285595fde.gif)

很明显这是一个非常严重的性能问题，需要紧急解决。

### 定位问题

找到这首歌，发现是一首长达 17 分钟的说唱歌曲《现实 VS 梦想》（虽然这个 battle 梦想赢了，但是我却被现实打败了┑(￣Д ￣)┍）。

![普通歌曲 VS 这首说唱](https://user-images.githubusercontent.com/6936358/64906293-4a2a0c00-d717-11e9-8077-b0221ccbe090.png)

我们开启 Vue 的 [performance模式](https://vuejs.org/v2/api/#performance)，打开 chrome 的 performance 面板看看到底瓶颈在哪。

操作 20 秒，前 10 秒每秒按一次“向右”，后十秒按住“向右”不放，看看时间耗在了哪里？

![不看不知道，一看吓一跳](https://user-images.githubusercontent.com/6936358/64906352-3a5ef780-d718-11e9-8613-a4b2aa617bc1.png)

从上面可以看出前十秒帧率波动非常大，而后面用 **10 秒**渲染了一帧，完全就是卡死的节奏，对应的就是前面动图后两秒的效果。从面板下部分的`火焰图`可以看出来，**scripting**计算密密麻麻，占用了非常多的时间。

再看按一次“向右”事件的回调耗时，一次回调的耗时就达到了 ** 243毫秒**

![](https://user-images.githubusercontent.com/6936358/64906364-5a8eb680-d718-11e9-9319-82264d48b61f.png)

再看 vue-dev-tool 面板

![](https://user-images.githubusercontent.com/6936358/64906369-6f6b4a00-d718-11e9-9689-4cd7df4edc62.png)

你没看错，ElButton 的更新这里显示用了 2000 多秒，一开始我以为这是 dev-tool 的一个统计的 bug，所以直接看 `lyricMaker` 这个组件（就是上面那个歌词制作器）。从上面火焰图可以看出大多数的时间都花在了脚本运算，结合页面逻辑，制作器中每一行、每个字的展示样式，都需要动态计算（每次前进后退都算一遍）的，所以引起性能问题的原因定为：

**当歌词的字非常多的时候，每次移动光标，触发了过多的 diff 计算，导致页面卡顿。**

### 解决问题

既然知道了问题是字过多引起的 diff 计算耗时过多，那么就和解决最常见的那类型问题—— `DOM节点过多怎么优化？`的问题一样了：**`删除掉不在可视区域的节点`**。
![](https://user-images.githubusercontent.com/6936358/64906384-9cb7f800-d718-11e9-92d3-16a909b6b300.png)

如上图，只需要把 >±6 当前行的行歌词都隐藏掉即可，改造后再看性能面板和 dev-tool 面板：

![](https://user-images.githubusercontent.com/6936358/64906392-aa6d7d80-d718-11e9-91d7-bfb998ac1c1a.png)

![](https://user-images.githubusercontent.com/6936358/64906396-b8bb9980-d718-11e9-932f-a7d9c0527e60.png)

可以看出事件回调的耗时已经从 **`243ms -> 8ms`**，从火焰图中看出，方法的调用已经少了非常多，目前看来优化的成效是明显的。

![](https://user-images.githubusercontent.com/6936358/64906407-d4bf3b00-d718-11e9-8f3d-edc06c576c1a.png)

![](https://user-images.githubusercontent.com/6936358/64906415-e274c080-d718-11e9-925d-563500e640ce.gif)

如果我们看问题只看表面，那到此就已经撒花结束了。不过上面截图的一个小细节，引起了我的兴趣。

### Dig Deep

再看 vue-del-tool 面板，细心的话我们可以发现 `ElButton` 组件的耗时从 **2390310ms 减少到了 15255ms，足足减少了 99% 的耗时**，其中 `updateRender` 占用了 99%的耗时。 

`lyricMaker` 组件的耗时只是减少了一半，`ElButton`更像是引起性能大提升的关键所在，从这开始我猜测一开始的几十万毫秒，并不是一个错误显示，而是真实的情况。鉴于蓝翔挖掘精神，我们去把 dev-tool 的源码弄下来找出这个面板显示时间的统计逻辑，主要在这个方法：[代码](https://github.com/vuejs/vue-devtools/blob/dev/src/backend/perf.js#L82-L127)

```js
const COMPONENT_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroyed',
  'destroyed'
]

const RENDER_HOOKS = {
  beforeMount: { after: 'mountRender' },
  mounted: { before: 'mountRender' },
  beforeUpdate: { after: 'updateRender' },
  updated: { before: 'updateRender' }
}
function applyHooks (vm) {
  if (vm.$options.$_devtoolsPerfHooks) return
  vm.$options.$_devtoolsPerfHooks = true

  const renderMetrics = {}

  COMPONENT_HOOKS.forEach(hook => {
    const renderHook = RENDER_HOOKS[hook]

    const handler = function () {
      if (SharedData.recordPerf) {
        // Before
        const time = performance.now()
        if (renderHook && renderHook.before) {
          // Render hook ends before one hook
          const metric = renderMetrics[renderHook.before]
          if (metric) {
            metric.end = time
            addComponentMetric(vm.$options, renderHook.before, metric.start, metric.end)
          }
        }

        // After
        this.$once(`hook:${hook}`, () => {
          const newTime = performance.now()
          addComponentMetric(vm.$options, hook, time, newTime)
          if (renderHook && renderHook.after) {
            // Render hook starts after one hook
            renderMetrics[renderHook.after] = {
              start: newTime,
              end: 0
            }
          }
        })
      }
    }
    const currentValue = vm.$options[hook]
    if (Array.isArray(currentValue)) {
      vm.$options[hook] = [handler, ...currentValue]
    } else if (typeof currentValue === 'function') {
      vm.$options[hook] = [handler, currentValue]
    } else {
      vm.$options[hook] = [handler]
    }
  })
}
```

从上面代码看出(`COMPONENT_HOOKS.forEach开始`)，`updateRender` 这个耗时是从 `beforeUpdate` 开始到 `updated` 结束这段时间，是**每个**组件都会算到统计中，比如当次数据变化有 1 千个 button 更新，共花了 1 秒，那么这个面板统计 ElButton 的 updateRender 时间是 1秒 * 1000，也就是 10000毫秒。

**所以说上面我们的 ElButton updateRender 用了 2390 秒是真实存在的，只不过还需要除以一个组件个数，并不是显示错误！**

我们先来看一个 [Demo](https://codepen.io/Yuliang-Lee/pen/OJLxZqV)，点击“点我”按钮，更新 `i` 的值，可以看到控制台输出 `3 btn updated`。

Wait~ 思考 3 秒，是不是有哪里怪怪的？

1 秒。

2 秒。。

3 秒。。。

button 组件为什么会更新？！和文章一开始说的高效更新机制是不是有点冲突了？我们从代码可以看出 button 并没有使用到 `i` 变量，那么在 `i` 变化前后**应该是不会触发更新**的。而逐字制作器中的 button 写法也是如此：

```js
<div class="tool">
    <el-button type="info" @click="handleLineModify(lineIndex)">修改</el-button>
    <el-button type="danger" @click="handleLineDelete(lineIndex)">删除</el-button>
</div>
```

同样因为不相关的状态数据更新，引起了这两个按钮的更新。这一切的一切到底是人性的扭曲还是道德的沦丧，敬请关注今晚23点 59分。。。咳咳，串场了抱歉...

> When you have eliminated the impossible, whatever remains,however improbable,must be the truth.   
                                                                      ----Sherlock·Holmes

既然事已至此，我们去深入研究下 Vue 的更新流程是怎样的。（这里省略一万字漫长的研究 Vue 源码的过程）

最终可以定位到，在 `ElButton` 被触发更新前，是因为 `lyricMaker` 组件在 diff 过程中当遍历到 `ElButton` 这个元素的时候，强制执行了 `ElButton` 的 `$forceUpadte` 方法，从而引起的性能雪崩。

完整源码在这：[代码](https://github.com/vuejs/vue/blob/dev/src/core/instance/lifecycle.js#L215-L300)

![精简版代码](https://user-images.githubusercontent.com/6936358/64906502-fff65a00-d719-11e9-96b4-45142df837c1.png)

从源码可以看出，有两种情况导致触发强制更新：

- 第一个是：`hasDynamicScopedSlot` 为 true，至于这个值何时为真，又是一个可以写一篇文章的故事，这里暂且不表，现在主要看第二个。

- 第二个是 **当组件拥有子元素（静态的、动态的）的时候，每次 diff 都会强制更新，这是 Vue 的一个 Feature！**。我们看看 Vue 的作者尤大是怎么说的：https://github.com/vuejs/vue/pull/9371

![](https://user-images.githubusercontent.com/6936358/64906512-25836380-d71a-11e9-9814-c51f86fa66ba.png)

野生翻译菌：包含静态 slot 的组件，因为有可能在父组件状态更新之后，slot 已经发生了变化，所以需要强制更新一次此子组件。

但是如 PR 所说，这个问题在 Vue3.0中就不会存在了，所有 slot 都会统一为 `scope slot` 处理。当前我们也有一个不太优雅的解决方案是手动把所有静态内容都设置为 `scope slot`。可以看这个 [Demo](https://codepen.io/Yuliang-Lee/pen/yLBzRXK)


**思考题**：

- 上面的第一个 Demo，如果把 `<!--   updateCount: {{updateCount}} -->` 这个注释放开，会发生什么事？


### 总结

1. 有时候我们解决问题了，也可能只是歪打正着而已。
  ![](https://user-images.githubusercontent.com/6936358/64906523-43e95f00-d71a-11e9-99a7-c6105cf3a179.png)

2. 有时候我们代码出问题了，并不是 bug，是 Feature！

--------------------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.info](https://www.xlaoyu.info)”