---
layout: post
title: "pyhton3输出中文也会报错?!!"
author: xlaoyu
categories: [web]
tag: [web,python]
description: 'python3输出中文报错'
keywords: python3,print,utf8,error
---


* content
{:toc}

这篇文章是以前重构一个python2项目为python3时遇到的一个问题，当时记录下来没有发表，现在发表在这里当做存档。




众所周知，python3相比python2的一个最大的改变就是str统一是unicode编码的，带有中文的字符串再也不用写成  u'中文' 这么麻烦，但是最近却遇到了 print('中文')  报错

```
UnicodeEncodeError: 'ascii' codec can't encode characters in position 157-158: ordinal not in range(128)
```

这个问题只发生在生产环境上，本地环境没有问题。那么首先考虑的就是生产环境和本地环境差别在哪里了-----启动方式。

生产环境上使用了 uWSGI 来做服务器处理web请求，而本地环境不是。

尝试在 uWSGI 配置文件中加入编码设置：

```
\[uwsgi\] 
...

env=LC\_ALL=zh\_CN.UTF-8 
...
```

重启，报错again！

经过百度和谷歌狂轰乱炸之后，也找不出什么有用的资料，再仔细想想，以前的项目使用了同样的 `runit + uWSGI` 为啥没问题呢？结合这一点去看 uWSGI 的官方文档，果然有Python 3的特别说明
[http://uwsgi-docs.readthedocs.io/en/latest/Python.html#python-3](http://uwsgi-docs.readthedocs.io/en/latest/Python.html#python-3)

![WSGI-python3](https://user-images.githubusercontent.com/6936358/39849506-4b50cf76-543f-11e8-8aea-130eccaed52e.png)

再看  [PEP3333](https://www.python.org/dev/peps/pep-3333/#unicode-issues)

![pep333-unicode-issues](https://user-images.githubusercontent.com/6936358/39849591-a8e0b700-543f-11e8-8a33-b388b43383cb.png)

真相好像已经若隐若现了？慢着，因为经过尝试，直接使用 uwsgi 启动项目 print 是能正常工作的，而使用 runit 就报错了。

注意最后一段

> For values referred to in this specification as "bytestrings" (i.e., values read from wsgi.input  , passed to write()  or yielded by the application), the value  must  be of type bytes  under Python 3, and str  in earlier versions of Python.

结合python 的 print 函数代码说明，pritn 默认是输出到 sys.stdout

```python
def print(self, *args, sep=' ', end='\\n', file=None): # known special case of print
    """
    print(value, ..., sep=' ', end='\\n', file=sys.stdout, flush=False)
    
    Prints the values to a stream, or to sys.stdout by default.
    Optional keyword arguments:
    file:  a file-like object (stream); defaults to the current sys.stdout.
    sep:   string inserted between values, default a space.
    end:   string appended after the last value, default a newline.
    flush: whether to forcibly flush the stream.
    """
    pass
```

print 默认输出到 sys.stdout 。由此猜测，使用 runit 启动项目和 runit 的 svlogd 收集日志改变了 sys.stdout 的输入位置，需要调用到上述的  _values read from wsgi.input  , passed to write()  or yielded by the application_  所以 python 中的unicode str 带有中文的时候就会报错。

经过不懈努力，终于在 PEP3333 文档中发现了这么一段

```python
import os, sys

enc, esc = sys.getfilesystemencoding(), 'surrogateescape'

def unicode\_to\_wsgi(u):
    # Convert an environment variable to a WSGI "bytes-as-unicode" string
    return u.encode(enc, esc).decode('iso-8859-1')

def wsgi\_to\_bytes(s):
    return s.encode('iso-8859-1')

def run\_with\_cgi(application):
    environ = {k: unicode\_to\_wsgi(v) for k,v in os.environ.items()}
    environ\['wsgi.input'\]        = sys.stdin.buffer
```

感觉和 sys.getfilesystemencoding() 有莫大的关系！然后去google寻找蛛丝马迹~~最后还是在万能的 stackoverflow 上找到了相关的

[http://stackoverflow.com/questions/9932406/unicodeencodeerror-only-when-running-as-a-cron-job](http://stackoverflow.com/questions/9932406/unicodeencodeerror-only-when-running-as-a-cron-job)   =>

[http://stackoverflow.com/questions/492483/setting-the-correct-encoding-when-piping-stdout-in-python](http://stackoverflow.com/questions/492483/setting-the-correct-encoding-when-piping-stdout-in-python)  =\> 第二个答案和答案下的评论

[https://drj11.wordpress.com/2007/05/14/python-how-is-sysstdoutencoding-chosen/](https://drj11.wordpress.com/2007/05/14/python-how-is-sysstdoutencoding-chosen/)  最后使用的解决方法

在再生产环境系统中尝试打印出 stdout 的编码

```python
import sys
print(sys.stdout.encoding)
 
# output ANSI_X3.4-1968
```

而在其他没有使用 *runit* 的环境打印出的是 **utf-8**。

最后，在 `uwsgi` 的配置文件中加入一句，用来设置 python 使用的编码格式。

```
env = LC\_CTYPE=zh\_CN.utf-8
```

启动项目！！ 中文正常输出！！！

就像文章最后说的

**BUT WHERE THE HELL IS THIS DOCUMENTED！**

--------------------

版权声明：原创文章，如需转载，请注明出处“本文首发于[xlaoyu.me](https://www.xlaoyu.me)”