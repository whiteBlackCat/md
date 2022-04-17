# 记录

## 谷歌指令

chrome://histograms/DNS.PrefetchQueue  查看队列状态
chrome://histograms/DNS：查看从浏览器启动到上一页的DNS记录
chrome://dns：查看个域名DNS统计
chrome://net-internals/#dns：清除host缓存

## 根据文件头部字节数据判断bom

|  Bytes   | Encoding |
| :------: | :------: |
|  FE FF   | UTF16BE  |
|  FF FE   | UTF16LE  |
| EF BB BF |   UTF8   |

## 无题

- 作为默认参数的函数拥有独立作用域，变量甚至与全局作用域无关
- 打开powershell界面：shift+右击

## 命令行

### nginx简单操作

- 启动: nginx安装目录地址 -c nginx配置文件地址
- 停止:

 1. `ps -ef|grep nginx` 查看进程号;  `kill -QUIT[|-TERM] 2072` 杀死进程
 2. 强制停止: `pkill -9 nginx`

- 重启: 启动-c前加-t

### 查端口占用的进程

1. 获取pid: `netstat -aon | findstr :port`
2. 程序: `tasklist|findstr "pid"`
3. netsh http show servicestate

## 问答

Q: 浏览器设置关闭安全策略-允许跨域
A: 1. 命令行:谷歌浏览器目录下 `chrome.exe --disable-web-security --user-data-dir`
2. 创建快捷方式,修改属性目标增加参数 `--disable-web-security --user-data-dir`

## ES6

### Let,const

- 无变量提升,暂时性死区;不允许重复声明
- 块级作用域的出现使得立即执行函数不在必要
- Object.freeze() 冻结对象(连带属性)
- 全局对象开始不再是顶层对象的属性

### 数组解构

- let [f,...tail] = [1,2,3];   console.log(tail); //[2, 3]
- 数组扩展:具有Iterator接口转(类数组使用Array.from)数组
- Array.from二参:回调等同于map
- 注意：解构时使用”===”值是否存在,默认值也可以是表达式，但是要注意只有默认值在使用时才会触发函数（惰性求值）
- Object.is:与===基本同 但:一是+0不等于-0;二是NaN等于自身。

### 字符扩展

1. Unicode表示法
 ES5:\uxxxx 超出后强制转两个字符(前4一个,其余一个)
 ES6:\u{xxxx} 任何位置均能正确解读(即使在变量中)与四字节的 UTF-16 编码等价
let hello = 123;hell\u{6F} // 123  猜测在编译阶段进行替换
2. codePointAt(p)正确处理 4 个字节储存的字符，返回字符的十进制码点,配合for of 可以准确输出双字节字符,能用于判断字节是否为双字节
3. String.fromCharCode正确处理 4 个字节储存的字符，返回一个字符的码点。
4. At()可以识别 Unicode 编号大于0xFFFF的字符，返回正确的字符。
5. normalize() Unicode 正规化:将字符的不同表示方法统一为同样的形式
6. includes(), startsWith(), endsWith()
7. Repeat(n)将原字符串重复n次 取整,NaN为0,负数无穷报错
8. padStart()，padEnd(n,str) 在首/尾将str重复掺入至长度为n  补全数字,提示

### 标签模板

alert`123`   等同于  alert(123)
当模板内含有变量时,变的复杂 先处理成多参数,在调用
tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], a + b, a * b)
重要应用:过滤 HTML 字符串，防止用户输入恶意内容;
String.raw()作标签函数时:将变量替换,斜杠被转义

## 正则

- 具名匹配: (?<组名>)
`let re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/u;
'2015-01-02'.replace(re, '$<day>/$<month>/$<year>')  //'02/01/2015'`
- 向后断言: /(?<=y)x/

二进制:0b 八进制:0o
Number.isFinite/isNaN :非数值返回false
--.isInteger :JS精度 小数位53位 超出小数点后16位舍去
Number.EPSILON:浮点数最小可识别误差  用以控制误差范围
--.MAX_SAFE_INTEGER准确的整数上限
Math.trunc去除小数部分 --.cbrt计算立方根 --.clz32前导0个数
--.imul()两数相乘保留低位

默认参数惰性求值:每次使用时才访问其值(向上访问) 参数默认值位于尾部(不然没法省略)
使用默认参数不参与函数length  
函数做默认参数:
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}

foo() // 3
x // 1
含默认参数时,函数初始化时为参数形成独立作用域(y内x实为第一参数,在没有第一参数时才指向全局),函数内声明与参数同名由于作用域不同而不影响
参数不可省略:默认值为Error对象

Rest参数:替代arguments对象  末尾 不含length
使用结构,扩展,默认值后函数内部不能再使用严格模式(可以外部)

func.name:

1. 匿名函数: ''
2. bind: 'bound '+ funcName
3. 普通: funcName

Object.assign() 非对象在源位置除字符串均无意  不拷贝继承,非枚举属性  浅拷贝
  对于取值函数,先取值在拷贝
遍历对象属性:
for...in:循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）
Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。
//拷贝get,set钩子
const shallowMerge = (target, source) => Object.defineProperties(
  target,
  Object.getOwnPropertyDescriptors(source)
);
Object.create(obj1,obj2)返回以obj1为原型的对象obj2为描述属性
//混入模式
let mix = (object) => ({
  with: (...mixins) => mixins.reduce(
    (c, mixin) => Object.create(
      c, Object.getOwnPropertyDescriptors(mixin)
    ), object)
});

// multiple mixins example
let a = {a: 'a'};
let b = {b: 'b'};
let c = {c: 'c'};
let d = mix(c).with(a, b);

d.c // "c"
d.b // "b"
d.a // "a"
Object.setPrototypeOf() 设置原型
Super关键字 仅用于简写的对象方法中
对象解构赋值:使用扩展符  将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面,非原型属性
拷贝属性含原型:
const clone3 = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
)
Symbol对象也能做对象属性,且独一无二  参数是描述,即使描述相同也不相等
注意实例时无new(因为不是对象)  不参与运算 可转字符串,布尔值
作为属性用法:使用[].如:{ [s](arg) { ... } }
魔术字符串:代码中常见的使结构耦合的常量
Object.getOwnPropertySymbols获取对象的symbol属性 公开但不易访问
.for()
Set 类似数组成员唯一
通过add()添加成员, 初始化时可接受数组  size返回成员个数
支持扩展运算(便捷的数组去重) 成员类型不会转换,但NaN相等
操作方法:Delete,has,clear
遍历方法:keys,values,entries,forEach 遍历顺序即是添加顺序
Weakset:成员必对象,弱引用(不计入对象引用,成员可能随时被回收,不可遍历) 无size
Map:hash结构键值对
键可以是对象 set,get,has,delete  数据初始化:具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构

Proxy:修改某些操作的默认行为,属于元编程
New proxy(target,handler)
例:
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});
//是否只有get和set钩子?  具有Object.defineProperty部分功能
可拦截操作:

get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。实例访问的是hasproperty属性,同时对for...in不生效
deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。
实现功能如:读取负数索引,链式调用,通用dom节点生成器(有点意思),
Yahali:当对象不可配置,不可重写时便不可代理,数据验证,保护内部属性

Reflect:
1.可以使用某些语言内部方法
2.使某些Object方法返回结果更加合理
3.使命令式操作变为函数行为
4.Proxy与reflect方法一一对应(总能在reflect上找到默认行为)
Reflect.get(target, name, receiver) receiver的作用:当target部署getter时,其内部的this会指向receiver
New promise(fuction(resolve,reject){
//do something and decide state
Resolve(12)
}).then(funcResolve,funcReject)
值得一提,then回调一定在该脚本同步任务后执行
Resolve参数为promise时,该返回的promise状态依赖于之前promise
Then方法返回的是promise实例,因此可采用链式调用
//关于then的链式调用可以研究下,当非promise和promise对后续then影响
Catch等同于then二参,错误会冒泡(除非被处理,不然一直后传 这里的错误除reject外还包括error,或者reject就是throw error),仅在promise内(不影响后续代码),可读性更强
Finally 不论成功失败
All接受由promise组成数组 当全fulfilled状态时返回由promise resolve组成数组,否则返回第一个reject值  注意:含iterator接口,成员为promise对象亦可;非promise对象会使用promise.resolve进行转换
Race 基本同all,返回第一个reject或resolve
Resolve promise直接返回,对象有then方法会被调用,之外返回并立即resolve(本轮事件结束)
Reject,基本同上
Try 包装后的(同/异步)函数具有统一异步的then,catch处理方式(promise.resolve则固定在本轮事件结束后;async返回对象可以使用then(此时不能捕获异常),catch)
Iterator 作用:为数据结构提供统一的访问接口,成员按某种方式排序,for...of循环
接口: [Symbol.iterator] = function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
};
原生具有iteraor数据结构:Array,Map,Set,String,TypedArray,函数的 arguments 对象,NodeList 对象
使用改接口操作:for...of,扩展运算,yield,
可选的return(循环提前退出 break,continue,error)及throw(配合generator)方法
迭代器（Iterators）
for-of与for-in
for-of最大的特点便是保证迭代顺序，忽略其他属性（非数字？？）
要求：迭代对象拥有Symbol.iterator属性，[Symbol.iterator]值是一个需要返回一个类似于{ next: function () {} }的对象的函。每次调用next(),他返回{value: …, done: [true/false]}的对象
for-of循环首先调用集合的[Symbol.iterator]()方法，紧接着返回一个新的迭代器对象。迭代器对象可以是任意具有.next()方法的对象；for-of循环将重复调用这个方法，每次循环调用一次。
完整如下：
table[Symbol.iterator] = function () {
  var keys = Object.keys(this).sort();
  var index = 0;

  return {
    next: function () {
      return {
        value: keys[index], done: index++ >= keys.length
      };
    }
  }
}
内置迭代器：String，Array，TypedArray，Map和Set
（// 基于单词数组创建一个set对象    var uniqueWords = new Set(words);
Map对象稍有不同：内含的数据由键值对组成，所以你需要使用解构（destructuring）来将键值对拆解为两个独立的变量：
for (var [key, value] of phoneBookMap) {
   console.log(key + "'s phone number is: " + value);
}）
// 向控制台输出对象的可枚举属性
for (var key of Object.keys(someObject)) {
  console.log(key + ": " + someObject[key]);
}？？？
解构操作同样也接受一个迭代器：
var hello = 'world';    var [first, second, ...rest] = [...hello];
console.log(first, second, rest); // w o ["r","l","d"]
无限迭代器
只要永远不返回done: true，就实现了一个无限迭代器。当然，需要极力避免出现这种情况。
var ids = {
  *[Symbol.iterator]: function () {
    var index = 0;

    return {
      next: function () {
        return { value: 'id-' + index++, done: false };
      }
    };
  }
};

var counter = 0;
for (var value of ids) {
  console.log(value);

  if (counter++ > 1000) { // let's make sure we get out!
    break;
  }
}
明白普通对象使用for-of，done的作用
迭代器对象也可以实现可选的.return()和.throw(exc)方法。如果for-of循环过早退出会调用.return()方法，异常、break语句或return语句均可触发过早退出。如果迭代器需要执行一些清洁或释放资源的操作，可以在.return()方法中实现。
生成器（Generators）
是个状态机,返回可遍历对象(调用该对象next方法,取出首个或上个yeild后的值直到return)
它是一个可以暂时退出，并且稍后重新进入继续执行的函数。在多次的进入中，它的上下文（绑定的变量）是会被保存的。？？？
写法:function*funcName(){} 尽管未规定*左右空格情况 推荐紧跟function关键字后,并与函数名隔一空格    内部通过yeild,return定义遍历值
具有暂缓执行,惰性求值特性
Yeild关键字只是用在generator中,用在表达式中需括号;赋值运算,函数参数则不需
Next方法参数:yield表达式只会得到undefind,而next参数会取代上次yield结果进行计算
例:
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b
第一次next(),运行到yeild所在行为止
第二从next(),函数返回yeild后值,而next参数代替yeild参与计算
使用 for of时注意,由于return得到的对象done为true,该值不会计入for of结果
Generator可以为普通对象添加iterator接口:
方式:1.generator处理该对象;2.该对象iterator方法为generator函数
throw方法:
函数外的错误内被函数内捕获,但:
1.必须通过生成器返回对象调用(throw Error()只会触发全局捕获)
2.只会捕获一次(由于惰执行特性,只有在上次yeild之后的catch会触发,很早之前?)
3.需要先执行一次next()
4.throw方法被捕获以后，会附带执行下一条yield表达式
Return方法:返回return参数,并终止遍历,但若有try...finally,则等到finally代码块执行完在执行
yeild*表达式:将自动遍历一个遍历器对象,将每个遍历结果以yeild 结果形式原地输出;整个yeild*值为遍历器内return值
实例:
function*foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function*bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}
Generator作为属性时:* myGeneratorMethod() {}/myGeneratorMethod: function*() {}
构造器对象能获得prototype,但this对象不会指向它(注意与构造函数区别)
应用:异步函数同步化
例:
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
//说说赶脚:将所有流程放入生成器内,使用next启动,对于异步操作(这里就是ajax请求)使用yeild暂停,ajax内部使用next()继续并传回res   手动分开流程可能会比较痛苦
//node下的异步回调首参为err? 因为原上下文环境消失,无法俘获
//Thunk函数有些类似科里化  thunkify模块(npm)
//作用:与generator结合,自动化流程(每次yeild异步thunk)
例:function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

var g = function* (){
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
};
run(g);

co模块:自动化处理异步
例:
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
  });
}
function next(ret) {
  if (ret.done) return resolve(ret.value);
  var value = toPromise.call(ctx, ret.value);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  return onRejected(
    new TypeError(
      'You may only yield a function, promise, generator, array, or object, '
      + 'but the following object was passed: "'
      + String(ret.value)
      + '"'
    )
  );
}
应用co块例:
const co = require('co');
const fs = require('fs');

const stream = fs.createReadStream('./les_miserables.txt');
let valjeanCount = 0;

co(function*() {
  while(true) {
    const res = yield Promise.race([
      new Promise(resolve => stream.once('data', resolve)),
      new Promise(resolve => stream.once('end', resolve)),
      new Promise((resolve, reject) => stream.once('error', reject))
    ]);
    if (!res) {
      break;
    }
    stream.removeAllListeners('data');
    stream.removeAllListeners('end');
    stream.removeAllListeners('error');
    valjeanCount += (res.toString().match(/valjean/ig) || []).length;
  }
  console.log('count:', valjeanCount); // count: 1120
});

async : Generator 函数的语法糖。
不同:*换成async,yeild换成await
特点:
1.内置执行器(普通调用,无需next)
2.语义更强
3.实用性 可以await原始类型数据   返回便是promise
当循环await异步时,async与await结合比仅await更快(下一个不用等带上一个处理完才开始)
例:
urls.map(async url => {
    const response = await fetch(url);
    return response.text();
  });
非:
 for (const url of urls) {
    const response = await fetch(url);
  }

异步遍历器:调用next但会promise resolve后返回具有value,done对象.next方法可以连续调用不必等待返回值
for await...of遍历具有asyncIterable接口
例:for await(const data of req) body += data;
异步 Generator 函数:返回异步遍历对象,统一异步同步遍历方法
例:async function* gen() {}

Class:创建对象的语法糖(使其看上去同Java)
定义例:
class Point {
  constructor() {
//做构造函数会做的事
  }

  toString() {
    //这是个原型方法例  但会变得不可枚举
  }
}
//注意没有’,’分隔   强制要求new运行
Class表达式可以赋值,new立即执行,不会提升
变通:以call调用类外方法,symbol
类方法单独使用时:绑定this,箭头函数,proxy
静态方法:static关键字 只能通过类调用,不会被实例继承(类通过ectend可以),其内this指向类,可与普通方法同名
静态属性:外部赋值
Class内当使用new实例化时,new.target存放class名否则undefined
类继承:class ColorPoint extends Point
Constructor内super方法表父类构造函数,(由于ES6子类this是通过修改父类this得到)子类实例化时必须先调用super(),再添加属性作用等同于:A.prototype.constructor.call(this);
Super作为普通对象调用方法时,指父类原型(于是父类实例属性是获取不到的),其内this仍指向子类;赋值时指向子类,取值时指向父类;此时使用范围也不局限在类中
子类方法:子类静态方法可直接通过子类(内部this也指向子类而非子类实例)调用;自类实例方法,需实例化后调用
相关方法:Object.getPrototypeOf
Object.setPrototypeOf(B.prototype, A.prototype)实例继承 setPrototypeOf(B, A);属性继承
ES6支持继承原生构造函数,ES5不能
Mixin:混合多个对象为一个对象
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix.prototype, mixin); // 拷贝实例属性
    copyProperties(Mix.prototype, Object.getPrototypeOf(mixin)); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

### DOM API

- TextDecoder 数据转码: new `TextDecoder('utf-8').decode(bytes)`

追踪用户脚本：
 1.反弹：将目标地址传给中间页，最后跳至目标页；2.Beacon API： navigator.sendBeacon('/log', 'foo=bar')；3.a元素ping属性

淘宝镜像: npm install cnpm -g --registry=<https://registry.npm.taobao.org>

## Vue

### path

描述地址的对象:

1. 字符串: 'home'
2. 简单对象: { path: 'home' }
3. 搭配1: { name: 'user', params: { userId: 123 }}
4. 搭配2:  { path: 'register', query: { plan: 'private' }}
5. Path实现params: { path: `/user/${userId}` }

动态参数实现可由name+params或者path;查询参数有path+query

### 保留变量(可以直接使用)

- 循环时 `$index`
- 事件处理函数入参 `$event`

### 导航解析流程

1. 失活的组件里调用离开守卫。
2. 调用全局的 beforeEach 守卫。
3. 在重用的组件里调用 beforeRouteUpdate 守卫
4. 在路由配置里调用 beforeEnter。
5. 在被激活的组件里调用 beforeRouteEnter。
6. 全局的 beforeResolve
7. afterEach 钩子。
8. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

### 组件缓存

代码:

``` html
<component :is="currentView" keep-alive>
  <!-- 非活动组件将被缓存 -->
</component>
```

钩子: activate
触发时机: 动态组件切换或静态组件初始化渲染

## python

- 库镜像: `pip install -i https://mirrors.aliyun.com/pypi/simple  scrapy`

## jQuery

### Tween

```javascript
function Tween( elem, options, prop, end, easing ) {
  return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;
Tween.prototype = {
  constructor: Tween,
  init: function( elem, options, prop, end, easing, unit ) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || "swing";
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  },
  // 获取css特征值:
  cur: function() {
    var hooks = Tween.propHooks[ this.prop ];
    return hooks && hooks.get ?
    hooks.get( this ) :
    Tween.propHooks._default.get( this );
  },
  run: function( percent ) {
    // 计算动画当前进度pos和动画当前位置now
    //如果有动画时长则使用jQuery.easing计算出缓动动画进度eased，否则进度eased为percent
    //并根据进度得到当前动画位置now
    if ( this.options.duration ) {
      this.pos = eased = jQuery.easing[ this.easing ](
        percent, this.options.duration * percent, 0, 1, this.options.duration
        );
    } else {
      this.pos = eased = percent;
    }
    this.now = ( this.end - this.start ) * eased + this.start;
    // 2.根据当前进度情况设置css特征值
    if ( hooks && hooks.set ) {
      hooks.set( this );
    } else {
      Tween.propHooks._default.set( this );
    }
    return this;
  },
  tick:function() {
    length = animation.tweens.length;
    for ( ; index < length ; index++ ) {
      animation.tweens[ index ].run( percent );
    }
  }
};
Tween.prototype.init.prototype = Tween.prototype;
```

核心流程：

1. 先根据参数调用jQuery.speed获取动画相关参数，并且生成动画执行函数doAnimation使用.queue压入队列并马上执行
2. doAnimation中调用创建一个延时对象，使用延时对象的promise方法构造一个动画对象animation（延时对象+动画特征列表），最后给animation添加动画执行完成后的回调函数。
3. 调用jQuery内部函数proFilter修正css特征名以便能被当前浏览器识别，并将某些复合css特征分解（比如padding分解成paddingTop / Right/ Bottom/ Left）.
4. 调用jQuery内部函数defaultPrefilter做动画能够正常运行前提条件修正,
对于show/hide动画，在之前就调用genFx将需要执行动画的css特征提取了出来，在defaultPrefilter函数里直接调用动画对象animation.createTween给每一个CSS动画属性添加对应的缓动动画对象（包括动画参数和动画函数如run）压入缓动动画组animation.tweens中
5. 调用jQuery内部函数createTweens将除开show/hide之外的动画每一个css动画特征使用animation.createTween创建缓动动画对象（包括动画参数和动画函数如run），压入缓动动画组animation.tweens中
6. 启动动画计时，在每个时间点上执行tick函数来给相应的css特征值设置运动值。其中css特征值运动的进度百分比是
remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
temp = remaining / animation.duration || 0,
percent = 1 - temp
7. 得到的percent是符合时间规律的。代入这个percent设置准确的css特征值，以刷新动画显示。
8. 动画完成后调用动画完成回调。

chrome具有override功能,能进行本地文件替换

v-if:组件初始化,组件显隐
fiddler路径匹配只输入路径更便捷

位运算
正整数取余: n&(2**m-1)
除法:n>>m   -->  n/(2**m)

void 0 --> undefined

调试时断点的watch,callstack要善用

Node环境下输出完整日志

1. util.inspect(obj,{showHidden:false,depth:null})
2. console.dir(obj,{depth:null})
3. JSON.stringify(obj,null,4)

路由懒加载:
const Foo = ()=>import(/*webpackChunkName: Foo*/ './Foo.vue')

arr1+arr2 --> arr1.concate(arr2).join('')

快速格式化定长数组
Array.from({length:13},(v,i)=>i)

CSP策略:Content-security-policy
站点管理员允许指定page能否被用户代理加载

异或运算:
a^a=0
0^a=a

1. 交换: 两个变量连续3次异或运算可以交换值
2. 加密: text^key=chiperText
   chiperText^key=text

parseInt(2.1231231e-9) --> 2
[0,0,0,0].map(parseInt)  --> [0,NaN,0,0]
num.toString(n): 十进制转换n进制
parseInt(str,n): n进制转十进制

技巧:

1. 若N=a*b,N极大,a在较大范围内,则应该通过b在较小范围内遍历反向求a

bigInt:

1. 123n
2. BigInt(123)

图存储:
邻接表 O(m)
定义数组 u,v,w存放边起,终点  下标指第几条边
first,next存放首次边,历史边  下标指起点编号

输入:
第一行: 点数 边数
边数行: 起点 终点 权重
`
4 5
1 4 9
4 3 8
1 2 5
2 4 6
1 3 7

`

=>

| 边号 | U   | V   | W   | first | next |
| ---- | --- | --- | --- | ----- | ---- |
| 1    | 1   | 4   | 9   | 5     | -1   |
| 2    | 4   | 3   | 8   | 4     | -1   |
| 3    | 1   | 2   | 5   | -1    | -1   |
| 4    | 2   | 4   | 6   | 2     | -1   |
| 5    | 1   | 3   | 7   |       | 3    |

城市化的事件侦听器

```javascript
mounted:function(){
  var picker=new PickerDay({
    field:this.$refs.input,
    format:'YYYY-MM-DD'
  })
  this.once('hook:beforeDestroy',function(){
    picker.destroy()
  })
}
```

$forceUpdate()

vue过度动画:
v-enter, v-enter-active, v-enter-to,
v-leave, v-leave-active, v-leave-to
当指定name时,v由name替代,如fade-enter
需指定上述同名的类名样式

vuw混入mixins:分发Vue组件可复用功能
选项合并特点:浅合并,组件优先
钩子合并:成数组,依次调用

```javascript

for(let i=0;i<5;i++){
  requestAnimationFrame(()=>console.log(i))
}

// 0 1 2 3 4
// let 会生成块作用域
```

null,undefined互相比较为true,其余值比较为false

void用法:

1. void 0 替代undefined
2. 在url内执行函数,会忽略返回值

数据类型 String,Boolean,Number能做函数调用
+[]===0:

1. [].valueOf -> []     [].toString -> ''
2. +'' -> 0

vue的自定义filter是即答函数,不能访问this
arr.fill传入字面量对象,生成的对象是同一个

DOM的File aip:
获取文件:dom.files
事件处理器: this.files
drop事件处理器:e.dataTransfer.files

结合new FileReader().readAsDataURL(file)及imgObj.src = result实现拖拽上传及预览
dropEnter,dropStart,drop事件应阻止冒泡

URL.craeteObjectURL(blob) 将二进制数据转url
使用完释放:URL.revokeObjectURL(obj_url)

scrollTo 调整滚动条

CMS（Content Management System）内容管理系统：Joomla，Drupal，Xoops
mySQL管理工具：phpmyadmin、navicat、mysql administrator

### 码点

将码点(code point)对应所有字符
'U+'接十六进制编码
目前17个plane,每个plane存放2^16个字符
决定码点的字节序就是编码方法: 比如UTF-32 4个字节表示1个字符  完全对应unicode码,但浪费空间(HTML文件便不能使用该编码方式)
UTF-8:变长的(不同字符的字节长度1~4)编码方法
UTF-16:基本平面的字符占用2个字节，辅助平面的字符占用4个字节
 辅助平面字符解读方式:
  在基本平面内，从U+D800到U+DFFF是一个空段，这个空段便用来映射辅助平面的字符。
  UTF-16将辅助平面的2^20位拆成两半，前10位映射在U+D800到U+DBFF（空间大小210），称为高位（H），后10位映射在U+DC00到U+DFFF（空间大小210），称为低位
  所以，当我们遇到两个字节，发现它的码点在U+D800到U+DBFF之间，就可以断定，紧跟在后面的两个字节的码点，应该在U+DC00到U+DFFF之间，这四个字节必须放在一起解读。

JavaScript编码:UCS-2编码,UTF-16是其超集
