
# 目录

* [下载](#下载)
* [Linux下安装](#Linux下安装)
* [GOPATH目录](#GOPATH目录)
* [go项目工程结构](#go项目工程结构)
* [Hello World](#HelloWorld)
* [安装程序](#安装程序)
* [跨平台编译](#跨平台编译)
* [获取远程包](#获取远程包)
* [获取gitlab私有库包](#获取gitlab私有库包)


# 下载

Go语言的官方下载地址是 https://golang.org/dl/ 可以打开选择版本下载，如果该页面打不开，或者打开了下载不了，可以通过Golang的国内网站 https://golang.google.cn/dl/ 下载。

根据操作系统和CPU类型下载相应的软件包

# Linux下安装

以树莓派3B+ 为例， CPU为arm， 相应的go语言开发包为 `go1.17.linux-armv6l.tar.gz`, 安装目录是 /usr/local/go
```sh
~$ wget https://golang.google.cn/dl/go1.17.1.linux-armv6l.tar.gz
~$ sudo tar -C /usr/local -xzf go1.17.1.linux-armv6l.tar.gz
```

如果是自己用软件解压的，可以拷贝到`/usr/local/go`下，但是要保证go文件夹下是bin、src、doc等目录

## 配置环境变量

Linux下有两个文件可以配置，其中`/etc/profile`是针对所有用户都有效的； `$HOME/.profile`是针对当前用户有效的，可以根据自己的情况选择。

针对所有用户的需要重启电脑才可以生效；针对当前用户的，在终端里使用source命令加载这个 `$HOME/.profile`即可生效。
```sh
~$ source ~/.profile
```

使用文本编辑器比如VIM编辑他们中的任意一个文件，在文件的末尾添加如下配置保存即可：
```
export GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin
```

其中`GOROOT`环境变量表示我们GO的安装目录，这样其他软件比如我们使用的Go开发IDE就可以自动的找到我们的Go安装目录，达到自动配置Go SDK的目的。

第二句配置是把`/usr/local/go/bin`这个目录加入到环境变量`PATH`里，这样我可以在终端里直接输入go等常用命令使用了.

配置好环境变量并使之生效后，打开终端，运行如下命令，就可以看到go的版本等信息了。
```
~$go version
go version go1.17 linux/arm

```
这说明我们已经安装go成功了。

# GOPATH目录

自从Golang采用Module的方式管理项目后，GOPATH目录已经不是那么重要了，目前主要用来存放依赖的Module库，生成的可执行文件等。GOPATH环境变量的配置参考上面的安装Go，配置到`/etc/profile`或`$HOME/.profile`里。

这个目录可以根据自己的设置指定，比如$HOME/go下。该目录下有3个子目录，他们分别是：
```
.
├── bin
├── pkg
└── src
```
* bin文件夹存放`go install`命名生成的可执行文件，可以把`$GOPATH/bin`路径加入到PATH环境变量里，就和我们上面配置的`$GOROOT/bin`一样，这样就可以直接在终端里使用我们go开发生成的程序了。
* pkg文件夹是存放go编译生成的文件。
* src存放的是非Go Module项目源代码。


# go项目工程结构

配置好工作环境后，就可以编码开发了，在这之前，我们看下go的通用项目结构,这里的结构主要是源代码相应地资源文件存放目录结构。

基于Go Module，可以在任意位置创建一个Go项目，而不再像以前一样局限在`$GOPATH/src`目录下。假设要创建一个tour项目，它位于`~/Desktop/tour`目录下，那现在打开终端，CD到`~/Desktop/tour`目录下，输入如下命令即可创建一个Go Module工程。
```
~$go mod init flysnow.org/tour
go: creating new go.mod: module flysnow.org/tour
```

当前生成的Go Module工程只有一个go.mod文件，它的内容如下所示：
```
module flysnow.org/tour

go 1.17
```

其中`module flysnow.org/tour`代表该项目的path,也就是最顶层的package，go 1.17表示该项目需要go 1.17版本及其以上才能编译运行。

go.mod文件是Go语言工具链用于管理Go语言项目的一个配置文件，我们不用手动修改它，Go语言的工具链会帮我们自动更新，比如当我们的项目添加一个新的第三方库的时候。

使用第三方库，也就是使用第三方库里的包，那么我们如何引用一个包呢，使用的就是go语言的import关键字，比如：
```go
import (
	"github.com/gohugoio/hugo/commands"
)
```

以上引入的`github.com/gohugoio/hugo/commands`这个包是属于 `github.com/gohugoio/hugo/`这个Go Module的。

所以相应的，我们也可以在我们自己的Go Module工程里创建一些包(其实就是子目录),比如我创建了lib1目录，那么它的对应的包就是`flysnow.org/tour/lib1`,其他包只有通过这个包名才能使用`flysnow.org/tour/lib1`包中的函数方法等。
```
.
├── go.mod
├── lib1
├── lib2
└── main.go
```


所以最后项目目录类似上面的结构，每个子目录都是一个包，子目录里可以放go文件。

# HelloWorld

有了tour项目，就可以演示下Go语言版本的Hello World了，在tour根目录下的`main.go`文件中，添加如下Go代码。
```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello World")
}
```

Go版Hello World非常简单。在`~/Desktop/tour`目录下运行`go run main.go`命令就可以看到打印的输出Hello World.
```
~$ go run main.go
Hello World
```

下面解释下这段代码。

1. package 是一个关键字，定义一个包，和Java里的package一样，也是模块化的关键。 
2. main包是一个特殊的包名，它表示当前是一个可执行程序，而不是一个库。 
3. import 也是一个关键字，表示要引入的包，和Java的import关键字一样，引入后才可以使用它。 
4. fmt是一个包名，这里表示要引入fmt这个包，这样我们就可以使用它的函数了。 
5. main函数是主函数，表示程序执行的入口，Java也有同名函数，但是多了一个String[]类型的参数。 
6. Println是fmt包里的函数，和Java里的system.out.println作用类似，这里输出一段文字。

整段代码非常简洁，关键字、函数、包等和Java非常相似，不过注意，go是不需要以;(分号)结尾的。

# 安装程序

安装的意思，就是生成可执行的程序，以供我们使用，为此go为我们提供了很方便的install命令，可以快速的把我们的程序安装到`$GOAPTH/bin`目录下。在`~/Desktop/tour`目录下运行如下代码即可安装。

```
~$ go install flysnow.org/tour
```

打开终端，运行上面的命令即可，install后跟全路径的包名。 然后我们在终端里运行tour就看到打印的Hello World了。
```
~$ tour
Hell World
```

# 跨平台编译

以前运行和安装，都是默认根据我们当前的机器生成的可执行文件，比如你的是Linux 64位，就会生成Linux 64位下的可执行文件，比如树莓派3B+，可以使用`go env`查看编译环境,以下截取重要的部分。
```
~$ go env
GOARCH="arm"
GOEXE=""
GOHOSTARCH="arm"
GOHOSTOS="linux"
GOOS="linux"
GOROOT="/usr/local/go"
GOTOOLDIR="/usr/local/go/pkg/tool/linux_arm"
```

注意里面两个重要的环境变量`GOOS`和`GOARCH`,其中`GOOS`指的是目标操作系统，它的可用值为：
```
aix
android
darwin
dragonfly
freebsd
illumos
js
linux
netbsd
openbsd
plan9
solaris
windows
```

一共支持13种操作系统。GOARCH指的是目标处理器的架构，目前支持的有：
```
arm
arm64
386
amd64
ppc64
ppc64le
mips
mipsle
mips64
mips64le
s390x
wasm
```

一共支持12种处理器的架构，GOOS和GOARCH组合起来，支持生成的可执行程序种类很多，具体组合参考https://golang.org/doc/install/source#environment 。如果我们要生成不同平台架构的可执行程序，只要改变这两个环境变量就可以了，比如要生成linux 64位的程序，命令如下：
```
GOOS=linux GOARCH=amd64 go build flysnow.org/tour
```

>前面两个赋值，是更改环境变量，这样的好处是只针对本次运行有效，不会更改我们默认的配置。

# 获取远程包

因为众所周知的原因，在获取远程包之前，我们需要先配置的代理,这里推荐`goproxy.io`代理，设置命令如下：
```
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.io,direct
```

设置好代理后，就可以使用go提供的一个获取远程包的工具go get来获取远程包了,它需要一个完整的包名作为参数，只要这个完整的包名是可访问的，就可以被获取到，比如我们获取一个CLI的开源库：

```
go get -v github.com/spf13/cobra
```
就可以下载这个库到我们`$GOPATH/pkg/mod`目录下了，这样我们就可以像导入其他包一样`import`了。

特别提醒，`go get`的本质是使用源代码控制工具下载这些库的源代码，比如git，hg等，所以在使用之前必须确保安装了这些源代码版本控制工具。

如果我们使用的远程包有更新，我们可以使用如下命令进行更新,多了一个-u标识。

```
go get -u -v github.com/spf13/cobra
```

# 获取gitlab私有库包

如果是私有的git库怎么获取呢？比如在公司使用gitlab搭建的git仓库，设置的都是private权限的。这种情况下我们可以配置下git，就可以了，在此之前你公司使用的gitlab必须要在7.8之上。然后要把我们http协议获取的方式换成ssh，假设你要获取`http://git.flysnow.org`，对应的ssh地址为`git@git.flysnow.org`，那么要在终端执行如下命令。

```
git config --global url."git@git.flysnow.org:".insteadOf "http://git.flysnow.org/"
```

这段配置的意思就是，当我们使用`http://git.flysnow.org/`获取git库代码的时候，实际上使用的是`git@git.flysnow.org`这个url地址获取的，也就是http到ssh协议的转换，是自动的，他其实就是在我们的`~/.gitconfig`配置文件中，增加了如下配置:
```
[url "git@git.flysnow.org:"]
	insteadOf = http://git.flysnow.org/
```

然后需要把git.flysnow.org加入GOPRIVATE环境变量中，因为它是你的私有仓库，不需要走GOPROXY代理。
```
# 设置不走 proxy 的私有仓库，多个用逗号相隔（可选）
go env -w GOPRIVATE=git.flysnow.org
```

现在我们就可以使用go get直接获取了，比如：
```
go get -v -insecure git.flysnow.org/hello
```

仔细看，多了一个`-insecure`标识，因为我们使用的是http协议， 是不安全的。当然如果你自己搭建的gitlab支持https协议，就不用加`-insecure`了，同时把上面的url insteadOf换成https的就可以了。
