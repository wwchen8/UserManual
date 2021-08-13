# Dokcer使用教程

## 目录
* [Linux中快速安装Docker](#Linux中快速安装Docker)
* [Docker常用命令](#Docker常用命令)
  * [镜像相关命令](#镜像相关命令)  
  * [容器相关命令](#容器相关命令)
* [Bug分支](#Bug分支)
* [Feature分支](#Feature分支)
* [多人协作](#多人协作)
* [Rebase](#Rebase)

## Linux中快速安装Docker

进入 [Dokcer官网](https://docker.com)

进入官网后，选择Products(产品)，然后选择Docker Desktop，进入下载页面，点击进行下载。
```
$curl -fsSL https://get.docker.com -o get-docker.sh
$sudo sh get-docker.sh
```
启动Docker服务进程
```
sudo systemctl start docker
sudo docker version
```

## Docker常用命令

### 镜像相关命令
1 查看
docker images
docker image ls

2 搜索镜像
docker search 镜像名

3 拉取和删除镜像
docker image pull 镜像名
docker pull redis
docker pull redis:5
第三方镜像：
docker pull quay.io/redhattraining/wordpress

docker image rm ID1 ID2 ID3
docker rmi redis:5
docker rmi ID

docker image inspect ID

### 容器相关命令
1.查看容器
docker container ps 	正在运行的容器
docker container ps -a 	所有容器
docker container ps -l	最后运行的容器
docker container ps -l -n 3      最后3个运行的容器
docker container ps -f status=exited 查询状态停止的容器
docker container ps -n 5 	最近创建的n个容器
docker container ps  --help

2.创建与启动容器
a. 创建并进入容器
docker container run -it --name mynginx -p 1080:80 nginx 
docker container run -it --name mynginx -p 1080:80 nginx  sh  退出交互后，容器停止
docker container run -it --name mynginx -P nginx   (随机端口)

登录进容器
docker container run -it  --name  mynginx  -p 1080:80 nginx  /bin/bash

b. 守护方式
docker container run -d --name  mynginx  -p 1080:80 nginx 

登录到容器：
docker container exec -it mynginx  /bin/bash

后台转换成前台模式
docker  attach <ID or Image Name>

detached模式下查看日志
docker container logs <ID or 容器名>
docker container logs -f <ID or 容器名>

删除容器:
停止多容器
docker container stop 容器1 容器2 容器3
docker container stop $(docker container ps -aq)

删除多容器
docker container rm 容器1 容器2 容器3
docker container rm  $(docker container ps -aq)

强制删除
docker container rm  c54d -f


3. 目录复制
docker  cp 本地文件  容器名: 目录名
docker cp 容器名:目录文件名 本地目录

4. 目录挂载

创建容器时 添加参数 : -v /宿主机目录:/容器目录
docker run -di -v /mydata/docker_centos/data:/usr/local/data --name centos7-01 centos:07
若提示权限不足，是因为centos7中的安全模块SELinux把权限禁止了。 可以通过参数 -privileged=true 解决

多目录挂载：
docker run -di -v /宿主机目录:/容器目录 -v /宿主机目录2:/容器目录2  Image
 


a. 匿名挂载
/var/lib/docker/volumes

docker run -di -v /容器目录名 --name myubuntu ubuntu

 
b.具名挂载
/var/lib/docker/volumes
docker run -di -v 名称:/容器目录名 --name myubuntu02 ubuntu

5. 只读只写
只读： 只能通过宿主机内容实现对容器德数据管理  
-v /宿主机目录:/容器目录:ro 

读写：默认 
-v /宿主机目录:/容器目录:rw

6.继承
--volume-from 容器名:[ro]

docker run -di -v /mydata/docker_ubuntu/data:/usr/local/data --name ubuntu-01 ubuntu
docker run -di --volume-from ubuntu-01 --name ubuntu-04 ubuntu
docker run -di --volume-from ubuntu-01 --name ubuntu-05 ubuntu

7. 查看目录挂载关系
docker volum ls
docker inspect 容器名|容器ID

8.查看容器的IP地址
docker inspect 容器名|容器ID
docker inspect --format='{{.NetworkSettings.IPAddress}}' 容器名|容器ID


三. 构建镜像
镜像的导入导出
导出：
docker image save 镜像名:标签 -o 镜像文件名
docker image save centos:7 -o mycentos.imge

导入:
docker image load -i  镜像文件名
docker image load -i  mycentos.imge


1.docker commit: 从容器创建一个新的镜像

a. 创建容器

# 拉取镜像
docker image pull centos:7
# 创建容器
docker run -di --name mycentos7 centos:7

b. 复制资源
docker cp /root/jdk-11.xxx._bin.tar.gz mycentos7 :/root

c. 安装资源
# 登录进容器
docker exec -it mycents7  /bin/bash

cd /root
安装资源

d. 构建镜像
docker commit -a=作者 -m=说明文字  容器名   新镜像名:标签
docker commit -a="writer" -m="jdk11 and tomcat9" mycentos7 newcentos:7

docker images 

e. 使用新镜像创建容器
docker run -di --name mynewcentos7 -p 8080:8080 newcentos:7
# 登录进容器
docker exec -it mycents7  /bin/bash


2.docker build: 配合Dockerfile文件创建镜像

Dockerfile文件
常用指令
FROM 
定制的镜像都是基于 FROM 的镜像
FROM centos:7
FROM scratch   //空镜像 从零开始构建镜像

LABEL 
指令用来给镜像添加一些元数据（metadata），以键值对的形式，
LABEL <key>=<value> <key>=<value> <key>=<value> ...
LABEL maintainer="Jerry Chen"

RUN
用于执行后面跟着的命令行命令。有以下俩种格式：

shell 格式：
RUN <命令行命令> # <命令行命令> 等同于，在终端操作的 shell 命令。

exec 格式：
RUN ["可执行文件", "参数1", "参数2"]
# 例如：
# RUN ["./test.php", "dev", "offline"] 等价于 RUN ./test.php dev offline


注意：Dockerfile 的指令每执行一次都会在 docker 上新建一层。所以过多无意义的层，会造成镜像膨胀过大。例如：

FROM centos
RUN yum install wget
RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
RUN tar -xvf redis.tar.gz
以上执行会创建 3 层镜像。可简化为以下格式：

FROM centos
RUN yum install wget \
    && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
    && tar -xvf redis.tar.gz
以 && 符号连接命令，这样执行后，只会创建 1 层镜像。

COPY
复制指令，从上下文目录中复制文件或者目录到容器里指定路径。

格式：
COPY [--chown=<user>:<group>] <源路径1>...  <目标路径>
COPY [--chown=<user>:<group>] ["<源路径1>",...  "<目标路径>"]
[--chown=<user>:<group>]：可选参数，用户改变复制到容器内文件的拥有者和属组。

<源路径>：源文件或者源目录，这里可以是通配符表达式，其通配符规则要满足 Go 的 filepath.Match 规则。例如：

COPY hom* /mydir/
COPY hom?.txt /mydir/
<目标路径>：容器内的指定路径，该路径不用事先建好，路径不存在的话，会自动创建。

ADD
ADD 指令和 COPY 的使用格类似（同样需求下，官方推荐使用 COPY）。功能也类似，不同之处如下：

ADD 的优点：在执行 <源文件> 为 tar 压缩文件的话，压缩格式为 gzip, bzip2 以及 xz 的情况下，会自动复制并解压到 <目标路径>。
ADD 的缺点：在不解压的前提下，无法复制 tar 压缩文件。会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢。具体是否使用，可以根据是否需要自动解压来决定。

EXPOSE
仅仅只是声明端口。

作用：
帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射。
在运行时使用随机端口映射时，也就是 docker run -P 时，会自动随机映射 EXPOSE 的端口。
格式：
EXPOSE <端口1> [<端口2>...]

ENV
设置环境变量，定义了环境变量，那么在后续的指令中，就可以使用这个环境变量。

格式：
ENV <key> <value>
ENV <key1>=<value1> <key2>=<value2>...

以下示例设置 NODE_VERSION = 7.2.0 ， 在后续的指令中可以通过 $NODE_VERSION 引用：

ENV NODE_VERSION 7.2.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc"

CMD
类似于 RUN 指令，用于运行程序，但二者运行的时间点不同:

CMD 在docker run 时运行。
RUN 是在 docker build。
作用：为启动的容器指定默认要运行的程序，程序运行结束，容器也就结束。CMD 指令指定的程序可被 docker run 命令行参数中指定要运行的程序所覆盖。

注意：如果 Dockerfile 中如果存在多个 CMD 指令，仅最后一个生效。

格式：

CMD <shell 命令> 
CMD ["<可执行文件或命令>","<param1>","<param2>",...] 
CMD ["<param1>","<param2>",...]  # 该写法是为 ENTRYPOINT 指令指定的程序提供默认参数
推荐使用第二种格式，执行过程比较明确。第一种格式实际上在运行的过程中也会自动转换成第二种格式运行，并且默认可执行文件是 sh。

ENTRYPOINT
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


WORKDIR
指定工作目录。用 WORKDIR 指定的工作目录，会在构建镜像的每一层中都存在。（WORKDIR 指定的工作目录，必须是提前创建好的）。

docker build 构建镜像过程中的，每一个 RUN 命令都是新建的一层。只有通过 WORKDIR 创建的目录才会一直存在。

格式：

WORKDIR <工作目录路径>

VOLUME
定义匿名数据卷。在启动容器时忘记挂载数据卷，会自动挂载到匿名卷。

作用：

避免重要的数据，因容器重启而丢失，这是非常致命的。
避免容器不断变大。
格式：

VOLUME ["<路径1>", "<路径2>"...]
VOLUME <路径>
在启动容器 docker run 的时候，我们可以通过 -v 参数修改挂载点。


获取镜像的三个基本途径
a. 从网络社区直接拉取，（pull from registry）
b. 从Dockerfile构建一个镜像，这种像是DIY一个镜像，但是整个构建过程是需要联网，因为需要西在基础镜像，然后根据基础镜像进行构建（build from Dockerfile）。
c. 自有文件的导入，可以从本地导入已经构建好的镜像文件，在没有网络的时候可以用。这个文件是通过 已有的镜像导出来的压缩包，然后就可以进行使用了。
