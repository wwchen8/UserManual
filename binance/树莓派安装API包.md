#  安装 binance-connector 包
```
#sudo pip install binance-connector -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

## 解决错误：   `c/_cffi_backend.c:15:10: fatal error: ffi.h: No such file or directory`
```
     #include <ffi.h>
              ^~~~~~~
    compilation terminated.
    error: command 'gcc' failed with exit status 1
```   

安装依赖包：
```
#sudo apt install build-essential libffi-dev libssl-dev
```
## 解决错误： error: Can not find Rust compiler
```
  ----------------------------------------
  ERROR: Failed building wheel for cryptography
```
安装rustc：
```
#sudo apt install -y rustc
```

## 编译cryptography时间过长： https://github.com/rust-lang/crates.io-index 连接超时

修改镜像:
```
#mkdir .cargo
#cd ~/.cargo
#vi config

[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'ustc'
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"

```
