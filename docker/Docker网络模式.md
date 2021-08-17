# Docker网络模式

## 目录
* [bridge模式](#bridge模式)
* [host模式](#host模式)
* [none模式](#none模式)  
* [container网络模式](#container网络模式)
* [上传镜像至DockerHub](#上传镜像至DockerHub)

---

安装Docker后，会默认创建三种网络，可通过docker network ls 查看
```
jerry@ubuntu:~$ sudo docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
e594e15c56d1   bridge    bridge    local
acd2edc5fc4a   host      host      local
a63061366529   none      null      local
```

网络模式 | 文件名	
-----| ---
bridge |为每个容器分配设置IP等，并将容器连接到一个 docker0 虚拟网桥，默认为该模式
host   |  容器将不会虚拟出自己的网卡，而是使用宿主机的IP和端口
none   | 容器有独立的 Network namespace，但并没有进行任何网络设置，如分配veth pair和网桥链接，IP等
container |新创建的容器不会创建自己的网卡和配置自己的IP，而是和一个指定的容器共享IP,端口范围。

>bridge为默认不需要用–net去指定，其他三种模式需要在创建容器时使用–net去指定。


## bridge模式

创建容器时通过参数 `--net bridge` 或 `--network bridge` 指定。是创建容器时的默认模式，该参数可以省略。

在该 bridge 模式下，Docker Daemon 会创建出一个名为 docker0 的虚拟网桥 ，用来连接宿主机与容器，或者连接不同的容器。  
Docker 利用 veth pair 技术，在宿主机上创建了两个虚拟网络接口 veth0 和 veth1（veth pair 技术的特性可以保证无论哪一个 veth 接收到网络报文，都会无条件地传输给另一方）。  

![](./pic/bridge.png)


## host模式

创建容器时通过参数 `--net host` 或 `--network host`指定。

采用host模式的容器 直接使用宿主机的ip地址与外界通信，端口也使用宿主机的端口，无需进行NAT转换.  

![](./pic/host.png)


## none模式

创建容器时通过参数 `--net none` 或 `--network none`指定。

none模式是指禁用网络模式，只有lo接口，代表 127.0.0.1，即 localhost本地环路接口。

```
//查看所有none模式的容器
#docker  network inspect none
```

## container网络模式

container网络模式是Docker中易中特别的网络模式。在创建容器时通过参数 --net container:已运行的容器名称|ID 或 --network container:已运行的容器名称|ID指定。

![](./pic/container.png)

该模式下的Docker容器会共享一个网络栈，这样两个容器之间可以使用localhost高效快速通信。虽然多个容器共享网络环境,但是多个容器形成的整体依然与宿主机以及其他容器形成网络隔离。

>Container网络模式的缺陷：  
>它并没有改善容器与宿主机以外世界通信的情况（和桥接模式一样，不能连接宿主机以外的其他设备）。


