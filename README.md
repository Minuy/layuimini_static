layuimini后台模板
===============
# 项目介绍
最简洁、清爽、易用的layui后台框架模板。

---

在原版Laymini iframe V2 2.0.6.1 的基础上添加了静态的支持，可以不使用接口，支持配置全局新页面打开或者在源网页打开，就最原始的Html的那种效果，方便一些刚刚学Web的同学使用（说的就是我QwQ），或者说每个页面的菜单都不一样的也可以用这个（但是要刷新整个页面）。
原始的功能也支持，使用起来暂时没发现啥问题。
就是我的代码写得有点乱，搞了挺久了，有点暴躁，不过注释还算全，后面再整理吧。
主要修改了 /js/lay-module/layuimini 下的 miniAdmin.js、miniMenu.js和miniTab.js这几个文件


# 代码仓库(iframe 多tab版)

###  v2版
直接 git clone https://github.com/Minuy/layuimini_static.git

# 使用说明

### 新增参数
miniAdmin.render(options,menu);
- 新增options.notTabButPage 默认为false，true时在新窗口或当前窗口打开新页面，而不是在iframe中，策略取决于target属性。同时打开后，菜单项的href为"",或者没定义，按钮是不能被选中的，但是可以跳转连接（通过下面的page属性），这样可以防止新窗口打开后旧窗口菜单项与内容对不上的尴尬。
- 新增menu，这个是init.json，直接写代码里即可，可选，（优先选择接口）
菜单配置中菜单项
- 新增 "active":false ，默认为false，表示选中的菜单项，全局最多一个为true（会检测的，把多的设置为false），设置后一打开页面就是选中这个的，但是这个不会触发Hash去切换iframe，只会改样式
- 新增 "page":"url" ，这个是配合options.notTabButPage属性新窗口打开的链接或者本窗口刷新的链接


运行时js代码会自动根据active找条链路，用来选中菜单项，并同时展开它的父菜单，这个链路的属性为 '_active'


使用时根据说明去添加就好了

源项目文档：

文档地址：[查看文档](http://layuimini.99php.cn/docs/)
源项目：https://github.com/zhongshaofa/layuimini 

