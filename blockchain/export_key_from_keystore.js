// 1. npm install keythereum
// 2. keystore文件必须保存在 path/keystore目录下
// 3. 运行： node 本脚本文件名 keystore文件名 密码

const keythereum = require("keythereum");
const path = require('path');

//keystore密钥存放目录，在project目录下的keystore目录下，
const keydir = path.resolve(__dirname,'./');

var arguments = process.argv.splice(2);

if(!arguments || arguments.length!=2){
	console.log("Parameter length must be 2.");
	return;
}

var address= arguments[0];        // keystore文件名
const password = arguments[1];    // 密码

var keyObject = keythereum.importFromFile(address, keydir);

var privateKey = keythereum.recover(password, keyObject);
console.log("address: ",keyObject["address"]) 
console.log("Private key: ",privateKey.toString('hex'));
