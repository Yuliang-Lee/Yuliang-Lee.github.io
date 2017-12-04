---
layout: post
title: mysql的sql_mode设置简介
author: xlaoyu
categories: [database]
tag: [mysql,sql_mode]
description: mysql的sql_mode设置简介
keywords: mysql,sql_mode
shortinfo: mysql的sql_mode设置简介
---

* content
{:toc}

最近接手了一个项目，在项目正常跑起来之后，进行日常的操作，发现好多地方都报了mysql的数据库查询错误，然后发现线上的版本又好好的能正常运行，最后google发现是因为mysql服务器的版本不一致导致的。但是版本不一样并不是因为语法改变了不兼容，而是因为mysql5.7.4之后的sql_mode默认配置发生了变化，一个没接触过的东西进入了眼球，遂继续探索之。



### 描述

`sql_mode`直接理解就是：**sql的运作模式**。官方的说法是：`sql_mode`可以影响sql支持的语法以及数据的校验执行，这使得MySQL可以运行在不同的环境中以及和其他数据库一起运作。
**注意：MySQL5.7.4之后的版本和之前的版本的默认sql_mode有一个比较大的改变。**


### 设置sql_mode

想设置sql_mode有三种方式：

- 在命令行启动MySQL时添加参数 `--sql-mode="modes"`
- 在MySQL的配置文件（my.cnf或者my.ini）中添加一个配置`sql-mode="modes"`
- 运行时修改SQL mode可以通过以下命令之一：

```
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

**modes**是一个由逗号分隔的不同模式名字连接起来的字符串


5.7版本的 MySQL 默认的 sql_mode 是： `ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_AUTO_CREATE_USER, and NO_ENGINE_SUBSTITUTION`。

其中`ONLY_FULL_GROUP_BY`和`STRICT_TRANS_TABLES`是从5.7.5版本加进来的，`NO_AUTO_CREATE_USER`是从5.7.7版加进来的，`ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE`和`NO_ZERO_IN_DATE`是5.7.8版加进来的。


### 几种常见的mode介绍

- **ONLY_FULL_GROUP_BY**：
出现在select语句、HAVING条件和ORDER BY语句中的列，必须是GROUP BY的列或者依赖于GROUP BY列的函数列。

- **NO_AUTO_VALUE_ON_ZERO**：
该值影响自增长列的插入。默认设置下，插入0或NULL代表生成下一个自增长值。如果用户 希望插入的值为0，而该列又是自增长的，那么这个选项就有用了。

- **STRICT_TRANS_TABLES**：
在该模式下，如果一个值不能插入到一个事务表中，则中断当前的操作，对非事务表不做限制

- **NO_ZERO_IN_DATE**：
这个模式影响了是否允许日期中的月份和日包含0。如果开启此模式，`2016-01-00`是不允许的，但是`0000-02-01`是允许的。它实际的行为受到 `strict mode`是否开启的影响[^1]。

- **NO_ZERO_DATE**：
设置该值，mysql数据库不允许插入零日期。它实际的行为受到 `strict mode`是否开启的影响[^2]。

- **ERROR_FOR_DIVISION_BY_ZERO**：
在INSERT或UPDATE过程中，如果数据被零除，则产生错误而非警告。如 果未给出该模式，那么数据被零除时MySQL返回NULL

- **NO_AUTO_CREATE_USER**：
禁止GRANT创建密码为空的用户

- **NO_ENGINE_SUBSTITUTION**：
如果需要的存储引擎被禁用或未编译，那么抛出错误。不设置此值时，用默认的存储引擎替代，并抛出一个异常

- **PIPES_AS_CONCAT**：
将"||"视为字符串的连接操作符而非或运算符，这和Oracle数据库是一样的，也和字符串的拼接函数Concat相类似

- **ANSI_QUOTES**：
启用ANSI_QUOTES后，不能用双引号来引用字符串，因为它被解释为识别符


### Strict SQL Mode

`strict mode`控制MySQL如何处理当SQL语句块在修改数值时出现不正确的值或者缺少值时的情况（是警告还是报错），会影响到非常多的方面，详情查看[^3]。



### 总结

**sql_mode**是一个不起眼，但是又非常重要的知识点。因为如果您需要升级MySQL或者使用你的系统在不同环境下运行的时候，不知道这个设置有可能会让你抓狂半天不知道为什么在别的机子运行得好好的语句这里就不行了（╯－_－）╯╧╧。


** 参考 **

[MySQL sql_mode 官网介绍](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html)
[mysql的sql_mode合理设置](http://blog.csdn.net/wyzxg/article/details/8787878)

[^1]: [https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_no_zero_in_date](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_no_zero_in_date)
[^2]: [https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_no_zero_date](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sqlmode_no_zero_date)
[^3]: [https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sql-mode-strict](https://dev.mysql.com/doc/refman/5.7/en/sql-mode.html#sql-mode-strict)

--------

版权声明：本文为博主原创文章，未经博主允许不得转载，本文首发于[xlaoyu](https://www.xlaoyu.info)