### 背景
项目中经常使用别人维护的模块，在git中使用子模块的功能能够大大提高开发效率。

使用子模块后，不必负责子模块的维护，只需要在必要的时候同步更新子模块即可。

本文主要讲解子模块相关的基础命令，详细使用请参考man page。

### 子模块的添加
添加子模块非常简单，命令如下：

`git submodule add <url> <path>`        url为子模块的路径，path为该子模块存储的目录路径

示例：`git submodule add git@192.168.110.44:submodules.git src/sub-module`

执行成功后，便会在当前项目的src目录下，引入目录名为submodule的子模块



执行成功后，git status会看到项目中修改了.gitmodules，并增加了一个新文件（为刚刚添加的路径）

`git diff --cached`查看修改内容可以看到增加了子模块，并且新文件下为子模块的提交hash摘要

`git commit`提交即完成子模块的添加

#### 子模块的使用及更新

克隆项目后，父级项目不会在更新和提交时不会更新子模块，**所有如果需要提交父模块，要先cd进子模块中进行pull和push操作，然后再提交父模块**

### 父模块中更新子模块

如果你是第一次克隆项目，默认子模块目录下无任何内容。需要在项目根目录执行如下命令完成子模块的下载：

`git submodule init`
`git submodule update`

或者组合命令

`git submodule update --init --recursive`

执行后，子模块目录下就有了源码

### 绑定子模块默认分支

> 当父模块分支更新后，子模块默认会被切到HEAD去，这不是我们想要的，还要手动cd进子模块，再切换分支

#### 未正确跟踪原因一

> 子模块未跟踪任何或正确的分支

```
$ cd <submodule-path>
$ git branch -u <origin>/<branch> <branch>
# else:
$ git checkout -b <branch> --track <origin>/<branch>
```

#### 未正确跟踪原因二

> 子模块没有设置默认分支

我们可以为子模块设置默认分支，这样每次pull父模块时子模块也一直保持在我们想要的分支

**方法一：在没有添加子模块时设置默认分支**

```
$ git submodule add -b <branch> <repository> [<submodule-path>]
$ git submodule update --remote
```

**方法二：在已添加子模块时绑定默认分支**

首先，您要确保您的子模块已检出要跟踪的分支。

```
$ cd <submodule-path>
$ git checkout <branch>
$ cd <parent-path>
$ git config -f .gitmodules submodule.<submodule-path>.branch <branch>
```

最后一步代码如何编写？

举个栗子：`git config -f .gitmodules submodule.src/sub-module.branch master`

执行这个命令后会更新父仓库的 `.gitmodules`

```
[submodule "src/sub-module"]
	path = src/sub-module
	url = git@192.168.110.11:vicer/submodules.git
	branch = master   # 新增的代码
```

然后执行 `git submodule update --remote`

这样每次更新子模块都会切到master分支

**最后：别忘记在父模块中提交子模块的更改！**

#### 最后一个方法

假设所有子模块都在master上。

从父模块执行它，为每个子模块切换master分支

```
#!/bin/bash
echo "更新子模块，并切换到master分支."

git submodule update 
git submodule foreach git checkout master 
git submodule foreach git pull origin master 
```



参考文章：[为什么我的GIT子模块HEAD与master分离](https://www.itranslater.com/qa/details/2325703063316726784)

### 删除子模块

有时子模块的项目维护地址发生了变化，或者需要替换子模块，就需要删除原有的子模块。

删除子模块较复杂，步骤如下：

`rm -rf 子模块目录` 删除子模块目录及源码
`vi .gitmodules` 删除项目目录下.gitmodules文件中子模块相关条目     (注意：不是删除文件)
`vi .git/config` 删除配置项中子模块相关条目
`rm .git/module/*` 删除模块下的子模块目录，每个子模块对应一个目录 （注意：只删除对应的子模块目录）

执行完成后，再执行添加子模块命令即可，如果仍然报错，执行如下：

`git rm --cached 子模块名称`

完成删除后，提交到仓库即可。

### 踩坑：子模块换行符与父模块不同

关于换行符问题，在采用子模块后，由于项目中用了es-lint，导致提交时两个项目的代码pull下来总会提示换行符不一致，而vue刚创建的项目是LF（这里删除重新create），子模块为CRLF，项目领导的电脑又为mac（我们的系统都是win10），所以干脆就统一一下，所有的换行符都为LF

>  git为了保持风格统一，提供了一个“换行符自动转换”功能。这个功能默认处于“自动模式”，当你在签出文件时，它试图将 UNIX 换行符（LF）替换为 Windows 的换行符（CRLF）；当你在提交文件时，它又试图将 CRLF 替换为 LF。

但遗憾的是，这个功能是有 bug 的，而且在短期内都不太可能会修正。

所以进行如下设置：

```
#提交时转换为LF，检出时不转换  (这样就保证了所有pull下来的项目都是LF)
git config --global core.autocrlf input

# IDE设置
webstorm：
File -> Settings
Editor -> Code Style
Line separator (for new lines) ，选择：Unix and OS X (\n)
```



参阅文章：[git 换行符LF与CRLF转换问题](https://www.cnblogs.com/sdgf/p/6237847.html)

参阅文章2：[在 Git 中正确设置 CRLF、LF 换行符转换](https://p3terx.com/archives/how-to-choose-crlf-lf.html)

