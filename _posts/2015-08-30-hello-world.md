---
layout: post
title: Hello World!
author: xlaoyu
categories: [life]
tags: [life]
comments: true
---

* content
{:toc}

Hello github pages~~~~
把原来在csdn的blog搬到这里来了~~
大概说一下用github-pages搭建个人blog的这个过程



大多数都是参考的http://www.pchou.info/category.html#web-build里面的文章
其中遇到的事情：

1. 没有用管理员权限使用node或者ruby，导致安装某些包的时候报错，**记得在管理员权限下运行**
2. 在_config.yml文件里开启[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown),在配置文件加入：

    ```
    markdown: kramdown
    kramdown:
      input: GFM
    ```
    但是完全感觉不出来有什么区别o(╯□╰)o，不知道是不是我姿势不对。。
3. 不使用jekyll内推荐的[disqus](https://disqus.com/home/welcome/)留言插件，采用相对于国内更友好的[多说](http://duoshuo.com/)。
4. 添加了分享文章的小插件[JiaThis](http://www.jiathis.com/)。（Ps:当时加这个进去的时候死活在页面看不到效果，尝试了半天发现是因为我访问网页时候使用了https协议，远程加载JS的时候出错了。。。(╯‵□′)╯︵┻━┻，改为http协议访问blog即可）。
5. 暂时就这么多。

2015/9/9更新：
#### 使用自己购买的域名和github pages绑定
以我自己在[godaddy](https://www.godaddy.com/ "godaddy")购买的为栗（购买流程自行百度，不在这里详说拉）：

1. 进入domain的配置页面（manage DNS），页面大概如下：
    ![manage DNS]({{ site.BASE_PATH }}/images/postImg/2015-08-30/pic1.png)
    找到CNAME那个配置项，编辑www那一行，然后把POINTS TO修改为你的github page地址（例：username.github.io)，保存即可；

2. 修改ANAME记录里 @ 的那条记录，points to 修改为192.30.252.153或192.30.252.154（如果你是主要访客是亚洲的，也可以是103.245.222.133），保存√。

3. 在你的项目根目录下创建CNAME文件（重说三），里面写入你购买的域名，如：www.xlaoyu.me，保存然后merge到你项目中。
4. 等几分钟然后你就可以拿着你的域名去装X了！

<a class="btn btn-default" href="https://github.com/Yuliang-Lee">my github address</a>

----------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”