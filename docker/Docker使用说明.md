# Dokcer使用教程

## 目录
* [Linux中快速安装Docker](#Linux中快速安装Docker)
* [Docker常用命令](#Docker常用命令)
  * [镜像相关命令](#镜像相关命令)  
  * [容器相关命令](#容器相关命令)

---
        
## Linux中快速安装Docker

进入 [Dokcer官网](https://docker.com)

进入官网后，选择Products(产品)，然后选择Docker Desktop，进入下载页面，点击进行下载。
```
$curl -fsSL https://get.docker.com -o get-docker.sh
$sudo sh get-docker.sh
```
启动Docker服务进程:
```
sudo systemctl start docker
sudo docker version
```
---
## Docker常用命令

### 镜像相关命令
1. 查看已经下载的镜像
```
#docker images
#docker image ls
```

2. 在hub-docker上搜索镜像

  `docker search 镜像名`

3. 拉取镜像

  `docker image pull 镜像名:标签`
```
#docker pull redis
#docker pull redis:5
```
  拉取第三方镜像：
```
#docker pull quay.io/redhattraining/wordpress
```

4. 删除镜像
```
#docker image rm ID1 ID2 ID3
#docker rmi redis:5
#docker rmi ID
```

5. 查看镜像的详细信息

  `docker image inspect ID`
<br/>
<br/>
### 容器相关命令

1. 查看容器
```
#docker container ps 	   正在运行的容器
#docker container ps -a 	所有容器
#docker container ps -l	  最后运行的容器
#docker container ps -l -n 3    最后3个运行的容器
#docker container ps -f status=exited  查询状态停止的容器
#docker container ps -n 5 	 最近创建的n个容器
#docker container ps  --help
```
<br/>
2. 创建与启动容器
<br/>
<br/>

* 以交互模式(interactive)创建并进入容器

docker container run -it --name 容器名 -p 宿主机端口:容器端口 镜像名  
```
#docker container run -it --name mynginx -p 1080:80 nginx 
#docker container run -it --name mynginx -p 1080:80 nginx  sh  退出交互后，容器停止
#docker container run -it --name mynginx -P nginx   (随机端口)
```
<br/>

**以交互模式(interactive)创建并进入容器shell:**

> #docker container run -it  --name  mynginx  -p 1080:80 nginx  /bin/bash
  

 <br/> 
 
* 以守护模式(detached)创建并运行容器
<br/> 

> docker container run -dt --name  容器名 -p 宿主机端口:容器端口 镜像名
```
#docker container run -dt --name  mynginx  -p 1080:80 nginx 
```

 **登录到守护模式运行的容器：**

> #docker container exec -it mynginx  /bin/bash

 **守护模式转换成交互模式:**

`docker  attach <ID or Container Name>`

 **在detached模式下查看日志：**
```
docker container logs <ID or 容器名>
docker container logs -f <ID or 容器名>
```
  
<br/>  
3. 删除容器:

* 停止多容器
```
#docker container stop 容器1 容器2 容器3
#docker container stop $(docker container ps -aq)
```

* 删除多容器
```
#docker container rm 容器1 容器2 容器3
#docker container rm  $(docker container ps -aq)
```

* 强制删除
```
docker container rm  c54d -f
```

<br/>

