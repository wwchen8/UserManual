# 构建镜像

## 目录
* [基于现有容器创建镜像](#基于现有容器创建镜像)
* [基于Dockerfile文件创建镜像](#基于Dockerfile文件创建镜像)
  * [Dockerfile文件常用指令](#Dockerfile文件常用指令)  
  * [具名挂载](#具名挂载)
  * [多目录挂载](#多目录挂载)
  * [只读只写](#只读只写)
  * [继承](#继承)
  * [查看目录挂载关系](#查看目录挂载关系)

---
获取镜像的三个基本途径
a. 从网络社区直接拉取，（pull from registry）
b. 从Dockerfile构建一个镜像，这种像是DIY一个镜像，但是整个构建过程是需要联网，因为需要西在基础镜像，然后根据基础镜像进行构建（build from Dockerfile）。
c. 自有文件的导入，可以从本地导入已经构建好的镜像文件，在没有网络的时候可以用。这个文件是通过 已有的镜像导出来的压缩包，然后就可以进行使用了。        

## 基于现有容器创建镜像

从容器创建一个新的镜像。

命令: `docker commit`

1. 创建容器
```
// 拉取镜像
#docker image pull centos:7
// 创建容器
#docker run -di --name mycentos7 centos:7
```

2. 复制资源
```
#docker cp /root/jdk-11.xxx._bin.tar.gz mycentos7 :/root
```

3. 安装资源
```
// 登录进容器
#docker exec -it mycentos7  /bin/bash
#cd /root
// 安装资源，配置环境
# ...
```

4. 构建镜像

命令:  `docker commit -a=作者 -m=说明文字  容器名   新镜像名:标签`

```
#docker commit -a="writer" -m="jdk11 and tomcat9" mymcentos7 customcentos:7
// 查看镜像列表
#docker images 
```

5. 使用新镜像创建容器
```
#docker run -di --name newcentos7 -p 8080:8080 customcentos:7
// 登录进容器
docker exec -it newcentos7  /bin/bash
```

---
## 基于Dockerfile文件创建镜像
 
### Dockerfile文件常用指令

1. FROM 

定制的镜像都是基于 FROM 的镜像
```
FROM centos:7
FROM scratch   //空镜像 从零开始构建镜像
```

>选择基础镜像的三个原则  
>* 官方镜像优于非官方的镜像  
>* 固定版本的Tag，而不是每次都使用latest  
>* 功能满足，选择体积小的镜像  

<br/>
2. LABEL 

指令用来给镜像添加一些元数据（metadata），以键值对的形式，
```
LABEL <key>=<value> <key>=<value> <key>=<value> ...
LABEL maintainer="Jerry Chen"
```

<br/>
3. RUN

用于执行后面跟着的命令行命令。有以下俩种格式：

* shell 格式：

RUN <命令行命令> 
<命令行命令> 等同于，在终端操作的 shell 命令。

* exec 格式：

RUN ["可执行文件", "参数1", "参数2"]
```
 RUN ["./test.php", "dev", "offline"]  //等价于 RUN ./test.php dev offline
```

**注意**
Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大。例如：

```
FROM centos
RUN yum install wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN tar -xvf redis.tar.gz
```
以上执行会创建 3 层镜像。可简化为以下格式：
```
FROM centos
RUN yum install wget \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && tar -xvf redis.tar.gz
```
以 && 符号连接命令，这样执行后，只会创建 1 层镜像。

<br/>
4. COPY

复制指令，从上下文目录(由WORKDIR指定)中复制文件或者目录到容器里指定路径。

格式:  
COPY [--chown=<user>:<group>] <源路径1>...  <目标路径>  
COPY [--chown=<user>:<group>] ["<源路径1>",...  "<目标路径>"]
 
>[--chown=<user>:<group>]：可选参数，用户改变复制到容器内文件的拥有者和属组。
><源路径>：源文件或者源目录，这里可以是通配符表达式，其通配符规则要满足 Go 的 filepath.Match 规则。例如：
><目标路径>：容器内的指定路径，该路径不用事先建好，路径不存在的话，会自动创建。

 ```
COPY hom* /mydir/
COPY hom?.txt /mydir/
 ```
<br/>
5. ADD
 
ADD 指令和 COPY 的使用格类似（同样需求下，官方推荐使用 COPY）。功能也类似，不同之处如下：

>ADD 的优点：在执行 <源文件> 为 tar 压缩文件的话，压缩格式为 gzip, bzip2 以及 xz 的情况下，会自动复制并解压到 <目标路径>。

>ADD 的缺点：在不解压的前提下，无法复制 tar 压缩文件。会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢。具体是否使用，可以根据是否需要自动解压来决定。

<br/>
6. EXPOSE
 
仅仅只是声明端口。

作用:  
>帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。

>在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。

格式：  
```
 EXPOSE <端口1> [<端口2>...]
```
 
<br/>
7. ENV

设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。

格式：
``` 
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>...
```

 以下示例设置 `NODE_VERSION = 7.2.0` ， 在后续的指令中可以通过 `$NODE_VERSION` 引用：
```
ENV NODE_VERSION 7.2.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc"
```

 <br/>
8. CMD
 
类似于 RUN 指令，用于运行程序，但二者运行的时间点不同:

>CMD 在docker run 时运行。

>RUN 是在 docker build。

 作用：为启动的容器指定默认要运行的程序，程序运行结束，容器也就结束。CMD 指令指定的程序可被 docker run 命令行参数中指定要运行的程序所覆盖。

>注意：如果 Dockerfile 中如果存在多个 CMD 指令，仅最后一个生效。

格式：

CMD <shell 命令> 
CMD ["<可执行文件或命令>","<param1>","<param2>",...] 
CMD ["<param1>","<param2>",...]  # 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数
推荐使用第二种格式，执行过程比较明确。第一种格式实际上在运行的过程中也会自动转换成第二种格式运行，并且默认可执行文件是 sh。

9. ENTRYPOINT
 
类似于 CMD 指令，但其不会被 docker run 的命令行参数指定的指令所覆盖，而且这些命令行参数会被当作参数送给 ENTRYPOINT 指令指定的程序。

但是, 如果运行 docker run 时使用了 --entrypoint 选项，将覆盖 CMD 指令指定的程序。

优点：在执行 docker run 的时候可以指定 ENTRYPOINT 运行所需的参数。

注意：如果 Dockerfile 中如果存在多个 ENTRYPOINT 指令，仅最后一个生效。

格式：

ENTRYPOINT ["<executeable>","<param1>","<param2>",...]
可以搭配 CMD 命令使用：一般是变参才会使用 CMD ，这里的 CMD 等于是在给 ENTRYPOINT 传参，以下示例会提到。

示例：

假设已通过 Dockerfile 构建了 nginx:test 镜像：

FROM nginx

ENTRYPOINT ["nginx", "-c"] # 定参
CMD ["/etc/nginx/nginx.conf"] # 变参 
1、不传参运行

$ docker run  nginx:test
容器内会默认运行以下命令，启动主进程。

nginx -c /etc/nginx/nginx.conf
2、传参运行

$ docker run  nginx:test -c /etc/nginx/new.conf
容器内会默认运行以下命令，启动主进程(/etc/nginx/new.conf:假设容器内已有此文件)

nginx -c /etc/nginx/new.conf


10. WORKDIR
 
指定工作目录。用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在。（WORKDIR 指定的工作目录，必须是提前创建好的）。

docker build 构建镜像过程中的，每一个 RUN 命令都是新建的一层。只有通过 WORKDIR 创建的目录才会一直存在。

格式：

WORKDIR <工作目录路径>

11. VOLUME
 
定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。

作用：

避免重要的数据，因容器重启而丢失，这是非常致命的。
避免容器不断变大。
格式：

VOLUME ["<路径1>", "<路径2>"...]
VOLUME <路径>
在启动容器 docker run 的时候，我们可以通过 -v 参数修改挂载点。


 

#mkdir -p /usr/local/dockerfile
#cd /usr/local/dockerfile
    #vi Dockerfile

FROM centos:7
LABEL maintainer="Jerry Li"
WORKDIR /usr/local
RUN mkdir -p /usr/local/java && mkdir -p /usr/local/tomcat
ADD jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/java
ADD apache-tomcat-9.0.37.tar.gz /usr/local/tomcat
EXPOSE 8080
ENV JAVA_HOME /usr/local/java/jdk-11.0.6/
ENV PATH $PATH:$JAVA_HOME/bin
CMD ["/usr/local/tomcat/apache-tomcat-9.0.37/bin/catalina.sh","run"]

#cp /root/jdk-11.0.6_linux-x64_bin.tar.gz /usr/local/dockerfile/
#cp /root/apache-tomcat-9.0.37.tar.gz /usr/local/dockerfile/
#docker build -f /usr/local/dockerfile/Dockerfile -t mycentos:7 /usr/local/dockerfile/

#docker images

#docker run -di --name mycentos7 -p 8080:8080 mycentos:7

#docker image tag mycentos:7 registername/mycentos:7
#docker login
username: registername
password
#docker image push registername/mycentos:7
 

