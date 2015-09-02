---
layout: post
title: js数组去重实现
categories: [js]
tags: [js, Array]
comments: true
---

js简单数组去重实现的几种方案。

在[牛客网][1]做了一套*“腾讯2015春招web前端开发练习卷”*，其中一道题目是用JS实现Array数组去重，原题描述如下：

> 请给Array本地对象增加一个原型方法，它用于删除数组条目中重复的条目(可能有多个)，返回值是一个包含被删除的重复条目的新数组。[题目连接][2]

*比较的都是简单数据类型number或者string*

------
我的实现是：

```javascript
Array.prototype.dereplication = function () {
    var
        resultArr = [];
    for (var i = 0; i < this.length; i += 1) {
        console.log("first:" + this[i]);
        for (var j = i + 1; j < this.length; j += 1) {
            console.log("second:" + this[j]);
            if (this[i] ==
                this[j]) {
                resultArr.push(this[j]);
                this.splice(j, 1);
                j--;
            }
        }
    }
    return resultArr;
}
```

参考实现是：

```javascript
@author 小小
Array.prototype.distinct = function() {
    var ret = [];
    for (var i = 0; i < this.length; i++)
    {
        for (var j = i+1; j < this.length;) {
            if (this[i] === this[j]) {
                ret.push(this.splice(j, 1)[0]);
            } else {
                j++;
            }
        }
     }
     return ret;
}
```

我的代码和推荐的代码非常的相似，可以说思路都是一样的，但是在讨论中看到了许多人提出了**单循环实现**的代码，其中一个觉得挺巧妙的实现是：

```javascript
@author 盖斯贝雷
Array.prototype.distinct = function () {
    var arr = [];
    var obj = {};
    for (var i = 0; i < this.length; i++) {
        if (obj[this[i]] == undefined)
            obj[this[i]] = this[i];
        else if (obj[this[i]])
            arr.push(this[i]);
    }
    return arr;
}
```
利用Object的key唯一的特点，来判断数组后续元素有是否已经存在重复。

下面是测试：浏览器使用chrome 44
测试代码：

```javascript
//方法循环10000次，数组长度是1000
Array.prototype.dereplication = function() {
    var resultArr = [];
    for (var i = 0; i < this.length; i += 1) {
        for (var j = i + 1; j < this.length; j += 1) {
            if (this[i] == this[j]) {
                resultArr.push(this[j]);
                this.splice(j, 1);
                j--;
            }
        }
    }
    return resultArr;
}
Array.prototype.distinct = function() {
    var ret = [];
    for (var i = 0; i < this.length; i++) {
        for (var j = i + 1; j < this.length;) {
            if (this[i] === this[j]) {
                ret.push(this.splice(j, 1)[0]);
            } else {
                j++;
            }
        }
    }
    return ret;
}
Array.prototype.distinct2 = function() {
    var arr = [];
    var obj = {};
    for (var i = 0; i < this.length; i++) {
        if (obj[this[i]] == undefined) {
            obj[this[i]] = this[i];
        }
        else if (obj[this[i]]) {
          arr.push(this[i]);
        }

    }
    return arr;
}

function cal(fun, arr) {
    var result = [],
        x = 10000,
        timeArr = [];

    console.profile("a");
    while (x) {
        var time1 = new Date().getTime();
        arr[fun]();
        var time2 = new Date().getTime();
        timeArr.push(time2 - time1);
        x--;
    }
    console.profileEnd("a");
    result = timeArr.reduce(function(item1, item2) {
        return item1 + item2;
    });
    //console.log(timeArr)
    return result;
}

function test(funArr) {
    var arr = [],
        complex = 1000, //数字越大，重复的越少
        i = 1000; //控制数组长度
    while (i) {
        arr.push((Math.random() * complex).toFixed(0));
        i--;
    }
    //console.log(arr)
    for (var i = funArr.length - 1; i >= 0; i--) {
        console.log(funArr[i] + " time:" + cal(funArr[i], arr));
    };
}
test(["dereplication", "distinct", "distinct2"]);
```

当代码的complex为1000，也就是数组中大多数元素都不重复的情况下运行三次：

| dereplication | distinct  | distinct2 |
|:--------------|:----------|:----------|
| 8381ms        | 12943ms   | 1045ms    |
| 8490ms        | 13504ms   | 1057ms    |
| 8157ms        | 13183ms   | 1044ms    |
{: rules="groups"}

**当重复数很少时。用对象做判断的写法有压倒性的性能优势。**
---------
但是当complex设为100，也就是数组中大部分都是重复元素时：

| dereplication | distinct | distinct2 |
|:------------|:----------|:----------|
| 302ms         | 450ms      | 961ms    |
| 327ms         | 437ms      | 980ms    |
| 321ms         | 454ms      | 958ms    |
{: rules="groups"}

**当数组中存在大量重复元素时，单循环方式比较慢**

这只是比较简单的测试，没有覆盖所有情况，仅代表个人观点。

-------
有更好的意见或者建议请留言或者发送到邮箱frank.yll1016 At gmail.com

[1]: http://www.nowcoder.com/
[2]: http://www.nowcoder.com/questionTerminal/fccbad5e52ce433b946ede3a023564a0