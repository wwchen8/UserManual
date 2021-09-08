# 什么是以太坊私钥储存（Keystore）文件

进入keystore管理以太坊私钥的障碍很大，主要是因为以太坊客户端在直接的命令行或图形界面下隐藏了大部分的密码复杂性。

例如，用geth:
```
$ geth account new
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase:
Repeat passphrase: 
Address: {008aeeda4d805471df9b2a5b0f38a0c3bcba786b}

$ geth account list
Account #0: {8a1c4d573cc29a96547816522cfe0b266e88abac} keystore:~/.ethereum/keystore/UTC--<created_date_time>--  008aeeda4d805471df9b2a5b0f38a0c3bcba786b
```

只需要输入命令(3个单词)就能创建一个新账户。然后输入两遍密码，就这么简单！一个私有的以太坊keystore文件就创建了。

你需要把那些非常珍贵的keystore文件备份、存储在一个或多个隐秘的位置，这样就只有你能获取这些文件并取到资金。

但你很有可能会搞砸它。搞砸的时候，你辛苦挣来的以太币被永久锁定！。

幸运的是，作为一个以太坊用户，你能搞砸的方式并不多：

1. 丢失了你的keystore文件
2. 忘记了和文件关联的密码
3. 或者以上两者你都搞砸了。

本文将为你介绍以太坊私钥是如何从 keystore 文件中算出来的。我们将讨论加密函数（对称加密，密钥生成函数，SHA3 哈希算法），但会尽可能的保证简明直接地来解释上述问题。

# 什么是keystore文件？

以太坊的 keystore 文件（Linux 系统存储在 `~/.ethereum/keystore` 或者 Windows 系统存储在 `C:\Users<User>\Appdata/Roaming/Ethereum/keystore`）是你独有的、用于签署交易的以太坊私钥的加密文件。如果你丢失了这个文件，你就丢失了私钥，意味着你失去了签署交易的能力，意味着你的资金被永久的锁定在了你的账户里。

当然，你可以直接把你的以太坊私钥存储在一个加密文件里，但是这样你的私钥容易受到攻击，攻击者简单的读取你的文件、用你的私钥签署交易，把钱转到他们的账户中。你的币会在你意识到发生什么了之前的短时间内丢失。

这就是以太坊 keystore 文件被创建的原因：它允许你以加密的方式存储密钥。这是**安全性**（一个攻击者需要 keystore 文件和你的密码才能盗取你的资金）和**可用性**（只需要keystore文件和密码就能用你的钱了）两者之间完美的权衡。

为了让你发送一些以太币，大多数的以太坊客户端会让你输入密码（与创建账户时密码相同）以解密你的以太坊私钥。一旦解密，客户端程序就得到私钥签署交易，允许你移动资金。

# Keystore文件是什么样子的？

如果你打开一个你的账户文件，它看起来像这样（取自[这里](https://github.com/hashcat/hashcat/issues/1228)）：
```
$ cat ~/.ethereum/keystore/UTC--<created_date_time>--  008aeeda4d805471df9b2a5b0f38a0c3bcba786b
{
    "crypto" : {
        "cipher" : "aes-128-ctr",
        "cipherparams" : {
            "iv" : "83dbcc02d8ccb40e466191a123791e0e"
        },
        "ciphertext" : "d172bf743a674da9cdad04534d56926ef8358534d458fffccd4e6ad2fbde479c",
        "kdf" : "scrypt",
        "kdfparams" : {
            "dklen" : 32,
            "n" : 262144,
            "r" : 1,
            "p" : 8,
            "salt" : "ab0c7876052600dd703518d6fc3fe8984592145b591fc8fb5c6d43190334ba19"
        },
        "mac" : "2103ac29920d71da29f15d75b4a16dbe95cfd7ff8faea1056c33131d846e3097"
    },
    "id" : "3198bc9c-6672-5ab3-d995-4942343ae5b6",
    "version" : 3
}
```

一个有许多神奇的参数的粗笨的 JSON 文件，似乎与复杂的加密操作相关。

# 让我们深入理解一下

如果你看这个 keystore 文件的结构，你会看到大部分内容都是在“crypto”中的.

这包括：

* **cipher**：对称 [AES 算法](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)的名称;
* **cipherparams**：上述 *cipher* 算法需要的参数;
* **ciphertext**：使用上述 *cipher* 算法进行加密的以太坊私钥;

* **kdf**：[密钥生成函数](https://en.wikipedia.org/wiki/Key_derivation_function)，用于让你用密码加密 keystore 文件;
* **kdfparams**：上述 kdf 算法需要的参数;
* **Mac**：用于验证密码的[代码](https://en.wikipedia.org/wiki/Message_authentication_code)。


让我们看看他们是如何协同工作的，如何在你的密码下保护 keystore 文件。

1. 加密你的私钥

一个以太坊账户就是用于加密签署交易的一个私钥 —公钥对。为了确保你的私钥没有在文件中明文存储，使用强对称算法（**cipher**）对其加密至关重要。

这些对称算法使用密钥来加密数据。加密后的数据可以使用相同的方法和同样的密钥来解密，因此算法命名为**对称算法**。在本文中，我们称这个对称密钥为**解密密钥**，因为它将用于对我们的以太坊私钥进行解密。

以下是 **cipher**，**cipherparams** 和 **ciphertext** 对应的概念：

* **Cipher**:  是用于加密以太坊私钥的对称加密算法。此处cipher用的是 *aes-128-ctr* 加密模式。
* **Cipherparams**:  是 *aes-128-ctr* 加密算法需要的参数。在这里，用到的唯一的参数 *iv*，是*aes-128-ctr*加密算法需要的初始化向量。
* **Ciphertext**:  密文是 *aes-128-ctr* 函数的加密输入。

所以，在这里，你已经有了进行解密以太坊私钥计算所需要的一切...等等。你需要首先取回你的解密密钥。

![6194358474a04064ac96571917923487](https://user-images.githubusercontent.com/81728370/132475553-846e4819-c683-4217-8e7c-b62993a01ffa.png)

                                 ciphertex 密文的对称解密

2. 用你的密码来保护它

要确保解锁你的账户很容易，你不需要记住你的每一个又长又非用户友好型的用于解密 ciphertext 密文**解密密钥**。相反，以太坊开发者选择了基于密码的保护，
也就是说你只需要输入密码就能拿回**解密密钥**。

为了能做到这一点，以太坊用了一个[密钥生成函数](https://en.wikipedia.org/wiki/Key_derivation_function)，输入密码和一系列参数就能计算**解密密钥**。

这就是 **kdf** 和 **kdfparams** 的用途：

* **kdf**:  是一个[密钥生成函数](https://en.wikipedia.org/wiki/Key_derivation_function)，根据你的密码计算（或者取回）**解密密钥**。在这里，**kdf** 用的是scrypt算法。
* **kdfparams**:  是scrypt函数需要的参数。在这里，简单来说，dklen、n、r、p 和 salt 是 **kdf** 函数的参数。更多关于 scrypt 函数的信息可以在这里找到。

在这里，用 **kdfparams** 参数对 *scrypt* 函数进行调整，反馈到我们的密码中，你就会得到**解密密钥**也就是密钥生成函数的输出。

![41322f690ae040e58781d42cc8a96aef](https://user-images.githubusercontent.com/81728370/132475738-7fee681f-18ad-4629-bc17-0b096905f2d2.png)

                                 用密码生成密钥

3. 确保你的密码是对的

我们描述了用密码和 keystore 文件生成以太坊私钥所需要的所有东西。然而，如果解锁账户的密码错误会发生什么？

根据迄今为止我们所看到的，所有操作（密码派生和解密）都会成功，但是最终计算的以太坊私钥不是正确的，这首先违背了密钥文件的使用初衷！

我们要保证输入解锁账户的密码是正确的，和最初创建 keystore 文件时一样（回想一下 geth 下创建新账户时两次输入的密码）。

这就是 keystore 文件中 **mac** 值起作用的地方。在密钥生成函数执行之后，它的输出（**解密密钥**）和 **ciphertext** 密文就被处理【注1】，并且和 **mac**（就像一种认
可的印章）作比较。如果结果和 **mac** 相同，那么密码就是正确的，并且解密就可以开始了。

【注1】这里有点简略了。在和 **mac** 进行比较之前，**解密密钥**（左起第二字节开始的16字节）要和 **ciphertext** 密文连接在一起，并进行哈希散列（用SHA3-256的方法）。 
更多信息请访问[这里](https://github.com/hashcat/hashcat/issues/1228)。

![7722c8acbd0e43b998030e88ce9eab5d](https://user-images.githubusercontent.com/81728370/132475821-9202bf46-7c1f-4f57-8d1a-599fd8149305.png)


4. 把所有的都放到一起考虑

唷！ 如果你已经做到了这一点，那么恭喜你！ 🎉🎊

让我们回顾一下我们描述的3个函数。

首先，你输入了密码，这个密码作为 **kdf** 密钥生成函数的输入，来计算**解密密钥**。

然后，刚刚计算出的**解密密钥** 和 **ciphertext** 密文连接并进行处理，和 **mac** 比较来确保密码是正确的。

最后，通过 **cipher** 对称函数用**解密密钥** 对 **ciphertext** 密文解密。

瞧！解密的结果是你的**以太坊私钥**。 你可以在这里看看整个过程：

![29ce9ec7823e44198b8a223cb1414b92](https://user-images.githubusercontent.com/81728370/132475914-c591d16c-6be5-4bf8-ab5a-778814a95a3a.png)


就像你从图中可以看到的，整个过程可以看做一个黑盒（不过，图中是个灰盒），你的密码是惟一的输入，你的以太坊私钥是惟一的输出。所需的其他信息都可以在你的以太坊账户创建时生成的keystore文件中获得。

由于这个原因，请确保你的密码足够强（并且无论如何你要记住它！）才能保证即使攻击者偷到了你的keystore文件也不能轻易得到你的私钥。
