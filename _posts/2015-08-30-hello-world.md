---
layout: post
title: Hello World!
categories: [life]
tags: [life]
comments: true
---

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

<a class="btn btn-default" href="https://github.com/Yuliang-Lee">my github address</a>
