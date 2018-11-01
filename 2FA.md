双因素认证（Two-factor authentication，简称 2FA）

证明身份的证据类型:
1. 秘密信息：只有该用户知道、其他人不知道的某种信息，比如密码。
2. 个人物品：该用户的私人物品，比如身份证、钥匙。
3. 生理特征：该用户的遗传特征，比如指纹、相貌、虹膜等等。
同时需要两种类型证据便是双因素:比如银行卡(卡,密码)

TOTP 的全称是"基于时间的一次性密码"（Time-based One-time Password）
步骤:
第一步，用户开启双因素认证后，服务器生成一个密钥。
第二步：服务器提示用户扫描二维码（或者使用其他方式），把密钥保存到用户的手机。也就是说，服务器和用户的手机，现在都有了同一把密钥。
	注意，密钥必须跟手机绑定。一旦用户更换手机，就必须生成全新的密钥。
第三步，用户登录时，手机客户端使用这个密钥和当前时间戳，生成一个哈希，有效期默认为30秒。用户在有效期内，把这个哈希提交给服务器。
第四步，服务器也使用密钥和当前时间戳，生成一个哈希，跟用户提交的哈希比对。只要两者不一致，就拒绝登录。

TOTP算法:
核心公示:
TC = floor((unixtime(now) − unixtime(T0)) / TS)
TC: 时间计数器; unixtime(now): 当前 Unix 时间戳; unixtime(T0): 约定的起始时间点的时间戳，默认是0; TS 则是哈希有效期的时间长度，默认是30秒
保证30s内手机客户端和服务器得到同一个哈希
采用默认之后公式简化成TC = floor(unixtime(now) / 30) 确实初看起来unixtime(now)每30s,TC为同一值.但有几个问题:
1. 手机端与服务器的now值如何保证在一定范围内相等(网络延时?)
2. TC值可以看做Random()*30,因为(1)值而使得两端得到的值不一致的可能性多大
允许+-1

哈希计算公式:
TOTP = HASH(SecretKey, TC)

JS实现:
$ npm install --save 2fa
生成一个32位字符的密钥:
var tfa = require('2fa');
tfa.generateKey(32, function(err, key) {
  console.log(key);
});
// b5jjo0cz87d66mhwa9azplhxiao18zlx
生成哈希:
var tc = Math.floor(Date.now() / 1000 / 30);
var totp = tfa.generateCode(key, tc);
console.log(totp); // 683464

优点:
单纯密码破解无效
缺点:
登录多一步,费时且麻烦;不能保证绝对安全,依然可以通过盗取 cookie 或 token，劫持整个对话（session);账号恢复又需要更加强力认证