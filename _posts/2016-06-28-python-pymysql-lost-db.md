---
layout: post
title: 关于python的pymysql包初始化无法选中数据库的问题
categories: [python]
tag: [python]
description: 关于python的pymysql包初始化无法选中数据库的问题
keywords: python,pymysql
shortinfo: 关于python的pymysql包初始化无法选中数据库的问题
---

最近在部署系统的时候出现了怪异的问题：使用 pymysql 0.7.4 初始化时无法选中 database，需要在连接上数据库之后手动执行一次 “use xxx_db"。

这个问题只在特定的机器中出现了，比如现在机器A没有问题，但是在机器B部署会有这个问题。探索许久都找不到原因，所以使用临时方法（就是手动执行一次“use xxx_db"）保证生产环境能正常使用。

记录一下问题目前的进展。

首先从`pymysql.connect()`这个方法开始，进入到`pymysql`包的 `__init__.py`文件，关键代码有：

``` python
def Connect(*args, **kwargs):
    """
    Connect to the database; see connections.Connection.__init__() for
    more information.
    """
    from .connections import Connection
    return Connection(*args, **kwargs)

connect = Connection = Connect
```

可以看出来`connect`方法主要是在`connections`包的`Connection`中，go on~  找到`Connection`发现是一个类，在`__init__`方法中进行了大量属性的赋值操作，这里不详细列出来了，方法的最后调用了内部的`connect()`方法：

``` python
def connect(self, sock=None):
    try:
        if sock is None:
            if self.unix_socket and self.host in ('localhost', '127.0.0.1'):
                sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
                sock.settimeout(self.connect_timeout)
                sock.connect(self.unix_socket)
                self.host_info = "Localhost via UNIX socket"
                if DEBUG: print('connected using unix_socket')
            else:
                while True:
                    try:
                        sock = socket.create_connection(
                            (self.host, self.port), self.connect_timeout)
                        break
                    except (OSError, IOError) as e:
                        if e.errno == errno.EINTR:
                            continue
                        raise
                self.host_info = "socket %s:%d" % (self.host, self.port)
                if DEBUG: print('connected using socket')
                sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            sock.settimeout(None)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
        self._sock = sock
        self._rfile = _makefile(sock, 'rb')
        self._next_seq_id = 0

        self._get_server_information()
        self._request_authentication()

        if self.sql_mode is not None:
            c = self.cursor()
            c.execute("SET sql_mode=%s", (self.sql_mode,))

        if self.init_command is not None:
            c = self.cursor()
            c.execute(self.init_command)
            c.close()
            self.commit()

        if self.autocommit_mode is not None:
            self.autocommit(self.autocommit_mode)
    except BaseException as e:
        self._rfile = None
        if sock is not None:
            try:
                sock.close()
            except:
                pass

        if isinstance(e, (OSError, IOError, socket.error)):
            exc = err.OperationalError(
                    2003,
                    "Can't connect to MySQL server on %r (%s)" % (
                        self.host, e))
            # Keep original exception and traceback to investigate error.
            exc.original_exception = e
            exc.traceback = traceback.format_exc()
            if DEBUG: print(exc.traceback)
            raise exc

        # If e is neither DatabaseError or IOError, It's a bug.
        # But raising AssertionError hides original error.
        # So just reraise it.
        raise
```

可以看出来，这里主要是使用了 socket 去连接远程的 mysql 服务，但是这里是没有确定使用哪个数据库的，代码还在后面！一开始以为是模块内部在
self.init_command() 这个方法里面动了手脚去执行某些操作，找了半天发现并非如此(╯‵□′)╯︵┻━┻。事实的真相只有一个，是在
self._request_authentication() 方法中。

``` python
def _request_authentication(self):
    # 其他代码

    if self.db and self.server_capabilities & CLIENT.CONNECT_WITH_DB:
        if isinstance(self.db, text_type):
            self.db = self.db.encode(self.encoding)
        data += self.db + b'\0'

    if self.server_capabilities & CLIENT.PLUGIN_AUTH:
        name = self._auth_plugin_name
        if isinstance(name, text_type):
            name = name.encode('ascii')
        data += name + b'\0'

    self.write_packet(data)
    auth_packet = self._read_packet()

   # 其他代码
```

因为现在是连接不上db，所以找关键字 self.db 。 从代码看出来，write_packet(data) 方法会把一些数据写到某个地方，而 data 中 db 的值有没有，主要由3个因素决定了：

1. self.db -- 这个是在初始化的时候由我来传递过去的，确定已经有并且是 True 的
2. self.server_capabilities -- 变量
3. CLIENT.CONNECT_WITH_DB -- 常量，数字8

我分别在生产环境和自己的环境测试打印出这三个变量：

|      | self.db | self.server_capabilities  | CLIENT.CONNECT_WITH_DB  |
|------|---|---|---|
| 问题机器B |  db_A |  41733      | 3254779903  |
| 正常机器A |  db_A  |  8 | 8  |

self.db and self.server_capabilities & CLIENT.CONNECT_WITH_DB 执行之后在生产环境上是 0 （False），  而在本地环境是 8 （False）

明显，self.server_capabilities 就是那个不稳定因素了，find this asshole!!

``` python
def _get_server_information(self):
    # 其他代码

    self.server_capabilities = struct.unpack('<H', data[i:i+2])[0]
    i += 2

    if len(data) >= i + 6:
        lang, stat, cap_h, salt_len = struct.unpack('<BHHB', data[i:i+6])
        i += 6
        self.server_language = lang
        self.server_charset = charset_by_id(lang).name

        self.server_status = stat
        if DEBUG: print("server_status: %x" % stat)

        self.server_capabilities |= cap_h << 16
        if DEBUG: print("salt_len:", salt_len)
        salt_len = max(12, salt_len - 9)

    # 其他代码
```

有两个地方 server_capabilities 会改变

`self.server_capabilities = struct.unpack('<H', data[i:i+2])[0]`

`self.server_capabilities |= cap_h << 16`

感觉这一块和 mysql 的底层有关联，由于时间和能力有限，暂时没法深入研究这里是啥意思了~~~~下次有空再战！



**参考**

<a href="https://dev.mysql.com/doc/internals/en/connection-phase-packets.html#packet-Protocol::HandshakeResponse">https://dev.mysql.com/doc/internals/en/connection-phase-packets.html#packet-Protocol::HandshakeResponse</a> 可能和最后相关的解释

版权声明：本文为博主原创文章，未经博主允许不得转载，本文首发于[xlaoyu](www.xlaoyu.info)