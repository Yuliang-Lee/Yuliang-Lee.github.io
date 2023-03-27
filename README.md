xlaoyu‘s blog repo
=====

这是我的[博客](https://www.xlaoyu.me)仓库，同时也是一个 jekyll 主题。

如果想使用本主题，先到 **[这里](https://github.com/Yuliang-Lee/Yuliang-Lee.github.io/releases)** 下载最新的源码包，**千万，千万，千万不要直接 clone github 仓库使用**。

修改和使用可以参考 [这个教程](https://github.com/Gaohaoyang/gaohaoyang.github.io)


## Fetures

### Service Worker

使用了 [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 把博客做成 PWA，提升访问速度，加强用户体验以及可以**`离线使用`**。如果使用手机浏览，在 Android 系统或者最新的 iOS 上可以把网页添加到桌面上，**当成 native app 使用**。

Ps：如果使用本 blog 模板，本地运行时必须安装 Node，然后在项目根目录下运行 `npm install` 安装依赖。以后每次 `commit` 会自动扫描文件生成最新的 `service-worker` 文件。