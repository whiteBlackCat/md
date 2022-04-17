## 语法规范:
1. 数据模板: DTD
2. 数据占位符:DPD
3. 末班规则:’name|rule’:value
4. rule包括:mix-max, count, mix-max.dmix-dmax, min-max.dcount,Count.dmin-dmax, count.dcount, +step


### 数据模板DTD 基本示例
    Mock.mock({
      'name|1-3':'a',   //生成1到3个a
      'name|+1':4,    //初始4,循环加1
      'name|1-4.5-8':1,//生成整数1-4,小数5-8的数
      'name|1-3':true, //1/4是true
      'name|1-3':obj,  //随机从obj寻找1-3属性
      'name':fun,     //返回函数返回值
      'name':reg,     //正则反向生成对应字符串
    }) 


> 核心方法:
####
    Mock.mock(rurl?,rtype?,template|function(opt))  // 将template对应数据返回
    rurl:ajax请求的地址
    rtype:ajax请求的类型，如’GET','POST'
    template:数据模板，就是之前那些个例子
    function:生成相应数据的函数

    Mock.setup(setting)  配置拦截ajax请求的行为，支持的配置项有timeout
    Mock.valid(template,data)  判断数据模板和数据是否一样
    Mock.toJSONShema(template)  把template风格的模板转成JSON Schema
    Mock.Random 生成各类型数据

> 函数:
<pre>
var Random = Mock.Random;
基本用法:
Basic:
Random.boolean(min?max?current?) 一定概率生成布尔值
实例:  
Random.boolean(1,2，false) //1/3的可能性是false 2/3是true
Random.natural(min?,max?)  //随机生成一个自然数   Integer 整数
Random.float(min?,max?,dmin?,dmax?)  //整数部分最小值最大值，小数部分最小值最大值
Random.character(pool?)  
pool值:
upper: 26个大写字母
lower: 26个小写字母
number: 0到9十个数字
sympol: "!@#$%^&*()[]"
Random.string(pool?,min?,max?)  默认3到7位字符  从一参字符串选择min-max个
Random.range(start?,stop,step?) //返回整数数组

Date:
Random.date(format?)  返回值随机格式指定的日期  time/datetime/now

Image:
Random.image(size?,background?,foreground?,format?text?) size有选取范围
Random.dataImage(size?,text?) base64编码

Color:
Random.color()  hex/rgb/grba/hsl

Text:
Random.paragraph(min?,max?,len?)  sentence:首字母大写 word,title  c前缀返中文

Name:
Random.first  last/name  c前缀中文

Web:
Random.url(protocol?,host?)  随机生成url    protocol/domin/tld/email/ip

Address:
Random.region()  随机生成大区   province/city/country/zip(邮编)

Helper:
Random.capitlize(word)  upper/lower
Random.Pick/shuffle(arr)

Miscellaneous
Random.guid()  生成guid    id身份证

</pre>