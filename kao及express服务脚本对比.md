// 创建应用
var App = require('express'); // 'koa'
var app = App();

// 监听端口
app.listen(3000);

// 中间件包括路由
app.use(middleware); <function,Array function> 非最后须调用next()
koa: 多次使用use或者
const compose = require('koa-compose');
const middlewares = compose([logger, main]);
express:
app.VERB(path, [callback...], callback) path支持string,reg  next后不再执行后面???
具体: 参数数量
express:
middleware = (req, res, next) => {
  // res.send 返回相应
  console.log('%s %s', req.method, req.url);
  next();
}
koa:
middleware = ctx => {
  // ctx.request, accepts(),path,throw(httpcode),cookies
  ctx.response.body = 'Hello World';
};
路由:
koa:
app.use(route.get('/', middleware));
express:
app.get('/', middleware);


express:
全局变量:app.set(name, value)/app.get(name)/app.enable(name)/app.disable(name)/app.enabled(name)  可以判断环境变量'development' == app.get('env')






以下全是express
使用挂载,静态文件服务  有的静态文件路径都前缀"/static"  可有多个静态文件服务,优先使用先定义的
app.use('/static', express.static(__dirname + '/public'));


下面的内建的可以改变Express行为的设置
env 运行时环境，默认为 process.env.NODE_ENV 或者 "development"
trust proxy 激活反向代理，默认未激活状态
jsonp callback name 修改默认?callback=的jsonp回调的名字
json replacer JSON replacer 替换时的回调, 默认为null
json spaces JSON 响应的空格数量，开发环境下是2 , 生产环境是0
case sensitive routing 路由的大小写敏感, 默认是关闭状态， "/Foo" 和"/foo" 是一样的
strict routing 路由的严格格式, 默认情况下 "/foo" 和 "/foo/" 是被同样对待的
view cache 模板缓存，在生产环境中是默认开启的
view engine 模板引擎
views 模板的目录, 默认是"process.cwd() + ./views"

app.engine(ext, callback) : 根据文件扩展名require() 对应的模板引擎

app.param([name], callback)
路由参数的处理逻辑
app.param('user', function(req, res, next, id){
  User.find(id, function(err, user){
    if (err) {
      next(err);
    } else if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('failed to load user'));
    }
  });
});
id何用?加载用户信息赋值req.user?
app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});
这里使用reg非id
app.get('/user/:id', function(req, res){
  res.send('user ' + req.params.id);
});
加上这个就比较容易理解

app.all(path, [callback...], callback) 所有http方法,适合比如白名单

app.locals 保存数据???  是个函数,接受对象,并把对象属性copy到其上(避开函数关键字如name) 

app.render(view, [options], callback)

app.routes 路由对象

req.params参数变量 默认{}  对于/user/:name 以req.params.name存储 对于正则路则是捕获组

req.query 请求参数对象
req.body  请求体,由bodyParser() 中间件提供
req.files 文件对象,由bodyParser() 中间件提供
req.param(name)
req.signedCookies  加密cookie
req.get(field) 获取相应头字段

req.accepts(types)  检测types是否可接受类型
req.accepted 返回一个从高质量到低质量排序的接受媒体类型数组
req.is(type)  检测"Content-Type"是否为指定的值
req.ip  host  path
req.fresh/req.stale : 判断请求是不是新/旧的-通过对Last-Modified 或者 ETag 进行匹配, 来标明这个资源是不是"新/旧的".
req.xhr 判断请求头里是否有"X-Requested-With"这样的字段并且值为"XMLHttpRequest", jQuery等库发请求时会设置这个头
req.secure 检查TLS 连接
req.subdomains 子域   riginalUrl  acceptedLanguages  acceptedCharsets  acceptsCharset(charset)  acceptsLanguage(lang)

res.status(code) 支持链式
res.set(field, [value])  设置响应头
res.get(field)
res.cookie(name, value, [options])  res.clearCookie(name, [options])  res.redirect([status], url)
res.location  设置location 请求头  redirect简化?
req.protocol返回标识请求协议的字符串，一般是"http"，当用TLS请求的时候是"https"。 当"trust proxy" 设置被激活， "X-Forwarded-Proto" 头部字段会被信任。 如果你使用了一个支持https的反向代理，那这个可能是激活的。
res.charset
res.send([body|status], [body])  发送响应
res.json([status|body], [body]) 返回JSON响应    res.jsonp([status|body], [body])支持jsonp 默认callback  app.set('jsonp callback name', 'cb');
res.type(type)   Sets the Content-Type 
res.format(object) 根据请求头设置不同响应 如果你使用了一个支持https的反向代理，那这个可能是激活的。res.format({
  'text/plain': function(){
    res.send('hey');
  },
  
  'text/html': function(){
    res.send('hey');
  },
  
  'application/json': function(){
    res.send({ message: 'hey' });
  }
});
res.attachment([filename]) 设置响应头的Content-Disposition 字段值为 "attachment". 如果有filename 参数，Content-Type 将会依据文件扩展名通过res.type()自动设置, 并且Content-Disposition的"filename="参数将会被设置
res.sendfile(path, [options], [fn]]) 传输文件  Options: maxAge 毫秒，默认为0  root 文件相对的路径
res.download(path, [filename], [fn])
res.links(links)
res.locals 保存变量,可在多处理时暂存变量

res.render(view, [locals], callback)
渲染view, 同时向callback 传入渲染后的字符串。 callback如果不传的话，直接会把渲染后的字符串输出至请求方， 一般如果不需要再对渲染后的模板作操作，就不需要传callback。 当有错误发生时next(err)会被执行. 如果提供了callback参数，可能发生的错误和渲染的字符串都会被当作参数传入, 并且没有默认响应。

res.render('index', function(err, html){
  // ...
});

res.render('user', { name: 'Tobi' }, function(err, html){
  // ...
});
Middleware
basicAuth()
基本的认证中间件，在req.user里添加用户名

用户名和密码的例子:

app.use(express.basicAuth('username', 'password'));
校验回调:

app.use(express.basicAuth(function(user, pass){
  return 'tj' == user && 'wahoo' == pass;
}));
异步校验接受参数fn(err, user), 下面的例子req.user 将会作为user对象传递.

app.use(connect.basicAuth(function(user, pass, fn){
  User.authenticate({ user: user, pass: pass }, fn);
}))
bodyParser()
支持 JSON, urlencoded和multipart requests的请求体解析中间件。 这个中间件是json(), urlencoded(),和multipart() 这几个中间件的简单封装

app.use(express.bodyParser());

// 等同于:
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
从安全上考虑，如果你的应用程序不需要文件上传功能，最好关闭它。我们只使用我们需要的中间件。例如：我们不使用bodyParser、multipart() 这两个中间件。

app.use(express.json());
app.use(express.urlencoded());
如果你的应用程序需要使用文件上传，设置一下就行。 一个简单的介绍如何使用.

compress()
通过gzip / deflate压缩响应数据. 这个中间件应该放置在所有的中间件最前面以保证所有的返回都是被压缩的

app.use(express.logger());
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());
cookieParser()
解析请求头里的Cookie, 并用cookie名字的键值对形式放在 req.cookies 你也可以通过传递一个secret 字符串激活签名了的cookie

app.use(express.cookieParser());
app.use(express.cookieParser('some secret'));
cookieSession()
提供一个以cookie为基础的sessions, 设置在req.session里。 这个中间件有以下几个选项:

key cookie 的名字，默认是 connect.sess
secret prevents cookie tampering
cookie session cookie 设置, 默认是 { path: '/', httpOnly: true, maxAge: null }
proxy 当设置安全cookies时信任反向代理 (通过 "x-forwarded-proto")
app.use(express.cookieSession());
清掉一个cookie, 只需要在响应前把null赋值给session:

req.session = null
csrf()
CSRF 防护中间件

默认情况下这个中间件会产生一个名为"_csrf"的标志，这个标志应该添加到那些需要服务器更改的请求里，可以放在一个表单的隐藏域，请求参数等。这个标志可以通过 req.csrfToken()方法进行校验。

bodyParser() 中间件产生的 req.body , query()产生的req.query,请求头里的"X-CSRF-Token"是默认的 value 函数检查的项

这个中间件需要session支持，因此它的代码应该放在session()之后.

directory()
文件夹服务中间件，用 path 提供服务。

app.use(express.directory('public'))
app.use(express.static('public'))
这个中间件接收如下参数：

hidden 显示隐藏文件，默认为false.
icons 显示图标，默认为false.
filter 在文件上应用这个过滤函数。默认为false.