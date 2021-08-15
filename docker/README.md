
# Docker私有仓库的搭建及认证

## 目录
* [Docker私有仓库搭建](#Docker私有仓库搭建)
* [配置私有仓库认证](#配置私有仓库认证)
 
---
## Docker私有仓库搭建

1. 拉取私有仓库镜像registry
```
#docker pull registry
```

2. 修改配置文件daemon.json
```
#vi /etc/docker/daemon.json
//添加一下内容
{
    "registry-mirrors": ["http://hub-mirror.c.163.com", "https://docker.mirrors.ustc.edu.cn"],
    "insecure-registries": [192.168.10.10:5000]
}

// 重新加载某个服务的配置文件
#systemctl daemon reload
// 重新启动 docker
#systemctl restart docker
```


3. 创建私有仓库容器
```
#docker run -di --name registry -p 5000:5000 -v /mydata/docker_registry:/var/lib/registry registry
```

在浏览器中输入： http://192.168.10.10:5000/v2/_catalog , 若显示内容：
```
{"repositories":[]}
```
则表示私有仓库搭建成功并且内容为空。

4. 推送镜像至私有仓库

**先给镜像设置标签**

命令: docker tag local-image:tag new-repoL:tag

```
#docker tag centos:7 192.168.10.10:5000/centos:7
```
**再将镜像推送至私有仓库**

命令: docker push new-repo:tag
```
#docker push 192.168.10.10:5000/centos:7
```

5. 从私有仓库拉取镜像
```
#docker pull 192.168.10.10:5000/centos:7
```

---
##  配置私有仓库认证

要确保私有仓库的安全性，需要一个安全证书，所以需要再搭建私有仓库的Docker主机上先生产自签名证书

首先创建证书存储的目录
```
#mkdir -p /usr/local/registry/certs
```

1. 生产自签名证书
```
#openssl req -newkey rsa:2048 -nodes -sha256 -keyout /usr/loca/registry/certs/domain.key -x509 -days 365 -out /usr/loca/registry/certs/domain.crt

open ssl req :  创建证书签名请求等功能
-newkey:         创建CSR证书签名文件和RSA私钥文件
rsa: 2048         指定创建的RSA私钥长度为2048
-nodes:            对私钥不进行加密
-sha256:          使用SHA256算法
-keyout:           创建的私钥文件名及位置
-x509:              自签发证书格式
-days:              证书有效期
-out:                指定CSR输出文件名和位置
```

填写信息，注意 `Common Name (your name or your server's hostname)` 需填入私有仓库所在宿主机的IP 地址192.168.10.10
```
Countrt: CN
State or ProvinceName: SH
Locality Name(City): SH
Organization Name:  SUPER
Organization Unit Name: Technology
Common Name(your name or your server's hostname):  192.168.10.10
Email Address: someone@super.com
```

在/usr/local/registry/certs/目录下产生两个文件 domain.crt  domain.key 


2. 生产鉴权密码文件
```
//创建存储鉴权密码文件目录
#mkdir -p /usr/local/registry/auth

//如果没有htpasswd功能，需要安装 httpd
#yum install -y httpd

//创建用户和密码
#htpasswd -Bbn root 1234 > /usr/local/registry/auth/htpasswd
```
>htpasswd是apache http的基本认证文件，使用htpasswd命令可以生产用户及密码文件


3. 创建具有认证功能的私有仓库容器
```
#docker run -di --name registry -p 5000:5000 \
    -v /mydata/docker_registry:/var/lib/registry \
    -v /usr/local/registry/certs:/certs \
    -v /usr/local/registry/auth:/auth \
    -e "REGISTRY_AUTH=htpasswd" \
    -e "REGISTRY_AUTH_HTPASSWD_REALM=Registry Realm" \
    -e REGISTRY_AUTH_HTPASSWD_PATH=/auth/htpasswd \ 
    -e REGISTRY_HTTP_TLS_CERTIFICATE=/certs/domain.crt \
    -e REGISTRY_HTTP_TLS_KEY=/certs/domain.key \
    registry
```

4. 推送镜像至私有仓库失败

```
#docker tag centos:7 192.168.10.10:5000/centos:7
#docker push 192.168.10.10:5000/centos:7
no basic auth credential
```

5. 登录账号
```
#docker login 192.168.10.10:5000
username: root
password: xxxx
```

6. 推送镜像至私有仓库成功
```
#docker push 192.168.10.10:5000/centos:7
```

7. 退出账号
```
#docker logout 192.168.10.10:5000
```
