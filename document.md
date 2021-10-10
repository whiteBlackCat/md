# 记录零散不足以单独分类

## 调教搜索引擎

### 限定关键词

| 限定符              | 作用                                                       |
| ------------------- | ---------------------------------------------------------- |
| "[words]"           | 检索结果必须含有指定关键词（多个关键词还会进一步限定顺序） |
| filetype:[pdf]      | 检索指定类型文件                                           |
| site:[url]          | 指定网站内检索                                             |
| link[url]           | 搜索网页中含有某链接的结果                                 |
| inurl               | 搜索网站地址中包含关键词的结果。                           |
| related:[url]       | 搜索相关网站                                               |
| index of            | 可以突破网站入口下载                                       |
| [time]..[time]      | 限定时间段                                                 |
| author:[author]     | 指定作者                                                   |
| intitle:[title]     | title内含有指定词                                          |
| define:[word]       | 查词定义                                                   |
| 1米=?公里           | 单位换算(改成其他单位就不一定会出现预期结果)               |
| allinanchor:[words] | 限制搜索的词语是网页中链接内包含的关键词                   |
| allintext:[words]   | 限制搜索的词语是网页内文包含的关键词                       |
| allintitle:[words]  | 限制搜索的词语是网页标题中包含的关键词                     |
| allinurl:[words]    | 限制搜索的词语是网页网址中包含的关键词                     |
| inanchor:[words]    | 限制搜索的词语是网页中链接内包含的关键词                   |
| intext:[words]      | 限制搜索的词语是网页内文包含的关键                         |

| 关键词操作        | 作用           |
| ----------------- | -------------- |
| 空格              | 与             |
| OR                | 或             |
| +                 | 添加           |
| -(减号前有个空格) | 剔除           |
| ~                 | 近义词         |
| *                 | 同类别可替换词 |

### 搜索姿势

1. 将目标拆分成多个关键词并使用上述限定符及操作符组合
2. 当结果不太匹配,则需要精炼关键词重新组合
3. 也许是当前站点没有目标相关内容

### 搜索前的准备

1. 首先，想好你想要寻找什么。哪些词能够最好地描述你要寻找的信息或者概念？哪些词是你能够用来替换的？有没有那些词是可以不必包括在你想要搜索的更好定义你的需求之内？
2. 构建你的搜索要求。使用尽可能多你所需要的关键词；越多越好。如果皆存在可能的话，试着用适当的搜索操作来使你的搜索更精炼——或者，如果你愿意的话，可以使用高级搜索页面。
3. 进行搜索。评估一下搜索结果页面上的匹配程度。如果一开始的结果与你想要的不一致，再精炼你的搜索要求并重新搜索——或转向更合适的搜索站点再进行搜索。
4. 选择你想要查看的匹配的页面，点击进行浏览。

## 双因素认证

Two-factor authentication，简称 2FA

### 证明身份的证据类型

1. 秘密信息：只有该用户知道、其他人不知道的某种信息，比如密码。
2. 个人物品：该用户的私人物品，比如身份证、钥匙。
3. 生理特征：该用户的遗传特征，比如指纹、相貌、虹膜等等。

同时需要两种类型证据便是双因素:比如银行卡(卡,密码)

### TOTP

基于时间的一次性密码（Time-based One-time Password）

#### 生成步骤

1. 用户开启双因素认证后，服务器生成一个密钥。
2. 服务器提示用户扫描二维码（或者使用其他方式），把密钥保存到用户的手机。也就是说，服务器和用户的手机，现在都有了同一把密钥。
  **注意**，密钥必须跟手机绑定。一旦用户更换手机，就必须生成全新的密钥。
3. 用户登录时，手机客户端使用这个密钥和当前时间戳，生成一个哈希，有效期默认为30秒。用户在有效期内，把这个哈希提交给服务器。
4. 服务器也使用密钥和当前时间戳，生成一个哈希，跟用户提交的哈希比对。只要两者不一致，就拒绝登录。

#### TOTP算法

核心公示: `TC = floor((unixtime(now) − unixtime(T0)) / TS)`
TC: 时间计数器
unixtime(now): 当前 Unix 时间戳
unixtime(T0): 约定的起始时间点的时间戳，默认是0;
TS : 哈希有效期的时间长度，默认是30秒,保证30s内手机客户端和服务器得到同一个哈希
采用默认之后公式简化成`TC = floor(unixtime(now) / 30)` 确实初看起来unixtime(now)每30s,TC为同一值.但有几个问题:

1. 手机端与服务器的now值如何保证在一定范围内相等(网络延时?)
2. TC值可以看做Random()*30,因为(1)值而使得两端得到的值不一致的可能性多大

哈希计算公式: `TOTP = HASH(SecretKey, TC)`

```javascript
// $ npm install --save 2fa
// 生成一个32位字符的密钥:
var tfa = require('2fa');
tfa.generateKey(32, function(err, key) {
  console.log(key);
});
// b5jjo0cz87d66mhwa9azplhxiao18zlx
// 生成哈希:
var tc = Math.floor(Date.now() / 1000 / 30);
var totp = tfa.generateCode(key, tc);
console.log(totp); // 683464
```

优点: 单纯密码破解无效
缺点: 登录多一步,费时且麻烦;不能保证绝对安全,依然可以通过盗取 cookie 或 token，劫持整个对话（session);账号恢复又需要更加强力认证

## 正则

### 常用

| 作用         | 正则                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| 汉字         | `^[\u4e00-\u9fa5]*$`                                                        |
| Email        | `^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`                             |
| 域名         | `[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/.?`        |
| InternetURL  | `^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$`                                |
| 手机号码     | `^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$`     |
| 双字节字符   | `[^\x00-\xff]`                                                              |
| 空白行       | `\n\s*\r`                                                                   |
| HTML标记     | `<(\S*?)[^>]*>.*?</\1>|<.*?/>`                                              |
| 首尾空白字符 | `^\s*|\s*$`                                                                 |
| IP地址一部分 | `25[0-5]|2[0-4]\d|[0-1]\d{2}|\d{2}|\d`                                      |
| IP地址       | `((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))` |

### 知识点

- 误匹配：指正则表达式所匹配的内容范围超出了所需要范围.有些文本明明不符合要求，但是被所写的正则式“击中了”。例如，如果使用\d{11}来匹配11位的手机号，\d{11}不单能匹配正确的手机号，它还会匹配98765432100这样的明显不是手机号的字符串。
- 漏匹配：指正则表达式所匹配的内容所规定的范围太狭窄.有些文本确实是所需要的，但是所写的正则没有将这种情况囊括在内。例如，使用\d{18}来匹配18位的身份证号码，就会漏掉结尾是字母X的情况。

### 建议

1. 掌握语法细节。正则表达式在各种语言中，其语法大致相同，细节各有千秋。
2. 先粗后精,从误匹配开始细化
3. 留有余地。能匹配一定的变化
4. 明确。减少任意量词
5. 非需要则不使用捕获
6. 宁简勿繁。将一条复杂的正则表达式拆分为两条或多条简单的正则表达式，编程难度会降低，运行效率会提升。
