因此，本文主要介绍如何在 [Node.js 官网](https://nodejs.org/)上下载二进制包，并且完成 Node.js 的安装。



# Node.js 二进制包下载

登录 [Node.js 官网下载页面](https://nodejs.org/en/download/)，树莓派3B官网Raspbian系统是属于 ARMV7l的，选择对应的二级制包下载即可，具体方法如下：

```sh
wget https://nodejs.org/dist/v14.17.6/node-v14.17.6-linux-armv7l.tar.xz
```



# 解压并安装 Node.js

下载完成后，先解压刚下载好的包，具体方法如下：

```sh
# tar命令中没有直接解压xz压缩格式的参数
xz -d node-v14.17.6-linux-armv7l.tar.xz
tar -xavf node-v14.17.6-linux-armv7l.tar
```

完成解压后，将 Node.js 的二进制包移动到 `/usr/local/node` 中，操作如下：

```sh
sudo mv ./node-v14.17.6-linux-armv7l /usr/local/node
# 如果系统内原本存在 /usr/bin/node ，先将其删除
sudo rm -rf /usr/bin/node
```

完成后，我们在为 `node` 和 `npm` 创建软连接：

```sh
sudo ln -s /usr/local/node/bin/node /usr/bin/node
sudo ln -s /usr/local/node/bin/npm /usr/bin/npm
```

然后，我们尝试测试一下 node 是否能正常使用：

```sh
node --version
>> v14.7.6
npm --version
>>
6.14.15
```

到这里为止，我们已经完成在 Raspbian 系统上安装 Node.js 了。

