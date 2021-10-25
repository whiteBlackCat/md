控制台监控angular：
1.获取scope：angular.element(targetNode).scope() 
     Isolated scope： angular.element(targetNode).isolateScope()
2.监视scope tree（Baratang 和 ng-inspector 这两个 Chrome 浏览器扩展）
3.抓取 Services (服务)：使用定义了 ngApp 元素的 injector 函数来抓取任何 Service   		(服务) 或者间接的通过任何带有 ng-scope class 的元素来获取 Service (服务)。
       angular.element(document.querySelector('.ng-scope'/’html’)).injector().get('MyService')
4: 从 directive(指令) 中获取 controller
    angular.element('my-pages').controller()
5: Chrome Console(控制台) 特性
 $0 - $4: 在 instpector window (监控器) 中获取最后的 5 个 DOM 元素。如：angular.element($0).scope()
   $(selector) 和 $$(selector): 可以方便的替代 querySelector() 和 querySelectorAll。

$timeout/$interval:用法相同，但返回promise对象
移除： $interval.cancel($scope.timer);  多在路由（页面）切换$scope.$on('destroy',function(){})

自定义指令：
内容复杂，所以加上例子
<body>
 <div my-hello></div>
</body>
<script type="text/javascript">
var m1 = angular.module('myApp',[]);
m1.directive('myHello',function(){
   return {
    restrict : 'A',
    replace : true,
    template : '<div>hello angular</div>'
   };
});
</script>
//注意指令写法，要求估计同JS
这是个my-hello的指令。有3值：
restrict E：标签指令，C：class指令，M：注释指令，A：属性指令（将指令解析为类名，注释，属性，标签）可多写
replace是否替换：替换则原标签消失，false则在原标签内插入
Template 内容，除此之外还有templateUrl，指定一个html模板文件。
Scope 默认是false，为true表示独立作用域。
给予一个对象时，表示执行绑定策略，在template上调用这些数据。
　　  a)：我们在DOM元素上my-id，我们使用@符号，表示解析普通字符串，说白了就是你写什麽就是什麽。
　　  b)：使用=符号，表示解析数据。
　　  c)：使用&符号，表示这绑定一个函数。
Controller：用于共享指定scope数据（函数）
link属性，表示当directive被angular编译后，执行该方法。这个方法接受三个参数，
a)：scope表示controller下面的数据。
b)：element表示当前的DOM元素。
c)：attr表示这个DOM元素上的自定义属性。
 transclude : true, //允许自定义指令的嵌套，通过ng-transclude指定嵌套的范围
 require : '^hello',//hello指令属性hi指令的父级，需要用^符号指定。如果无法指定，使用?容错处理。

视图传参：
1、在首页视图的”/”后面添加要传递的实参。 
2、在路由配置中的路由路径中定义一个变量用以匹配，格式为/:varible 。 
3、配置控制器，将$routeParams 注入到控制器当中。 
4、在控制器中进行赋值。$scope.params=$routeParams; 。 
5、在路由完成后的视图中成功显示出该实参。 <h3>{{params.age}}</h3>
需要注意的一点是，该实参是作为一个键值存在$routeParams里面的，必须通过访问他所对应的变量（在这里是age），才能得到该值。
<!--首页html-->
<li><a href="#/user/18" rel="external nofollow" rel="external nofollow" >用户</a></li>
//js
.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/user/:age',{//注意这里与#/user/18的联系
        templateUrl:'list.html',//目标网页
        controller:'listController'})//目标控制器
 }]);
<!--list.html-->
<div>
  <div>
  <h1>HI,这里是list.html</h1>
  <h2>{{name}}</h2>
  <h3>{{params.age}}</h3>
</div>
</div>
将该实参放到视图路由地址后面。然后在JS的when方法中声明该一个变量用来匹配该实参。但是该实参是作为一个“键值”保存在$routeParams （数组）里面，我们必须在控制符中注入它（所谓注入其实就是把他里面的属性和值都共享出来？）。然后在控制器中声明并赋值，（也即是取出来）。如下：
.controller('listController',function($scope,$routeParams){
  $scope.name="ROSE";
  $scope.params=$routeParams;
});


动态WEB应用设计的结构框架
第一次元素渲染在编译后
ng-app初始化应用程序 =“xxx”加载xxx模块，无则加载非特定模块  声明所有者，所有angular操作须在其内
（网页中可有多个应用称程序，此法只启动第一个。abgular.bootstrap()启动多个）  
{{expression}}：在作用域内，可访问$scope  不能使用if/else（可以三目） 过滤器允许
ng-init:初始化数据  
ng-bind:同表达式  特点初始化时页面无“{{}}”
ng-model：将作用域的属性同指定元素绑定     （自动将input，select，textarea的value赋给指定属性咯） ng-model 指令把元素值（比如输入域的值）绑定到应用程序。ng-model 指令 绑定 HTML 元素 到应用程序数据  ng-model 指令可以为应用数据提供状态值(invalid, dirty, touched, error):{{myForm.myAddress.$valid}}
ng-model 指令基于它们的状态为 HTML 元素提供了 CSS 类：ng-empty ng-not-empty ng-touched ng-untouched ng-valid ng-invalid ng-dirty ng-pending ng-pristine 这些会根据ng-model绑定的html元素状态添加/删除相应的类名
ng-show，ng-if：根据变量的boolen决定是否显示 区别：前者通过display后者移除节点
ng-click：点击执行相应代码（支持dbl-click,mousedown/enter/move,keydown/up/press,change）
ng-switch:类似JS  ng-switch="var"  ng-switch-when="val"  ng-switch-default
ng-repeat:="property in obj"  遍历obj（似乎允许es6的对象解构）$index:返回序号  $first/last：返回boolen
    obj含重复属性时报错，可添加track by $index解决
ng-style：将对象做css   注意使用JS下写法
ng-class:直接添加类名（变量值）；根据boolen判断{true:'box2',false:'box3'}[bol];
     各自判断：{'box1':isC1,'box2':isC2,'box3':isC3}

控制器：函数，添加功能  视图与作用域桥梁   适合一个独立容器  不适DOM操作，数据     


创建模块：var app = angular.module(name,array)//name即xxx   
       app.controller("controllerName",["$scope",function($scope){
	$scope.name=...;
}])
app.run(["$rootscope",function($rootscope){}])//注入形式为字符串  
内联式注入：上例     简单  不能进行压缩混淆（形参改变，不知实参）
推断式注入：无数组，function前的$scope去掉

作用域：app处$rootscope，除隔离作用域均可访问父级作用域
过滤器：根据传入的参数返回新数组   管道符“|”+filterName
自定义过滤器：app.filter("myFilter",function(){
  return function(val){
    console.log(val);
return val;//返回页面的值  可在此修改如 val.toUpperCase();
}
})
在ng-repeat中使用filter：|orderBy：property1：boolen  根据属性1排序，是否逆序
         |limitTo：number   字母个数 负数从右开始
         |filter：“str”  筛选含str元素
	|currency：“￥”   date   number   uppercase lowercase   首参符号 二参位数
自定义（元素）指令：
app.drective("myDirective",function(){
return{
template:<div><h1>自定义指令{{name}}</h1></div>,
link:function(scope,ele,attrs){//可进行简单JQ操作  scope该指令的作用域  ele目标元素
scope.name="1qwwe";}}}）
指令嵌套：
<first-directive>
  <second-directive third-directive></second-directive>//一指令无模板，故可有子级，二指令不行。一为二三父，二三同
</first-directive>
app.directive("firstDirective",function(){//指令名驼峰，html中-
return{//配置项
controller : ["$scope,function($scope){
$scope.firstName = "first";
this.info = {//这里this是因为要被别的指令调用
name : $scope.firstName,
age :30}
}]
}
})
app.directive("secondDirective",function(){
return{
template:<div><h1>第二个指令</h1></div>,//可以是函数，要求返回字符  参数：元素（数组？） 属性
require:"?^thirdDirective",//^同级?上级查找
link:function(scope,ele,attrs,ctrl){console.log(ctrl.name)}//若无require属性，ctrl为undefined
}
})
app.directive("thirdDirective",function(){
return{
restrict:"A",
require:"?^firstDirective",
link:function(scope,ele,attrs,ctrl){console.log(ctrl.info)}
}
})
link函数：将作用域与DOM进行连接，也可对已编译的DOM进行事件监听
参数：scope，ele，attrs，ctrl（要求指定require属性，否则undefined）被依赖的指令
link函数内可使用JQuery
templateUrl：String（函数）  模板路径
replace：Boolean   是否将模板标签替换（删除指令标签，默认false，仅插入）
restrict：渲染模式   E 标签   C 样式   A 属性    M 注释  默认“EA”
scope：：当使用字符串时，要求控制器已被注册  默认false，可访问父级、修改父级作用域（不严谨）
	true：创建继承父级作用域（仅在生成时访问，之后不能修改）
	{}：隔离作用域，不再继承   通过标识符引用元素指令   @ 单向绑定   用法：键 当前作用域访问的变量
	值 @+引用父级的变量省略则通过键名索引 值      = 双向绑定 用法同@  父级属性值不加{{}} 变量
	&： 方法同上  传方法 参数必对象，形参为键，实参为值   指令中的scope引用父级的属性名！！！进而访问属性值
transclude：boolean  是否保留原标签（指令渲染模式为A可以，E？）要在template中添加一个含ng-transclude属性标签
$http:原生XMLHttpRequest封装，返回promise对象（回调用sucess之类）  路径为String  
	使用方法：.get()put post head delete jsonp，将method，url放入对象做参数    success的res等同于then的res.data
	config对象：method url param（object）转换为查询字符窜放在URL后   data（object）消息体发送给服务器  timeout延迟发送时间 responseType 预期返回数据格式
生命周期：
编译阶段：遍历指令，返回模板函数（此时的DOM并未渲染，修改DOM开销不大）
链接阶段：数据与DOM绑定


路由：
首先引入angular-ui-router.js文件
其次初始化模块不同   var app = angular.module("moduleName",["ui.router"]);//数组参数dep依赖模块  另外仅一个参数获取模块
配置模块 app.config(["$stateProvider","urlRouterProvider"(//可选),function($stateProvider,$urlRouterProvider){
$stateProvider.state("home",{//about路由名
	url:"/home",//路由地址   实际只是原页面的hash值因此不会真正刷新页面
	template:"<h1>首页</h1>" //显示内容
}).state("about",{
	url:"/about",
	template:"<h1>关于我们</h1>"
}).state("items",{
	url:"/items",
	templateUrl:"./items.html",
	controller:["$scope","$state",function($scope,$state){
		$scope.jump=function(){ $state.go("home")}//跳转到路由home
	}]
}).state("items.com",{
	url:"/com",
	template:"..."
}).state("items.other",{
	url:"/other/:type",//路由参数
	template:"...",
	controller:["$scope","$stateParams","$state",function($scope,$state,$stateParams){
		console.log($stateParams);//输出路由参数
		$scope.jumpOther=function(){$state.go("items.other",{type:"123"})}//另一种路由穿参
	}]
});
$urlRouterProvider.otherwise("home");//路由重定向至home  初始路由
}])


使用：
<div ui-view></div>  //ui-view  路由渲染地方
<footer>
  <a ui-sref="home"><a>  //各个路由链接  ui-sref=路由名
  <a ui-sref="about" ui-sref-active="active"></a>//当路由激活时启用的样式（类名）
</footer>	


items.html  部分
<div class="">
	<h1></h1>
	<button ng-click="jump()"></button>
	<a ui-sref="about"></a>
	<ul>
		<li><a ui-sref="items.com">1</a></li>//二级路由  此路由显示的内容在下方的ui-view中
		<li><a ui-sref="items.hone">1</a><li>//位置在一级路由下方
		<li><a ui-sred="item.other"></a></li>
	</ul>
	<div ui-view></div>
</div>

脏查询$digest  
每个模型与视图绑定，angular便创建监听放到监听列表。触发脏查询，angular遍历$watch列表，若有值发生变化
应用退回$digest循环，直至该值不再变化，再启用新值继续遍历。若全部值不再变化，才在view中渲染

何时触发：angular系统方法，如：controller初始化，ng-指令，事件执行后（于是settimeout改变某值，不会有反应）

$scope.$apply()  手动触发脏查询   不添加参数，查询当前scope内所有属性方法    建议将不触发脏查询的操作作为匿名函数当其参数
$scope.watch(str,func) 一参查询变量  二参回调（新旧值） 
$timeout,$interval  替代相应方法   要求注入，触发脏查询

依赖注入Dependency Injection   调用者（client）使用服务接口，具体的服务查找创建由注入者负责
注入：将被依赖对象（Service）实例传给依赖对象的行为
注入过程：
1、通过函数参数列表得到模块依赖项
2、查找依赖项所对应的对象
3、执行时注入对象
只有controller能注入$scope

factory：将函数返回值注册以便注入（被注册的函数便可以在任何想要的地方注入使用）
service：调用时，angular会使用new，返回实例（类似构造函数）  数据持久化共享如与后台通信，控制器通信
value：简单赋值  value("defult",100)
constant:静态常量  constant("PI",3.14)   能注入config
provider:供应商  注册各种服务 能注入config要求服务名+Provider的形式
	使用：provider模块，在config中注入$provider,调用其provider方法

由于使用了iis服务，localhost：80已被占用


路由能将各页面组合，值得注意的是controller.js也需要路由分配  service数据交互给controller处理   理一理父级传子级数据   数据初始化


菜鸟angular路由：
1、载入了实现路由的 js 文件：angular-route.js。
2、包含了 ngRoute 模块作为主应用模块的依赖模块。
angular.module('routingDemoApp',['ngRoute'])
3、使用 ngView 指令。
<div ng-view></div>
该 div 内的 HTML 内容会根据路由的变化而变化。
4、配置 $routeProvider，AngularJS $routeProvider 用来定义路由规则。
module.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{template:'这是首页页面'})
        .when('/computers',{template:'这是电脑分类页面'})
        .when('/printers',{template:'这是打印机页面'})
        .otherwise({redirectTo:'/'});
}]);
AngularJS 模块的 config 函数用于配置路由规则。通过使用 configAPI，我们请求把$routeProvider注入到我们的配置函数并且使用$routeProvider.whenAPI来定义我们的路由规则。
$routeProvider 为我们提供了 when(path,object) & otherwise(object) 函数按顺序定义所有路由，函数包含两个参数:
第一个参数是 URL 或者 URL 正则规则。
第二个参数是路由配置对象。
$routeProvider.when(url, {
    template: string,//入简单的 HTML 内容
    templateUrl: string,//入 HTML 模板文件
    controller: string, function 或 array,//在当前模板上执行的controller函数，生成新的scope。
    controllerAs: string,//为controller指定别名。
    redirectTo: string, function,//重定向的地址。
    resolve: object<key, function>//指定当前controller所依赖的其他模块。
});
<a href="#/about">About</a>   这里的跳转使用“#”+标记的形式


ng-value：能写表达式   作用同value
ng-true-vale：当值为TRUE时显示替换的内容   ng-false-value同理
angular.copy()/extend()、tojson、fromjson工具

ng-repeat内$first第一个 last   odd even
数据提交控制：ng-model-options="{updateOn:'default blur',debounce:{default:3000,blur:0}}"前者失焦点提交，后3s后提交
	单独功能更简单：分开 无default  后者无blur 
ng-class：使用样式{className1：boolean，className1：boolean，...}根据boolean决定是否使用该类样式 boolean可为表达式  延伸ng-class-odd/even
	作用：可根据数据动态给予样式
ng-style：{style。。}注意为JS写法即驼峰法，可使用变量表示，作用：动态修改样式（如input输入修改）
ng-change需ng-model配合使用      弹性盒模型不错哦flex
boostrap中type=button有阻止提交功能？

angular微信前台菜单：一二级，每个菜单编辑页面会修改页面  66666

在函数中使用过滤器：注入$filter  使用$filter("filterName")(Arg1,Arh2)  前个如currency  后“￥” 1
$watch("对象"，function,boolean) 对象可以是var，obj。function处理程序   boolean暂不清楚
var | filterName :arg    对应 filter("filterName",function(){ return function(var,arg){}})  
文本节点替换元素节点会出错
控制器父子级传数据：父级使用对象  
组件内样式应在  组件名下
$window服务提供JS中window相同功能
ng-bind-html="data"    当data含html文本时会报错。通过$sce解决  $scope.data = $sce.trustAsHtml("<h1>qwe</h1>");
$cacheFactory服务：提供类似sessionstorage功能   建表头obj=$cacheFacory("表头名")  put(key，value),get（key），remove（key）removeAll，destroy删除表
angular  post注意序列化
父子级路由：parent属性           上级.下级
ui-view=top   能赋值，能够进行更加细致的页面规划   views:{top:{config}}    父子级top变下@上

ng-bing相比模板{{}}不如后者灵活  前者替换全部文本


angular与JS不互通（变量，函数，事件   不在script内）         angular注重数据

多页面WEB应用程序在服务器上组装拼接html  Angular在浏览器完成 服务器只是提供模板，数据


后端服务开发：
新建数据库、配置数据源、新建数据表、新建服务、新建数据表动作、模型编译、重启tomcat

<![CDATA[.....]]>
SVG：
  desc：描述
  defs：定义资源形状
    rect：
    circle：
  g：组，封装可视图形
    use：使用xlink：href指向形状ID

BOM核心：
window：
  document：
    anchors
    forms
    images
    links
    location
  frames
  history
  location
  navigation
  screen


本文实例讲述了jQuery基于json与cookie实现购物车的方法。分享给大家供大家参考，具体如下：
json 格式：
[{'ProductID':ABC','Num':'1'},{'ProductID':DEF,'Num':'2'}]

这里使用到了 $.cookie这个插件。这个插件的代码在文章的最后
/*
添加商品及数量到购物车cookie中,返回当前商品在cookie中的总数
*/
function AddToShoppingCar(id, num) {
  var _num = 1;
  if (num != undefined)
    _num = num;
  var totalNum = _num; //总数默认为传入参数
  var cookieSet = { expires: 7, path: '/' }; //设置cookie路径的
//  $.cookie(cookieProductID, null, cookieSet);//清除Cookie
  var jsonStr = "[{'ProductID':'" + id + "','Num':'" + _num + "'}]"; //构造json字符串,id是商品id  num是这个商品的数量
  if ($.cookie(cookieProductID) == null) {
    $.cookie(cookieProductID, jsonStr, cookieSet); //如果没有这个cookie就设置他
  }
  else {
    var jsonObj = eval('(' + $.cookie(cookieProductID) + ')'); //如果有，把json字符串转换成对象
    var findProduct = false;//是否找到产品ID,找到则为TRUE,否则为FALSH
    for (var obj in jsonObj) {
      if (jsonObj[obj].ProductID == id) {
        jsonObj[obj].Num = Number(jsonObj[obj].Num) + _num;
        totalNum = jsonObj[obj].Num;
        findProduct = true;
        break;
      }
    }
    if (findProduct == false) { //没找到,则添加
      jsonObj[jsonObj.length] = new Object();
      jsonObj[jsonObj.length - 1].ProductID = id;
      jsonObj[jsonObj.length - 1].Num = num;
    }
    $.cookie(cookieProductID, JSON.stringify(jsonObj), cookieSet); //写入coockie  JSON需要json2.js支持
  }
  return totalNum;
  //  alert($.cookie(cookieProductID));
}

//以下为cookie插件代码
jQuery.cookie = function(name, value, options) {
  if (typeof value != 'undefined') { // name and value given, set cookie
    options = options || {};
    if (value === null) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
      var date;
      if (typeof options.expires == 'number') {
        date = new Date();
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  } else { // only name given, get cookie
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
};










angular面试：
AngularJS 常见面试问题

问题来源：如何衡量一个人的 AngularJS 水平？

ng-if 跟 ng-show/hide 的区别有哪些？
第一点区别是，ng-if 在后面表达式为 true 的时候才创建这个 dom 节点，ng-show 是初始时就创建了，用 display:block 和 display:none 来控制显示和不显示。

第二点区别是，ng-if 会（隐式地）产生新作用域，ng-switch 、 ng-include 等会动态创建一块界面的也是如此。

这样会导致，在 ng-if 中用基本变量绑定 ng-model，并在外层 div 中把此 model 绑定给另一个显示区域，内层改变时，外层不会同步改变，因为此时已经是两个变量了。

<p>{{name}}</p>
<div ng-if="true">
    <input type="text" ng-model="name">
</div>
ng-show 不存在此问题，因为它不自带一级作用域。

避免这类问题出现的办法是，始终将页面中的元素绑定到对象的属性（data.x）而不是直接绑定到基本变量（x）上。

详见 AngularJS 中的作用域

ng-repeat迭代数组的时候，如果数组中有相同值，会有什么问题，如何解决？
会提示 Duplicates in a repeater are not allowed. 加 track by $index 可解决。当然，也可以 trace by 任何一个普通的值，只要能唯一性标识数组中的每一项即可（建立 dom 和数据之间的关联）。

ng-click 中写的表达式，能使用 JS 原生对象上的方法吗？
不止是 ng-click 中的表达式，只要是在页面中，都不能直接调用原生的 JS 方法，因为这些并不存在于与页面对应的 Controller 的 $scope 中。

举个栗子：

<p>{{parseInt(55.66)}}<p>
会发现，什么也没有显示。

但如果在 $scope 中添加了这个函数：

$scope.parseInt = function(x){
    return parseInt(x);
}
这样自然是没什么问题了。

对于这种需求，使用一个 filter 或许是不错的选择：

<p>{{13.14 | parseIntFilter}}</p>

app.filter('parseIntFilter', function(){
    return function(item){
        return parseInt(item);
    }
})
{{now | 'yyyy-MM-dd'}} 这种表达式里面，竖线和后面的参数通过什么方式可以自定义？
filter，格式化数据，接收一个输入，按某规则处理，返回处理结果。

内置 filter

ng 内置的 filter 有九种：

date（日期）
currency（货币）
limitTo（限制数组或字符串长度）
orderBy（排序）
lowercase（小写）
uppercase（大写）
number（格式化数字，加上千位分隔符，并接收参数限定小数点位数）
filter（处理一个数组，过滤出含有某个子串的元素）
json（格式化 json 对象）
filter 有两种使用方法，一种是直接在页面里：

<p>{{now | date : 'yyyy-MM-dd'}}</p>
另一种是在 js 里面用：

// $filter('过滤器名称')(需要过滤的对象, 参数1, 参数2,...)
$filter('date')(now, 'yyyy-MM-dd hh:mm:ss');
自定义 filter

// 形式
app.filter('过滤器名称',function(){
    return function(需要过滤的对象,过滤器参数1,过滤器参数2,...){
        //...做一些事情  
        return 处理后的对象;
    }
});  

// 栗子
app.filter('timesFilter', function(){
    return function(item, times){
        var result = '';
        for(var i = 0; i < times; i++){
            result += item;
        }
        return result;
    }
})
factory、service 和 provider 是什么关系？
factory

把 service 的方法和数据放在一个对象里，并返回这个对象

app.factory('FooService', function(){
    return {
        target: 'factory',
        sayHello: function(){
            return 'hello ' + this.target;
        }
    }
});
service

通过构造函数方式创建 service，返回一个实例化对象

app.service('FooService', function(){
    var self = this;
    this.target = 'service';
    this.sayHello = function(){
        return 'hello ' + self.target;
    }
});
provider

创建一个可通过 config 配置的 service，$get 中返回的，就是用 factory 创建 service 的内容

app.provider('FooService', function(){
    this.configData = 'init data';
    this.setConfigData = function(data){
        if(data){
            this.configData = data;
        }
    }
    this.$get = function(){
        var self = this;
        return {
            target: 'provider',
            sayHello: function(){
                return self.configData + ' hello ' + this.target;
            }
        }
    }
});

// 此处注入的是 FooService 的 provider
app.config(function(FooServiceProvider){
    FooServiceProvider.setConfigData('config data');
});
从底层实现上来看，service 调用了 factory，返回其实例；factory 调用了 provider，返回其 $get 中定义的内容。factory 和 service 功能类似，只不过 factory 是普通 function，可以返回任何东西（return 的都可以被访问，所以那些私有变量怎么写，你懂的）；service 是构造器，可以不返回（绑定到 this 的都可以被访问）；provider 是加强版 factory，返回一个可配置的 factory。

详见 AngularJS 之 Factory vs Service vs Provider

angular 的数据绑定采用什么机制？详述原理
脏检查机制。

双向数据绑定是 AngularJS 的核心机制之一。当 view 中有任何数据变化时，会更新到 model ，当 model 中数据有变化时，view 也会同步更新，显然，这需要一个监控。

原理就是，Angular 在 scope 模型上设置了一个 监听队列，用来监听数据变化并更新 view 。每次绑定一个东西到 view 上时 AngularJS 就会往 $watch 队列里插入一条 $watch，用来检测它监视的 model 里是否有变化的东西。当浏览器接收到可以被 angular context 处理的事件时，$digest 循环就会触发，遍历所有的 $watch，最后更新 dom。

举个栗子

<button ng-click="val=val+1">increase 1</button>
click 时会产生一次更新的操作（至少触发两次 $digest 循环）

按下按钮
浏览器接收到一个事件，进入到 angular context
$digest 循环开始执行，查询每个 $watch 是否变化
由于监视 $scope.val 的 $watch 报告了变化，因此强制再执行一次 $digest 循环
新的 $digest 循环未检测到变化
浏览器拿回控制器，更新 $scope.val 新值对应的 dom
$digest 循环的上限是 10 次（超过 10次后抛出一个异常，防止无限循环）。

详见 关于 AngularJS 的数据绑定

两个平级界面块 a 和 b，如果 a 中触发一个事件，有哪些方式能让 b 知道？详述原理
这个问题换一种说法就是，如何在平级界面模块间进行通信。有两种方法，一种是共用服务，一种是基于事件。

共用服务

在 Angular 中，通过 factory 可以生成一个单例对象，在需要通信的模块 a 和 b 中注入这个对象即可。

基于事件

这个又分两种方式

第一种是借助父 controller。在子 controller 中向父 controller 触发（$emit）一个事件，然后在父 controller 中监听（$on）事件，再广播（$broadcast）给子 controller ，这样通过事件携带的参数，实现了数据经过父 controller，在同级 controller 之间传播。

第二种是借助 $rootScope。每个 Angular 应用默认有一个根作用域 $rootScope， 根作用域位于最顶层，从它往下挂着各级作用域。所以，如果子控制器直接使用 $rootScope 广播和接收事件，那么就可实现同级之间的通信。

详见 AngularJS 中 Controller 之间的通信

一个 angular 应用应当如何良好地分层？
目录结构的划分

对于小型项目，可以按照文件类型组织，比如：

css
js
  controllers
  models
  services
  filters
templates  
但是对于规模较大的项目，最好按业务模块划分，比如：

css
modules
  account
    controllers
    models
    services
    filters
    templates
  disk
    controllers
    models
    services
    filters
    templates
modules 下最好再有一个 common 目录来存放公共的东西。

逻辑代码的拆分

作为一个 MVVM 框架，Angular 应用本身就应该按照 模型，视图模型（控制器），视图来划分。

这里逻辑代码的拆分，主要是指尽量让 controller 这一层很薄。提取共用的逻辑到 service 中 （比如后台数据的请求，数据的共享和缓存，基于事件的模块间通信等），提取共用的界面操作到 directive 中（比如将日期选择、分页等封装成组件等），提取共用的格式化操作到 filter 中等等。

在复杂的应用中，也可以为实体建立对应的构造函数，比如硬盘（Disk）模块，可能有列表、新建、详情这样几个视图，并分别对应的有 controller，那么可以建一个 Disk 构造函数，里面完成数据的增删改查和验证操作，有跟 Disk 相关的 controller，就注入 Disk 构造器并生成一个实例，这个实例就具备了增删改查和验证方法。这样既层次分明，又实现了复用（让 controller 层更薄了）。

参考 AngularJS在苏宁云中心的深入实践

angular 应用常用哪些路由库，各自的区别是什么？
Angular1.x 中常用 ngRoute 和 ui.router，还有一种为 Angular2 设计的 new router（面向组件）。后面那个没在实际项目中用过，就不讲了。

无论是 ngRoute 还是 ui.router，作为框架额外的附加功能，都必须以 模块依赖 的形式被引入。

区别

ngRoute 模块是 Angular 自带的路由模块，而 ui.router 模块是基于 ngRoute模块开发的第三方模块。

ui.router 是基于 state （状态）的， ngRoute 是基于 url 的，ui.router模块具有更强大的功能，主要体现在视图的嵌套方面。

使用 ui.router 能够定义有明确父子关系的路由，并通过 ui-view 指令将子路由模版插入到父路由模板的 <div ui-view></div> 中去，从而实现视图嵌套。而在 ngRoute 中不能这样定义，如果同时在父子视图中 使用了 <div ng-view></div> 会陷入死循环。

示例

ngRoute

var app = angular.module('ngRouteApp', ['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
        .when('/main', {
            templateUrl: "main.html",
            controller: 'MainCtrl'
        })
        .otherwise({ redirectTo: '/tabs' });
ui.router

var app = angular.module("uiRouteApp", ["ui.router"]);
app.config(function($urlRouterProvider, $stateProvider){
    $urlRouterProvider.otherwise("/index");
    $stateProvider
        .state("Main", {
            url: "/main",
            templateUrl: "main.html",
            controller: 'MainCtrl'
        })
如果通过angular的directive规划一套全组件化体系，可能遇到哪些挑战？
没有自己用 directive 做过一全套组件，讲不出。

能想到的一点是，组件如何与外界进行数据的交互，以及如何通过简单的配置就能使用吧。

分属不同团队进行开发的 angular 应用，如果要做整合，可能会遇到哪些问题，如何解决？
可能会遇到不同模块之间的冲突。

比如一个团队所有的开发在 moduleA 下进行，另一团队开发的代码在 moduleB 下

angular.module('myApp.moduleA', [])
    .factory('serviceA', function(){
        ...
    })
    
angular.module('myApp.moduleB', [])
    .factory('serviceA', function(){
        ...
    })    
    
angular.module('myApp', ['myApp.moduleA', 'myApp.moduleB'])    
会导致两个 module 下面的 serviceA 发生了覆盖。

貌似在 Angular1.x 中并没有很好的解决办法，所以最好在前期进行统一规划，做好约定，严格按照约定开发，每个开发人员只写特定区块代码。

angular 的缺点有哪些？
强约束

导致学习成本较高，对前端不友好。

但遵守 AngularJS 的约定时，生产力会很高，对 Java 程序员友好。

不利于 SEO

因为所有内容都是动态获取并渲染生成的，搜索引擎没法爬取。

一种解决办法是，对于正常用户的访问，服务器响应 AngularJS 应用的内容；对于搜索引擎的访问，则响应专门针对 SEO 的HTML页面。

性能问题

作为 MVVM 框架，因为实现了数据的双向绑定，对于大数组、复杂对象会存在性能问题。

可以用来 优化 Angular 应用的性能 的办法：

减少监控项（比如对不会变化的数据采用单向绑定）
主动设置索引（指定 track by，简单类型默认用自身当索引，对象默认使用 $$hashKey，比如改为 track by item.id）
降低渲染数据量（比如分页，或者每次取一小部分数据，根据需要再取）
数据扁平化（比如对于树状结构，使用扁平化结构，构建一个 map 和树状数据，对树操作时，由于跟扁平数据同一引用，树状数据变更会同步到原始的扁平数据）
另外，对于Angular1.x ，存在 脏检查 和 模块机制 的问题。

移动端

可尝试 Ionic，但并不完善。

参考 如何看2015年1月Peter-Paul Koch对Angular的看法？

如何看待 angular 1.2 中引入的 controller as 语法？
最根本的好处

在 angular 1.2 以前，在 view 上的任何绑定都是直接绑定在 $scope 上的

function myCtrl($scope){
    $scope.a = 'aaa';
    $scope.foo = function(){
        ...
    }
}
使用 controllerAs，不需要再注入 $scope，controller 变成了一个很简单的 javascript 对象（POJO），一个更纯粹的 ViewModel。

function myCtrl(){
    // 使用 vm 捕获 this 可避免内部的函数在使用 this 时导致上下文改变
    var vm = this;
    vm.a = 'aaa';
}
原理

从源码实现上来看，controllerAs 语法只是把 controller 这个对象的实例用 as 别名在 $scope 上创建了一个属性。

if (directive.controllerAs) {
    locals.$scope[directive.controllerAs] = controllerInstance;
}
但是这样做，除了上面提到的使 controller 更加 POJO 外，还可以避免遇到 AngularJS 作用域相关的一个坑（就是上文中 ng-if 产生一级作用域的坑，其实也是 javascript 原型链继承中值类型继承的坑。因为使用 controllerAs 的话 view 上所有字段都绑定在一个引用的属性上，比如 vm.xx，所以坑不再存在）。

<div ng-controller="TestCtrl as vm">
    <p>{{name}}</p>
    <div ng-if="vm.name">
        <input type="text" ng-model="vm.name">
    </div>
</div>
问题

使用 controllerAs 会遇到的一个问题是，因为没有注入 $scope，导致 $emit、 $broadcast、 $on、 $watch 等 $scope 下的方法无法使用。这些跟事件相关的操作可以封装起来统一处理，或者在单个 controller 中引入 $scope，特殊对待。

参考 angular controller as syntax vs scope

详述 angular 的 “依赖注入”
栗子

依赖注入是一种软件设计模式，目的是处理代码之间的依赖关系，减少组件间的耦合。

举个栗子，如果没有使用 AngularJS，想从后台查询数据并在前端显示，可能需要这样做：

var animalBox = document.querySelector('.animal-box');

var httpRequest = {
    get: function(url, callback){
        console.log(url + ' requested');
        var animals = ['cat', 'dog', 'rabbit'];
        callback(animals);
    }
}

var render = function(el, http){
    http.get('/api/animals', function(animals){
        el.innerHTML = animals;
    })
}

render(httpRequest, animalBox);
但是，如果在调用 render 的时候不传参数，像下面这样，会报错，因为找不到 el 和 http（定义的时候依赖了，运行的时候不会自动查找依赖项）

render();
// TypeError: Cannot read property 'get' of undefined
而使用 AngularJS，可以直接这样

function myCtrl = ($scope, $http){
    $http.get('/api/animals').success(function(data){
        $scope.animals = data;
    })
}
也就是说，在 Angular App 运行的时候，调用 myCtrl，自动做了 $scope 和 $http 两个依赖性的注入。

原理

AngularJS 是通过构造函数的参数名字来推断依赖服务名称的，通过 toString() 来找到这个定义的 function 对应的字符串，然后用正则解析出其中的参数（依赖项），再去依赖映射中取到对应的依赖，实例化之后传入。

简化一下，大概是这样：

var inject = {
    // 存储依赖映射关系
    storage: {},    
    // 注册依赖
    register: function(name, resource){
        this.storage[name] = resource;
    }, 
    // 解析出依赖并调用
    resolve: function(target){
    
        var self = this;
        
        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        fnText = target.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS)[1].split(/, ?/g);
        
        var args = [];
        argDecl.forEach(function(arg){
            if(self.storage[arg]){
                args.push(self.storage[arg]);
            }
        })
        
        return function(){
            target.apply({}, args);
        }
    }
}
使用这个 injector，前面那个不用 AngularJS 的栗子这样改造一下就可以调用了

inject.register('el', animalBox);
inject.register('ajax', httpRequest);
render = inject.resolve(render);
render();
问题

因为 AngularJS 的 injector 是假设函数的参数名就是依赖的名字，然后去查找依赖项，那如果按前面栗子中那样注入依赖，代码压缩后（参数被重命名了），就无法查找到依赖项了。

// 压缩前
function myCtrl = ($scope, $http){
    ...
}

// 压缩后
function myCtrl = (a, b){
    ...
}
所以，通常会使用下面两种方式注入依赖（对依赖添加的顺序有要求）。

数组注释法


myApp.controller('myCtrl', ['$scope', '$http', function($scope, $http){
    ...
}])
显式 $inject

myApp.controller('myCtrl', myCtrl);
function myCtrl = ($scope, $http){
    ...
}
myCtrl.$inject = ['$scope', '$http'];
补充

对于一个 DI 容器，必须具备三个要素：依赖项的注册，依赖关系的声明和对象的获取。

在 AngularJS 中，module 和 $provide 都可以提供依赖项的注册；内置的 injector 可以获取对象（自动完成依赖注入）；依赖关系的声明，就是前面问题中提到的那样。

下面是个栗子


// 对于 module，传递参数不止一个，代表新建模块，空数组代表不依赖其他模块
// 只有一个参数（模块名），代表获取模块

// 定义 myApp，添加 myApp.services 为其依赖项
angular.module('myApp', ['myApp.services']);
// 定义一个 services module，将 services 都注册在这个 module 下面
angular.module('myApp.services', [])

// $provider 有 factory, service, provider, value, constant

// 定义一个 HttpService
angular.module('myApp.services').service('HttpService', ['$http', function($http){
    ...
}])
参考

[AngularJS] 自己实现一个简单的依赖注入
理解angular中的module和injector，即依赖注入
AngularJS中的依赖注入实际应用场景
如何看待angular2
相比 Angular1.x，Angular2的改动很大，几乎算是一个全新的框架。

基于 TypeScript（可以使用 TypeScript 进行开发），在大型项目团队协作时，强语言类型更有利。

组件化，提升开发和维护的效率。

还有 module 支持动态加载，new router，promise的原生支持等等。

迎合未来标准，吸纳其他框架的优点，值得期待，不过同时要学习的东西也更多了（ES next、TS、Rx等）。



$apply可以带参数，它可以接受一个函数，然后在应用数据之后，调用这个函数。
当调用$digest的时候，只触发当前作用域和它的子作用域上的监控，但是当调用$apply的时候，会触发作用域树上的所有监控。
因此，从性能上讲，如果能确定自己作的这个数据变更所造成的影响范围，应当尽量调用$digest，只有当无法精确知道数据变更造成的影响范围时，才去用$apply，很暴力地遍历整个作用域树，调用其中所有的监控。

从另外一个角度，我们也可以看到，为什么调用外部框架的时候，是推荐放在$apply中，因为只有这个地方才是对所有数据变更都应用的地方，如果用$digest，有可能临时丢失数据变更。
setter，getter的观测机制？脏检查？

app.directive('test',function(){

return {
    compile: function(tElem,attrs){
        //在这里原则性的做一些DOM转换   
        return function(scope,elem,attrs){
         //这里编写link函数
        }
    }
}
}); 
Compile函数主要用来在link函数运行之前进行一些DOM转化。
例子像是ng-repeat这样的指令，需要多次克隆并重复DOM元素，就需要在link函数运行之前使用compile函数。（展开节点）
指令是如何被编译的
当应用在启动时，Angular开始使用$compile服务解析DOM。这项服务会在标记中寻找指令然后将它们各自匹配到注册的适龄。一旦所有的指令都已经被识别完成，Angular就开始执行它们的compile函数。正如前面所提到的，compile函数返回一个link函数，该函数会被添加到稍后执行的link函数队列中。这叫做编译阶段(compile phase)。注意到即使同一个指令有几个实例存在，compile函数也只会运行一次。

services 单例 factory（service, func）返回函数fuc(这与一些？？不同filter？)  


mvc目录结构：
普遍做法：根据文件类型 如：
templates/
    _login.html
    _feed.html
app/
    app.js
    controllers/
        LoginController.js
        FeedController.js
    directives/
        FeedEntryDirective.js
    services/
        LoginService.js
        FeedService.js
    filters/
        CapatalizeFilter.js
app扩张后：特性划分 如：
app/
    app.js
    Feed/
        _feed.html
        FeedController.js
        FeedEntryDirective.js
        FeedService.js
    Login/
        _login.html
        LoginController.js
        LoginService.js
    Shared/
        CapatalizeFilter.js

模块：
将一个应用相关部分放在一起，并在模块名后加上module区分
注入时以？？方式注入  推断？



在编写AngularJS程序时，时常会出现这种情况：某个对象有一个依赖，而这个对象又将其自身绑定在全局scope上，这意味着在任何AngularJS代码中这个依赖都是可用的，但这却破坏了依赖注入模型，并会导致一些问题，尤其体现在测试过程中。

使用AngularJS可以很容易的将这些全局依赖封装进模块中，所以它们可以像AngularJS标准模块那样被注入进去。

Underscrore.js是一个很赞的库，它可以以函数式的风格简化Javascript代码，通过以下方式，你可以将其转化为一个模块：

JavaScript

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; //Underscore must already be loaded on the page
});
var app = angular.module('app', ['underscore']);

app.controller('MainCtrl', ['$scope', '_', function($scope, _) {
    init = function() {
          _.keys($scope);
      }

      init();
}]);

var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; //Underscore must already be loaded on the page
});
var app = angular.module('app', ['underscore']);
 
app.controller('MainCtrl', ['$scope', '_', function($scope, _) {
    init = function() {
          _.keys($scope);
      }
 
      init();
}]);
这样的做法允许应用程序继续以AngularJS依赖注入的风格进行开发，同时在测试阶段也能将underscore交换出去。

这可能看上去十分琐碎，没什么必要，但如果你的代码中正在使用use strict（而且必须使用），那这就是必要的了。
这究竟是什么意思  跨应用注入？？


控制器膨胀

控制器是AngularJS的肉和土豆，一不小心就会将过多的逻辑加入其中，尤其是刚开始的时候。控制器永远都不应该去操作DOM，或是持有DOM选择器，那是我们需要使用指令和ng-model的地方。同样的，业务逻辑应该存在于服务中，而非控制器。

数据也应该存储在服务中，除非它们已经被绑定在$scope上了。服务本身是单例的，在应用程序的整个生命周期都存在，然而控制器在应用程序的各状态间是瞬态的。如果数据被保存在控制器中，当它被再次实例化时就需要重新从某处获取数据。即使将数据存储于localStorage中，检索的速度也要比Javascript变量慢一个数量级。

AngularJS在遵循单一职责原则（SRP）时运行良好，如果控制器是视图和模型间的协调者，那么它所包含的逻辑就应该尽量少，这同样会给测试带来便利。
Service vs Factory：
以下是它们在AngularJS源代码中的定义：
function factory(name, factoryFn) { 
    return provider(name, { $get: factoryFn }); 
}
 
function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
}
service仅仅是调用了factory函数，而后者又调用了provider函数
service的构造函数在声明时被实例化了一次，同时factory对象在每一次被注入时传递，但是仍然只有一个factory实例。
factory提供了更多的灵活性，因为它可以返回函数，这些函数之后可以被新建出来。这迎合了面向对象编程中工厂模式的概念，

没有使用Batarang

Batarang是一个出色的Chrome插件，用来开发和测试AngularJS app。

Batarang提供了浏览模型的能力，这使得我们有能力观察AngularJS内部是如何确定绑定到作用域上的模型的，这在处理指令以及隔离一定范围观察绑定值时非常有用。

Batarang也提供了一个依赖图， 如果我们正在接触一个未经测试的代码库，这个依赖图就很有用，它能决定哪些服务应该被重点关照。

最后，Batarang提供了性能分析。Angular能做到开包即用，性能良好，然而对于一个充满了自定义指令和复杂逻辑的应用而言，有时候就不那么流畅了。使用Batarang性能工具，能够直接观察到在一个digest周期中哪个函数运行了最长时间。性能工具也能展示一棵完整的watch树，在我们拥有很多watcher时，这很有用。

过多的watcher

在上一点中我们提到，AngularJS能做到开包即用，性能良好。由于需要在一个digest周期中完成脏数据检查，一旦watcher的数量增长到大约2000时，这个周期就会产生显著的性能问题。（2000这个数字不能说一定会造成性能大幅下降，但这是一个不错的经验数值。在AngularJS 1.3 release版本中，已经有一些允许严格控制digest周期的改动了，Aaron Gray有一篇很好的文章对此进行解释。）

以下这个“立即执行的函数表达式(IIFE)”会打印出当前页面上所有的watcher的个数，你可以简单的将其粘贴到控制台中，观察结果。这段IIFE来源于Jared在StackOverflow上的回答：

JavaScript

(function () { 
    var root = $(document.getElementsByTagName('body'));
    var watchers = [];

    var f = function (element) {
        if (element.data().hasOwnProperty('$scope')) {
            angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                watchers.push(watcher);
            });
        }

        angular.forEach(element.children(), function (childElement) {
            f($(childElement));
        });
    };

    f(root);

    console.log(watchers.length);
})();

(function () { 
    var root = $(document.getElementsByTagName('body'));
    var watchers = [];
 
    var f = function (element) {
        if (element.data().hasOwnProperty('$scope')) {
            angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                watchers.push(watcher);
            });
        }
 
        angular.forEach(element.children(), function (childElement) {
            f($(childElement));
        });
    };
 
    f(root);
 
    console.log(watchers.length);
})();
通过这个方式得到watcher的数量，结合Batarang性能板块中的watch树，应该可以看到哪里存在重复代码，或着哪里存在不变数据同时拥有watch。

当存在不变数据，而你又想用AngularJS将其模版化，可以考虑使用bindonce。Bindonce是一个简单的指令，允许你使用AngularJS中的模版，但它并不会加入watch，这就保证了watch数量不会增长

$scope跨域
子级的name不会传到父级，但user.name会（这里父子级有相同变量，原理在于对象传引用）
$location:jquery风格 和$watch整合（数据变化能反馈到视图层） 兼容低级浏览器 关联上下文
$http:用法与ajax（jQuery）相似 需要可细查
$apply(fuc)  $digest() $watch('var',func) 
ng-options 更适合创建下拉列表  选择的是对象  select ng-model="selectedSite" ng-options="x.site for x in sites"></select>
$dirty	表单有填写记录
$valid	字段内容合法的
$invalid	字段内容是非法的
$pristine	表单没有填写记录
ng-switch     ng-include 指令来包含 HTML 内容:
包含文件功能 (SSI： Server Side Includes)。在 HTML 中包含 HTML 文件，并发送到客户端浏览器

 ng-include 指令不允许包含其他域名的文件。
如果你需要包含其他域名的文件，你需要设置域名访问白名单：
    $sceDelegateProvider.resourceUrlWhitelist([
        'http://c.runoob.com/runoobtest/**'
    ]);

AngularJS 使用动画需要引入 angular-animate.min.js 库。
<script src="http://cdn.static.runoob.com/libs/angular.js/1.4.6/angular-animate.min.js"></script>
还需在应用中使用模型 ngAnimate：
<body ng-app="ngAnimate">
或者var app = angular.module('myApp', ['ngAnimate']);
ngAnimate 模型可以添加或移除 class 。
ngAnimate 模型并不能使 HTML 元素产生动画，但是 ngAnimate 会监测事件，类似隐藏显示 HTML 元素 ，如果事件发生 ngAnimate 就会使用预定义的 class 来设置 HTML 元素的动画。
AngularJS 添加/移除 class 的指令:
ng-show
ng-hide
ng-class
ng-view
ng-include
ng-repeat
ng-if
ng-switch
ng-show 和 ng-hide 指令用于添加或移除 ng-hide class 的值。
其他指令会在进入 DOM 会添加 ng-enter 类，移除 DOM 会添加 ng-leave 属性。
当 HTML 元素位置改变时，ng-repeat 指令同样可以添加 ng-move 类 。
此外， 在动画完成后，HTML 元素的类集合将被移除。例如： ng-hide 指令会添加一下类：
ng-animate
ng-hide-animate
ng-hide-add (如果元素将被隐藏)
ng-hide-remove (如果元素将显示)
ng-hide-add-active (如果元素将隐藏)
ng-hide-remove-active (如果元素将显示)
依赖注入（Dependency Injection，简称DI）是一种软件设计模式，在这种模式下，一个或更多的依赖（或服务）被注入（或者通过引用传递）到一个独立的对象（或客户端）中，然后成为了该客户端状态的一部分。
5个核心组件用来作为依赖注入：
value
factory
service
provider
constant
// 使用 provider 创建 service 定义一个方法用于计算两数乘积
mainApp.config(function($provide) {
   $provide.provider('MathService', function() {
      this.$get = function() {
         var factory = {};  
         
         factory.multiply = function(a, b) {
            return a * b; 
         }
         return factory;
      };
   });
});
service  在该对象上定义方法   factory 新建对象并返回

、载入了实现路由的 js 文件：angular-route.js。
2、包含了 ngRoute 模块作为主应用模块的依赖模块。
angular.module('routingDemoApp',['ngRoute'])
3、使用 ngView 指令。
<div ng-view></div>
该 div 内的 HTML 内容会根据路由的变化而变化。
4、配置 $routeProvider，AngularJS $routeProvider 用来定义路由规则。
module.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{template:'这是首页页面'})
        .when('/computers',{template:'这是电脑分类页面'})
        .when('/printers',{template:'这是打印机页面'})
        .otherwise({redirectTo:'/'});
}]);
$routeProvider.when(url, {
    template: string,
    templateUrl: string,
    controller: string, function 或 array,
    controllerAs: string,
    redirectTo: string, function,
    resolve: object<key, function>
});

本教程用到的 AngularJS 指令 :
指令	描述
ng-app	定义应用程序的根元素。
ng-bind	绑定 HTML 元素到应用程序数据
ng-bind-html	绑定 HTML 元素的 innerHTML 到应用程序数据，并移除 HTML 字符串中危险字符
ng-bind-template	规定要使用模板替换的文本内容
ng-blur	规定 blur 事件的行为
ng-change	规定在内容改变时要执行的表达式
ng-checked	规定元素是否被选中
ng-class	指定 HTML 元素使用的 CSS 类
ng-class-even	类似 ng-class，但只在偶数行起作用
ng-class-odd	类似 ng-class，但只在奇数行起作用
ng-click	定义元素被点击时的行为
ng-cloak	在应用正要加载时防止其闪烁
ng-controller	定义应用的控制器对象
ng-copy	规定拷贝事件的行为
ng-csp	修改内容的安全策略
ng-cut	规定剪切事件的行为
ng-dblclick	规定双击事件的行为
ng-disabled	规定一个元素是否被禁用
ng-focus	规定聚焦事件的行为
ng-form	指定 HTML 表单继承控制器表单
ng-hide	隐藏或显示 HTML 元素
ng-href	为 the <a> 元素指定链接
ng-if	如果条件为 false 移除 HTML 元素
ng-include	在应用中包含 HTML 文件
ng-init	定义应用的初始化值
ng-jq	定义应用必须使用到的库，如：jQuery
ng-keydown	规定按下按键事件的行为
ng-keypress	规定按下按键事件的行为
ng-keyup	规定松开按键事件的行为
ng-list	将文本转换为列表 (数组)
ng-model	绑定 HTML 控制器的值到应用数据
ng-model-options	规定如何更新模型
ng-mousedown	规定按下鼠标按键时的行为
ng-mouseenter	规定鼠标指针穿过元素时的行为
ng-mouseleave	规定鼠标指针离开元素时的行为
ng-mousemove	规定鼠标指针在指定的元素中移动时的行为
ng-mouseover	规定鼠标指针位于元素上方时的行为
ng-mouseup	规定当在元素上松开鼠标按钮时的行为
ng-non-bindable	规定元素或子元素不能绑定数据
ng-open	指定元素的 open 属性
ng-options	在 <select> 列表中指定 <options>
ng-paste	规定粘贴事件的行为
ng-pluralize	根据本地化规则显示信息
ng-readonly	指定元素的 readonly 属性
ng-repeat	定义集合中每项数据的模板
ng-selected	指定元素的 selected 属性
ng-show	显示或隐藏 HTML 元素
ng-src	指定 <img> 元素的 src 属性
ng-srcset	指定 <img> 元素的 srcset 属性
ng-style	指定元素的 style 属性
ng-submit	规定 onsubmit 事件发生时执行的表达式
ng-switch	规定显示或隐藏子元素的条件
ng-transclude	规定填充的目标位置
ng-value	规定 input 元素的值
过滤器解析 AngularJs 过滤器。
AngularJS 事件
AngularJS 支持以下事件:
ng-click
ng-dbl-click
ng-mousedown
ng-mouseenter
ng-mouseleave
ng-mousemove
ng-keydown
ng-keyup
ng-keypress
ng-change
事件解析： Angular 事件。
AngularJS 验证属性
$dirty
$invalid
$error
验证解析：Angular 验证。
AngularJS 全局 API
转换
API	描述
angular.lowercase()	将字符串转换为小写
angular.uppercase()	将字符串转换为大写
angular.copy()	数组或对象深度拷贝
angular.forEach()	对象或数组的迭代函数
比较
API	描述
angular.isArray()	如果引用的是数组返回 true
angular.isDate()	如果引用的是日期返回 true
angular.isDefined()	如果引用的已定义返回 true
angular.isElement()	如果引用的是 DOM 元素返回 true
angular.isFunction()	如果引用的是函数返回 true
angular.isNumber()	如果引用的是数字返回 true
angular.isObject()	如果引用的是对象返回 true
angular.isString()	如果引用的是字符串返回 true
angular.isUndefined()	如果引用的未定义返回 true
angular.equals()	如果两个对象相等返回 true
JSON
API	描述
angular.fromJson()	反序列化 JSON 字符串
angular.toJson()	序列化 JSON 字符串
基础
API	描述
angular.bootstrap()	手动启动 AngularJS
angular.element()	包裹着一部分DOM element或者是HTML字符串，把它作为一个jQuery元素来处理。
angular.module()	创建，注册或检索 AngularJS 模块

1、currency(货币)格式化
      <div ng-controller="Aaa">   <p>{{name | currency:'￥'}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = '12334.273489274834';   }]);  </script>      
在name的数据後面使用｜符号表示启用过滤器，如果对linux比较熟悉的话，这块的｜根linux的管道功能。currency可以理解成函数，而'￥'则是函数的参数，如果不传默认为$符号！
  
2、number(数字)格式化
      <div ng-controller="Aaa">   <p>{{name | number:2}}</p>  </div>  <script type="text/javascript">   $scope.name = '12334.273489274834';  </script>    
用来精确浮点数(精确到2位)默认是3位。
  
3、uppercase , lowercase(大小写)格式化
      <div ng-controller="Aaa">   <p>{{name | uppercase}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = 'hello';   }]);  </script>    
uppercase转换成大写，lowercase转换成小写
  
4、json(数据)格式化
      <div ng-controller="Aaa">   <pre>{{name | json}}</pre>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = { name : 'xcg',age : 19 };   }]);  </script>    
以json的格式输出到页面中，视图只能使用pre标签才可以识别
  
5、limitTo(截取)格式化
      <div ng-controller="Aaa">   <p>{{name | limitTo : 3}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = '123456789';   }]);  </script>    
截取字符串，数字不行。。。
  
6、limitTo(截取)格式化
      <div ng-controller="Aaa">   <p>{{name | date : 'yyyy-MM-dd hh:mm:ss'}}</p>  　　<p>{{name | date : 'MM/dd/yyyy @ h:mma'}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = 1448022616463;   }]);  </script>    
7、orderBy(排序)格式化
      <div ng-controller="Aaa">   <pre>{{name | orderBy : 'age' : true | json}}</pre>  <div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = [     {color : 'red',age : '10'},     {color : 'yellow',age : '20'},     {color : 'blue',age : '30'},     {color : 'green',age : '40'}    ];   }]);  </script>    
如果排序的值是字母，就按照字母的顺序来排序。如果是数字，从大到小。传入true则为逆向排序。
  
8、filter(筛选&过滤)格式化
      <div ng-controller="Aaa">   <pre>{{name | filter : 'l' | json}}</pre>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = [     {color : 'red',age : '10'},     {color : 'yellow',age : '20'},     {color : 'blue',age : '30'},     {color : 'green',age : '40'}    ];   }]);  </script>    
在filter传入'l'，会筛选出blue以及yellow。
  
<pre>{{name | filter : 'yellow' : true | json}}</pre> 如果像这样再传入true，就必须保证value的完整性，单单的'l'是无法筛选出来的。
  
上面都是在视图中以表达式的形式使用过滤器，下面我们来看看在JS中使用过滤器。
      <div ng-controller="Aaa">   <p>{{currency}}</p>   <p>{{number}}</p>   <p>{{uppercase}}</p>   <pre>{{json}}</pre>   <p>{{limitTo}}</p>   <p>{{date}}</p>   <pre>{{orderBy}}</pre>   <pre>{{filter}}</pre>  </div>  <script type="text/javascript">  var m1 = angular.module('myApp',[]);  m1.controller('Aaa',['$scope','$filter',function($scope,$filter){   var colors = [{color : 'red',age : '10'},     {color : 'yellow',age : '20'},     {color : 'blue',age : '30'},     {color : 'green',age : '40'}];     $scope.currency = $filter('currency')(12334.273489274834,'￥');   $scope.number = $filter('number')('12334.273489274834',2);   $scope.uppercase = $filter('uppercase')('hello');   $scope.json = $filter('json')({ name : 'xcg',age : 19 });   $scope.limitTo = $filter('limitTo')('xiecg',2);   $scope.date = $filter('date')('1448106268837','yyyy-MM-dd hh:mm:ss');   $scope.orderBy = $filter('orderBy')(colors,'age',true);   $scope.filter = $filter('filter')(colors,'l');  }]);  </script>      
这些都属于内置过滤器，我们还可以用.filter自定义过滤器。
      <div ng-controller="Aaa">   <p>{{name | firstUpper : 2}}</p>   </div>  <script type="text/javascript">  var m1 = angular.module('myApp',[]);  //自定义过滤器  m1.filter('firstUpper',function(){   return function(str,num){    console.log(num); //2，得到传递的参数    return str.charAt(0).toUpperCase() + str.substring(1);   }  });  m1.controller('Aaa',['$scope','$filter',function($scope,$filter){   $scope.name = 'hollo';  }]);  </script>      








Angular页面间切换及传值的4种方法
1. 基于ui-router的页面跳转传参
(1) 在AngularJS的app.js中用ui-router定义路由，比如现在有两个页面，一个页面（producers.html）放置了多个producers，点击其中一个目标，页面跳转到对应的producer页，同时将producerId这个参数传过去。
?
1
2
3
4
5
6
7
8
9
10	state('producers', {
 url: '/producers',
 templateUrl: 'views/producers.html',
 controller: 'ProducersCtrl'
})
.state('producer', {
 url: '/producer/:producerId',
 templateUrl: 'views/producer.html',
 controller: 'ProducerCtrl'
})

(2) 在producers.html中，定义点击事件，比如ng-click="toProducer(producerId)"，在ProducersCtrl中，定义页面跳转函数 (使用ui-router的$state.go接口)：
?
1
2
3
4
5	.controller('ProducersCtrl', function ($scope, $state) {
 $scope.toProducer = function (producerId) {
  $state.go('producer', {producerId: producerId});
 };
});
(3) 在ProducerCtrl中，通过ui-router的$stateParams获取参数producerId，譬如：
?
1
2
3	.controller('ProducerCtrl', function ($scope, $state, $stateParams) {
 var producerId = $stateParams.producerId;
});


2. 基于factory的页面跳转传参
举例：你有N个页面，每个页面都需要用户填选信息，最终引导用户至尾页提交，同时后一个页面要显示前面所有页面填写的信息。这个时候用factory传参是比较合理的选择（下面的代码是一个简化版，根据需求可以不同定制）：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34	.factory('myFactory', function () {
 //定义factory返回对象
 var myServices = {}; 
 //定义参数对象
 var myObject = {};
  
 /**
  * 定义传递数据的set函数
  * @param {type} xxx
  * @returns {*}
  * @private
  */
 var _set = function (data) {
  myObject = data;  
 };
 
 /**
  * 定义获取数据的get函数
  * @param {type} xxx
  * @returns {*}
  * @private
  */
 var _get = function () {
  return myObject;
 };
 
 // Public APIs
 myServices.set = _set;
 myServices.get = _get;
  
 // 在controller中通过调set()和get()方法可实现提交或获取参数的功能
 return myServices;
  
});


3. 基于factory和$rootScope.$broadcast()的传参
(1) 举例：在一个单页中定义了nested views，你希望让所有子作用域都监听到某个参数的变化，并且作出相应动作。比如一个地图应用，某个$state中定义元素input，输入地址后，地图要定位，同时另一个状态下的列表要显示出该位置周边商铺的信息，此时多个$scope都在监听地址变化。
PS: $rootScope.$broadcast()可以非常方便的设置全局事件，并让所有子作用域都监听到。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17	.factory('addressFactory', ['$rootScope', function ($rootScope) {
 // 定义所要返回的地址对象 
 var address = {};
  
 // 定义components数组，数组包括街道，城市，国家等
 address.components = [];
 
 // 定义更新地址函数，通过$rootScope.$broadcast()设置全局事件'AddressUpdated'
 // 所有子作用域都能监听到该事件
 address.updateAddress = function (value) {
 this.components = value.slice();
 $rootScope.$broadcast('AddressUpdated');
 };
  
 // 返回地址对象
 return address;
}]);
(2) 在获取地址的controller中：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17	// 动态获取地址，接口方法省略
var component = {
 addressLongName: xxxx,
 addressShortName: xxxx,
 cityLongName: xxxx,
 cityShortName: xxxx   
};
 
// 定义地址数组
$scope.components = [];
 
$scope.$watch('components', function () {
 // 将component对象推入$scope.components数组
 components.push(component);
 // 更新addressFactory中的components
 addressFactory.updateAddress(components);
});
(3) 在监听地址变化的controller中：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15	// 通过addressFactory中定义的全局事件'AddressUpdated'监听地址变化
$scope.$on('AddressUpdated', function () {
 // 监听地址变化并获取相应数据
 var street = address.components[0].addressLongName;
 var city = address.components[0].cityLongName;
 
 // 通过获取的地址数据可以做相关操作，譬如获取该地址周边的商铺，下面代码为本人虚构
 shopFactory.getShops(street, city).then(function (data) {
  if(data.status === 200){
   $scope.shops = data.shops; 
  }else{
   $log.error('对不起，获取该位置周边商铺数据出错: ', data);
  }
 });
});
4. 基于localStorage或sessionStorage的页面跳转传参
注意事项：通过LS或SS传参，一定要监听变量，否则参数改变时，获取变量的一端不会更新。AngularJS有一些现成的WebStorage dependency可以使用，譬如gsklee/ngStorage · GitHub，grevory/angular-local-storage · GitHub。下面使用ngStorage来简述传参过程：
(1) 上传参数到localStorage - Controller A
?
1
2
3
4
5
6
7
8
9
10
11	// 定义并初始化localStorage中的counter属性
$scope.$storage = $localStorage.$default({
 counter: 0
});
 
// 假设某个factory（此例暂且命名为counterFactory）中的updateCounter()方法
// 可以用于更新参数counter
counterFactory.updateCounter().then(function (data) {
 // 将新的counter值上传到localStorage中
 $scope.$storage.counter = data.counter;
});
(2) 监听localStorage中的参数变化 - Controller B
?
1
2
3
4
5	$scope.counter = $localStorage.counter;
$scope.$watch('counter', function(newVal, oldVal) {
 // 监听变化，并获取参数的最新值
 $log.log('newVal: ', newVal); 
});


var httpPost = function($httpProvider) {
  /*******************************************
  说明：$http的post提交时，纠正消息体
  ********************************************/
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  /*
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for (name in obj) {
      value = obj[name];
      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
//这里的最后结果究竟是遍历完所有（属性及属性下的属性）还是死循环。
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  };
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [
    function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }
  ];
};
var ngApp = angular.module('wtApp', ['ngCookies'], httpPost);


调用
$http({
  method: 'POST',
  url: 'GetData.ashx',
  params: { id: '1002' },//params作为url的参数
  data: { keyName: 'qubernet' }//作为消息体参数
}, function (data) {
});














Angularjs中，$http以post在消息体中传递参数，需要做以下修改，以确保消息体传递参数的正确性。
一、在声明应用的时候进行设置：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44	var httpPost = function($httpProvider) {
  /*******************************************
  说明：$http的post提交时，纠正消息体
  ********************************************/
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  /*
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for (name in obj) {
      value = obj[name];
      if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value instanceof Object) {
        for (subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  };
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [
    function(data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }
  ];
};
var ngApp = angular.module('wtApp', ['ngCookies'], httpPost);
二、调用$http post
?
1
2
3
4
5
6
7	$http({
  method: 'POST',
  url: 'GetData.ashx',
  params: { id: '1002' },//params作为url的参数
  data: { keyName: 'qubernet' }//作为消息体参数
}, function (data) {
});
基本思路
思路一（origin:master）：从维基百科的某个分类（比如：航空母舰（key））页面开始，找出链接的title属性中包含key（航空母舰）的所有目标，加入到待抓取队列中。这样，抓一个页面的代码及其图片的同时，也获取这个网页上所有与key相关的其它网页的地址，采取一个类广度优先遍历的算法来完成此任务。
思路二（origin:cat）：按分类进行抓取。注意到，维基百科上，分类都以Category:开头，由于维基百科有很好的文档结构，很容易从任一个分类，开始，一直把其下的所有分类全都抓取下来。这个算法对分类页面，提取子分类，且并行抓取其下所有页面，速度快，可以把分类结构保存下来，但其实有很多的重复页面，不过这个可以后期写个脚本就能很容易的处理。
库的选择
开始想用jsdom，虽然感觉它功能强大，但也比较“重”，最要命的是说明文档不够好，只说了它的优势，没一个全面的说明。因此，换成cheerio，轻量级，功能比较全，至少文档一看就能有一个整体概念。其实做到后来，才发现根本不需要库，用正则表达式就能搞定一切！用库只是少写了一点正则而矣。
关键点
全局变量设定：
?
1
2
3	var regKey = ['航空母舰','航空母艦','航母'];  //链接中若包含此中关键词，即为目标
var allKeys = [];              //链接的title，也是页面标识，避免重复抓取
var keys = ['Category:%E8%88%AA%E7%A9%BA%E6%AF%8D%E8%88%B0'];  //等待队列，起始页
图片下载
使用request库的流式操作，让每一个下载操作形成闭包。注意异步操作可能带来的副作用。另外，图片名字要重新设定，开始我取原名，不知道为什么，有的图明明存在，就是显示不出来；并且要把srcset属性清理掉，不然本面显示不出来。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18	$ = cheer.load(downHtml);
 var rsHtml = $.html();
 var imgs = $('#bodyContent .image');    //图片都由这个样式修饰
 for(img in imgs){
  if(typeof imgs[img].attribs === 'undefined' || typeof imgs[img].attribs.href === 'undefined')
   {continue;}  //结构为链接下的图片，链接不存在，跳过
  else
   {
    var picUrl = imgs[img].children[0].attribs.src;  //图片地址
    var dirs = picUrl.split('.');
    var filename = baseDir+uuid.v1()+'.'+dirs[dirs.length -1];  //重新命名
 
    request("https:"+picUrl).pipe(fs.createWriteStream('pages/'+filename));  //下载
 
    rsHtml = rsHtml.replace(picUrl,filename);  //换成本地路径
    // console.log(picUrl);
   }
 }
广度优先遍历
开始没能完全理解异步的概念，以循环方式来做，以为使用了Promise，就已经全转化为同步了，但其实只是能保证交给promise的操作会有序进行，并不能让这些操作与其它的操作有序化！如，下面的代码就是不正确的。
?
1
2
3
4
5
6
7
8
9
10
11
12
13	var keys = ['航空母舰'];
var key = keys.shift();
while(key){
 data.get({
  url:encodeURI(key),
  qs:null
 }).then(function(downHtml){
    ...
    keys.push(key);        //(1)
  }
 });
key = keys.shift();          //(2）
}
上面的操作看试很正常，但其实（2）会在（1）之间被运行！哪怎么办？
我使用递归来解决这个问题。如下示例代码：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17	var key = keys.shift();
(function doNext(key){
 data.get({
  url:key,
  qs:null
 }).then(function(downHtml){
  ...
  keys.push(href);
  ...
  key = keys.shift();
  if(key){
   doNext(key);
  }else{
   console.log('抓取任务顺利完成。')
  }
 })
})(key);
正则清理
使用正则表达式清理无用的页面代码，因为有很多模式需要处理，写了一个循环统一处理。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14	var regs = [/<link rel=\"stylesheet\" href=\"?[^\"]*\">/g,
  /<script>?[^<]*<\/script>/g,
 /<style>?[^<]*<\/style>/g,
 /<a ?[^>]*>/g,
 /<\/a>/g,
 /srcset=(\"?[^\"]*\")/g
 ]
 regs.forEach(function(rs){
  var mactches = rsHtml.match(rs);
  for (var i=0;i < mactches.length ; i++)
  {
   rsHtml = rsHtml.replace(mactches[i],mactches[i].indexOf('stylesheet')>-1?'<link rel="stylesheet" href="wiki'+(i+1)+'.css"':'');
  }
 })
运行效果
上维基中文是需要FQ的，试运行了一下，抓取 航空母舰 分类，运行过程中，发现了三百左右的相关链接（包括分类页面，这些页面我是只取有效链接，不下载），最终正确的下载了209个，手工测试了一些出错链接，发现都为无效链接，显示该词条还未建立，整个过程大概花了不到十五分钟，压缩后近三十M，感觉效果还不错。
源代码
https://github.com/zhoutk/wikiSpider
小结
到昨晚基本完成任务，思路一能够抓取内容比较准确的页面，而且页面不重复，但抓取效率不高，分类信息无法准确获得；思路二能够按维基百科的分类，自动抓取并分门别类的把文件存储到本地，效率高（实测，抓取【军舰】类，共抓取页面近六千个，费时五十来分钟，每分钟能抓取超过一百个页面），能准确的保存分类信息。


说到流，就涉及到一个*nix的概念：管道——在*nix中，流在Shell中被实现为可以通过 |(管道符) 进行桥接的数据，一个进程的输出（stdout）可被直接作为下一个进程的输入（stdin）。
在Node中，流（Stream）的概念与之类似，代表一种数据流可供桥接的能力。
pipe
流化的精髓在于 .pipe()方法。可供桥接的能力，在于数据流的两端（上游/下游 或称为 读/写流）以一个 .pipe(）方法进行桥接。

伪代码的表现形式为：
复制代码 代码如下:

//上游.pipe（下游)
Readable.pipe(Writable);
流的分类
这里并不打算讨论所谓的Node  v0.4 之前的“经典”流。那么，流分为这么几类（皆为抽象接口：
1.stream.Readable    可读流（需要实现_read方法，关注点在于对数据流读取的细节
2.stream.Writable     可写流（需要实现_write方法，关注点在于对数据流写入的细节
3.stream.Duplex        可读/写流（需要实现以上两接口，关注点为以上两接口的细节
4.stream.Transform  继承自Duplex（需要实现_transform方法，关注点在于对数据块的处理
简单来说：
1）.pipe() 的拥有者一定具备 Readable 流（并不局限于）能力，它拥有 'readable'/'data'/'end'/'close'/'error' 一系列事件可供订阅，也提供 .read()/.pause()/.resume()等一系列方法供调用；
2）.pipe() 的参数一定具备Writable 流（并不局限于 ）能力，它拥有 'drain'/'pipe'/'unpipe'/'error'/'finish' 事件可供访问，也提供 .write()/.end() 等一系列方法供调用
什么鬼
有没有一丝丝焦虑？别急，做为一个说人话的低级码工，我会把Stream掰开了和您扯一扯的。
Stream类，在 Node.js的源码 里，是这么定义的：
复制代码 代码如下:

var EE = require('events').EventEmitter;
var util = require('util');
util.inherits(Stream, EE);
 
function Stream() {
  EE.call(this);
}
可以看出，本质上，Stream是一个EventEmitter，那意味着它具备事件驱动的功能（.emit/.on...）。众所周知，“Node.js 就是基于V8的事件驱动平台”，实现了事件驱动的流式编程，具备了和Node一样的异步回调的特征。
比如在 Readable 流中，有一个 readable 事件，在一个暂停的只读流中，只要有数据块准备好可读时，它就会被发送给订阅者（Readable 流有哪些呢？express中的 req，ftp或者mutli-form上传组件的req.part，系统中的标准输入 process.stdin等）。有了readable 事件，我们可以做个处理shell 命令输出的分析器之类的工具：
复制代码 代码如下:

process.stdin.on('readable', function(){
   var buf = process.stdin.read();
   if(buf){
      var data = buf.toString();
      // parsing data ...                                                
   }
});
这样调用：
复制代码 代码如下:

head -10 some.txt | node parser.js
对于 Readable 流，我们还可以订阅它的 data 和 end 事件，以获取数据块并在流枯竭时获得通知，如 经典socket示例 中那样：
复制代码 代码如下:

req.on('connect', function(res, socket, head) {
    socket.on('data', function(chunk) {
      console.log(chunk.toString());
    });
    socket.on('end', function() {
      proxy.close();
    });
  });
Readable流状态的切换
需要注意的是，Readable 流有两种状态：flowing mode（激流） 和 pause  mode（暂停）。前者根本停不下来，谁被pipe上了就马上不停的给；后者会暂停，直到下游显式的调用 Stream.read() 请求才读取数据块。Readable 流初始化时是 pause mode的。
这两种状态可以互为切换的，其中，
有以下任一行为，pause 转 flowing：
1.对 Readable 流添加一个data事件订阅
2.对 Readable 调用 .resume() 显式开启flowing
3.调用 Readable 流的 .pipe(writable) ，桥接到一个 Writable 流上
有以下任一行为，flowing 转回 pause：
1.Readable 流还没有 pipe 到任何流上，可调 .pause() 暂停
2.Readable 流已经 pipe 到了流上，需 remove 掉所有 data 事件订阅，并且调用 .unpipe()方法逐一解除与下游流的关系
妙用
结合流的异步特性，我可以写出这样的应用：直接将 用户A 的输出桥接到 用户B 的页面上输出：
复制代码 代码如下:

router.post('/post', function(req, res) {
    var destination = req.headers['destination']; //发给谁
    cache[destionation] = req;
    //是的，并不返回，所以最好是个ajax请求
});
用户B请求的时候：
复制代码 代码如下:

router.get('/inbox', function(req, res){
    var user = req.headers['user'];
    cache.find(user, function(err, previousReq){ //找到之前存的req
       var form = new multiparty.Form();
       form.parse(previousReq);  // 有文件给我
       form.on('part', function (part) {
            part.pipe(res); //流式大法好:)
 
            part.on('error', function (err) {
                console.log(err);
                messaging.setRequestDone(uniqueID);
                return res.end(err);
            });
        });
    });
});




Stream在node.js中是一个抽象的接口，基于EventEmitter，也是一种Buffer的高级封装，用来处理流数据。流模块便是提供各种API让我们可以很简单的使用Stream。
流分为四种类型，如下所示：
Readable，可读流
Writable，可写流
Duplex，读写流
Transform，扩展的Duplex，可修改写入的数据
1、Readable可读流
通过stream.Readable可创建一个可读流，它有两种模式：暂停和流动。
在流动模式下，将自动从下游系统读取数据并使用data事件输出；暂停模式下，必须显示调用stream.read()方法读取数据，并触发data事件。
所有的可读流最开始都是暂停模式，可以通过以下方法切换到流动模式：
监听'data'事件
调用stream.resume()方法
调用stream.pipe()方法将数据输出到一个可写流Writable
同样地，也可以切换到暂停模式，有两种方法：
如果没有设置pipe目标，调用stream.pause()方法即可。
如果设置了pipe目标，则需要移除所有的data监听和调用stream.unpipe()方法
在Readable对象中有一个_readableSate的对象，通过该对象可以得知流当前处于什么模式，如下所示：
readable._readableState.flowing = null，没有数据消费者，流不产生数据
readable._readableState.flowing = true，处于流动模式
readable._readableState.flowing = false，处于暂停模式
为什么使用流取数据
对于小文件，使用fs.readFile()方法读取数据更方便，但需要读取大文件的时候，比如几G大小的文件，使用该方法将消耗大量的内存，甚至使程序崩溃。这种情况下，使用流来处理是更合适的，采用分段读取，便不会造成内存的'爆仓'问题。
data事件
在stream提供数据块给消费者时触发，有可能是切换到流动模式的时候，也有可能是调用readable.read()方法且有有效数据块的时候，使用如下所示：
?
1
2
3
4
5
6
7
8
9
10
11
12
const fs = require('fs');
 
const rs = fs.createReadStream('./appbak.js');
var chunkArr = [],
  chunkLen = 0;
rs.on('data',(chunk)=>{
  chunkArr.push(chunk);
  chunkLen+=chunk.length;
});
rs.on('end',(chunk)=>{
  console.log(Buffer.concat(chunkArr,chunkLen).toString());
});
readable事件
当流中有可用数据能被读取时触发，分为两种，新的可用的数据和到达流的末尾，前者stream.read()方法返回可用数据，后者返回null，如下所示：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
const rs = fs.createReadStream('./appbak.js');
var chunkArr = [],
  chunkLen = 0;
 
rs.on('readable',()=>{
  var chunk = null;
  //这里需要判断是否到了流的末尾
  if((chunk = rs.read()) !== null){
    chunkArr.push(chunk);
    chunkLen+=chunk.length;
  }
});
rs.on('end',(chunk)=>{
  console.log(Buffer.concat(chunkArr,chunkLen).toString());
});
pause和resume方法
stream.pause()方法让流进入暂停模式，并停止'data'事件触发，stream.resume()方法使流进入流动模式，并恢复'data'事件触发，也可以用来消费所有数据，如下所示：
?
1
2
3
4
5
6
7
8
9
10
11
12
const rs = fs.createReadStream('./下载.png');
rs.on('data',(chunk)=>{
  console.log(`接收到${chunk.length}字节数据...`);
  rs.pause();
  console.log(`数据接收将暂停1.5秒.`);
  setTimeout(()=>{
    rs.resume();
  },1000);
});
rs.on('end',(chunk)=>{
  console.log(`数据接收完毕`);
});
pipe(destination[, options])方法
pipe()方法绑定一个可写流到可读流上，并自动切换到流动模式，将所有数据输出到可写流，以及做好了数据流的管理，不会发生数据丢失的问题，使用如下所示：
?
1
2
const rs = fs.createReadStream('./app.js');
rs.pipe(process.stdout);
以上介绍了多种可读流的数据消费的方法，但对于一个可读流，最好只选择其中的一种，推荐使用pipe()方法。
2、Writable可写流
所有的可写流都是基于stream.Writable类创建的，创建之后便可将数据写入该流中。
write(chunk[, encoding][, callback])方法
write()方法向可写流中写入数据，参数含义：
chunk，字符串或buffer
encoding，若chunk为字符串，则是chunk的编码
callback，当前chunk数据写入磁盘时的回调函数
该方法的返回值为布尔值，如果为false，则表示需要写入的数据块被缓存并且此时缓存的大小超出highWaterMark阀值，否则为true。
 使用如下所示：
?
1
2
3
const ws = fs.createWriteStream('./test.txt');
ws.write('nihao','utf8',()=>{process.stdout.write('this chunk is flushed.');});
ws.end('done.')
背压机制
如果可写流的写入速度跟不上可读流的读取速度，write方法添加的数据将被缓存，逐渐增多，导致占用大量内存。我们希望的是消耗一个数据，再去读取一个数据，这样内存就维持在一个水平上。如何做到这一点？可以利用write方法的返回值来判断可写流的缓存状态和'drain'事件，及时切换可读流的模式，如下所示：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
function copy(src,dest){
  src = path.resolve(src);
  dest = path.resolve(dest);
  const rs = fs.createReadStream(src);
  const ws = fs.createWriteStream(dest);
  console.log('正在复制中...');
  const stime = +new Date();
  rs.on('data',(chunk)=>{
    if(null === ws.write(chunk)){
      rs.pause();
    }
  });
  ws.on('drain',()=>{
    rs.resume();
  });
  rs.on('end',()=>{
    const etime = +new Date();
    console.log(`已完成，用时：${(etime-stime)/1000}秒`);
    ws.end();
  });
  function calcProgress(){
     
  }
}
copy('./CSS权威指南 第3版.pdf','./javascript.pdf');
drain事件
如果Writable.write()方法返回false，则drain事件将会被触发，上面的背压机制已经使用了该事件。
finish事件
在调用stream.end()方法之后且所有缓存区的数据都被写入到下游系统，就会触发该事件，如下所示：
?
1
2
3
4
5
6
7
8
9
const ws = fs.createWriteStream('./alphabet.txt');
const alphabetStr = 'abcdefghijklmnopqrstuvwxyz';
ws.on('finish',()=>{
  console.log('done.');
});
for(let letter of alphabetStr.split()){
  ws.write(letter);
}
ws.end();//必须调用
end([chunk][, encoding][, callback])方法
end()方法被调用之后，便不能再调用stream.write()方法写入数据，负责将抛出错误。
3、Duplex读写流
Duplex流同时实现了Readable与Writable类的接口，既是可读流，也是可写流。例如'zlib streams'、'crypto streams'、'TCP sockets'等都是Duplex流。
4、Transform流
Duplex流的扩展，区别在于，Transform流自动将写入端的数据变换后添加到可读端。例如：'zlib streams'、'crypto streams'等都是Transform流。
5、四种流的实现
stream模块提供的API可以让我们很简单的实现流，该模块使用require('stream')引用，我们只要继承四种流中的一个基类(stream.Writable, stream.Readable, stream.Duplex, or stream.Transform)，然后实现它的接口就可以了，需要实现的接口如下所示：
| Use-case | Class | Method(s) to implement |
 | ------------- |-------------| -----|
 | Reading only | Readable | _read |
 | Writing only | Writable | _write, _writev |
 | Reading and writing | Duplex | _read, _write, _writev |
 | Operate on written data, then read the result | Transform | _transform, _flush |
Readable流实现
如上所示，我们只要继承Readable类并实现_read接口即可，，如下所示：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
const Readable = require('stream').Readable;
const util = require('util');
const alphabetArr = 'abcdefghijklmnopqrstuvwxyz'.split();
/*function AbReadable(){
  if(!this instanceof AbReadable){
    return new AbReadable();
  }
  Readable.call(this);
}
util.inherits(AbReadable,Readable);
AbReadable.prototype._read = function(){
  if(!alphabetArr.length){
    this.push(null);
  }else{
    this.push(alphabetArr.shift());
  }
};
 
const abReadable = new AbReadable();
abReadable.pipe(process.stdout);*/
 
/*class AbReadable extends Readable{
  constructor(){
    super();
  }
  _read(){
    if(!alphabetArr.length){
      this.push(null);
    }else{
      this.push(alphabetArr.shift());
    }
  }
}
const abReadable = new AbReadable();
abReadable.pipe(process.stdout);*/
 
/*const abReadable = new Readable({
  read(){
    if(!alphabetArr.length){
      this.push(null);
    }else{
      this.push(alphabetArr.shift());
    }
  }
});
abReadable.pipe(process.stdout);*/
 
const abReadable = Readable();
abReadable._read = function(){
  if (!alphabetArr.length) {
    this.push(null);
  } else {
    this.push(alphabetArr.shift());
  }
}
abReadable.pipe(process.stdout);
以上代码使用了四种方法创建一个Readable可读流，必须实现_read()方法，以及用到了readable.push()方法，该方法的作用是将指定的数据添加到读取队列。
Writable流实现
我们只要继承Writable类并实现_write或_writev接口，如下所示(只使用两种方法)：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
/*class MyWritable extends Writable{
  constructor(){
    super();
  }
  _write(chunk,encoding,callback){
    process.stdout.write(chunk);
    callback();
  }
}
const myWritable = new MyWritable();*/
const myWritable = new Writable({
  write(chunk,encoding,callback){
    process.stdout.write(chunk);
    callback();
  }
});
myWritable.on('finish',()=>{
  process.stdout.write('done');
})
myWritable.write('a');
myWritable.write('b');
myWritable.write('c');
myWritable.end();
Duplex流实现
实现Duplex流，需要继承Duplex类，并实现_read和_write接口，如下所示：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
class MyDuplex extends Duplex{
  constructor(){
    super();
    this.source = [];
  }
  _read(){
    if (!this.source.length) {
      this.push(null);
    } else {
      this.push(this.source.shift());
    }
  }
  _write(chunk,encoding,cb){
    this.source.push(chunk);
    cb();
  }
}
 
const myDuplex = new MyDuplex();
myDuplex.on('finish',()=>{
  process.stdout.write('write done.')
});
myDuplex.on('end',()=>{
  process.stdout.write('read done.')
});
myDuplex.write('\na\n');
myDuplex.write('c\n');
myDuplex.end('b\n');
myDuplex.pipe(process.stdout);
上面的代码实现了_read()方法，可作为可读流来使用，同时实现了_write()方法，又可作为可写流来使用。
Transform流实现
实现Transform流，需要继承Transform类，并实现_transform接口，如下所示：
class MyTransform extends Transform{
  constructor(){
    super();
  }
  _transform(chunk, encoding, callback){
    chunk = (chunk+'').toUpperCase();
    callback(null,chunk);
  }
}
const myTransform = new MyTransform();
myTransform.write('hello world!');
myTransform.end();
myTransform.pipe(process.stdout);
上面代码中的_transform()方法，其第一个参数，要么为error，要么为null，第二个参数将被自动转发给readable.push()方法，因此该方法也可以使用如下写法：
_transform(chunk, encoding, callback){
  chunk = (chunk+'').toUpperCase()
  this.push(chunk)
  callback();
}
Object Mode流实现
我们知道流中的数据默认都是Buffer类型，可读流的数据进入流中便被转换成buffer，然后被消耗，可写流写入数据时，底层调用也将其转化为buffer。但将构造函数的objectMode选择设置为true，便可产生原样的数据，如下所示：
const rs = Readable();
rs.push('a');
rs.push('b');
rs.push(null);
rs.on('data',(chunk)=>{console.log(chunk);});//<Buffer 61>与<Buffer 62>
 
const rs1 = Readable({objectMode:!0});
rs1.push('a');
rs1.push('b');
rs1.push(null);
rs1.on('data',(chunk)=>{console.log(chunk);});//a与b
下面利用Transform流实现一个简单的CSS压缩工具，如下所示：
function minify(src,dest){
  const transform = new Transform({
    transform(chunk,encoding,cb){
      cb(null,(chunk.toString()).replace(/[\s\r\n\t]/g,''));
    }
  });
  fs.createReadStream(src,{encoding:'utf8'}).pipe(transform).pipe(fs.createWriteStream(dest));
}
minify('./reset.css','./reset.min.css');



node中的I/O是异步的，因此对磁盘和网络的读写需要通过回调函数来读取数据，下面是一个文件下载服务器的简单代码：
?
1
2
3
4
5
6
7
8
<code class="hljs javascript">var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
fs.readFile(__dirname + '/data.txt', function (err, data) {
res.end(data);
});
});
server.listen(8000);</code>
这些代码可以实现需要的功能，但是服务在发送文件数据之前需要缓存整个文件数据到内存，如果"data.txt"文件很大且并发量很大的话，会浪费很多内存。因为用户需要等到整个文件缓存到内存才能接受的文件数据，这样导致用户体验相当不好。不过还好(req, res)两个参数都是Stream，这样我们可以用fs.createReadStream()代替fs.readFile():
?
1
2
3
4
5
6
7
<code class="hljs javascript">var http = require('http');
var fs = require('fs');
var server = http.createServer(function (req, res) {
var stream = fs.createReadStream(__dirname + '/data.txt');
stream.pipe(res);
});
server.listen(8000);</code>
.pipe()方法监听fs.createReadStream()的'data' 和'end'事件，这样"data.txt"文件就不需要缓存整个文件，当客户端连接完成之后马上可以发送一个数据块到客户端。使用.pipe()另一个好处是可以解决当客户端延迟非常大时导致的读写不平衡问题。如果想压缩文件再发送，可以使用三方模块实现：
?
1
2
3
4
5
6
7
8
<code class="hljs javascript">var http = require('http');
var fs = require('fs');
var oppressor = require('oppressor');
var server = http.createServer(function (req, res) {
var stream = fs.createReadStream(__dirname + '/data.txt');
stream.pipe(oppressor(req)).pipe(res);
});
server.listen(8000);</code>
这样文件就会对支持gzip和deflate的浏览器进行压缩。oppressor 模块会处理所有的content-encoding。
Stream使开发程序变得简单。
3、基础概念
有五种基本的Stream: readable, writable, transform, duplex, and”classic”.
3-1、pipe
所有类型的Stream收是使用 .pipe() 来创建一个输入输出对，接收一个可读流src并将其数据输出到可写流dst，如下：
?
1
<code class="hljs perl">src.pipe(dst)</code>
.pipe( dst )方法为返回dst流，这样就可以接连使用多个.pipe()，如下：
?
1
<code class="hljs perl">a.pipe( b ).pipe( c ).pipe( d )</code>
功能与下面的代码相同：
?
1
2
3
<code class="hljs perl">a.pipe( b );
b.pipe( c );
c.pipe( d );</code>
3-2、readable streams
通过调用Readable streams的 .pipe()方法可以把Readable streams的数据写入一个Writable , Transform, 或者Duplex stream。
?
1
<code class="hljs perl">readableStream.pipe( dst )</code>
1>创建 readable stream
这里我们创建一个readable stream!
?
1
2
3
4
5
6
7
8
9
<code class="hljs perl">var Readable = require('stream').Readable;
var rs = new Readable;
rs.push('beep ');
rs.push('boop\n');
rs.push(null);
rs.pipe(process.stdout);
$ node read0.js
beep boop
</code>
rs.push( null ) 通知数据接收者数据已经发送完毕.
注意到我们在将所有数据内容压入可读流之前并没有调用rs.pipe(process.stdout);，但是我们压入的所有数据内容还是完全的输出了，这是因为可读流在接收者没有读取数据之前，会缓存所有压入的数据。但是在很多情况下, 更好的方法是只有数据接收着请求数据的时候，才压入数据到可读流而不是缓存整个数据。下面我们重写 一下._read()函数：
?
1
2
3
4
5
6
7
8
9
10
<code class="hljs javascript">var Readable = require('stream').Readable;
var rs = Readable();
var c = 97;
rs._read = function () {
rs.push(String.fromCharCode(c++));
if (c > 'z'.charCodeAt(0)) rs.push(null);
};
rs.pipe(process.stdout);</code>
<code class="hljs bash">$ node read1.js
abcdefghijklmnopqrstuvwxyz</code>
上面的代码通过重写_read()方法实现了只有在数据接受者请求数据才向可读流中压入数据。_read()方法也可以接收一个size参数表示数据请求着请求的数据大小，但是可读流可以根据需要忽略这个参数。
注意我们也可以用util.inherits()继承可读流。为了说明只有在数据接受者请求数据时_read()方法才被调用，我们在向可读流压入数据时做一个延时，如下：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
<code class="hljs javascript">var Readable = require('stream').Readable;
var rs = Readable();
var c = 97 - 1;
rs._read = function () {
if (c >= 'z'.charCodeAt(0)) return rs.push(null);
setTimeout(function () {
rs.push(String.fromCharCode(++c));
}, 100);
};
rs.pipe(process.stdout);
process.on('exit', function () {
console.error('\n_read() called ' + (c - 97) + ' times');
});
process.stdout.on('error', process.exit);</code>
用下面的命令运行程序我们发现_read()方法只调用了5次：
?
1
2
3
<code class="hljs bash">$ node read2.js | head -c5
abcde
_read() called 5 times</code>
使用计时器的原因是系统需要时间来发送信号来通知程序关闭管道。使用process.stdout.on('error', fn) 是为了处理系统因为header命令关闭管道而发送SIGPIPE信号，因为这样会导致process.stdout触发EPIPE事件。如果想创建一个的可以压入任意形式数据的可读流，只要在创建流的时候设置参数objectMode为true即可，例如：Readable({ objectMode: true })。
2>读取readable stream数据
大部分情况下我们只要简单的使用pipe方法将可读流的数据重定向到另外形式的流，但是在某些情况下也许直接从可读流中读取数据更有用。如下：
?
1
2
3
4
5
6
7
8
9
<code class="hljs php">process.stdin.on('readable', function () {
var buf = process.stdin.read();
console.dir(buf);
});
$ (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume0.js 
<buffer 0a="" 61="" 62="" 63="">
<buffer 0a="" 64="" 65="" 66="">
<buffer 0a="" 67="" 68="" 69="">
null</buffer></buffer></buffer></code>
当可读流中有数据可读取时，流会触发'readable' 事件，这样就可以调用.read()方法来读取相关数据，当可读流中没有数据可读取时，.read() 会返回null，这样就可以结束.read() 的调用， 等待下一次'readable' 事件的触发。下面是一个使用.read(n)从标准输入每次读取3个字节的例子：
?
1
2
3
4
<code class="hljs javascript">process.stdin.on('readable', function () {
var buf = process.stdin.read(3);
console.dir(buf);
});</code>
如下运行程序发现，输出结果并不完全!
?
1
2
3
4
<code class="hljs bash">$ (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume1.js 
<buffer 61="" 62="" 63="">
<buffer 0a="" 64="" 65="">
<buffer 0a="" 66="" 67=""></buffer></buffer></buffer></code>
这是应为额外的数据数据留在流的内部缓冲区里了，而我们需要通知流我们要读取更多的数据.read(0)可以达到这个目的。
?
1
2
3
4
5
<code class="hljs javascript">process.stdin.on('readable', function () {
var buf = process.stdin.read(3);
console.dir(buf);
process.stdin.read(0);
});</code>
这次运行结果如下：
?
1
2
3
<code class="hljs xml">$ (echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume2.js 
<buffer 0a="" 64="" 65="">
<buffer 0a="" 68="" 69=""></buffer></buffer></code>
我们可以使用 .unshift() 将数据重新押回流数据队列的头部，这样可以接续读取押回的数据。如下面的代码，会按行输出标准输入的内容：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
<code class="hljs javascript">var offset = 0;
process.stdin.on('readable', function () {
var buf = process.stdin.read();
if (!buf) return;
for (; offset < buf.length; offset++) {
if (buf[offset] === 0x0a) {
console.dir(buf.slice(0, offset).toString());
buf = buf.slice(offset + 1);
offset = 0;
process.stdin.unshift(buf);
return;
}
}
process.stdin.unshift(buf);
});
$ tail -n +50000 /usr/share/dict/american-english | head -n10 | node lines.js 
'hearties'
'heartiest'
'heartily'
'heartiness'
'heartiness\'s'
'heartland'
'heartland\'s'
'heartlands'
'heartless'
'heartlessly'</code>
当然，有很多模块可以实现这个功能，如：split 。
3-3、writable streams
writable streams只可以作为.pipe()函数的目的参数。如下代码：
?
1
<code class="hljs perl">src.pipe( writableStream );</code>
1>创建 writable stream
重写 ._write(chunk, enc, next) 方法就可以接受一个readable stream的数据。
?
1
2
3
4
5
6
7
8
9
10
<code class="hljs php">var Writable = require('stream').Writable;
var ws = Writable();
ws._write = function (chunk, enc, next) {
console.dir(chunk);
next();
};
process.stdin.pipe(ws);
$ (echo beep; sleep 1; echo boop) | node write0.js 
<buffer 0a="" 62="" 65="" 70="">
<buffer 0a="" 62="" 6f="" 70=""></buffer></buffer></code>
第一个参数chunk是数据输入者写入的数据。第二个参数end是数据的编码格式。第三个参数next(err)通过回调函数通知数据写入者可以写入更多的时间。如果readable stream写入的是字符串，那么字符串会默认转换为Buffer，如果在创建流的时候设置Writable({ decodeStrings: false })参数，那么不会做转换。如果readable stream写入的数据时对象，那么需要这样创建writable stream
?
1
<code class="hljs css">Writable({ objectMode: true })</code>
2>写数据到 writable stream
调用writable stream的.write(data)方法即可完成数据写入。
?
1
<code class="hljs vala">process.stdout.write('beep boop\n');</code>
调用.end()方法通知writable stream 数据已经写入完成。
?
1
2
3
4
5
6
7
8
9
<code class="hljs javascript">var fs = require('fs');
var ws = fs.createWriteStream('message.txt');
ws.write('beep ');
setTimeout(function () {
ws.end('boop\n');
}, 1000);
$ node writing1.js 
$ cat message.txt
beep boop</code>
如果需要设置writable stream的缓冲区的大小，那么在创建流的时候，需要设置opts.highWaterMark，这样如果缓冲区里的数据超过opts.highWaterMark，.write(data)方法会返回false。当缓冲区可写的时候，writable stream会触发'drain' 事件。
3-4、classic streams
Classic streams比较老的接口了，最早出现在node 0.4版本中，但是了解一下其运行原理还是十分有好
处的。当一个流被注册了"data" 事件的回到函数，那么流就会工作在老版本模式下，即会使用老的API。
1>classic readable streams
Classic readable streams事件就是一个事件触发器，如果Classic readable streams有数据可读取，那么其触发 "data" 事件，等到数据读取完毕时，会触发"end" 事件。.pipe() 方法通过检查stream.readable 的值确定流是否有数据可读。下面是一个使用Classic readable streams打印A-J字母的例子：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
<code class="hljs javascript">var Stream = require('stream');
var stream = new Stream;
stream.readable = true;
var c = 64;
var iv = setInterval(function () {
if (++c >= 75) {
clearInterval(iv);
stream.emit('end');
}
else stream.emit('data', String.fromCharCode(c));
}, 100);
stream.pipe(process.stdout);
$ node classic0.js
ABCDEFGHIJ</code>
如果要从classic readable stream中读取数据，注册"data" 和"end"两个事件的回调函数即可，代码如下：
?
1
2
3
4
5
6
7
8
9
10
<code class="hljs php">process.stdin.on('data', function (buf) {
console.log(buf);
});
process.stdin.on('end', function () {
console.log('__END__');
});
$ (echo beep; sleep 1; echo boop) | node classic1.js 
<buffer 0a="" 62="" 65="" 70="">
<buffer 0a="" 62="" 6f="" 70="">
__END__</buffer></buffer></code>
需要注意的是如果你使用这种方式读取数据，那么会失去使用新接口带来的好处。比如你在往一个 延迟非常大的流写数据时，需要注意读取数据和写数据的平衡问题，否则会导致大量数据缓存在内存中，导致浪费大量内存。一般这时候强烈建议使用流的.pipe()方法，这样就不用自己监听”data” 和”end”事件了，也不用担心读写不平衡的问题了。当然你也可以用 through代替自己监听”data” 和”end” 事件，如下面的代码：
?
1
2
3
4
5
6
7
8
9
10
11
12
<code class="hljs php">var through = require('through');
process.stdin.pipe(through(write, end));
function write (buf) {
console.log(buf);
}
function end () {
console.log('__END__');
}
$ (echo beep; sleep 1; echo boop) | node through.js 
<buffer 0a="" 62="" 65="" 70="">
<buffer 0a="" 62="" 6f="" 70="">
__END__</buffer></buffer></code>
或者也可以使用concat-stream来缓存整个流的内容：
?
1
2
3
4
5
6
<code class="hljs oxygene">var concat = require('concat-stream');
process.stdin.pipe(concat(function (body) {
console.log(JSON.parse(body));
}));
$ echo '{"beep":"boop"}' | node concat.js 
{ beep: 'boop' }</code>
当然如果你非要自己监听"data" 和"end"事件，那么你可以在写数据的流不可写的时候使用.pause()方法暂停Classic readable streams继续触发”data” 事件。等到写数据的流可写的时候再使用.resume() 方法通知流继续触发"data" 事件继续读取
数据。
2>classic writable streams
Classic writable streams 非常简单。只有 .write(buf), .end(buf)和.destroy()三个方法。.end(buf) 方法的buf参数是可选的，如果选择该参数，相当于stream.write(buf); stream.end() 这样的操作，需要注意的是当流的缓冲区写满即流不可写时.write(buf)方法会返回false，如果流再次可写时，流会触发drain事件。
4、transform
transform是一个对读入数据过滤然输出的流。
5、duplex
duplex stream是一个可读也可写的双向流，如下面的a就是一个duplex stream:
?
1
<code class="hljs livecodeserver">a.pipe(b).pipe(a)</code>
缓冲（buffer）模块
js起初就是为浏览器而设计的，所以能很好的处理unicode编码的字符串，但不能很好的处理二进制数据。这是Node.js的一个问题，因为Node.js旨在网络上发送和接收经常是以二进制格式传输的数据。比如：
 - 通过TCP连接发送和接收数据；
 - 从图像或者压缩文件读取二进制数据；
 - 从文件系统读写数据；
 - 处理来自网络的二进制数据流
而Buffer模块为Node.js带来了一种存储原始数据的方法，于是可以再js的上下文中使用二进制数据。每当需要在Node.js中处理I/O操作中移动的数据时，就有可能使用Buffer模块。
类：Buffer
Buffer 类是一个全局变量类型，用来直接处理2进制数据的。 它能够使用多种方式构建。
原始数据保存在 Buffer 类的实例中。一个 Buffer 实例类似于一个整数数组
1.new Buffer(size):分配一个新的 buffer 大小是 size 的8位字节. 
2.new Buffer(array):分配一个新的 buffer 使用一个8位字节 array 数组. 
3.new Buffer(str, [encoding]):encoding String类型 - 使用什么编码方式，参数可选.
4.类方法: Buffer.isEncoding(encoding):如果给定的编码 encoding 是有效的，返回 true，否则返回 false。 
5.类方法: Buffer.isBuffer(obj):测试这个 obj 是否是一个 Buffer. 返回Boolean
6.类方法: Buffer.concat(list, [totalLength])：list {Array}数组类型，Buffer数组，用于被连接。totalLength {Number}类型 上述Buffer数组的所有Buffer的总大小。
除了可以读取文件得到Buffer的实例外，还能够直接构造，例如：
复制代码代码如下:

var bin = new Buffer([ 0x48, 0x65, 0x6c, 0x6c, 0x6c ]);
Buffer与字符串类似，除了可以用.length属性得到字节长度外，还可以用[index]方式读取指定位置的字节，例如：
复制代码代码如下:

bin[0]; // => 0x48;

Buffer与字符串能够互相转化，例如可以使用指定编码将二进制数据转化为字符串：
复制代码代码如下:

var str = bin.toString('utf-8'); // => "hello"

.slice方法不是返回一个新的Buffer，而更像是返回了指向原Buffer中间的某个位置的指针，如下所示。
复制代码代码如下:

1.[ 0x48, 0x65, 0x6c, 0x6c, 0x6c ]
2.    ^           ^
3.    |           |
4.   bin     bin.slice(2)
写入缓冲区
复制代码代码如下:

var buffer = new Buffer(8);//创建一个分配了8个字节内存的缓冲区
console.log(buffer.write('a','utf8'));//输出1

这会将字符"a"写入缓冲区，node返回经过编码以后写入缓冲区的字节数量，这里的字母a的utf-8编码占用1个字节。
复制缓冲区
Node.js提供了一个将Buffer对象整体内容复制到另一个Buffer对象中的方法。我们只能在已经存在的Buffer对象之间复制，所以必须创建它们。
复制代码代码如下:

buffer.copy(bufferToCopyTo)
其中，bufferToCopyTo是要复制的目标Buffer对象。如下示例：
复制代码代码如下:

var buffer1 = new Buffer(8);
buffer1.write('nice to meet u','utf8');
var buffer2 = new Buffer(8);
buffer1.copy(buffer2);
console.log(buffer2.toString());//nice to meet u
流模块
在UNIX类型的操作系统中，流是个标准的概念。有如下三个主要的流：
1.标准输入
2.标准输出
3.标准错误
可读流
如果说，缓冲区是Node.js处理原始数据的方式的话，那么流通常是Node.js移动数据的方式。Node.js中的流是可读的或者可写的。Node.js中许多模块都使用了流，包括HTTP和文件系统。
假设我们创建一个classmates.txt的文件，并从中读入姓名清单，以便使用这些数据。由于数据是流，这就意味着完成文件读取之前，从收到最初几个字节开始，就可以对数据动作，这是Node.js中的一个常见模式：
复制代码代码如下:

var fs = require('fs');
var stream = fs.ReadStream('classmates.txt');
stream.setEncoding('utf8');
stream.on('data', function (chunk) {
    console.log('read some data')
});
stream.on('close', function () {
    console.log('all the data is read')
});
在以上示例中，在收到新数据时触发事件数据。当文件读取完成后触发关闭事件。
可写流
显然，我们也可以创建可写流以便写数据。这意味着，只要一段简单的脚本，就可以使用流读入文件然后写入另一个文件：
复制代码代码如下:

var fs = require('fs');
var readableStream = fs.ReadStream('classmates.txt');
var writableStream = fs.writeStream('names.txt');
readableStream.setEncoding('utf8');
readableStream.on('data', function (chunk) {
    writableStream.write(chunk);
});
readableStream.on('close', function () {
    writableStream.end();
});
现在，当接收到数据事件时，数据会被写入可写流中。
readable.setEncoding(encoding)：返回: this
readable.resume()：同上。该方法让可读流继续触发 data 事件。
readable.pause()：同上。该方法会使一个处于流动模式的流停止触发 data 事件，切换到非流动模式，并让后续可用数据留在内部缓冲区中。 
类: stream.Writable
Writable（可写）流接口是对您正在写入数据至一个目标的抽象。
1.writable.write(chunk, [encoding], [callback]):
chunk {String | Buffer} 要写入的数据
encoding {String} 编码，假如 chunk 是一个字符串
callback {Function} 数据块写入后的回调
返回: {Boolean} 如果数据已被全部处理则 true。
该方法向底层系统写入数据，并在数据被处理完毕后调用所给的回调。
2.writable.cork():强行滞留所有写入。
滞留的数据会在 .uncork() 或 .end() 调用时被写入。
3.writable.end([chunk], [encoding], [callback])

chunk {String | Buffer} 可选，要写入的数据
encoding {String} 编码，假如 chunk 是一个字符串
callback {Function} 可选，流结束后的回调
在调用 end() 后调用 write() 会产生错误。
复制代码代码如下:

// 写入 'hello, ' 然后以 'world!' 结束
http.createServer(function (req, res) {
  res.write('hello, ');
  res.end('world!');
  // 现在不允许继续写入了
});






串行任务：需要一个接着一个坐的任务叫做串行任务。
可以使用回调的方式让几个异步任务按顺序执行，但如果任务过多，必须组织一下，否则过多的回调嵌套会把代码搞得很乱。
为了用串行化流程控制让几个异步任务按顺序执行，需要先把这些任务按预期的执行顺序放到一个数组中，这个数组将起到队列的作用：完成一个任务后按顺序从数组中取出下一个。
数组中的每个任务都是一个函数。任务完成后应该调用一个处理器函数，告诉它错误状态和结果。
为了演示如何实现串行化流程控制，我们准备做个小程序，让它从一个随机选择的RSS预定源中获取一篇文章的标题和URL，并显示出来。
需要从npm存储苦衷下载两个辅助模块，在命令行中（以mac系统为例）输入以下命令：
?
1
2
3
4
mkdir random_story
cd random_story
npm install request
npm install htmlparser
request模块是个简化的HTTP客户端，可以获取RSS数据。htmlparser模块能够把原始的RSS数据转换成JavaScript数据结构。
在新目录下创建一个random_story.js文件，包含以下代码：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';
//确保包含RSS订阅列表的文件存在
function checkForRSSFile() {
  fs.exists(configFilename, function(exists) {
    if (!exists) {
      return next(new Error('Missing RSS file: ' + configFilename));
    }
    next(null, configFilename);
  });
}
//读取并解析包含RSS订阅列表的文件
function readRSSFile(configFilename) {
  fs.readFile(configFilename, function(err, feedList) {
    if (err) {
      return next(err);
    }
 
    feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n");
    var random = Math.floor(Math.random()*feedList.length);
    next(null, feedList[random]);
  });
}
//向预定源发送HTTP请求以获取数据
function downloadRSSFeed(feedUrl) {
  request({uri: feedUrl}, function(err, res, body) {
    if (err) {
      return next(err);
    }
    if (res.statusCode !== 200) {
      return next(new Error('Abnormal response status code'));
    }
    next(null, body);
  });
}
//解析到一个条目数组中
function parseRSSFeed(rss) {
  var handler = new htmlparser.RssHandler();
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) {
    return next(new Error('No RSS items found.'));
  }
  var item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}
 
var tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
  ];
function next(err, result) {
  if (err) {
    throw err;
  }
  var currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  }
}
//开始执行串行化任务
next();
在试用这个程序之前，现在程序脚本所在的目录下创建一个rss_feeds.txt文件。这里只包含了一条预定源信息：
http://dave.smallpict.com/rss.xml
之后执行脚本：
?
1
node random_story.js

返回信息如上图。成功实现了一个串行化流程控制。
[async/await形式的串行化流程控制]
之后将源代码改写了一下，改写成ES7的async/await形式。水平有限，如有错误请指出！
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
let fs = require('fs');
let request = require('request');
let htmlparser = require('htmlparser');
let configFilename = './rss_feeds.txt';
 
function checkForRSSFile() {
  return new Promise((resolve, reject) => {
    fs.exists(configFilename, (exists) => {
      if (!exists) {
        reject(new Error('Missing RSS file: ' + configFilename));
      }
      resolve();
    });
  });
}
 
function readRSSFile(configFilename) {
  return new Promise((resolve, reject) => {
    fs.readFile(configFilename, (err, feedList) => {
      if (err) {
        reject(err);
      }
      feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n");
      let random = Math.floor(Math.random()*feedList.length);
      resolve(feedList[random]);
    });
  });
}
 
function downloadRSSFeed(feedUrl) {
  return new Promise((resolve, reject) => {
    request({uri: feedUrl}, (err, res, body) => {
      if (err) {
        reject(err);
      }
      if (res.statusCode !== 200) {
        reject(new Error('Abnormal response status code'));
      }
      resolve(body);
    });
  });
}
 
function parseRSSFeed(rss) {
  let handler = new htmlparser.RssHandler();
  let parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) {
    throw new Error('No RSS items found.');
  }
  let item = handler.dom.items.shift();
  console.log(item.title);
  console.log(item.link);
}
 
async function getRSSFeed() {
  await checkForRSSFile();
  let url = await readRSSFile(configFilename);
  let rss = await downloadRSSFeed(url);
  return rss;
}
getRSSFeed().then(rss => parseRSSFeed(rss), e => console.log(e));




nodejs的fs模块并没有提供一个copy的方法，但我们可以很容易的实现一个，比如：
?
1
2
var source = fs.readFileSync('/path/to/source', {encoding: 'utf8'});
fs.writeFileSync('/path/to/dest', source);
这种方式是把文件内容全部读入内存，然后再写入文件，对于小型的文本文件，这没有多大问题，比如grunt-file-copy就是这样实现的。但是对于体积较大的二进制文件，比如音频、视频文件，动辄几个GB大小，如果使用这种方法，很容易使内存“爆仓”。理想的方法应该是读一部分，写一部分，不管文件有多大，只要时间允许，总会处理完成，这里就需要用到流的概念。

如上面高大上的图片所示，我们把文件比作装水的桶，而水就是文件里的内容，我们用一根管子(pipe)连接两个桶使得水从一个桶流入另一个桶，这样就慢慢的实现了大文件的复制过程。
Stream在nodejs中是EventEmitter的实现，并且有多种实现形式，例如：
http responses request
fs read write streams
zlib streams
tcp sockets
child process stdout and stderr
上面的文件复制可以简单实现一下：
var fs = require('fs');
var readStream = fs.createReadStream('/path/to/source');
var writeStream = fs.createWriteStream('/path/to/dest');
 
readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
  writeStream.write(chunk);
});
 
readStream.on('end', function() { // 当没有数据时，关闭数据流
  writeStream.end();
});
上面的写法有一些问题，如果写入的速度跟不上读取的速度，有可能导致数据丢失。正常的情况应该是，写完一段，再读取下一段，如果没有写完的话，就让读取流先暂停，等写完再继续，于是代码可以修改为：
var fs = require('fs');
var readStream = fs.createReadStream('/path/to/source');
var writeStream = fs.createWriteStream('/path/to/dest');
 
readStream.on('data', function(chunk) { // 当有数据流出时，写入数据
  if (writeStream.write(chunk) === false) { // 如果没有写完，暂停读取流
    readStream.pause();
  }
});
 
writeStream.on('drain', function() { // 写完后，继续读取
  readStream.resume();
});
 
readStream.on('end', function() { // 当没有数据时，关闭数据流
  writeStream.end();
});
或者使用更直接的pipe
?
1
2
// pipe自动调用了data,end等事件
fs.createReadStream('/path/to/source').pipe(fs.createWriteStream('/path/to/dest'));
下面是一个更加完整的复制文件的过程
var fs = require('fs'),
  path = require('path'),
  out = process.stdout;
 
var filePath = '/Users/chen/Movies/Game.of.Thrones.S04E07.1080p.HDTV.x264-BATV.mkv';
 
var readStream = fs.createReadStream(filePath);
var writeStream = fs.createWriteStream('file.mkv');
 
var stat = fs.statSync(filePath);
 
var totalSize = stat.size;
var passedLength = 0;
var lastSize = 0;
var startTime = Date.now();
 
readStream.on('data', function(chunk) {
 
  passedLength += chunk.length;
 
  if (writeStream.write(chunk) === false) {
    readStream.pause();
  }
});
 
readStream.on('end', function() {
  writeStream.end();
});
 
writeStream.on('drain', function() {
  readStream.resume();
});
 
setTimeout(function show() {
  var percent = Math.ceil((passedLength / totalSize) * 100);
  var size = Math.ceil(passedLength / 1000000);
  var diff = size - lastSize;
  lastSize = size;
  out.clearLine();
  out.cursorTo(0);
  out.write('已完成' + size + 'MB, ' + percent + '%, 速度：' + diff * 2 + 'MB/s');
  if (passedLength < totalSize) {
    setTimeout(show, 500);
  } else {
    var endTime = Date.now();
    console.log();
    console.log('共用时：' + (endTime - startTime) / 1000 + '秒。');
  }
}, 500);
可以把上面的代码保存为copy.js试验一下
我们添加了一个递归的setTimeout（或者直接使用setInterval）来做一个旁观者，每500ms观察一次完成进度，并把已完成的大小、百分比和复制速度一并写到控制台上，当复制完成时，计算总的耗费时间，效果如图：

我们复制了一集1080p的权利的游戏第四季第7集，大概3.78G大小，由于使用了SSD，可以看到速度还是非常不错的，哈哈哈~ 复制完成后，显示总花费时间

结合nodejs的readline， process.argv等模块，我们可以添加覆盖提示、强制覆盖、动态指定文件路径等完整的复制方法，有兴趣的可以实现一下，实现完成，可以
?
1
ln -s /path/to/copy.js /usr/local/bin/mycopy
这样就可以使用自己写的mycopy命令替代系统的cp命令
以上就是本文的全部内容，希望对大家的学习有所帮助，也希望大家多多支持脚本之家。


Node.js中的流十分强大，它对处理潜在的大文件提供了支持，也抽象了一些场景下的数据处理和传递。正因为它如此好用，所以在实战中我们常常基于它来编写一些工具 函数/库 ，但往往又由于自己对流的某些特性的疏忽，导致写出的 函数/库 在一些情况会达不到想要的效果，或者埋下一些隐藏的地雷。本文将会提供两个在编写基于流的工具时，私以为有些用的两个tips。
一，警惕EVENTEMITTER内存泄露
在一个可能被多次调用的函数中，如果需要给流添加事件监听器来执行某些操作。那么则需要警惕添加监听器而导致的内存泄露：
'use strict';
const fs = require('fs');
const co = require('co');
 
function getSomeDataFromStream (stream) {
 let data = stream.read();
 if (data) return Promise.resolve(data);
 
 if (!stream.readable) return Promise.resolve(null);
 
 return new Promise((resolve, reject) => {
  stream.once('readable', () => resolve(stream.read()));
  stream.on('error', reject);
  stream.on('end', resolve);
 })
}
 
let stream = fs.createReadStream('/Path/to/a/big/file');
 
co(function *() {
 let chunk;
 while ((chunk = yield getSomeDataFromStream(stream)) !== null) {
  console.log(chunk);
 }
}).catch(console.error);
在上述代码中，getSomeDataFromStream函数会在通过监听error事件和end事件，来在流报错或没有数据时，完成这个Promise。然而在执行代码时，我们很快就会在控制台中看到报警信息：(node) warning: possible EventEmitter memory leak detected. 11 error listeners added. Use emitter.setMaxListeners() to increase limit.，因为我们在每次调用该函数时，都为传入的流添加了一个额外的error事件监听器和end事件监听器。为了避免这种潜在的内存泄露，我们要确保每次函数执行完毕后，清除所有此次调用添加的额外监听器，保持函数无污染：
function getSomeDataFromStream (stream) {
 let data = stream.read();
 if (data) return Promise.resolve(data);
 
 if (!stream.readable) return Promise.resolve(null);
 
 return new Promise((resolve, reject) => {
  stream.once('readable', onData);
  stream.on('error', onError);
  stream.on('end', done);
 
  function onData () {
   done();
   resolve(stream.read());
  }
 
  function onError (err) {
   done();
   reject(err);
  }
 
  function done () {
   stream.removeListener('readable', onData);
   stream.removeListener('error', onError);
   stream.removeListener('end', done);
  }
 })
}
二，保证工具函数的回调在处理完毕数据后才被调用
工具函数往往会对外提供一个回调函数参数，待处理完流中的所有数据后，带着指定值触发，通常的做法是将回调函数的调用挂在流的end事件中，但如果处理函数是耗时的异步操作，回调函数则可能在所有数据处理完毕前被调用：
'use strict';
const fs = require('fs');
 
let stream = fs.createReadStream('/Path/to/a/big/file');
 
function processSomeData (stream, callback) {
 stream.on('data', (data) => {
  // 对数据进行一些异步耗时操作
  setTimeout(() => console.log(data), 2000);
 });
 
 stream.on('end', () => {
  // ...
  callback()
 })
}
 
processSomeData(stream, () => console.log('end'));
以上的代码callback回调可能会在数据并未被全部处理时就被调用，因为流的end事件的触发时机仅仅是在流中的数据被读完时。所以我们需要额外地对数据是否已处理完进行检查：
function processSomeData (stream, callback) {
 let count = 0;
 let finished = 0;
 let isEnd = false;
 
 stream.on('data', (data) => {
  count++;
  // 对数据进行一些异步耗时操作
  setTimeout(() => {
   console.log(data);
   finished++;
   check();
  }, 2000);
 });
 
 stream.on('end', () => {
  isEnd = true;
  // ...
  check();
 })
 
 function check () {
  if (count === finished && isEnd) callback()
 }
}
这样一来，回调便会在所有数据都处理完毕后触发了。



使用Node.js给图片加水印的方法
作者：敲代码的怪蜀黍 字体：[增加 减小] 类型：转载 时间：2016-11-15 我要评论
使用Node.js给图片加水印，首先要确保本地安装了node环境。然后，我们进行图像编辑操作需要用到一个Node.js的库：images。具体详情大家可以通过本文了解下
一、准备工作：
首先，确保你本地已经安装好了node环境。
然后，我们进行图像编辑操作需要用到一个Node.js的库：images。
这个库的地址是：https://github.com/zhangyuanwei/node-images，作者定义它为 “Node.js轻量级跨平台图像编解码库” ，并提供了一系列接口。
我们要做的首先是安装images库：
npm install images
二、直接上DEMO：
步骤如下：
step1：文件夹结构

step2：JS代码
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14	var images = require('images');
var path = require('path');
var watermarkImg = images('water_logo.png');
var sourceImg = images('source.png');
// 比如放置在右下角，先获取原图的尺寸和水印图片尺寸
var sWidth = sourceImg.width();
var sHeight = sourceImg.height();
var wmWidth = watermarkImg.width();
var wmHeight = watermarkImg.height();
images(sourceImg)
// 设置绘制的坐标位置，右下角距离 40px
.draw(watermarkImg, sWidth - wmWidth - 40, sHeight - wmHeight - 40)
// 保存格式会自动识别
.save('saveimg.png');
step3：运行node app命令

step4：运行node命令后，文件夹结构如下图

step5：最终生成的加水印图片

以上所述是小编给大家介绍的使用Node.js给图片加水印的方法，希望对大家有所帮助，如果大家有任何疑问请给我留言，小编会及时回复大家的。在此也非常感谢大家对脚本之家网站的支持！



node.js+Ajax实现获取HTTP服务器返回数据

投稿：hebedich 字体：[增加 减小] 类型：转载 时间：2014-11-26 我要评论
这篇文章主要介绍了node.js+Ajax实现获取HTTP服务器返回数据，讲解的十分详细，也给出了很多的实例，是篇非常不错的文章，这里推荐给大家。

我们看一个HTML5页面中通过AJAX请求的方式获取HTTP服务器返回数据的代码示例.由于我们把服务器的端口指定为1337,并将从端口为80的网站中运行HTML5页面,因此这是一种跨域操作,需要在HTTP响应头部中添加Access_Control_Allow_Origin字段,并且将参数指定为允许向服务器请求数据额域名+端口号(省略端口号时允许该域名下的任何端口向服务器请求数据),
静态页面:index.html(注:一定要放在服务器环境下,如果是win7系统的话,可以开启IIS服务,并把页面考过去直接运行这个页面,)
复制代码 代码如下:

<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>node中的ajax请求(html5页面)</title>
    <script type="text/javascript">
        function GetData(){
            var xhr=new XMLHttpRequest();
            xhr.open("GET","http://localhost:1337/",true);
            xhr.onreadystatechange=function(){
                if(xhr.readyState==4){
                    if(xhr.status==200){
                        document.getElementById("res").innerHTML=xhr.responseText;
                    }
                }
            }
            xhr.send(null);
        }
    </script>
</head>
<body>
<input type="button" value="获取数据" onclick="GetData()" />
<div id="res">dsdf</div>
</body>
</html>
node代码:
复制代码 代码如下:

var http=require("http");
var server=http.createServer(function(req,res){
    if(req.url!=="/favicon.ico"){
        res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost"});
        res.write("你好啊!");
    }
    res.end();
});
server.listen(1337,"localhost",function(){
    console.log("开始监听...");
});
首先开启服务:node server.js
启动静态页面:

点击按钮"获取数据"

如果大家觉得需要配置服务器环境太麻烦,可以借用编辑器的优势来做.
比如我用的是webstrom 8.0;
当我启动页面的时候,浏览器中显示的是这个路径:

端口是63342.这个时候我们队代码做一些修改:
node的 server.js代码:
复制代码 代码如下:

var http=require("http");
var server=http.createServer(function(req,res){
    if(req.url!=="/favicon.ico"){
        res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost:63342"});
        //res.setHeader();
        res.write("你好啊!");
    }
    res.end();
});
server.listen(1337,"localhost",function(){
    console.log("开始监听...");
});
修改了"Access-Control-Allow-Origin"的值.
重新运行demo会发现,达到同样的效果
也可以通过res.seetHeader来单独设置响应头部.
可以将上面的res.writeHead()改成res.setHeader();
复制代码 代码如下:

var http=require("http");
var server=http.createServer(function(req,res){
    if(req.url!=="/favicon.ico"){
        //res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost:63342"});
        res.setHeader("Content-Type","text/plain");
        res.setHeader("Access-Control-Allow-Origin","http://localhost:63342");
        res.write("你好啊!");
    }
    res.end();
});
server.listen(1337,"localhost",function(){
    console.log("开始监听...");
});
细心的同学可能发现了,利用setHeader的方法时,缺少了一个状态码,比如200.那么我们在使用res.setHeader的时候,如何来设置状态码呢?等会上代码
ajax在服务器端返回的时候日期:

我们可以在服务器端返回时,删除这个字段.
设置res.sendData=false;
复制代码 代码如下:

var http=require("http");
var server=http.createServer(function(req,res){
    if(req.url!=="/favicon.ico"){
        //res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost:63342"});
        res.statusCode=200;
        res.sendDate=false;
        res.setHeader("Content-Type","text/plain");
        res.setHeader("Access-Control-Allow-Origin","http://localhost:63342");
        res.write("你好啊!");
    }
    res.end();
});
server.listen(1337,"localhost",function(){
    console.log("开始监听...");
});

设置了状态码,也屏蔽了日期信息.
res.getHeader(name)获取我们设置的响应头信息
res.removeHeader(name);删除我们的头信息.必须在我们的write方法发送数据之情被调用.
res.headersSent属性是一个布尔值,当当响应头已发送时,属性值为true时;当响应头未发送时,属性值为false.
server.js代码:
复制代码 代码如下:

var http=require("http");
var server=http.createServer(function(req,res){
    if(req.url!=="/favicon.ico"){
        if(res.headersSent)
            console.log("响应头已发送");
        else
            console.log("响应头未发送");
        res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"http://localhost:63342"});
        if(res.headersSent)
            console.log("响应头已发送");
        else
            console.log("响应头未发送");        
        res.write("你好啊!");
    }
    res.end();
});
server.listen(1337,"localhost",function(){
    console.log("开始监听...");
});
运行demo查看结果:

res.write()方法是向客户端发送数据的,其实他还有一个返回值.
当向客户端发送的数据量比较小时或网速较快时,node总是将数据直接发送到操作系统的内核缓存区中,然后从内核缓存区中取出数据发送给对方.这个时候write会返回true.
当网速慢或数据量较大时,http服务器并不一定会立刻把数据发送给客户端,node会把数据缓存在内存中,并在对方可以接受数据的情况下将内存中的数据通过操作系统的内核发送给对方.这时的write返回false.

可以设置test.txt的内容多少来测试结果.




上传的handler比较简单，网上都能找到
var url=require('url');
var exec=require('child_process').exec;
var querystring=require('querystring');
 
/********************************文件上传 第3方模块测试*************************/
function fileUploadForm(request,response){
 response.writeHead(200,{'Content-Type':'text/html'});
 var body = '<html>'+
  '<head>'+
  '<meta http-equiv="Content-Type" '+
  'content="text/html; charset=UTF-8" />'+
  '</head>'+
  '<body>'+
  '<form action="/fileuploadaction" method="post" enctype="multipart/form-data">'+
  '<input name="name" type="text" />'+
  '<input name="upload" type="file" />'+
  '<input type="submit" value="Upload" />'+
  '</form>'+
  '</body>'+
  '</html>';
 response.write(body);
 response.end();
}
 
<span style="color: rgb(255, 0, 0);">function fileUploadAction(request,response){
 var fs=require('fs');
 var formidable=require('formidable');
 var baseUploadPath="./media/upload/";
 var form=new formidable.IncomingForm();
 form.uploadDir='./var/tmp';
 form.parse(request,function(error,fields,files){
  if(!error){
   console.log(fields);
   var desUploadName=baseUploadPath+files.upload.name;
   fs.renameSync(files.upload.path, desUploadName);
   response.writeHead(200,{'Content-Type':'text/html'});//值得注意的是这里的response.writeHead()函数内容要写在form.parse()的callback中要不不会显示
   response.write('received image:</br>');
   response.write('<img src="/showuploadimage?name='+files.upload.name+'" />');
   response.end();
  }
 });
}</span>
 
function showUploadImage(request,response){
 var fs=require('fs');
 var imageName=querystring.parse(url.parse(request.url).query);
 var baseUploadPath="./media/upload/";
 fs.readFile(baseUploadPath+imageName.name, "binary", function(error, file) {
  if(error) {
   response.writeHead(500, {"Content-Type": "text/plain"});
   response.write(error + "\n");
   response.end();
  } else {
   response.writeHead(200, {"Content-Type": "image/png"});
   response.write(file, "binary");
   response.end();
  }
 });
}
exports.fileuploadform=fileUploadForm;
exports.fileuploadaction=fileUploadAction;
exports.showuploadimage=showUploadImage;
同时在index.js中添加
handle['/fileuploadform']=handlers.fileuploadform; 
handle['/fileuploadaction']=handlers.fileuploadaction; 
handle['/showuploadimage']=handlers.showuploadimage; 
有一点需要注意的是，在有需要处理文件上传的时候，不能在server中添加
request.setEncoding('utf8');//设置这个很可能导致上传失败，这是formidable模块的一个bug吧
和
request.addListener("data",function(tempPostData){ 
   postData+=tempPostData; 
  }); 
  request.addListener("end",function(){ 
   route(request,response,postData,handle); 
  });




JS AJAX前台如何给后台类的函数传递参数

投稿：whsnow 字体：[增加 减小] 类型：转载 时间：2014-06-27 我要评论
这篇文章主要介绍了JS AJAX前台给后台类的函数传递参数的方法，下面有个不错的示例，需要的朋友可以参考下

将普通页面的方法公布为WebMethod，以Javascript形式访问。
1 方法要public static修饰，返回类型最好是string。
2 方法前添加[WebMethod] 特性。
3 Client端访问时要使用Post方法，和Json作为数据形式进行交互。否则会整页HTML返回。
4 在jQuery访问时，回调中的data.d才时真正的返回内容。
5 访问URL为： http://abc.com/abc.aspx/GetTime 如有个GetTime的公共静态方法。
例：
abc.aspx
[WebMethod]
public static string GetTime()
{
return DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
}
---------------
脚本（以jQuery为例调用）
$.ajax({
url:url,
method:"post",
dataType:"json",
contentType:"application/json; charset=UTF-8",
success: function(data){
$("#id").html(data.d); //见第3点
}
});




希尔排序基本思想：先取一个小于n的整数d1作为第一个增量，把文件的全部记录分成d1个组。所有距离为d1的倍数的记录放在同一个组中。先在各组内进行直接插入排序；然后，取第二个增量d2 < d1重复上述的分组和排序，直至所取的增量dt=1(dt < dt-l< … < d2 < d1)，即所有记录放在同一组中进行直接插入排序为止。
该方法实质上是一种分组插入方法。
实例1：
复制代码 代码如下:

/**
 * 希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。希尔排序是非稳定排序算法。
 *
 * 希尔排序是基于插入排序的以下两点性质而提出改进方法的：
 *
 * 插入排序在对几乎已经排好序的数据操作时， 效率高， 即可以达到线性排序的效率
 * 但插入排序一般来说是低效的， 因为插入排序每次只能将数据移动一位
 *
 */

function shellSort( list ) {
    var gap = Math.floor( list.length / 2 );

    while( gap > 0 ) {

        for( i = gap; i < list.length; i++ ) {
            temp = list[i];

            for( j = i; j >= gap && list[j - gap] > temp; j -= gap ) {
                list[j] = list[j - gap];
            }
            list[j] = temp;
        }

        gap = Math.floor( gap / 2 );
    }

    return list;
};

// test
var arr = [2, 1, 3, 12, 5, 66, 23, 87, 15, 32];

shellSort(arr);
实例2：
复制代码 代码如下:

<script type="text/javascript">
//document.write("----------希尔排序，插入排序的升级,1959年shell搞出来的------当增量取的正确时，时间复杂度为n的1.3次方-------");
//document.write("<br /><br />")
//var array = new Array(12, 25, 32, 16, 18, 27, 59, 69, 36);
function shellSort(array) {
 var j, i, v, h=1, s=3, k,n = array.length;
 var result = "";
 var count = 0;
    while(h < n)
  h=s*h+1;

 while(h > 1) {
  h=(h-1)/s;
       for (k=0; k<h; k++)
   for (i=k+h,j=i; i<n; i+=h, j=i) {
            v=array[i];
    while(true)
     if ((j-=h) >= 0 && array[j] > v)
      array[j+h]=array[j];
     else
      break;
    array[j+h]=v;

         }
   count++;
   result += "<br />第" + count + "遍排序的结果是:";
         for (var n = 0; n < array.length; n++) {
            result += array[n] + ",";
          }
 }
 return result;
}
//shallSort(array);
//document.write("<br /><br />");
</script>




适配器模式（Adapter）是将一个类（对象）的接口（方法或属性）转化成客户希望的另外一个接口（方法或属性），适配器模式使得原本由于接口不兼容而不能一起工作的那些类（对象）可以一些工作。速成包装器（wrapper）。
适配器的别名是包装器（wrapper），这是一个相对简单的模式。在程序开发中有许多这样的场景：当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求。这时候有两种解决办法，第一种是修改原来的接口实现，但如果原来的模块很复杂，或者我们拿到的模块是一段别人编写的经过压缩的代码，修改原接口就显得不太现实了。第二种办法是创建一个适配器，将原接口转换为客户希望的另一个接口，客户只需要和适配器打交道。
为什么需要采用适配器模式？
在开发应用程序时，您往往会需要更换其中某一部分，例如，您用于保存日志或类似性质的内容的一个库。 当您用一个新库来替换它时，新库不太可能有完全相同的接口。 从这里开始，您有两种选择：
（1）检查所有代码，并更改指向旧库的一切代码。
（2）创建一个适配器，使新库可以使用与旧库相同的接口。
显然，在一些情况下，假如您的应用程序很小，或者对旧库的引用很少，更合适的做法是检查完整的代码，并更改它以匹配新库，而不是添加一个新的抽象层，使代码更复杂。 但是，在大多数情况下，创建一个适配器更为实用且节省时间。
JavaScript代码示例
一件事情有可能发生时，它就一定会发生。首先让我们来看一下这个小小的LoggerFactory，它让我们能更容易地修改我们使用的日志接口。

var LoggerFactory = {
  getLogger: function() {
    return window.console;
  },
  ...
};
 
/* 用法示例 */
var logger = LoggerFactory.getLogger();
logger.log("something to log");
在我们调用getLogger时它给我们返回了控制台对象(console)。为了这个练习我们假装console对象只有一个方法——log，并且它只能接收一个字符串类型的参数。 接下来，我们有另一个日志接口，这个会复杂些，因为1）它是用JavaScript实现的，不像console那样是浏览器本身就有的；2）它会把日志通过AJAX发送到服务器，这也意味着我们要对URL数据进行编码（代码里不会具体实现URL编码相关的事，因为它和我们的要讲的适配器模式毫不相干）。当然，它会使用一个和控制台不同的接口。
var AjaxLogger = {
  sendLog: function() {
    var data = this.urlEncode(arguments);
 
    jQuery.ajax({
      url: "http://example.com/log",
      data: data
    });
  },
 
  urlEncode: function(arg) {
    ...
    return encodedData;
  },
  ...
};
我们使用了jQuery的AJAX请求，主要是为了节省时间，忽略那些和适配器模式不想干的事情。 我们现在要做的事情就是创建一个适配器，并且改变之前的LoggerFactory让其返回这个适配器而不是控制台对象。

var AjaxLoggerAdapter = {
  log: function(arg) {
    AjaxLogger.sendLog(arg);
  }
};
 
/* 调整 LoggerFactory */
 
var LoggerFactory = {
  getLogger: function() {
    // 改变返回值
    return AjaxLoggerAdapter;
  },
  ...
};
我们对现有代码只做了一行更改，整个程序就可以使用这个新的日志接口了。
复杂适配器
日志接口是个很简单的例子，它只有一个方法，把它直接映射到旧的方法上也没什么难的。大多数情况下并不是如此。你可能会碰到这样的问题，即这些互相映射的函数的参数是完全不同的，旧接口可能根本没有这些参数，你必须自己处理它们。某些情况下，你又必须删掉一些参数，因为新的接口根本用不上它们。如果两个对象之间的接口映射太难，我们就要想想别的办法了，反正我不希望查找和修改数千行旧代码。












什么是设计模式
百度百科：
设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。
使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。 毫无疑问，设计模式于己于他人于系统都是多赢的；设计模式使代码编制真正工程化；设计模式是软件工程的基石脉络，如同大厦的结构一样。
实际情况：
设计模式绝对不是纸上谈兵的知识，光看书就以为自己懂了，那只是井底之蛙之见，设计模式绝对是从实践中来到实践中去的！如果编码经验很少，也不太可能能理解好设计模式，但凡软件设计能力强的人编码功底都是相当扎实的。
如果没有能深刻理解面向对象，也不太可能理解好设计模式，刚刚毕业或者才工作一两年就说自己面向对象能力强的人，基本上就是夸夸其谈的人。
很明显，我就是属于那种夸夸其谈的人，哈哈，不过希望对本文的总结，让自己更加了解这些设计模式，理解的更加透彻。
单体模式：
概念：
单体是一个用来划分命名空间并将一批相关的属性和方法组织在一起的对象，如果他可以被实例化，那么他只能被实例化一次。
特点：　
可以来划分命名空间，从而清除全局变量所带来的危险。
利用分支技术来来封装浏览器之间的差异。
可以把代码组织的更为一体，便于阅读和维护。
代码实现：
?
1
2
3
4
5
6
/*Basic Singleton*/
var Singleton = {
  attribute:true,
  method1:function(){},
　　 method2:function(){}
};
应用场景：
单体模式在我们平时的应用中用的比较多的，相当于把我们的代码封装在一个起来，只是暴露一个入口，从而避免全部变量的污染。
工厂模式:
概念：
工厂模式的定义：提供创建对象的接口，意思就是根据领导（调用者）的指示（参数），生产相应的产品（对象）。
创建一个对象常常需要复杂的过程，所以不适合在一个复杂的对象中。
创建对象可能会导致大量的重复代码，也可能提供不了足够级别的抽象。
工厂就是把成员对象的创建工作转交给一个外部对象，好处在于消除对象之间的耦合(也就是相互影响)
分类：
简单工厂模式：使用一个类，通常为单体，来生成实例。
复杂工厂模式定义是：将其成员对象的实列化推到子类中，子类可以重写父类接口方法以便创建的时候指定自己的对象类型。
父类只对创建过程中的一般性问题进行处理，这些处理会被子类继承，子类之间是相互独立的，具体的业务逻辑会放在子类中进行编写。
代码实现：
简单工厂模式：　
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
var XMLHttpFactory =function(){};　　　　　　//这是一个简单工厂模式
　　XMLHttpFactory.createXMLHttp =function(){
　　　 var XMLHttp = null;
　　　　if (window.XMLHttpRequest){
　　　　　　XMLHttp = new XMLHttpRequest()
　　　 }else if (window.ActiveXObject){
　　　　　　XMLHttp = new ActiveXObject("Microsoft.XMLHTTP")
　　　　}
　　return XMLHttp;
　　}
　　//XMLHttpFactory.createXMLHttp()这个方法根据当前环境的具体情况返回一个XHR对象。
　　var AjaxHander =function(){
　　　　var XMLHttp = XMLHttpFactory.createXMLHttp();
　　　　...
　　}
复杂工厂模式：流程==》 先设计一个抽象类，这个类不能被实例化，只能用来派生子类，最后通过对子类的扩展实现工厂方法
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
var XMLHttpFactory =function(){};　   //这是一个抽象工厂模式
XMLHttpFactory.prototype = {
　　//如果真的要调用这个方法会抛出一个错误，它不能被实例化，只能用来派生子类
　　createFactory:function(){
 　　throw new Error('This is an abstract class');
　　}
}
var XHRHandler =function(){}; //定义一个子类
// 子类继承父类原型方法
extend( XHRHandler , XMLHttpFactory );
XHRHandler.prototype =new XMLHttpFactory(); //把超类原型引用传递给子类,实现继承
XHRHandler.prototype.constructor = XHRHandler; //重置子类原型的构造器为子类自身
//重新定义createFactory 方法
XHRHandler.prototype.createFactory =function(){
　　var XMLHttp =null;
　　if (window.XMLHttpRequest){
 　　XMLHttp =new XMLHttpRequest();
　　}else if (window.ActiveXObject){
 　　XMLHttp =new ActiveXObject("Microsoft.XMLHTTP")
　　}
　　return XMLHttp;
}
应用场景：
以下几种情景下工厂模式特别有用：
（1）对象的构建十分复杂
（2）需要依赖具体环境创建不同实例
（3）处理大量具有相同属性的小对象
优点：
可以实现一些相同的方法，这些相同的方法我们可以放在父类中编写代码，那么需要实现具体的业务逻辑，那么可以放在子类中重写该父类的方法，去实现自己的业务逻辑；
也就是说有两点：　　
　1、弱化对象间的耦合，防止代码的重复。在一个方法中进行类的实例化，可以消除重复性的代码。
　2、重复性的代码可以放在父类去编写，子类继承于父类的所有成员属性和方法，子类只专注于实现自己的业务逻辑。
缺点：
当工厂增加到一定程度的时候，提升了代码的复杂度，可读性下降。而且没有解决对象的识别问题，即怎么知道一个对象的类型。
单例模式
概念：
单例模式定义了一个对象的创建过程，此对象只有一个单独的实例，并提供一个访问它的全局访问点。也可以说单例就是保证一个类只有一个实例，实现的方法一般是先判断实例存在与否，如果存在直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。
代码实现：
单例的实现有很多种，下面只介绍其中的一种，使用闭包方式来实现单例，代码如下：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
var single = (function(){
  var unique;
  function getInstance(){
　　　　// 如果该实例存在，则直接返回，否则就对其实例化
    if( unique === undefined ){
      unique = new Construct();
    }
    return unique;
  }
  function Construct(){
    // ... 生成单例的构造函数的代码
  }
  return {
    getInstance : getInstance
  }
})();
上面的代码中，unique便是返回对象的引用，而 getInstance便是静态方法获得实例。Construct 便是创建实例的构造函数。
可以通过 single.getInstance() 来获取到单例，并且每次调用均获取到同一个单例。这就是 单例模式 所实现的效果。
使用场景：
单例模式是一种常用的模式，有一些对象我们往往只需要一个，比如全局缓存、浏览器的window对象。在js开发中，单例模式的用途同样非常广泛。试想一下，当我们
单击登录按钮的时候，页面中会出现一个登录框，而这个浮窗是唯一的，无论单击多少次登录按钮，这个浮窗只会被创建一次。因此这个登录浮窗就适合用单例模式。
总结一下它的使用场景：
1、可以用它来划分命名空间
2、借助单例模式，可以把代码组织的更为一致，方便阅读与维护
观察者模式（发布订阅模式）
概念：
定义对象间的一种一对多的依赖关系，以便当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动刷新，也被称为是发布订阅模式。
它需要一种高级的抽象策略，以便订阅者能够彼此独立地发生改变，而发行方能够接受任何有消费意向的订阅者。
应用场景：　　
这个模式要先说应用场景，比较好理解。
打一个离我们比较近的一个场景，博客园里面有一个订阅的按钮（貌似有bug），比如小A,小B,小C都订阅了我的博客，当我的博客一有更新时，就会统一发布邮件给他们这三个人，就会通知这些订阅者
发布订阅模式的流程如下：
  1. 确定谁是发布者(比如我的博客)。
  2. 然后给发布者添加一个缓存列表，用于存放回调函数来通知订阅者。
  3. 发布消息，发布者需要遍历这个缓存列表，依次触发里面存放的订阅者回调函数。
  4. 退订（比如不想再接收到这些订阅的信息了，就可以取消掉）
代码如下：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
var pubsub = {};  // 定义发布者
(function (q) {
  var list = [], //回调函数存放的数组，也就是记录有多少人订阅了我们东西
    subUid = -1;
  // 发布消息,遍历订阅者
  q.publish = function (type, content) {
    // type 为文章类型，content为文章内容
    // 如果没有人订阅，直接返回
    if (!list[type]) {
      return false;
    }
    setTimeout(function () {
      var subscribers = list[type],
        len = subscribers ? subscribers.length : 0;
 
      while (len--) {
        // 将内容注入到订阅者那里
        subscribers[len].func(type, content);
      }
    }, 0);
    return true;
  };
  //订阅方法，由订阅者来执行
  q.subscribe = function (type, func) {
    // 如果之前没有订阅过
    if (!list[type]) {
      list[type] = [];
    }
    // token相当于订阅者的id，这样的话如果退订，我们就可以针对它来知道是谁退订了。
    var token = (++subUid).toString();
    // 每订阅一个，就把它存入到我们的数组中去
    list[type].push({
      token: token,
      func: func
    });
    return token;
  };
  //退订方法
  q.unsubscribe = function (token) {
    for (var m in list) {
      if (list[m]) {
        for (var i = 0, j = list[m].length; i < j; i++) {
          if (list[m][i].token === token) {
            list[m].splice(i, 1);
            return token;
          }
        }
      }
    }
    return false;
  };
} (pubsub));
//将订阅赋值给一个变量，以便退订
var girlA = pubsub.subscribe('js类的文章', function (type, content) {
  console.log('girlA订阅的'+type + ": 内容内容为：" + content);
});
var girlB = pubsub.subscribe('js类的文章', function (type, content) {
  console.log('girlB订阅的'+type + ": 内容内容为：" + content);
});
var girlC = pubsub.subscribe('js类的文章', function (type, content) {
  console.log('girlC订阅的'+type + ": 内容内容为：" + content);
});
//发布通知
pubsub.publish('js类的文章', '关于js的内容'); 
// 输出：
// girlC订阅的js类的文章: 内容内容为：关于js的内容
// test3.html:78 girlB订阅的js类的文章: 内容内容为：关于js的内容
// test3.html:75 girlA订阅的js类的文章: 内容内容为：关于js的内容
//girlA退订了关于js类的文章 
setTimeout(function () {
  pubsub.unsubscribe(girlA);
}, 0);
//再发布一次，验证一下是否还能够输出信息
pubsub.publish('js类的文章', "关于js的第二篇文章");
// 输出：
// girlB订阅的js类的文章: 内容内容为：关于js的第二篇文章
// girlC订阅的js类的文章: 内容内容为：关于js的第二篇文章
代码可以自己运行一遍，这样比较好理解
优缺点：
优点：当我们需要维护相关对象的一致性的时候，使用观察者模式，，就可以避免对象之间的紧密耦合。例如，一个对象可以通知另外一个对象，而不需要知道这个对象的信息。
缺点：在发布/订阅模式中，如果我们需要将发布者同订阅者上解耦，将会在一些情况下，导致很难确保我们应用中的特定部分按照我们预期的那样正常工作。也就是说它的优点也可能是它的缺点
策略模式
概念：
策略模式指的是定义一些列的算法，把他们一个个封装起来，目的就是将算法的使用与算法的实现分离开来。说白了就是以前要很多判断的写法，现在把判断里面的内容抽离开来，变成一个个小的个体。
代码实现：
代码情景为超市促销，vip为5折，老客户3折，普通顾客没折，计算最后需要支付的金额。
没有使用策略模式的情况：
?
1
2
3
4
5
6
7
8
9
10
11
function Price(personType, price) {
  //vip 5 折
  if (personType == 'vip') {
    return price * 0.5;
  } 
  else if (personType == 'old'){ //老客户 3 折
    return price * 0.3;
  } else {
    return price; //其他都全价
  }
}
不足之处：不好的地方，当我有其他方面的折扣时，又或者我活动的折扣时经常变化的，这样就要不断的修改if..else里面的条件了。而且也违背了设计模式的一个原则：对修改关闭，对扩展开放的原则；
使用策略模式之后：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
// 对于vip客户
function vipPrice() {
  this.discount = 0.5;
}
vipPrice.prototype.getPrice = function(price) {
　　return price * this.discount;
}
// 对于老客户
function oldPrice() {
  this.discount = 0.3;
}
oldPrice.prototype.getPrice = function(price) {
  return price * this.discount;
}
// 对于普通客户
function Price() {
  this.discount = 1;
}
Price.prototype.getPrice = function(price) {
  return price ;
}
// 上下文，对于客户端的使用
function Context() {
  this.name = '';
  this.strategy = null;
  this.price = 0;
}
Context.prototype.set = function(name, strategy, price) {
  this.name = name;
  this.strategy = strategy;
  this.price = price;
}
Context.prototype.getResult = function() {
  console.log(this.name + ' 的结账价为: ' + this.strategy.getPrice(this.price));
}
var context = new Context();
var vip = new vipPrice();
context.set ('vip客户', vip, 200);
context.getResult();  // vip客户 的结账价为: 100
var old = new oldPrice();
context.set ('老客户', old, 200);
context.getResult(); // 老客户 的结账价为: 60
var Price = new Price();
context.set ('普通客户', Price, 200);
context.getResult(); // 普通客户 的结账价为: 200
通过策略模式，使得客户的折扣与算法解藕，又使得修改跟扩展能独立的进行，不影到客户端或其他算法的使用；
使用场景：
策略模式最实用的场合就是某个“类”中包含有大量的条件性语句，比如if...else 或者 switch。每一个条件分支都会引起该“类”的特定行为以不同的方式作出改变。以其维
护一段庞大的条件性语句，不如将每一个行为划分为多个独立的对象。每一个对象被称为一个策略。设置多个这种策略对象，可以改进我们的代码质量，也更好的进行单元测试。
模板模式
概念：
定义了一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
通俗的讲，就是将一些公共方法封装到父类，子类可以继承这个父类，并且可以在子类中重写父类的方法，从而实现自己的业务逻辑。
代码实现：
比如前端面试，基本包括笔试，技术面试，领导面试，HR面试等，但是每个公司的笔试题，技术面可能不一样，也可能一样，一样的就继承父类的方法，不一样的就重写父类的方法
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
var Interview = function(){};
// 笔试
Interview.prototype.writtenTest = function(){
  console.log("这里是前端笔试题");
};
// 技术面试
Interview.prototype.technicalInterview = function(){
  console.log("这里是技术面试");
}; 
// 领导面试
Interview.prototype.leader = function(){
  console.log("领导面试");
};
// 领导面试
Interview.prototype.HR = function(){
  console.log("HR面试");
};
// 等通知
Interview.prototype.waitNotice = function(){
  console.log("等通知啊，不知道过了没有哦");
};
// 代码初始化
Interview.prototype.init = function(){
  this.writtenTest();
  this.technicalInterview();
  this.leader();
  this.HR();
  this.waitNotice();
};
// 阿里巴巴的笔试和技术面不同，重写父类方法，其他继承父类方法。
var AliInterview = function(){};
AliInterview.prototype = new Interview();
// 子类重写方法 实现自己的业务逻辑
AliInterview.prototype.writtenTest = function(){
  console.log("阿里的技术题就是难啊");
}
AliInterview.prototype.technicalInterview = function(){
  console.log("阿里的技术面就是叼啊");
}
var AliInterview = new AliInterview();
AliInterview.init();
// 阿里的技术题就是难啊
// 阿里的技术面就是叼啊
// 领导面试
// HR面试
// 等通知啊，不知道过了没有哦
应用场景：
模板模式主要应用在一些代码刚开要一次性实现不变的部分。但是将来页面有修改，需要更改业务逻辑的部分或者重新添加新业务的情况。主要是通过子类来改写父类的情况，其他不需要改变的部分继承父类。
代理模式
概念：
代理模式的中文含义就是帮别人做事，javascript的解释为：把对一个对象的访问, 交给另一个代理对象来操作.
代码实现：
比如我们公司的补打卡是最后是要交给大boss来审批的，但是公司那么多人，每天都那么多补打卡，那大boss岂不是被这些琐事累死。所以大boss下会有一个助理，来帮
忙做这个审批，最后再将每个月的补打卡统一交给大boss看看就行。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
// 补打卡事件
var fillOut = function (lateDate) {
  this.lateDate = lateDate;
};
// 这是bigBoss
var bigBoss = function (fillOut) {
  this.state = function (isSuccess) {
    console.log("忘记打卡的日期为：" + fillOut.lateDate + ", 补打卡状态：" + isSuccess);
  }
};
// 助理代理大boss 完成补打卡审批
var proxyAssis = function (fillOut) {
  this.state = function (isSuccess) {
    (new bigBoss(fillOut)).state(isSuccess); // 替bigBoss审批
  }
};
// 调用方法：
var proxyAssis = new proxyAssis(new fillOut("2016-9-11"));
proxyAssis.state("补打卡成功");
// 忘记打卡的日期为：2016-9-11, 补打卡状态：补打卡成功
应用场景：
比如图片的懒加载，我们就可以运用这种技术。在图片未加载完成之前，给个loading图片，加载完成后再替换成实体路径。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
var myImage = (function(){
  var imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return function(src){
    imgNode.src = src; 
  }
})();
// 代理模式
var ProxyImage = (function(){
  var img = new Image();
  img.onload = function(){
    myImage(this.src);
  };
  return function(src) {
        // 占位图片loading
        myImage("http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif");
    img.src = src;
  }
})();
// 调用方式
ProxyImage("https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png"); // 真实要展示的图片
当然，这种懒加载方法不用代理模式也是可以实现的，只是用代理模式。我们可以让 myImage 只做一件事，只负责将实际图片加入到页面中，而loading图片交给ProxyImage去做。从而降低代码的耦合度。因为当我不想用loading的时候，可以直接调用myImage 方法。也即是说假如我门不需要代理对象的话，直接可以换成本体对象调用该方法即可。
外观模式
概念：
外观模式是很常见。其实它就是通过编写一个单独的函数，来简化对一个或多个更大型的，可能更为复杂的函数的访问。也就是说可以视外观模式为一种简化某些内容的手段。
说白了，外观模式就是一个函数，封装了复杂的操作。
代码实现：
比如一个跨浏览器的ajax调用
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
function ajaxCall(type,url,callback,data){
  // 根据当前浏览器获取对ajax连接对象的引用
  var xhr=(function(){
    try {
      // 所有现代浏览器所使用的标准方法
      return new XMLHttpRequest();
    }catch(e){}
    // 较老版本的internet Explorer兼容
    try{
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    }catch(e){}
    try{
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    }catch(e){}
    try{
      return new ActiveXObject("Microsoft.XMLHTTP");
    }catch(e){}
    // 如果没能找到相关的ajax连接对象，则跑出一个错误。
    throw new Error("Ajax not support in this browser.")
  }()),
  STATE_LOADED=4,
  STATUS_OK=200;
  // 一但从服务器收到表示成功的相应消息，则执行所给定的回调方法
  xhr.onreadystatechange=function{
    if(xhr.readyState !==STATE_LOADED){
      return;
    }
    if(xhr.state==STATUS_OK){
      callback(xhr.responseText);
    }
  }
  // 使用浏览器的ajax连接对象来向所给定的URL发出相关的调用
  xhr.open(type.toUpperCase(),url);
  xhr.send(data);
}
// 使用方法
ajaxCall("get","/user/12345",function(rs){
  alert('收到的数据为：'+rs);
})
应用场景：
当需要通过一个单独的函数或方法来访问一系列的函数或方法调用，以简化代码库的其余内容，使得代码更容易跟踪管理或者更好的维护时，可以使用外观模式。其实我们平时代码中这种模式应该是用的比较多的。
以上就是本文的全部内容，希望本文的内容对大家的学习或者工作能带来一定的帮助，同时也希望多多支持脚本之家！



一、定义
享元（flyweight）模式是一种用于性能优化的模式，核心是运用共享技术来有效支持大量细刻度的对象。 
在JavaScript中，浏览器特别是移动端的浏览器分配的内存并不算多，如何节省内存就成了一个非常有意义的事情。 
享元模式是一种用时间换空间的优化模式
内衣工厂有100种男士内衣、100中女士内衣，要求给每种内衣拍照。如果不使用享元模式则需要200个塑料模特；使用享元模式，只需要男女各1个模特。
二、什么场景下使用享元模式？
（1）程序中使用大量的相似对象，造成很大的内存开销 
（2）对象的大多数状态都可以变为外部状态，剥离外部状态之后，可以用相对较少的共享对象取代大量对象
三、如何应用享元模式？
第一种是应用在数据层上，主要是应用在内存里大量相似的对象上； 
第二种是应用在DOM层上，享元可以用在中央事件管理器上用来避免给父容器里的每个子元素都附加事件句柄。
享元模式要求将对象的属性分为内部状态和外部状态。 
内部状态独立于具体的场景，通常不会改变，可以被一些对象共享； 
外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
享元模式中常出现工厂模式，Flyweight的内部状态是用来共享的，Flyweight factory负责维护一个Flyweight pool(模式池)来存放内部状态的对象。
缺点：对象数量少的情况，可能会增大系统的开销，实现的复杂度较大！
四、示例：文件上传
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
var Upload = function(uploadType) {
  this.uploadType = uploadType;
}
 
/* 删除文件（内部状态） */
Upload.prototype.delFile = function(id) {
  uploadManger.setExternalState(id, this);  // 把当前id对应的外部状态都组装到共享对象中
  // 大于3000k提示
  if(this.fileSize < 3000) {
    return this.dom.parentNode.removeChild(this.dom);
  }
  if(window.confirm("确定要删除文件吗？" + this.fileName)) {
    return this.dom.parentNode.removeChild(this.dom);
  }
}
 
/** 工厂对象实例化 
 * 如果某种内部状态的共享对象已经被创建过，那么直接返回这个对象
 * 否则，创建一个新的对象
 */
var UploadFactory = (function() {
  var createdFlyWeightObjs = {};
  return {
    create: function(uploadType) {
      if(createdFlyWeightObjs[uploadType]) {
        return createdFlyWeightObjs[uploadType];
      }
      return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
    }
  };
})();
 
/* 管理器封装外部状态 */
var uploadManger = (function() {
  var uploadDatabase = {};
 
  return {
    add: function(id, uploadType, fileName, fileSize) {
      var flyWeightObj = UploadFactory.create(uploadType);
      var dom = document.createElement('div');
      dom.innerHTML = "<span>文件名称：" + fileName + "，文件大小：" + fileSize +"</span>"
             + "<button class='delFile'>删除</button>";
 
      dom.querySelector(".delFile").onclick = function() {
        flyWeightObj.delFile(id);
      };
      document.body.appendChild(dom);
 
      uploadDatabase[id] = {
        fileName: fileName,
        fileSize: fileSize,
        dom: dom
      };
 
      return flyWeightObj;
    },
    setExternalState: function(id, flyWeightObj) {
      var uploadData = uploadDatabase[id];
      for(var i in uploadData) {
        // 直接改变形参（新思路！！）
        flyWeightObj[i] = uploadData[i];
      }
    }
  };
})();
 
/*触发上传动作*/
var id = 0;
window.startUpload = function(uploadType, files) {
  for(var i=0,file; file = files[i++];) {
    var uploadObj = uploadManger.add(++id, uploadType, file.fileName, file.fileSize);
  }
};
 
/* 测试 */
startUpload("plugin", [
  {
    fileName: '1.txt',
    fileSize: 1000
  },{
    fileName: '2.txt',
    fileSize: 3000
  },{
    fileName: '3.txt',
    fileSize: 5000
  }
]);
startUpload("flash", [
  {
    fileName: '4.txt',
    fileSize: 1000
  },{
    fileName: '5.txt',
    fileSize: 3000
  },{
    fileName: '6.txt',
    fileSize: 5000
  }
]);
五、补充
（1）直接改变形参Demo
?
1
2
3
4
5
6
7
8
9
function f1() {
  var obj = {a: 1};
  f2(obj);
  console.log(obj);  // {a: 1, b: 2}
}
function f2(obj) {
  obj.b = 2;
}
f1();  
（2）对象池，也是一种性能优化方案，其跟享元模式有一些相似之处，但没有分离内部状态和外部状态的过程。
?
1
2
3
4
5
6
7
8
9
10
11
12
var objectPoolFactory = function(createObjFn) {
  var objectPool = [];
  return {
    create: function() {
      var obj = objectPool.lenght === 0 ? createObjFn.apply(this, arguments) : objectPool.shift();
      return obj;
    },
    recover: function() {
      objectPool.push(obj);
    }
  };
}


装饰者模式（Decorator Pattern）：在不改变原类和继承的情况下动态扩展对象功能，通过包装一个对象来实现一个新的具有原对象相同接口的新的对象。
装饰者模式的特点：
1. 在不改变原对象的原本结构的情况下进行功能添加。
2. 装饰对象和原对象具有相同的接口，可以使客户以与原对象相同的方式使用装饰对象。
3. 装饰对象中包含原对象的引用，即装饰对象是真正的原对象经过包装后的对象。
二、Javascript装饰者模式详解：
描述：
装饰者模式中，可以在运行时动态添加附加功能到对象中。当处理静态类时，这可能是一个挑战。在Javascript中，由于对象是可变的，因此，添加功能到对象中的过程本身并不是问题。
装饰者模式的一个比较方便的特征在于其预期行为的可定制和可配置特性。可以从仅具有一些基本功能的普通对象开始，然后从可用装饰资源池中选择需要用于增强普通对象的哪些功能，并且按照顺序进行装饰，尤其是当装饰顺序很重要的时候。
实现装饰者模式的其中一个方法是使得每个装饰者成为一个对象，并且该对象包含了应该被重载的方法。每个装饰者实际上继承了目前已经被前一个装饰者进行增强后的对象。每个装饰方法在“继承的对象”上调用了同样的方法并获取其值，此外它还继续执行了一些操作。
先上实例1：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
//需要装饰的类（函数）
function Macbook() {
 this.cost = function () {
  return 1000;
 };
} 
//计算商品的包装费
function PackagingFee(macbook) {
 this.cost = function () {
  return macbook.cost() + 75;
 };
}
//计算商品的运费
function Freight(macbook) {
 this.cost = function () {
  return macbook.cost() + 300;
 };
} 
//计算商品的保险费用
function Insurance(macbook) {
 this.cost = function () {
  return macbook.cost() + 250;
 };
}
// 用法
var myMacbook = new Insurance(new Freight(new PackagingFee(new Macbook())));
console.log(myMacbook.cost());//1625
我们简单的分析下上面的代码，上面的代码中，一共定义了四个函数（其中一个需要修饰的函数，三个用于修饰的函数）。
然后，声明一个变量myMacbook指向new出来的Insurance对象，Insurance对象的形参指向new出来的Freight对象，Freight对象的形参指向new出来的PackagingFee对象，PackagingFee对象的形参指向new出来的Macbook对象。
接下来，调用myMacbook的cost方法。从上面的分析，我们可以得出 myMacbook.cost()的值等于（Freight对象的cost方法+250），Freight对象的cost方法等于（PackagingFee对象的cost方法+300），PackagingFee对象的cost方法等于（Macbook对象的cost方法+75）。
所以最终的结果是：myMacbook.cost()的值 = 250 + (300 + (75 + 1000)) = 1625。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
// 用法
var myMacbook = new Insurance(new Freight(new PackagingFee(new Macbook())));
console.log(myMacbook.cost());//1625 
//上面的代码等价于下面拆分后的代码，或许拆分后代码你更能看出前后的逻辑性
var macbook = new Macbook();
var package = new PackagingFee(macbook);
var freight = new Freight(package);
var myMacbook = new Insurance(freight);
//当然，如果你不想声明这么多变量（macbook、package、freight），只用一个变量也是可以的
var macbook = new Macbook();
macbook = new PackagingFee(macbook);
macbook = new Freight(macbook);
var myMacbook = new Insurance(macbook);
再看看实例2：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
function ConcreteClass() {
 this.performTask = function () {
  this.preTask();
  console.log('doing something');
  this.postTask();
 };
}
function AbstractDecorator(decorated) {
 this.performTask = function () {
  decorated.performTask();
 };
}
function ConcreteDecoratorClass(decorated) {
 this.base = AbstractDecorator;
 this.base(decorated);// add performTask method
 decorated.preTask = function () {
  console.log('pre-calling..');
 };
 decorated.postTask = function () {
  console.log('post-calling..');
 };
}
var concrete = new ConcreteClass();
var decorator1 = new ConcreteDecoratorClass(concrete);
decorator1.performTask();
//pre-calling..
//doing something
//post-calling..
实例2实际上和实例1是非常类似的，我们来简单分析下吧。首先，实例2中定义了三个函数，然后声明了两个变量concrete和decorator1，最后调用了decorator1的performTask方法。
粗看一眼，ConcreteDecoratorClass里面好像并没有performTask方法。我们先来分析下面的两行代码：
?
1
2
var concrete = new ConcreteClass(); //声明一个变量concrete指向new出来的ConcreteClass对象
var decorator1 = new ConcreteDecoratorClass(concrete); //声明一个变量decorator1指向new出来的ConcreteDecoratorClass对象，并传入变量concrete作为形参
然后，我们再来逐行分析下ConcreteDecoratorClass函数里面的代码：
?
1
2
this.base = AbstractDecorator; //定义一个当前对象（decorator1）的base属性，并指向函数AbstractDecorator
this.base(decorated); //调用base属性指向的函数，也就是调用AbstractDecorator函数，同时传入形参decorated，形参decorated指向new出来的ConcreteClass对象
说到这里，好像还是没有分析出ConcreteDecoratorClass函数里面有performTask方法，重点是看 "this"！
ConcreteDecoratorClass函数中的this指向new出来的ConcreteDecoratorClass对象（也就是和decorator1指向同一个对象）；
AbstractDecorator函数里面的this关键是看哪个对象来调用这个函数，this就指向哪个对象（从代码 “this.base = AbstractDecorator; this.base(decorated);” 中我们可以看出是new出来的ConcreteDecoratorClass对象在调用AbstractDecorator函数），所以AbstractDecorator函数里面的this指向new出来的ConcreteDecoratorClass对象（也和decorator1指向同一个对象）。
总结下来，我们会发现，在上面的代码中，不管是ConcreteDecoratorClass函数里面的this，还是AbstractDecorator函数里面的this，都指向new出来的ConcreteDecoratorClass对象。
所以，当我们执行decorator1.performTask()时，它会继续执行匿名函数中的代码（decorated.performTask();），匿名函数中的decorated形参指向new出来的ConcreteClass对象，并执行该对象的performTask方法。
最后看看实例3：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
var tree = {};
tree.decorate = function () {
 console.log('Make sure the tree won\'t fall');
}; 
tree.getDecorator = function (deco) {
 tree[deco].prototype = this;
 return new tree[deco];
}; 
tree.RedApples = function () {
 this.decorate = function () {
  this.RedApples.prototype.decorate(); // 第7步：先执行原型（这时候是Angel了）的decorate方法
  console.log('Add some red apples'); // 第8步 再输出 red
  // 将这2步作为RedApples的decorate方法
 }
};
tree.BlueApples = function () {
 this.decorate = function () {
  this.BlueApples.prototype.decorate(); // 第1步：先执行原型的decorate方法，也就是tree.decorate()
  console.log('Put on some blue apples'); // 第2步 再输出blue
  // 将这2步作为BlueApples的decorate方法
 }
}; 
tree.Angel = function () {
 this.decorate = function () {
  this.Angel.prototype.decorate(); // 第4步：先执行原型（这时候是BlueApples了）的decorate方法
  console.log('An angel on the top'); // 第5步 再输出angel
  // 将这2步作为Angel的decorate方法
 }
};
tree = tree.getDecorator('BlueApples'); // 第3步：将BlueApples对象赋给tree，这时候父原型里的getDecorator依然可用
tree = tree.getDecorator('Angel'); // 第6步：将Angel对象赋给tree，这时候父原型的父原型里的getDecorator依然可用
tree = tree.getDecorator('RedApples'); // 第9步：将RedApples对象赋给tree
tree.decorate(); // 第10步：执行RedApples对象的decorate方法
//Make sure the tree won't fall
//Add blue apples
//An angel on the top
//Put on some red apples
实例3看起来很复杂，实际上分析逻辑还是和前面两个实例一样，我们可以看出实例3中一共声明了5个函数表达式。我们重点分析下下面的代码：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
//tree.getDecorator('BlueApples')返回new出来的tree.BlueApples的实例对象，并将该对象赋值给空的tree对象
tree = tree.getDecorator('BlueApples'); //new出来的tree.BlueApples的实例对象的原型指向 --> 空对象tree 
//tree.getDecorator('Angel')返回new出来的tree.Angel的实例对象（这行代码中的第二个tree已经是上面一行代码运行结果后的tree.BlueApples的实例对象）
tree = tree.getDecorator('Angel'); //new出来的tree.Angel的实例对象的原型指向 --> tree.BlueApples的实例对象
//tree.getDecorator('RedApples')返回new出来的tree.RedApples的实例对象（这行代码中的第二个tree已经是上面一行代码运行结果后的tree.Angel的实例对象）
tree = tree.getDecorator('RedApples'); //new出来的tree.RedApples的实例对象的原型指向 --> tree.Angel的实例对象
//调用tree.decorate()，这里的tree已经是new出来的tree.RedApples的实例对象了。
//tree.RedApples的实例对象的decorate属性方法里面的第一行代码是 “this.RedApples.prototype.decorate()”
//结合上面的分析可以得出以下的原型链结构：
//this.RedApples.prototype --> tree.Angel;
//tree.Angel.prototype --> tree.BlueApples;
//tree.BlueApples.prototype --> 空对象tree
tree.decorate();
分析到这里，就不难知道最后的输出结果了



基于BootStrap Metronic开发框架经验小结【六】对话框及提示框的处理和优化

1、Bootstrap对话框的使用
常规的Bootstrap有几种尺寸的对话框，包括默认状态的小对话框，中等宽度的对话框，和全尺寸的对话框几种，Bootstrap的对话框界面非常友好， 当我们使用ESC键或者鼠标单击其他空白处，则会自动隐藏对话框的。
它们的定义只是class不同，如下面是默认的小对话框界面代码：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49	<!--------------------------添加/修改信息的弹出层---------------------------->
<div id="add" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-primary">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <h4 class="modal-title">
          <i class="icon-pencil"></i>
          <span id="lblAddTitle" style="font-weight:bold">添加信息</span>
        </h4>
      </div>
      <form class="form-horizontal form-bordered form-row-strippe" id="ffAdd" action="" data-toggle="validator" enctype="multipart/form-data">
        <div class="modal-body">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label class="control-label col-md-2">父ID</label>
                <div class="col-md-10">
                  <select id="PID" name="PID" type="text" class="form-control select2" placeholder="父ID..." ></select>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="control-label col-md-2">名称</label>
                <div class="col-md-10">
                  <input id="Name" name="Name" type="text" class="form-control" placeholder="名称..." />
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="form-group">
                <label class="control-label col-md-2">备注</label>
                <div class="col-md-10">
                  <textarea id="Note" name="Note" class="form-control" placeholder="备注..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer bg-info">
          <input type="hidden" id="ID" name="ID" />
          <button type="submit" class="btn blue">确定</button>
          <button type="button" class="btn green" data-dismiss="modal">取消</button>
        </div>
      </form>
    </div>
  </div>
</div>
大概的界面如下所示：

注意上面代码里面的对话框样式代码，如下：
?
1	<div class="modal-dialog">
如果是其他两个尺寸的数据库，也只需要修改这里即可，如下所示两种代码分别是：
?
1	<div class="modal-dialog modal-lg">
以及
?
1	<div class="modal-dialog modal-full">
我们可以根据界面元素的布局，来决定采用哪个尺寸的对话框层定义，不过他们这几个对话框的调用方式是一致的。
打开对话框界面如下所示：
?
1
2	//显示可以选择客户
$("#btnSelectCustomer").show();
关闭对话框界面如下所示:
?
1	$("#add").modal("hide");
一般情况下，我们弹出的对话框就是一个表单，可以执行类似保存数据的提交操作的，因此需要对表单的数据进行验证，如果有错误，我们可能需要在界面上提醒，因此在页面初始化的时候，需要初始化表单的验证规则，下面是我们常规的表单初始化操作。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40	//绑定相关事件
    function BindEvent() {
      //判断表单的信息是否通过验证
      $("#ffAdd").validate({
        meta: "validate",
        errorElement: 'span',
        errorClass: 'help-block help-block-error',
        focusInvalid: false,
        highlight: function (element) {
          $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
          label.closest('.form-group').removeClass('has-error');
          label.remove();
        },
        errorPlacement: function (error, element) {
          element.parent('div').append(error);
        },
        submitHandler: function (form) {
          $("#add").modal("hide");
          //构造参数发送给后台
          var postData = $("#ffAdd").serializeArray();
          $.post(url, postData, function (json) {
            var data = $.parseJSON(json);
            if (data.Success) {
              //增加肖像的上传处理
              $('#file-Portrait').fileinput('upload');
              //保存成功 1.关闭弹出层，2.刷新表格数据
              showTips("保存成功");
              Refresh();
            }
            else {
              showError("保存失败:" + data.ErrorMessage, 3000);
            }
          }).error(function () {
            showTips("您未被授权使用该功能，请联系管理员进行处理。");
          });
        }
      });
    }
但是一般这些代码都会重复很多，因此我们可以封装函数的方式，重用部分代码，从而使用更简洁的处理代码，但同样能达到目的。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22	//绑定相关事件
   function BindEvent() {
     //添加、编辑记录的窗体处理
     formValidate("ffAdd", function (form) {
       $("#add").modal("hide");
       //构造参数发送给后台
       var postData = $("#ffAdd").serializeArray();
       $.post(url, postData, function (json) {
         var data = $.parseJSON(json);
         if (data.Success) {
           //保存成功 1.关闭弹出层，2.刷新表格数据
           showTips("保存成功");
           Refresh();
         }
         else {
           showError("保存失败:" + data.ErrorMessage, 3000);
         }
       }).error(function () {
         showTips("您未被授权使用该功能，请联系管理员进行处理。");
       });
     });
   }
2、删除确认的对话框处理
1）bootbox插件的使用
除了上面的常规对话框，我们还经常碰到一种简洁的确认对话框，虽然也可以使用上面的代码来构建一个确认对话框，不过一般情况下不需要这么麻烦的，可以使用插件bootbox的确认对话框来进行处理。
Bootbox.js是一个小的JavaScript库，它帮助您在使用bootstrap框架的时候快速的创建一个对话框，也可以帮您创建，管理或删除任何所需的DOM元素或js事件处理程序。
bootbox.js使用三方法设计模仿他们的本地JavaScript一些方法。他们确切的方法签名是灵活的每个可以采取各种参数定制标签和指定缺省值，但它们通常被称为一样：
bootbox.alert(message, callback)
bootbox.prompt(message, callback)
bootbox.confirm(message, callback)
唯一需要的参数是alert是 message; callback是必需的 confirm 和 prompt 调用以确定用户的响应。甚至当调用警报回调是确定当用户 驳回对话框由于我们的包装方法不能不要块 像他们的母语是有用的：他们是异步而非同步。
这三种方法调用四分之一个公共方法，你也可以使用你自己的自定义对话框创建 ：
?
1	bootbox.dialog(options)
更多api帮助文档请参见：http://bootboxjs.com/documentation.html
Alert
?
1
2
3	bootbox.alert("Hello world!", function() {
Example.show("Hello world callback");
});
Confirm
?
1
2
3	bootbox.confirm("Are you sure?", function(result) {
Example.show("Confirm result: "+result);
});
或者代码：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18	bootbox.confirm("您确认删除选定的记录吗？", function (result) {
         if (result) {
           //最后去掉最后的逗号,
           ids = ids.substring(0, ids.length - 1);
           //然后发送异步请求的信息到后台删除数据
           var postData = { Ids: ids };
           $.get("/Province/DeletebyIds", postData, function (json) {
             var data = $.parseJSON(json);
             if (data.Success) {
               showTips("删除选定的记录成功");
               Refresh();//刷新页面数据
             }
             else {
               showTips(data.ErrorMessage);
             }
           });
         }
       });

Prompt
?
1
2
3
4
5
6
7	bootbox.prompt("What is your name?", function(result) {
if (result === null) {
  Example.show("Prompt dismissed");
} else {
  Example.show("Hi <b>"+result+"</b>");
}
});
Custom Dialog
使用代码和界面效果如下所示：
?
1	bootbox.dialog(…)
[2）
2）sweetalert插件的使用
虽然上面的效果非常符合Bootstrap的风格，不过界面略显单调。上面的效果不是我很喜欢这种风格，我遇到一个看起来更加美观的效果，如下所示。

这个效果是引入插件sweetalert（http://t4t5.github.io/sweetalert/）实现的。
?
1
2
3
4
5
6
7
8
9
10
11	swal({
   title: "操作提示",
   text: newtips,
   type: "warning", showCancelButton: true,
   confirmButtonColor: "#DD6B55",
   cancelButtonText: "取消",
   confirmButtonText: "是的，执行删除！",
   closeOnConfirm: true
 }, function () {
   delFunction();
 });
上面的界面效果类似的实现代码如下所示：


一般它的弹出框代码可以做的很简单，如下所示。

3、信息提示框的处理
上面两种处理，都是利用弹出对话框进行实现的，而且对界面有阻塞的，一般情况下，我们做信息提示效果，希望它不要影响我们进一步的操作，或者至少提供一个很短的自动消失效果。
那么这里我们就来介绍下jNotify插件和toastr插件了。
1）jNotify提示框的使用
jNotify提示框，一款优秀的jQuery结果提示框插件。我们在提交表单后，通过Ajax响应后台返回结果，并在前台显示返回信息，jNotify能非常优雅的显示操作结果信息。jNotify是一款基于jQuery的信息提示插件，它支持操作成功、操作失败和操作提醒三种信息提示方式。jNotify浏览器兼容性非常好，支持更改提示内容，支持定位提示框的位置，可配置插件参数。
?
1
2
3	jSuccess(message,{option});
jError("操作失败，请重试!!");
jNotify("注意：请完善你的<strong>个人资料！</strong>");
jNotify的参数详细配置：
?
1
2
3
4
5
6
7
8
9
10
11
12
13	autoHide : true,        // 是否自动隐藏提示条
clickOverlay : false,      // 是否单击遮罩层才关闭提示条
MinWidth : 200,          // 最小宽度
TimeShown : 1500,         // 显示时间：毫秒
ShowTimeEffect : 200,       // 显示到页面上所需时间：毫秒
HideTimeEffect : 200,       // 从页面上消失所需时间：毫秒
LongTrip : 15,          // 当提示条显示和隐藏时的位移
HorizontalPosition : "right",   // 水平位置:left, center, right
VerticalPosition : "bottom",   // 垂直位置：top, center, bottom
ShowOverlay : true,        // 是否显示遮罩层
ColorOverlay : "#000",      // 设置遮罩层的颜色
OpacityOverlay : 0.3,      // 设置遮罩层的透明度
onClosed:fn      //关闭提示框后执行函数，可以再次调用其他jNotify。如上面的三个依次调用。
下面是我在脚本类里面封装的饿公用方法，用来实现提示效果的显示的。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34	//显示错误或提示信息（需要引用jNotify相关文件）
function showError(tips, TimeShown, autoHide) {
  jError(
   tips,
   {
     autoHide: autoHide || true, // added in v2.0
     TimeShown: TimeShown || 1500,
     HorizontalPosition: 'center',
     VerticalPosition: 'top',
     ShowOverlay: true,
     ColorOverlay: '#000',
     onCompleted: function () { // added in v2.0
       //alert('jNofity is completed !');
     }
   }
  );
}
//显示提示信息
function showTips(tips, TimeShown, autoHide) {
  jSuccess(
   tips,
   {
     autoHide: autoHide || true, // added in v2.0
     TimeShown: TimeShown || 1500,
     HorizontalPosition: 'center',
     VerticalPosition: 'top',
     ShowOverlay: true,
     ColorOverlay: '#000',
     onCompleted: function () { // added in v2.0
       //alert('jNofity is completed !');
     }
   }
  );
}
这样我们在使用Ajax的POST方法的时候，我们可以根据不同的需要进行提示。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16	var postData = $("#ffAdd").serializeArray();
        $.post(url, postData, function (json) {
          var data = $.parseJSON(json);
          if (data.Success) {
            //增加肖像的上传处理
            $('#file-Portrait').fileinput('upload');
            //保存成功 1.关闭弹出层，2.刷新表格数据
            showTips("保存成功");
            Refresh();
          }
          else {
            showError("保存失败:" + data.ErrorMessage, 3000);
          }
        }).error(function () {
          showTips("您未被授权使用该功能，请联系管理员进行处理。");
        });

2）toastr插件的使用
toastr是一个Javascript库用于创建Gnome/Growl风格，非阻塞的页面消息提醒。，toastr可设定四种通知模式：成功，出错，警告，提示，而提示窗口的位置，动画效果都可以通过能数来设置，在官方站可以通过勾选参数来生成JS，非常的方便使用。
插件地址是：http://codeseven.github.io/toastr/
它可以分别创建如下几种效果：警告、危险、成功、提示的对话框信息，效果如下所示。

它的使用JS代码如下所示。
?
1
2
3
4
5
6
7
8	//显示一个警告,没有标题
toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!')
//显示一个成功,标题
toastr.success('Have fun storming the castle!', 'Miracle Max Says')
//显示错误标题
toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')
//清除当前的列表
toastr.clear()
这个插件的参数定义说明如下所示。
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18	//参数设置，若用默认值可以省略以下面代
  toastr.options = {
    "closeButton": false, //是否显示关闭按钮
    "debug": false, //是否使用debug模式
    "positionClass": "toast-top-full-width",//弹出窗的位置
    "showDuration": "300",//显示的动画时间
    "hideDuration": "1000",//消失的动画时间
    "timeOut": "5000", //展现时间
    "extendedTimeOut": "1000",//加长展示时间
    "showEasing": "swing",//显示时的动画缓冲方式
    "hideEasing": "linear",//消失时的动画缓冲方式
    "showMethod": "fadeIn",//显示时的动画方式
    "hideMethod": "fadeOut" //消失时的动画方式
    };
    //成功提示绑定
    $("#success").click(function(){
    toastr.success("祝贺你成功了");
    })



　var a = function(t) { return t; } 
　　(1 + 2).toString(); 
alert(a); 

//此时自执行




下面是我们使用Node.js时遵循的10个性能规则：
1. 避免使用同步代码
在设计上，Node.js是单线程的。为了能让一个单线程处理许多并发的请求，你可以永远不要让线程等待阻塞，同步或长时间运行的操作。Node.js的一个显著特征是：它从上到下的设计和实现都是为了实现异步。这让它非常适合用于事件型程序。
不幸的是，还是有可能会发生同步/阻塞的调用。例如，许多文件系统操作同时拥有同步和异步的版本，比如writeFile和writeFileSync。即使你用代码来控制同步方法，但还是有可能不注意地用到阻塞调用的外部函数库。当你这么做时，对性能的影响是极大的。
?
1
2
3
4
5
6
7
8	// Good: write files asynchronously
fs.writeFile('message.txt', 'Hello Node', function (err) {
 console.log("It's saved and the server remains responsive!");
});
  
// BAD: write files synchronously
fs.writeFileSync('message.txt', 'Hello Node');
console.log("It's saved, but you just blocked ALL requests!");
我们的初始化log在实现时无意地包含了一个同步调用来将内容写入磁盘。如果我们不做性能测试那么就会很容易忽略这个问题。当以developer box中一个node.js实例来作为标准测试，这个同步调用将导致性能从每秒上千次的请求降至只有几十个。
2.关闭套接字池
Node.js的http客户端会自动地使用套接字池：默认地，它会限制每台主机只能有5个套接字。虽然套接字的重复使用可能会让资源的增加在控制之下，但如果你需要处理许多数据来自于同一主机的并发请求时，将会导致一系列的瓶颈。在这种情况下，增大maxSockets 的值或关闭套接字池是个好主意：
?
1
2
3
4
5
6	// Disable socket pooling
  
var http = require('http');
var options = {.....};
options.agent = false;
var req = http.request(options)
3.不要让静态资源使用Node.js
对于css和图片等静态资源，用标准的WebServer而不是Node.js。例如，领英移动使用的是nginx。我们同时还利用内容传递网络（CDNs），它能将世界范围内的静态资拷贝到服务器上。这有两个好处：（1）能减少我们node.js服务器的负载量（2）CDNs可以让静态内容在离用户较近的服务器上传递，以此来减少等待时间。
4.在客户端渲染
让我们快速比较一下服务器渲染和客户端渲染的区别。如果我们用node.js在服务器端渲染，对于每个请求我们都会回送像下面这样的HTML页面：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16	<!-- An example of a simple webpage rendered entirely server side -->
  
<!DOCTYPE html>
<html>
 <head>
  <title>LinkedIn Mobile</title>
 </head>
 <body>
  <div class="header">
   <img src="http://mobile-cdn.linkedin.com/images/linkedin.png" alt="LinkedIn"/>
  </div>
  <div class="body">
   Hello John!
  </div>
 </body>
</html>
请注意观察这个页面所有的内容，除了用户的名字，其余都是静态内容：对于每个用户和页面重载内容都是一样的。因此更有效的作法是让Node.js仅以JSON形式返回页面需要的动态内容。
{"name": "John"}
页面的其余部分—所有静态的HTML标记－能放在JavaScript模板中（比如underscore.js模板）：
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16	<!-- An example of a JavaScript template that can be rendered client side -->
  
<!DOCTYPE html>
<html>
 <head>
  <title>LinkedIn Mobile</title>
 </head>
 <body>
  <div class="header">
   <img src="http://mobile-cdn.linkedin.com/images/linkedin.png" alt="LinkedIn"/>
  </div>
  <div class="body">
   Hello <%= name %>!
  </div>
 </body>
</html>
性能的提升来自于这些地方：如第三点所说，静态JavaScript模板能通过webserver（比如nginx）在服务器端提供，或者用更好的CDN来实现。此外，JavaScript模板能缓存在浏览器中或存储在本地，所有初始页面加载以后，唯一需要发送给客户端的数据就是JSON，这将是最有效果的。这个方法能极大性地减少CPU，IO，和Node.js的负载量。
5.使用gzip

许多服务器和客户端支持gzip来压缩请求和应答。无论是应答客户端还是向远程服务器发送请求，请确保充分使用它。
6.并行化

试着让你所有的阻塞操作－向远程服务发送请求，DB调用，文件系统访问并行化。这将能减少最慢的阻塞操作的等待时间，而不是所有阻塞操作的等待时间。为了保持回调和错误处理的干净，我们使用Step来控制流量。
7.Session自由化
领英移动使用Express框架来管理请求/应答周期。许多express的例子都包含如下的配置：
app.use(express.session({ secret: "keyboard cat" }));
默认地，session数据是存储在内存中的，这会给服务器增加巨大的开销，特别是随着用户量的增长。你可以使用一个外部session存储，比如MongoDB或Redis，不过每一个请求将会导致远程调用来取得session数据的开销。在可能的情况下，最好的选择就是在服务器端存储所有的无状态数据。通过不包含上述express配置让session自由化，你会看到更好的性能。
8.使用二进制模块
如果可能，用二进制模块取代JavaScript模块。例如，当我们从用JavaScript写的SHA模块转换到Node.js的编译版本，我们会看到性能的一个大跃进：
?
1
2
3	// Use built in or binary modules
var crypto = require('crypto');
var hash = crypto.createHmac("sha1",key).update(signatureBase).digest("base64");
9.用标准的 V8 JavaScript 取代客户端库
许多JavaScript库都是为了在web浏览器上使用而创建的，因为在JavaScript环境不同时：比如，一些浏览器支持forEach，map和reduce这样的函数，但有些浏览器不支持。因此客户端库通常用许多低效的代码来克服浏览器的差异。另一方面，在Node.js中，你能确切地知道哪些JavaScript方法是有效的：V8 JavaScript引擎支撑Node.js实现ECMA-262第五版中指定的ECMAScript。直接用标准的V8 JavaScript函数替代客户端库，你会发现性能得到显著的提高。
10.让你的代码保持小且轻
使用移动设备会让访问速度慢且延迟高，这告诉我们要让我们的代码保持小且轻。对于服务器代码也保持同样的理念。偶尔回头看看你的决定且问自己像这样的问题：“我们真的需要这个模块吗？”，“我们为什么用这个框架，它的开销值得我们使用吗？”，“我们能用简便的方法实现它吗？”。小轻且的代码通常更高效、快速。






每次调用ajax()函数都要对浏览器内置的XHR检查，效率不高。
使用惰性方式的方法
复制代码 代码如下:

/**
 * JS惰性函数
 */
 
function ajax(){
    if(typeof XMLHttpRequest != "undefined"){
        ajax = function(){
            return new XMLHttpRequest();    
        };
    }else if(typeof ActiveXObject != "undefined"){
        ajax = function(){
            if(typeof arguments.callee.activeXString != "string"){
                var versions = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];    
 
                for(var i=0,k=version.length;i<k;i++){
                    try{
                        var xhr = new ActiveXObject(versions[i]);   
                        arguments.callee.activeXString = versions[i];
                        return xhr;
                    }catch(ex){
                        throw ex;   
                    }
                }
            }   
 
            return new ActiveXObject(arguments.callee.activeXString);
        }
    }else{
        ajax = function(){
            throw "No XHR object";  
        }
    }
 
    return ajax();    //有点意思
}

在第二个惰性方法中if的每个分支都会为ajax()变量赋值，有效覆盖了原有函数，最后一步调用新的函数。下一次调用的ajax()的时候，就直接调用变量。


特点：当js文件中有多个ajax请求时，无需次次进行能力检测

可以此推广




确保代码尽量简洁
　　不要什么都依赖JavaScript。不要编写重复性的脚本。要把JavaScript当作糖果工具，只是起到美化作用。别给你的网站添加大量的JavaScript代码。只有必要的时候用一下。只有确实能改善用户体验的时候用一下。
　　尽量减少DOM访问
　　使用JavaScript访问DOM元素很容易，代码更容易阅读，但是速度很慢。下面介绍几个要点：限制使用JavaScript来修饰网页布局，把针对访问元素的引用缓存起来。有时，当你的网站依赖大量的DOM改动时，就应该考虑限制你的标记。这是改用HTML5、舍弃那些原来的XHTML和HTML4的一个充分理由。你可以查看DOM元素的数量，只要在Firebug插件的控制台中输入：document.getElementsByTagName('*').length。
　　压缩代码
　　要提供经过压缩的JavaScript页面，最有效的办法就是先用JavaScript压缩工具对你的代码压缩一下，这种压缩工具可以压缩变量和参数名称，然后提供因而获得的代码，使用了gzip压缩。
　　是的，我没有压缩我的main.js，但你要检查有没有未经压缩的任何jQuery插件，别忘了压缩。下面我列出了压缩方面的几个方案。
　　◆ YUI压缩工具(jQuery开发团队就使用它)，初学者指南
(http://www.slideshare.net/nzakas/extreme-JavaScript-compression-with-yui-compressor)、第二指南 (http://vilimpoc.org/research/js-speedup/)和官方网站(http://developer.yahoo.com/yui/compressor/)。
　　◆ Dean Edwards Packer(http://dean.edwards.name/packer/)
　　◆ JSMin(http://crockford.com/JavaScript/jsmin)
　　GZip压缩：其背后的想法是，缩短在浏览器和服务器之间传送数据的时间。缩短时间后，你得到标题是Accept-Encoding: gzip,deflate的一个文件。不过这种压缩方法有一些缺点。它在服务器端和客户端都要占用处理器资源(以便压缩和解压缩)，还要占用磁盘空间。
　　避免eval()：虽然有时eval()会在时间方面带来一些效率，但使用它绝对是错误的做法。eval()导致你的代码看起来更脏，而且会逃过大多数压缩工具的压缩。
　　加快JavaScript装入速度的工具：Lab.js
　　有许多出色的工具可以加快JavaScript装入的速度。值得一提的一款工具是Lab.js。
　　借助LAB.js(装入和阻止JavaScript)，你就可以并行装入JavaScript文件，加快总的装入过程。此外，你还可以为需要装入的脚本设置某个顺序，那样就能确保依赖关系的完整性。此外，开发者声称其网站上的速度提升了2倍。
　　使用适当的CDN
　　现在许多网页使用内容分发网络(CDN)。它可以改进你的缓存机制，因为每个人都可以使用它。它还能为你节省一些带宽。你很容易使用ping检测或使用Firebug调试那些服务器，以便搞清可以从哪些方面加快数据的速度。选择CDN时，要照顾到你网站那些访客的位置。记得尽可能使用公共存储库。
　　面向jQuery的几个CDN方案：
　　◆ http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js——谷歌Ajax，关于更多库的信息请参阅http://code.google.com/apis/libraries/devguide.html#Libraries。
　　◆ http://ajax.microsoft.com/ajax/jquery/jquery-1.4.2.min.js——微软的CDN
　　•http://code.jquery.com/jquery-1.4.2.min.js——Edgecast (mt)。
　　网页末尾装入JavaScript
　　如果你关注用户，用户因互联网连接速度慢而没有离开你的网页，这是一个非常好的做法。易用性和用户放在首位，JavaScript放在末位。这也许很痛苦，但是你应该有所准备，有些用户会禁用JavaScript。可以在头部分放置需要装入的一些JavaScript，但是前提是它以异步方式装入。
　　异步装入跟踪代码
　　这一点非常重要。我们大多数人使用谷歌分析工具(Google Analytics)来获得统计数据。这很好。现在看一下你把你的跟踪代码放在哪里。是放在头部分?还是说它使用document.write?然后，如果你没有使用谷歌分析工具异步跟踪代码，那也只能怪你自己。
　　这就是谷歌分析工具异步跟踪代码的样子。我们必须承认，它使用DOM，而不是使用document.write，这可能更适合你。它可以在网页装入之前检测到其中一些事件，这非常重要。现在想一想这种情况，你的网页甚至还没有装入，所有用户都关闭了网页。已找到了解决页面浏览量错失的办法。
复制代码 代码如下:

var _gaq = _gaq || []; 
_gaq.push(['_setAccount', 'UA-XXXXXXX-XX']); 
_gaq.push(['_trackPageview']); 
(function() { 
var ga = document.createElement('script'); ga.type = 'text/JavaScript'; ga.async = true; 
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'; 
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); 
})(); 

　　没有使用谷歌分析工具?这不是问题，今天的分析工具提供商大多允许你使用异步跟踪。
　　Ajax优化
　　Ajax请求对你网站的性能有重大影响。下面我介绍关于Ajax优化的几个要点。
　　缓存你的ajax
　　先看一下你的代码。你的ajax可以缓存吗?是的，它依赖数据，但是你的ajax请求大多应该可以缓存。在jQuery中，你的请求在默认情况下已被缓存，不包括script和jsonp数据类型。
　　针对Ajax请求使用GET
　　POST类型请求要发送两个TCP数据包(先发送标题，然后发送数据)。GET类型请求只需要发送一个数据包(这可能取决于你的cookie数量)。所以，当你的URL长度不到2K，你又想请求一些数据时，不妨使用GET。
　　使用ySlow
　　说到性能，ySlow既简单，又极其有效。它可以对你的网站进行评分，显示哪些方面需要改正，以及应关注哪些方面。
　　另外支一招：把你的JavaScript打包成PNG文件
　　设想一下：把你的JS和CSS添加到图片的末尾，然后用CSS来裁切，通过一次HTTP请求来获得应用程序中所需的所有信息。
我最近找到了这个方法。它基本上把你的JavaScript/css数据打包成PNG文件。之后，你可以拆包，只要使用画布API的getImageData()。此外，它非常高效。你可以在不缩小数据的情况下，多压缩35%左右。而且是无损压缩!我得指出，对比较庞大的脚本来说，在图片指向画布、读取像素的过程中，你会觉得有“一段”装入时间。




函数节流，简单地讲，就是让一个函数无法在很短的时间间隔内连续调用，只有当上一次函数执行后过了你规定的时间间隔，才能进行下一次该函数的调用。
函数节流的原理挺简单的，估计大家都想到了，那就是定时器。当我触发一个时间时，先setTimout让这个事件延迟一会再执行，如果在这个时间间隔内又触发了事件，那我们就clear掉原来的定时器，再setTimeout一个新的定时器延迟一会执行，就这样。
以下场景往往由于事件频繁被触发，因而频繁执行DOM操作、资源加载等重行为，导致UI停顿甚至浏览器崩溃。
1. window对象的resize、scroll事件
2. 拖拽时的mousemove事件
3. 射击游戏中的mousedown、keydown事件
4. 文字输入、自动完成的keyup事件
实际上对于window的resize事件，实际需求大多为停止改变大小n毫秒后执行后续处理；而其他事件大多的需求是以一定的频率执行后续处理。针对这两种需求就出现了debounce和throttle两种解决办法。
throttle 和 debounce 是解决请求和响应速度不匹配问题的两个方案。二者的差异在于选择不同的策略。
throttle 等时间 间隔执行函数。
debounce 时间间隔 t 内若再次触发事件，则重新计时，直到停止时间大于或等于 t 才执行函数。
一、throttle函数的简单实现
?
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
function throttle(fn, threshhold, scope) { 
threshhold || (threshhold = 250); 
var last, 
timer; return function () { 
var context = scope || this; 
var now = +new Date(), 
args = arguments; 
if (last && now - last + threshhold < 0) { 
// hold on to it 
clearTimeout(deferTimer); 
timer = setTimeout(function () { 
last = now; 
fn.apply(context, args); 
}, threshhold); 
} else { 
last = now; 
fn.apply(context, args); 
} 
};}
调用方法
?
1
2
3
4
$('body').on('mousemove', throttle(function (event) 
{
console.log('tick');
}, 1000));
二、debounce函数的简单实现
?
1
2
3
4
5
6
7
8
9
10
11
12
function debounce(fn, delay) 
{ 
var timer = null; 
return function () 
{ 
var context = this,
args = arguments; 
clearTimeout(timer); 
timer = setTimeout(function () { 
fn.apply(context, args); 
}, delay); 
};}
调用方法
?
1
2
3
4
$('input.username').keypress(debounce(function (event)
{
// do the Ajax request
}, 250));
三、简单的封装实现
/** * throttle * @param fn, wait, debounce */var throttle = function ( fn, wait, debounce ) { 
var timer = null, // 定时器 
t_last = null, // 上次设置的时间 
context, // 上下文 
args, // 参数 
diff; // 时间差 
return funciton () { 
var curr = + new Date(); 
var context = this, args = arguments; 
clearTimeout( timer ); 
if ( debounce ) { // 如果是debounce 
timer = setTimeout( function () { 
fn.apply( context, args ); 
}, wait ); 
} else { // 如果是throttle 
if ( !t_last ) t_last = curr; 
if ( curr - t_last >= wait ) { 
fn.apply( context, wait ); 
context = wait = null; 
} 
} }}/** * debounce * @param fn, wait */var debounce = function ( fn, wait ) 
{ 
return throttle( fn, wait, true );
}
小结：这两个方法适用于会重复触发的一些事件，如：mousemove，keydown，keyup，keypress，scroll等。
如果只绑定原生事件，不加以控制，会使得浏览器卡顿，用户体验差。为了提高js性能，建议在使用以上及类似事件的时候用函数节流或者函数去抖加以控制。
四、underscore v1.7.0相关的源码剖析　　　　　　　　　　　　　　　　　　　　　　　　　　
1. _.throttle函数
_.throttle = function(func, wait, options) { 
var context, args, result; 
var timeout = null; 
// 定时器 
var previous = 0; 
// 上次触发的时间 
if (!options) options = {}; 
var later = function() { 
previous = options.leading === false ? 0 : _.now(); 
timeout = null; 
result = func.apply(context, args); 
if (!timeout) context = args = null; 
}; 
return function()
{ 
var now = _.now(); 
// 第一次是否执行 
if (!previous && options.leading === false) previous = now; 
// 这里引入了一个remaining的概念：还剩多长时间执行事件 
var remaining = wait - (now - previous); 
context = this; 
args = arguments; 
// remaining <= 0 考虑到事件停止后重新触发或者 
// 正好相差wait的时候，这些情况下，会立即触发事件 
// remaining > wait 没有考虑到相应场景 
// 因为now-previous永远都是正值，且不为0，那么 
// remaining就会一直比wait小，没有大于wait的情况 
// 估计是保险起见吧，这种情况也是立即执行 
if (remaining <= 0 || remaining > wait) 
{ 
if (timeout)
{ 
clearTimeout(timeout); 
timeout = null; 
} 
previous = now; 
result = func.apply(context, args); 
if (!timeout) context = args = null; 
// 是否跟踪 
} else if (!timeout && options.trailing !== false)
{ 
timeout = setTimeout(later, remaining); 
} 
return result; 
};};
由上可见，underscore考虑了比较多的情况：options.leading：
第一次是否执行，默认为true，表示第一次会执行，传入{leading:false}则禁用第一次执行options.trailing：最后一次是否执行，默认为true，表示最后一次会执行，传入{trailing: false}表示最后一次不执行所谓第一次是否执行，是刚开始触发事件时，要不要先触发事件，如果要，则previous=0，remaining 为负值，则立即调用了函数所谓最后一次是否执行，是事件结束后，最后一次触发了此方法，如果要执行，则设置定时器，即事件结束以后还要在执行一次。remianing > wait 表示客户端时间被修改过。
2. _.debounce函数 
_.debounce = function(func, wait, immediate) { 
// immediate默认为false 
var timeout, args, context, timestamp, result; 
var later = function() { 
// 当wait指定的时间间隔期间多次调用_.debounce返回的函数，则会不断更新timestamp的值，导致last < wait && last >= 0一直为true，从而不断启动新的计时器延时执行func var last = _.now() - timestamp; 
if (last < wait && last >= 0) { 
timeout = setTimeout(later, wait - last); 
} else { 
timeout = null; 
if (!immediate) { 
result = func.apply(context, args); 
if (!timeout) context = args = null; 
} 
} 
}; 
return function() 
{ 
context = this; 
args = arguments; 
timestamp = _.now(); 
// 第一次调用该方法时，且immediate为true，则调用func函数 
var callNow = immediate && !timeout; // 在wait指定的时间间隔内首次调用该方法，则启动计时器定时调用func函数 
if (!timeout) timeout = setTimeout(later, wait); 
if (callNow) { 
result = func.apply(context, args); 
context = args = null; 
} 
return result; 
};};
_.debounce实现的精彩之处我认为是通过递归启动计时器来代替通过调用clearTimeout来调整调用func函数的延时执行。
















angular+ionic+cordova=混合app应用
 json数据
angular:处理数据  指令语言 双向绑定，依赖注入   ng-*  ng-app 当前angular执行环境（作用域，标签包含） ng-controller 控制范围
ng-modle：name  绑定的数据模型     {{name}}表达式（显示与ng-modle相同的name标签内容（value,innerhtml？））    
  jQuery：动效

单选框 ng-model="status"及ng-value="0"(或1) 表状态   ng-show=status  功能 显示/隐藏    ng-if  删除节点
ng-repeat      

    angular版本   特点（数据交互）

在实际的开发过程中，很多後端返回给我们的数据都是需要格式化处理的，在angular中为我们内置提供了filter指令，可以很方便的对数据进行处理。首先我们看看在视图中是如何使用过滤器的。
  
1、currency(货币)格式化
      <div ng-controller="Aaa">   <p>{{name | currency:'￥'}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = '12334.273489274834';   }]);  </script>      
在name的数据後面使用｜符号表示启用过滤器，如果对linux比较熟悉的话，这块的｜根linux的管道功能。currency可以理解成函数，而'￥'则是函数的参数，如果不传默认为$符号！
  
2、number(数字)格式化
      <div ng-controller="Aaa">   <p>{{name | number:2}}</p>  </div>  <script type="text/javascript">   $scope.name = '12334.273489274834';  </script>    
用来精确浮点数(精确到2位)默认是3位。
  
3、uppercase , lowercase(大小写)格式化
      <div ng-controller="Aaa">   <p>{{name | uppercase}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = 'hello';   }]);  </script>    
uppercase转换成大写，lowercase转换成小写
  
4、json(数据)格式化
      <div ng-controller="Aaa">   <pre>{{name | json}}</pre>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = { name : 'xcg',age : 19 };   }]);  </script>    
以json的格式输出到页面中，视图只能使用pre标签才可以识别
  
5、limitTo(截取)格式化
      <div ng-controller="Aaa">   <p>{{name | limitTo : 3}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = '123456789';   }]);  </script>    
截取字符串，数字不行。。。
  
6、limitTo(截取)格式化
      <div ng-controller="Aaa">   <p>{{name | date : 'yyyy-MM-dd hh:mm:ss'}}</p>  　　<p>{{name | date : 'MM/dd/yyyy @ h:mma'}}</p>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = 1448022616463;   }]);  </script>    
7、orderBy(排序)格式化
      <div ng-controller="Aaa">   <pre>{{name | orderBy : 'age' : true | json}}</pre>  <div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = [     {color : 'red',age : '10'},     {color : 'yellow',age : '20'},     {color : 'blue',age : '30'},     {color : 'green',age : '40'}    ];   }]);  </script>    
如果排序的值是字母，就按照字母的顺序来排序。如果是数字，从大到小。传入true则为逆向排序。
  
8、filter(筛选&过滤)格式化
      <div ng-controller="Aaa">   <pre>{{name | filter : 'l' | json}}</pre>  </div>  <script type="text/javascript">   var m1 = angular.module('myApp',[]);   m1.controller('Aaa',['$scope',function($scope){    $scope.name = [     {color : 'red',age : '10'},     {color : 'yellow',age : '20'},     {color : 'blue',age : '30'},     {color : 'green',age : '40'}    ];   }]);  </script>    
在filter传入'l'，会筛选出blue以及yellow。
  
<pre>{{name | filter : 'yellow' : true | json}}</pre> 如果像这样再传入true，就必须保证value的完整性，单单的'l'是无法筛选出来的。
  
上面都是在视图中以表达式的形式使用过滤器，下面我们来看看在JS中使用过滤器。
      <div ng-controller="Aaa">   <p>{{currency}}</p>   <p>{{number}}</p>   <p>{{uppercase}}</p>   <pre>{{json}}</pre>   <p>{{limitTo}}</p>   <p>{{date}}</p>   <pre>{{orderBy}}</pre>   <pre>{{filter}}</pre>  </div>  <script type="text/javascript">  var m1 = angular.module('myApp',[]);  m1.controller('Aaa',['$scope','$filter',function($scope,$filter){   var colors = [{color : 'red',age : '10'},     {color : 'yellow',age : '20'},     {color : 'blue',age : '30'},     {color : 'green',age : '40'}];     $scope.currency = $filter('currency')(12334.273489274834,'￥');   $scope.number = $filter('number')('12334.273489274834',2);   $scope.uppercase = $filter('uppercase')('hello');   $scope.json = $filter('json')({ name : 'xcg',age : 19 });   $scope.limitTo = $filter('limitTo')('xiecg',2);   $scope.date = $filter('date')('1448106268837','yyyy-MM-dd hh:mm:ss');   $scope.orderBy = $filter('orderBy')(colors,'age',true);   $scope.filter = $filter('filter')(colors,'l');  }]);  </script>      
这些都属于内置过滤器，我们还可以用.filter自定义过滤器。
      <div ng-controller="Aaa">   <p>{{name | firstUpper : 2}}</p>   </div>  <script type="text/javascript">  var m1 = angular.module('myApp',[]);  //自定义过滤器  m1.filter('firstUpper',function(){   return function(str,num){    console.log(num); //2，得到传递的参数    return str.charAt(0).toUpperCase() + str.substring(1);   }  });  m1.controller('Aaa',['$scope','$filter',function($scope,$filter){   $scope.name = 'hollo';  }]);  </script>      
这里我们自定义了一个首字母大写的方法，例子是在视图中使用的，也可以在JS中使用过滤器。
