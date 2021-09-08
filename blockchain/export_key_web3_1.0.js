var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
console.log(web3.eth.accounts.decrypt({ version: 3,
  id: '88e40042-044e-4307-85df-a7c2e20e8b34',
  address: '044a7eac226630557e49629411f6079b8d6aa6ae',
  crypto:
   { ciphertext:
      'd298f5ec33d33394aabd42dacb9f9eafd6f5fbade72d5edb89dd1f777ddda211',
     cipherparams: { iv: 'ebce486e1a0e7943c504c08b34c59a1d' },
     cipher: 'aes-128-ctr',
     kdf: 'scrypt',
     kdfparams:
      { dklen: 32,
        salt:
         '675bde56399d9993da5ac7a67b1cac7f4dbd3d4ef322463097046656a6eeb196',
        n: 8192,
        r: 8,
        p: 1 },
     mac:
      'f0de8846997ab4e266a7203bf112cf11f9eeb4a9df9cf743dc8c51837e13068d' 
  }
},'password1'));//第二个参数是你自己设的密码

/*
返回: 
{ address: '0x044a7EaC226630557e49629411f6079b8d6aA6AE',
  privateKey:
   '0x3bfadf07640eba0d326f445d60e0805f81b5f15319363957555aa7d04c8a0edd',
  signTransaction: [Function: signTransaction],
  sign: [Function: sign],
  encrypt: [Function: encrypt] }</pre>
*/
