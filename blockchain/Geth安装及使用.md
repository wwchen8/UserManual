# 目录
* [Geth介绍](#Geth介绍)
  * [节点类型](#节点类型)
* [源码安装Geth](#源码安装Geth)
* [启动节点同步](#启动节点同步)
  * [启动同步测试网](#启动同步测试网)
* [利用Geth搭建自己的私有链](#利用Geth搭建自己的私有链)
  * [准备创世区块描述文件genesis.json](#准备创世区块描述文件genesis.json)
  * [初始化创世纪区块](#初始化创世纪区块)
  * [启动私有区块链](#启动私有区块链)
  * [以dev模式启动私有区块链](#以dev模式启动私有区块链)
  * [连接Geth三种方式](#连接Geth三种方式)
* [Geth客户端下常用指令](#Geth客户端下常用指令)

---
# Geth介绍
为了与区块链进行通信，必须使用区块链客户端。客户端是能够与其他客户建立p2p通信信道，签署和广播交易，挖掘，部署和与智能合约交互等的软件。
客户端通常被称为节点。

以太坊节点必须遵循的功能的正式定义在以太坊黄皮书中定义。黄皮书定义了网络上节点所需的函数，挖掘算法，私钥/公钥ECDSA参数。
它定义了使节点与以太坊客户端完全兼容的全部功能。

迄今为止最受欢迎的客户是Geth和Parity。实现的不同之处主要在于选择的编程语言：Geth使用Golang，而Parity使用Rust。

## 节点类型
当你加入以太坊网络时，你可以选择运行各种类型的节点。目前的选项是：

* light节点

不保存链上的区块历史数据，只保存区块链当前的状态。轻节点可以对块和交易进行验证。

* full节点

全节点是整个主链的一个副本，存储并维护链上的所有数据，并随时验证新区块的合法性。每个全节点都可以帮助其他新节点获取区块数据，并提供所有交易和合约的独立验证。
运行全节点将耗费巨大的成本，包括硬件资源和带宽。

---
# 源码安装Geth

1. 克隆 github 仓库
第一步是克隆 git 仓库，以获取源代码的副本。
```
$ git clone https://github.com/ethereum/go-ethereum.git
```
2. 从源码构建 Geth

geth是用go语言写的，编译geth源码需要go语言和C语言编译器，因此需要先安装go语言

要构建 Geth ，切换到下载源代码的目录并使用 make 命令：
```
$ cd go-ethereum 
$ make geth
```
构建成功后会在当前目录的子目录`build/bin/`下生成geth程序。

查看 geth ve rsion 确保在真正运行 之前 安装正常:
```
$ ./build/bin/geth version 
Geth
Version: 1.10.4-unstable
Git Commit: 5cff9754d795971451f2f4e8a2cc0c6f51ce9802
Git Commit Date: 20210602
Architecture: amd64
Go Version: go1.13.8
Operating System: linux
GOPATH=/home/ubuntu/project 
GOROOT=/usr/local/go
```

---
# 启动节点同步

安装好了安装好了Geth，现在我们可以尝试运行一下它。geth就会开始同步区块，并存储就会开始同步区块，并存储在当前目录下。
```
$ geth –datadir . --syncmode fast
```
`syncmode fast` 参数表示我们会以“快速”模式同步区块 。在这种模式下，我们只会下载每个区块头和区块体，但不会执行验证所有的交易，直到所有区块同步完毕再去获取一个系统
当前的状态。这样就节省了很多交易验证的时间。
通常，在同步以太坊区块链时，客户端会一开始就下载并验证每个块和每个交易，也就是说从创世区块开始。 如果不加 syncmode fast 参数， 同步将花费很长时间并且具有很高的资源要
求。

## 启动同步测试网

如果我们想同步测试网络的区块，可以用下面的命令：
```
$ geth --testnet --datadir . --syncmode fast
```
 `testnet` 这 个参数会 告诉 geth 启动并连接到最新的测试网络， 也就是 Ropsten 。测试网络的区块和交易数量会明显少于主网，所以会更快一点。但即使是用快速模式同步测试网络，
 也会需要几个小时的时间。

    --testnet     Ropsten网络:预配置的POW(proof-of-work)测试网络
  
    --rinkeby     Rinkeby网络: 预配置的POA(proof-of-authority)测试网络

---
# 利用Geth搭建自己的私有链

因为公共网络的区块数量太多，同步耗时太长，我们为了方便快速了解 Geth ，可以试着用它来搭一个只属于自己的私链。

## 准备创世区块描述文件genesis.json

genesis.json内容如下:

``` json
{
  "config": {
        "chainId": 15,
        "homesteadBlock": 0,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip158Block": 0,
        "ByzantiumBlock": 0,
        "constantinopleBlock": 0,
        "petersburgBlock": 0
    },
  "coinbase"   : "0x0000000000000000000000000000000000000000",
  "difficulty" : "0x2000",
  "extraData"  : "",
  "gasLimit"   : "0xffffffff",
  "nonce"      : "0x0000000000000042",
  "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
  "timestamp"  : "0x00",

  "alloc"      : {
      "0x7df9a875a174b3bc565e6424a0050ebc1b2d1d82": { "balance": "8000000000000000000" },
      "0xf41c74c9ae680c1aa78f42e5647a62f353b7bdde": { "balance": "6000000000000000000" }
  }
}
```
其中主要配置 chainId。 alloc可以为特定地址预分配货币余额。

chainId与networkid的区别与相同：

> chainid 在eip155里有用到，目前来看是做重放保护的
> 
> networkid 是区分网络的，只有networkid的值相同的网络才能相连
```
config.chainId        // 区块链的ID，在 geth 命令中的 --networkid 参数需要与 chainId 的值一致
config.homesteadBlock // Homestead 硬分叉区块高度，指定从什么区块开始实现Homestead 硬分叉,这里设置为初始区块
config.eip155Block    // 指明从那个节点开始实现eip155该协议，详情看ethereum/EIPs-155 Simple replay attack protection 35，36
config.eip158Block    //指明从那个节点开始实现eip155该协议，详情看ethereum/EIPs-158 State clearing 被EIP-161取代
config.ByzantiumBlock //指明什么时候实现拜占庭分叉
coinbase              //160bits,指明挖矿奖励节点是哪一个
```

## 初始化创世纪区块

要创建一条以它作为创世块的区块链，执行以下命令：
```
geth --datadir /path_private_chain/data init genesis.json 
```
![20180516163107607](https://user-images.githubusercontent.com/81728370/132983279-2b3d3b74-ed47-4d09-9d71-6bcb2795b807.png)

此时会在`/path_private_chain/`目录下生成 `data` 目录，data目录又包含geth和keystore目录。geth目录存储区块数据，keystore目录则保存账户信息。

![20180516163118555](https://user-images.githubusercontent.com/81728370/132983299-8545687e-eca0-4a92-bc35-fdff4dc520db.png)

## 启动私有区块链

当前目录下运行 geth ，就会启动这条私链，注意要将 networked 设置为与创世块配置里的chainId 一致。
```
geth --datadir /path_private_chain/data --networkid 15  --rpc --rpcaddr 0.0.0.0 --rpcport 8545
```

常用参数：
* console          启动geth控制台，不加该选项，geth启动之后成为一个后台进程不会自动结束
* --rpcapi net,eth,web3,personal
* --rpc                       启用HTTP-RPC服务器
* --rpcaddr value             HTTP-RPC服务器接口地址(默认值:“localhost”)
* --rpcport value             HTTP-RPC服务器监听端口(默认值:8545)

要通过Geth的RPC访问端结点提供这些管理API，需要在启动geth时使用--${interface}api选项，其中${interface}可以是rpc，表示HTTP上的端结点，
或者是ws，表示WebSocket上的端结点，或者ipc，表示unix套接字或windows命名管道上的端结点。

默认情况下，Geth在IPC端结点上提供所有的API，在HTTP和WebSocket接口上仅提供db、eth、net和web3这几个API。

## 以dev模式启动私有区块链

dev 模式，也叫回归测试模式，主要用来给开发人员提供一个方便的开发测试环境。

在dev模式下，可以轻松的获得以太币，默认开启来的挖矿，方便发起交易，交易也会被快速的打包，节省时间方便验证。

```
geth --datadir /path_private_chain/data --dev --networkid 15 --rpc --rpcaddr 0.0.0.0 --rpcport 8545
```

## 连接Geth三种方式

1. IPC 方式连接
```
geth attach ethereum/data0/geth.ipc 
```
或
```
geth --ipcpath ~/.ethereum/geth.ipc attach  
```
 
2. TCP 连接控制台——连接远程控制台
```
geth --exec 'eth.coinbase' attach http://localhost:8545
```

3. WebSocket 方式
```
geth attach ws://localhost:8546
```

---
# Geth客户端下常用指令

Geth客户端console是一个交互式的 JavaScript 执行环境，在这里面可以执行 JavaScript 代码，其中 > 是命令提示符。在这个环境里也内置了一些用来操作以太坊的 JavaScript 对象，可以直接使用这些对象。这些对象主要包括：

* eth：包含一些跟操作区块链相关的方法；
* net：包含一些查看p2p网络状态的方法；
* admin：包含一些与管理节点相关的方法；
* miner：包含启动&停止挖矿的一些方法；
* personal：主要包含一些管理账户的方法；
* txpool：包含一些查看交易内存池的方法；
* web3：包含了以上对象，还包含一些单位换算的方法

进入以太坊 Javascript Console 后，就可以使用里面的内置对象做一些操作，这些内置对象提供的功能很丰富，比如查看区块和交易、创建账户、挖矿、发送交易、部署智能合约等。

常用命令有：

**net模块**
``` javascript
> net.listening             //查看节点状态 
> net.peerCount             // 查看节点链接的数量
```

**账户操作**
``` javascript
> eth.accounts          //查看账户
> personal.listAccounts                 //查看账户
> personal.newAccount()                 //新建账户
> personal.unlockAccount("**********")  //解锁账户
> personal.lockAccount("**********")    //锁定账户
> eth.getBalance(eth.accounts[0])       //账户余额
```

查看/修改coinbase帐户，coinbase接收挖矿奖励，默认为创建的第一个账户eth.accounts[0]：
``` javascript
> eth.coinbase
> miner.setEtherbase(eth.accounts[0])
```

**发送交易**
``` javascript
> eth.sendTransaction({from: "0xb5f49168e69df3030541199f5a5b3442bb40172c", to: "0x26d6e7a5593bd71bfc7e8d1042a975f6e29ee794", value: web3.toWei(2, "ether")})
```
**查看交易信息，区块信息和区块高度**
``` javascript
> eth.getTransaction("交易hash")
> eth.getBlock(区块号)
> eth.blockNumber
```

**挖矿、结束挖矿**
``` javascript
> miner.start(1)
> miner.stop()
```
