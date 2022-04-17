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

| 作用                  | 正则                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------- |
| 汉字                  | `^[\u4e00-\u9fa5]*$`                                                                          |
| Email                 | `^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`                                               |
| 域名                  | `[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/.?`                          |
| InternetURL           | `^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$`                                                  |
| 手机号码              | `^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$`                       |
| 双字节字符            | `[^\x00-\xff]`                                                                                |
| 空白行                | `\n\s*\r`                                                                                     |
| HTML标记              | `<(\S*?)[^>]*>.*?</\1>|<.*?/>`                                                                |
| 首尾空白字符          | `^\s*|\s*$`                                                                                   |
| IP地址一部分          | `25[0-5]|2[0-4]\d|[0-1]\d{2}|\d{2}|\d`                                                        |
| IP地址                | `((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))`                   |
| 匹配嵌套的`<div>`标签 | `<div[^>]*>[^<>]*(((?'Open'<div[^>]*>)[^<>]*)+((?'-Open'</div>)[^<>]*)+)*(?(Open)(?!))</div>` |

### 知识点

- 误匹配：指正则表达式所匹配的内容范围超出了所需要范围.有些文本明明不符合要求，但是被所写的正则式“击中了”。例如，如果使用\d{11}来匹配11位的手机号，\d{11}不单能匹配正确的手机号，它还会匹配98765432100这样的明显不是手机号的字符串。
- 漏匹配：指正则表达式所匹配的内容所规定的范围太狭窄.有些文本确实是所需要的，但是所写的正则没有将这种情况囊括在内。例如，使用\d{18}来匹配18位的身份证号码，就会漏掉结尾是字母X的情况。
- `(?:exp)` 非捕获
- `(?<name>exp)` 具名捕获
- `(?=exp)`  匹配exp前面的位置  零宽前向断言
- `(?<=exp)` 匹配exp后面的位置 零宽后向断言
- `(?!exp)`  匹配后面跟的不是exp的位置
- `(?<!exp)` 匹配前面不是exp的位置
- `(?#comment)` 注释

处理选项：

- IgnoreCase(忽略大小写)  
- Multiline(多行模式)  (在此模式下,$的精确含意是:匹配\n之前的位置以及字符串结束前的位置.)
- Singleline(单行模式)  更改.的含义，使它与每一个字符匹配（包括换行符\n）。  
- IgnorePatternWhitespace(忽略空白)   忽略表达式中的非转义空白并启用由#标记的注释。

> 注：单行模式，多行模式可同时开启

平衡组/递归匹配

- `(?'group')` 把捕获的内容命名为group,并压入堆栈(Stack)
- `(?'-group')` 从堆栈上弹出最后压入堆栈的名为group的捕获内容，如果堆栈本来为空，则本分组的匹配失败
- `(?(group)yes|no)` 如果堆栈上存在以名为group的捕获内容的话，继续匹配yes部分的表达式，否则继续匹配no部分
- `(?!)` 零宽负向先行断言，由于没有后缀表达式，试图匹配总是失败
- `(?<x>-<y>exp)`      平衡组
- `(?im-nsx:exp)`    在子表达式exp中改变处理选项
- `(?im-nsx)` 为表达式后面的部分改变处理选项
- `(?(exp)yes|no)` 把exp当作零宽正向先行断言，如果在这个位置能匹配，使用yes作为此组的表达式；否则使用no
- `(?(name)yes|no)` 如果命名为name的组捕获到了内容，使用yes作为表达式；否则使用no

常见正则表达式引擎

| 引擎                                      | 区别点                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DFA(Deterministic finite automaton)`     | 确定型有穷自动机 DFA引擎它们不要求回溯，所以匹配速度快！DFA引擎还可以匹配最长的可能的字符串。不过DFA引擎只包含有限的状态，所以它不能匹配具有反向引用的模式，还不可以捕获子表达式。代表性有：awk,egrep,flex,lex,MySQL,Procmail                                                                                                                                                                   |
| `NFA(Non-deterministic finite automaton)` | 非确定型有穷自动机，又分为传统NFA,Posix NFA 传统的NFA引擎运行所谓的“贪婪的”匹配回溯算法（longest-leftmost），以指定顺序测试正则表达式的所有可能的扩展并接受第一个匹配项。传统的NFA回溯可以访问完全相同的状态多次，在最坏情况下，它的执行速度可能非常慢，但它支持子匹配。代表性有：GNU Emacs,Java,ergp,less,more,.NET语言,PCRE library,Perl,PHP,Python,Ruby,sed,vi等，一般高级语言都采用该模式。 |

**占有字符和零宽度**
正则表达式匹配过程中，如果子表达式匹配到的是字符内容，而非位置，并被保存到最终的匹配结果中，那么就认为这个子表达式是占有字符的；如果子表达式匹配的仅仅是位置，或者匹配的内容并不保存到最终的匹配结果中，那么就认为这个子表达式是零宽度的。占有字符是互斥的，零宽度是非互斥的。也就是一个字符，同一时间只能由一个子表达式匹配，而一个位置，却可以同时由多个零宽度的子表达式匹配。常见零宽字符有：^，(?=)等

Demo2:源字符DEF,对应标记是：`0D1E2F3`，匹配正则表达式是：`/D\w+F/`
过程可以理解为：首先由正则表达式字符 `/D/` 取得控制权，从位置0开始匹配，由 `/D/` 来匹配`“D”`，匹配成功，控制权交给字符 `/\w+/` ；由于`“D”`已被 `/D/` 匹配，所以 `/\w+/` 从位置1开始尝试匹配，`\w+`贪婪模式，会记录一个备选状态，默认会匹配最长字符，直接匹配到EF，并且匹配成功，当前位置3了。并且把控制权交给 `/F/` ；由 `/F/` 匹配失败，`\w+`匹配会回溯一位，当前位置变成2。并把控制权交个`/F/`，由`/F/`匹配字符F成功。因此`\w+`这里匹配E字符,匹配完成！

Demo3:源字符DEF,对应标记是：0D1E2F3，匹配正则表达式是：`/^[?=D](D-F)+$/`
过程可以理解为：元字符 `/^/` 和 `/$/` 匹配的只是位置，顺序环视 `/(?=D)/` （匹配当前位置，右边是否有字符“D”字符出现）只进行匹配，并不占有字符，也不将匹配的内容保存到最终的匹配结果，所以都是零宽度的。 首先由元字符 `/^/` 取得控制权，从位置0开始匹配，`/^/` 匹配的就是开始位置“位置0”，匹配成功，控制权交给顺序环视 `/(?=D)/`；`/(?=D])/` 要求它所在位置右侧必须是字母”D”才能匹配成功，零宽度的子表达式之间是不互斥的，即同一个位置可以同时由多个零宽度子表达式匹配，所以它也是从位置0尝试进行匹配，位置0的右侧是字符“D”，符合要求，匹配成功，控制权交给 `/[D-F]+/` ；因为 `/(?=D)/` 只进行匹配，并不将匹配到的内容保存到最后结果，并且 /(?=D)/ 匹配成功的位置是位置0，所以 `/[D-F]+/` 也是从位置0开始尝试匹配的， `/[D-F]+/` 首先尝试匹配“D”，匹配成功，继续尝试匹配，直到匹配完”EF”，这时已经匹配到位置3，位置3的右侧已没有字符，这时会把控制权交给 `/$/`，元字符 `/$/` 从位置3开始尝试匹配，它匹配的是结束位置，也就是“位置3”，匹配成功。此时正则表达式匹配完成，报告匹配成功。匹配结果为“DEF”，开始位置为0，结束位置为3。其中 `/^/` 匹配位置0， `/(?=D)/` 匹配位置0， `/[D-F]+/` 匹配字符串“DEF”， `/$/` 匹配位置3。

1. 在没有g标识符时，match和exec方法效果是一样的；有g标识符时，exec方法可以提供最完整的匹配结果。
2. 这里顺便提一下RegExp.test()方法，它是exec方法的简化版，有匹配结果就返回true，没有匹配结果就返回false，执行过程与exec是一样的。相当于 (p.exec(s) != null)。
3. RegExp的lastIndex属性在有g标识符，且在exec和test方法中是有效的,其他地方是无效的。

### 建议

1. 掌握语法细节。正则表达式在各种语言中，其语法大致相同，细节各有千秋。
2. 先粗后精,从误匹配开始细化
3. 留有余地。能匹配一定的变化
4. 明确。减少任意量词
5. 非需要则不使用捕获
6. 宁简勿繁。将一条复杂的正则表达式拆分为两条或多条简单的正则表达式，编程难度会降低，运行效率会提升。

## sublime

### 安装插件

首先安装包管理

#### Package Control

安装方法：

1. CTRL+` ，出现控制台
2. 粘贴以下代码至控制台
`import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)`

#### 推荐插件

Emmet,JSFormat,LESS,Less2CSS,Alignment,sublime-autoprefixer,Bracket Highlighter,Git,jQuery,DocBlockr,Color​Picker,AutoFileName,Nodejs,Trailing spaces,FileDiffs,GBK Encoding Support,Git​Gutter

### 使用node环境

1. 下载Nodejs插件，下载地址为：[https://github.com/tanepiper/SublimeText-Nodejs](https://github.com/tanepiper/SublimeText-Nodejs).解压后文件名改为Nodejs
2. 打开Sublime Text3，点击菜单“Perferences” =>“Browse Packages”打开“Packages”文件夹，并将第1部的Nodejs文件夹剪切进来
3. 打开文件“Nodejs.sublime-build”，将代码 "encoding": "cp1252" 改为 "encoding": "utf8" ，将代码 "cmd": ["taskkill /F /IM node.exe & node", "$file"] 改为 "cmd": ["node", "$file"] ，保存文件
4. 打开文件“Nodejs.sublime-settings”，将代码 "node_command": false改为 "node_command": "D:\\Program Files\\nodejs\\node.exe" ，将代码 "npm_command": false 改为 "npm_command": "D:\\Program Files\\nodejs\\npm.cmd" ，保存文件
5. 编写一个测试文件test.js，按“ctrl+B"运行代码

## Node

### 使用mysql

步骤:

1. 创建一个新项目：`mkdir mysql-test && cd mysql-test`
2. 创建一个 package.json 文件：`npm init -y`
3. 安装mysql模块: `npm install mysql –save`
4. 创建一个app.js文件并将下面的代码段复制进去。

   ```javascript
   // app.js:
   const mysql = require('mysql')
   const connection = mysql.createConnecntion({
      host:'localhost',
      user:'user',
      password:'password',
      database:''
   )}
   //建立SQL链接
   connection.connection(err=>{
   if(err)throw err;
   console.log('connented';})
   connection.end(err=>{})
   ```

5. 运行该文件: `node app.js`。会看到一条 “Connected!”(已连接上了)消息。

#### 使用grunt自动化

监听文件修改`grunt-contrib-watch` 都会运行已经预定义好的任务，并且会使用 `grunt-execute` 来运行 `node app.js` 命令。

```javascript
//SQL查询
connection.query('SELECT*FROM employee',(err,rows)=>{
//查询操作
})
//insert查询
const obj = {}
connection.query(INSERT INTO employee SET ?',obj,(err,rows)=>{
//查询操作
})

```

## 模块加载规范

### CommonJS

实现: Node.js, Browserify
核心: 模块通过 require 方法来同步加载所要依赖的其他模块，然后通过 exports 或 module.exports 来导出需要暴露的接口
优点:

  1. 服务器端模块便于重用
  2. NPM 中已经有将近20万个可以使用模块包
  3. 简单并容易使用

 缺点:

  1. 同步的模块加载方式不适合在浏览器环境中，同步意味着阻塞加载，浏览器资源是异步加载的
  2. 不能非阻塞的并行加载多个模块

### AMD(Asynchronous Module Definition)

实现: RequireJS, curl
核心:
定义: `define(id?, dependencies?, factory)`
引用: `require(["module", "../file"], function(module, file) { /*...*/ });`
  声明模块的时候指定所有的依赖 dependencies，并且还要当做形参传到 factory 中，对于依赖的模块提前执行，依赖前置
 优点: 可以并行加载多个模块,适合在浏览器环境中异步加载模块
 缺点：

  1. 提高了开发成本，代码的阅读和书写比较困难，模块定义方式的语义不顺畅
  2. 不符合通用的模块化思维方式，是一种妥协的实现

### CMD(Common Module Definition)

 实现:Sea.js, coolie
 核心: 和 AMD 很相似，尽量保持简单，并与 CommonJS 和 Node.js 的 Modules 规范保持了很大的兼容性

 ```javascript
  define(function(require, exports, module) {
   var $ = require('jquery');
   var Spinning = require('./spinning');
   exports.doSomething = ...
   module.exports = ...
  })
  ```

 优点：

  1. 依赖就近，延迟执行
  2. 可以很容易在 Node.js 中运行
 缺点：依赖 SPM 打包，模块的加载逻辑偏重

### UMD(Universal Module Definition)

核心: 类似于兼容 CommonJS 和 AMD 的语法糖，是模块定义的跨平台解决方案

### ES6 模块

实现: Babel
核心: 设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
优点：容易进行静态分析,面向未来的 ECMAScript 标准
缺点：原生浏览器端还没有实现该标准,全新的命令字，新版的 Node.js才支持

## GCM: Google Cloud Messaging

应用的通知消息或信息从服务器发送到所有使用这个应用的安卓系统或Chrome浏览器的应用或拓展上。
国内android应用消息推送主要有: (国内谷歌都被墙了,自然不使用GCM)

1. 如QQ，长期驻留在系统后台并占用一部分内存来推送消息(通过后台清理应用并未实际清理该部分)
2. 第三方推送服务(注入SDK)
3. GCM服务.与第三方推送服务不同的是，它是系统层级的，第三方应用的服务器把消息发送给谷歌的服务器再转接到各个用户。IOS、Windows 10系统的消息推送亦是在应用未运行的情况下由第三方服务器转给苹果或微软的服务器，再推送给用户。

优点：
（1）快捷地获取消息、资讯和通知
（2）突破网络防火长城GFW的封锁
（3）节约内存、电量(获取消息不需要打开应用)
（4）完整Android系统的体验及克服Android系统碎片化

### 使用GCM

第一步，安装谷歌服务
第二步，将安装好的谷歌服务，包括Google服务框架、Google账户管理、Google Play服务和Play商店授予所有权限，并允许开机自启
第三步，拨号盘输入“*#*#426#*#*”，进入Google Play服务，在第四个按钮STATUS/EVENTS中可查看目前是否连接上以及连接日志
第四步，确保出现connected并且在Device ID后面出现一串数字
第五步，如果要开启某一个应用的GCM推送，确保它被允许开机自启
第六步，打开你需要开启GCM的应用，在应用的设置中找到消息推送按钮，确保它已经打开
第七步，修改GCM的心跳间隔为5分钟，以保证推送的时效性。通过一个应用即可一键完成

Android推送方案分析（MQTT/XMPP/GCM）

方案1、使用GCM服务
简介：Google推出的云消息服务，即第二代的C2DM。
优点：Google提供的服务、原生、简单，无需实现和部署服务端。
缺点：Android版本限制（必须大于2.2版本），该服务在国内不够稳定、需要用户绑定Google帐号，受限于Google。

方案2、使用XMPP协议（Openfire + Spark + Smack）
简介：基于XML协议的通讯协议，前身是Jabber，目前已由IETF国际标准化组织完成了标准化工作。
优点：协议成熟、强大、可扩展性强、目前主要应用于许多聊天系统中，且已有开源的Java版的开发实例androidpn。
缺点：协议较复杂、冗余（基于XML）、费流量、费电，部署硬件成本高。

方案3、使用MQTT协议（更多信息见：<http://mqtt.org/>）
简介：轻量级的、基于代理的“发布/订阅”模式的消息传输协议。
优点：协议简洁、小巧、可扩展性强、省流量、省电，目前已经应用到企业领域（参考：<http://mqtt.org/software），且已有C++版的服务端组件rsmb>。
缺点：不够成熟、实现较复杂、服务端组件rsmb不开源，部署硬件成本较高。

方案4、使用HTTP轮循方式(websocket是其替代品)
简介：定时向HTTP服务端接口（Web Service API）获取最新消息。
优点：实现简单、可控性强，部署硬件成本低。
缺点：实时性差。

GCM的主要特点：
1、它允许第三方的程序服务端发送消息到他们的安卓设备。
2、GCM不能保证消息的发送和消息的顺序。
3、手机端的程序不需要一直运行来接收消息。系统会通过Intent broadcast来唤醒程序当有新的消息到来时。当然程序需要设置适当的broadcast receiver和permission。
4、它不提供任何的用户界面或者其他的东西来处理消息。C2DM只是简单的把收到的原始消息传递给程序。这个程序提供了处理这个消息的方法。比如，这个程序可能抛出一个通知，显示一个自定义的界面或者只是同步数据
5、GCM要求手机必须运行Android2.2或者更高版本并且要有Google Play Store ，或者运行具有谷歌api 的Android 2.2虚拟机。但是，你不仅限于通过Google Play Store部署你的程序。
6、它使用一个现有的连接用于谷歌服务。对前置3.0设备,这要求用户在他们的移动设备设置他们的谷歌账户。Android 4.0.4或更高对于谷歌帐户是不要求的。

## CSS

### 视图宽高

#### Window

1. innerWidth,innerHeight : 窗体的内部宽度，不包括用户界面元素，比如控制台,菜单

2. outerWidth,outerHeight : 整个浏览器窗体的大小，包括任务栏等

3. pageXOffset,pageYOffset  :整个页面滚动的像素值（水平方向的和垂直方向的）滚动条位置

4. screenX , screenY :浏览器窗口在显示器中的位置

#### Screen

1. availWidth,availHeight : 显示器可用宽高，不包括任务栏

2. colorDepth : 显示器的颜色深度

3. pixelDepth : 该属性基本上与colorDepth一样

4. width , height : 表示显示器屏幕的宽高

#### documentView 和 ElementView

1. document.elementFromPoint(0,0) : 返回给定坐标处所在的元素
2. Element.getBoundingClientRect() : 得到矩形元素的界线

3. Element.getClientRects() : ???

4. Element.scrollIntoView() : 让元素滚动到可视区域（不属于草案方法）

5. Element: clientLeft, clientTop : 表示内容区域的左上角相对于整个元素左上角的位置（包括边框）

6. Element : clientWidth, clientHeight : 内容区域的高度和宽度，包括padding大小，但是不包括边框和滚动条。

7. Element : offsetLeft, offsetTop 表示相对于最近的祖先定位元素（CSS position 属性被设置为 relative、absolute 或 fixed 的元素）的左右偏移值

8. Element.offsetParent : 第一个祖定位元素（即用来计算上面的offsetLeft和offsetTop的元素）

9. Element.offsetWidth,offsetHeight: 整个元素的尺寸（包括边框）

10. Element.scrollLeft, scrollTop: 表示元素滚动的像素大小

11. Element.scrollWidth, scrollHeight: 表示整个内容区域的宽高，包括隐藏的部分。如果元素没有隐藏的部分，则相关的值应该等用于clientWidth和clientHeight。

#### 鼠标

1. m.clientX,clientY : 相对于window，为鼠标相对于window的偏移
2. m.offsetX, offsetY : 表示鼠标相对于当前被点击元素padding box的左上偏移值
3. m.pageX, pageY : 为鼠标相对于document的坐标。

4. m.screenX, screenY :鼠标相对于显示器屏幕的偏移坐标

5. m.x, y : 相当于clientX/clientY

## 备忘

### TODO List

mootools: 扩展浏览器原生对象
Modernizr: 识别浏览器对指定标签的指定某功能的支持情况
fullpage:基于jquery的全屏滚动插件
joomla,Drupal:CMS
WordPress:个人博客系统

npm包：
moment.js   js日期类处理库
moment-timezone.js  时区处理库
cheerio   字符型html内容进行同jQuery操作(目前只想到2种用法:1.数据包裹在hml内;2.模板操作)

Q: 获取上传文件File,用于显示,下载

1. new FileReader()

```javascript
var reader = new FileReader()
reader.onload = func
reader.readAsDataURL(file)
// reader.result  内容
// reader.readAsArrayBuffer()
// reader.readAsBinarryString()
// reader.readerAsText()

// Blob(b)
// blob.slice()
// blob.stream
// blob.text
// blob.arrayBuffer
```

2. 对象URL

```javascript
window.URL.createObjectURL()
window.URL.revokeObjectURL()

img.src=window.URL.craeteObjectURL(file)
img.onload = function(){
  window.URL.revokeObjectURL(this.src)
}

```

File对象来源:

1. inpuit元素FileList
2. 拖拽生成的dataTransfer
3. HTMLCanvasElement的mozGetAsFile()

File对象是特殊的Blob,可应用于FileReader,URL.createObjectURL,createImageBitmap,XMLHttpRequest.send

ReadableStream

1. 构造
2. Fetch的response.body

方法:
cancel()  取消源流则不可读取,取消目标流则会报错
getReader,getIterator  同异步读取器
pipeThrough,pipeTo

```javascript
fetch('url').then(response=>{
   const reader = response.body.getReader()
   const stream = new ReadableStream({
     start(controller){
       function push{
         reader.ready().then((done,value)=>{
           if(done){
             controller.close() 
             return
           }
           controller.enqueue(value)
           push()
         })
       }
       push()
     }
   })
   return new Response(stream,{
     headers:{
       'content-Type':'text/html'
     }
   })
})
```

npx: node软件包的执行工具
运行时默认到 node_modules/.bin路劲和环境变量$PATH检查存在
在不配置scripts时能直接执行npx mocka
执行一次性命令:当包不存在时临时下载安装

docusaurus: 基于React构造的站点生成器,静态网站生成器
yenv: 使用yaml文件管理环境变量
morgan: node环境http请求的中间件
cookie-parser,body-parser,express-session:express中间件
moment:时间格式
connet--mongodb-session:查找mongodb
helmet:express中间件,设置http头
colors:颜色打印
node-cron:定时执行
ajv:校验
