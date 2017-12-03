---
layout: post
title: mac升级导致git不可用
author: xlaoyu
categories: [tech]
tag: [mac,git]
description: 'xcrun error invalid active developer path'
keywords: git,mac,xcrun
---

* content
{:toc}

昨晚升级了 mac 系统到10.13.1 High Sierra，重启后进入命令行，输入`git`命令，会出现
```bash
xcrun: error: invalid active developer path
 (/Library/Developer/CommandLineTools), missing xcrun at:
 /Library/Developer/CommandLineTools/usr/bin/xcrun
```
一脸懵逼，谷歌之后发现好像每次系统升级都可能会出现这个问题，在这里记录一下



# 解决方法
```bash
xcode-select --install
```

参考链接
[http://www.ttlsa.com/linux/mac-git-xcrun-error-invalid-active-developer-path/](http://www.ttlsa.com/linux/mac-git-xcrun-error-invalid-active-developer-path/)
[https://stackoverflow.com/questions/32893412/command-line-tools-not-working-os-x-el-capitan-macos-sierra-macos-high-sierra/32894314#32894314](https://stackoverflow.com/questions/32893412/command-line-tools-not-working-os-x-el-capitan-macos-sierra-macos-high-sierra/32894314#32894314)
[https://apple.stackexchange.com/questions/254380/macos-sierra-invalid-active-developer-path](https://apple.stackexchange.com/questions/254380/macos-sierra-invalid-active-developer-path)

**本文首发于 [xlaoyu](www.xlaoyu.info) ，不经允许不许转发**