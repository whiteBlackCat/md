1.Native调用JS
使用WebView:loadUrl();方法即可直接调用指定Js代码中的函数，如mWebView.loadUrl("javascript:setUserName('zhooker');");
2.JS调用Native
最普通的一种通信方式，就是使用Android原生的JavascriptInterface来进行js和java的通信。首先先看一段html代码

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN" dir="ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <script type="text/javascript">
        function showToast(toast) {
            javascript:control.showToast(toast);
        }
        function log(msg){
            console.log(msg);
        }
    </script>

</head>

<body>
<input type="button" value="toast"
       onClick="showToast('Hello world')" />
</body>
</html>

当我们点击了按钮之后，会调用JS的showToast(),并调用到control.showToast(),我们接着看一下java层的代码：

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = (WebView)findViewById(R.id.webView);

        WebSettings webSettings = webView.getSettings();//1

        webSettings.setJavaScriptEnabled(true);//1.打开js通道

        webView.addJavascriptInterface(new JsInterface(), "control");
//注入自定义的interface，取名叫control，对应于html代码中的control

        webView.loadUrl("file:///android_asset/interact.html");
    }

    public class JsInterface {

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(MainActivity.this, toast, Toast.LENGTH_SHORT).show();
            log("show toast success");
        }

        public void log(final String msg){
            webView.post(new Runnable() {
                @Override
                public void run() {
                    webView.loadUrl("javascript: log(" + "'" + msg + "'" + ")");
                }
            });
        }
}

注意：在Android4.2以上使用@JavascriptInterface注释防止xss攻击


JSBridge：WebChromeClient类可以监听WebView事件，通过重写特定事件达到通信目的

@Overridepublic boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
    return super.onJsPrompt(view, url, message, defaultValue, result);
}
@Overridepublic boolean onJsAlert(WebView view, String url, String message, JsResult result) {
    return super.onJsAlert(view, url, message, result);
}
@Overridepublic boolean onJsConfirm(WebView view, String url, String message, JsResult result) {
    return super.onJsConfirm(view, url, message, result);
}

这三个方法其实就对应于js中的alert(警告框)，comfirm(确认框)和prompt(提示框)方法，。比如我们可以在js脚本中调用alert方法，这样对应的就会走到WebChromeClient类的onJsAlert()方法中，我们就可以拿到其中的信息去解析，并且做java层的事情。在js中，alert和confirm的使用概率还是很高的，特别是alert，所以我们最好不要使用这两个通道，以免出现不必要的问题。所以我们可以通过重写WebView中WebChromeClient类的onJsPrompt()方法来进行js和java的通信。
我们可以定义一个自己的协议，通过js脚本把这段协议文本传递到onPropmt()方法中并且进行解析，在onPropmt()解析对应的URL之后就可以去执行对应的java代码了。
一般URL的格式为：scheme://host:port/path?query，对应的我们协定prompt传入message的格式为: jsbridge://class:port/method?params。
先看一下我们html和js的代码

<!DOCTYPE HTML>

<html>
<head>
  <meta charset="utf-8">
  <script src="file:///android_asset/jsBridge.js" type="text/javascript"></script>
</head>

<body>
<div class="blog-header">
  <h3>JSBridge</h3>
</div>
<ul class="entry">

    <br/>
    <li>
        toast展示<br/>
        <button onclick="JsBridge.call('JSBridge','toast',{'message':'我是气泡','isShowLong':0},function(res){});">toast</button>
    </li>

    <br/>
    <li>
        异步任务<br/>
        <button onclick="JsBridge.call('JSBridge','plus',{'data':1},function(res){console.log(JSON.stringify(res))});">plus</button>
    </li>

    <br/>
    <br/>
</ul>

</body>
</html>

点击按钮会执行js脚本的这段代码

call: function (obj, method, params, callback, timeout) {
    var sid;

    if (typeof callback !== 'function') {
        callback = null;
    }

    sid = Private.getSid();

    Private.registerCall(sid, callback);
    Private.callMethod(obj, method, params, sid);

}

然后在call这个方法内，会执行Private类的registerCall和callMethod，我们来看callMehod()。

//生成URI，调用native功能
callMethod: function (obj, method, params, sid) {
    // hybrid://objectName:sid/methodName?params
    params = Private.buildParam(params);

    var uri = LOCAL_PROTOCOL + '://' + obj + ':' + sid + '/' + method + '?' + params;

    var value = CB_PROTOCOL + ':';
    window.prompt(uri, value);
}

以界面的第一个按钮toast为例，点击这个按钮，它会执行相应的js脚本代码，然后就会像我们前面所讲的那样，走到onJsPrompt()方法中，下面让我们看看对应的java代码。

public class InjectedChromeClient extends WebChromeClient {
    private final String TAG = "InjectedChromeClient";

    private JsCallJava mJsCallJava;

    public InjectedChromeClient() {
        mJsCallJava = new JsCallJava();
    }

    @Override
    public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        result.confirm(mJsCallJava.call(view, message));
        return true;
    }
}

我们传给JsCallJava类的那个message，就像我们前面定义的协议一样。sheme是hybrid://，表示这是一个hybrid方法，host是JSBridge，方法名字是toast，传递的参数是以json格式传递的，具体内容如图。不知道大家有没有发现，这里我有一个东西没有讲，就是JSBridge:后面的那串数字，这串数字是干什么用的呢？大家应该知道，现在我们整个调用过程都是同步的，这意味着我们没有办法在里面做一些异步的操作，为了满足异步的需求，我们就需要定义这样的port，有了这串数字，我们在java层就可以做异步的操作，等操作完成以后回调给js脚本，js脚本就通过这串数字去得到对应的callback，有点像startActivity中的那个requestCode。
Java层通过onJsPrompt获取到URl后，URL形式如hybrid://JSBridge:875725/toast?{“message”:”我是气泡”,”isShowLong”:0},就可以通过解析URL，再通过反射的方法去调用对应的函数。
最后总结一下JSBridge的流程：


在js脚本中把对应的方法名，参数等写成一个符合协议的uri，并且通过window.prompt方法发送给java层。

在java层的onJsPrompt方法中接受到对应的message之后，通过JsCallJava类进行具体的解析。

在JsCallJava类中，我们解析得到对应的方法名，参数等信息，并且在map中查找出对应的类的方法。


作者：兰兰笑笑生
链接：http://www.jianshu.com/p/0584bc2f9c9a
來源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。











Native与H5交互的那些事
 发表于 2016-04-20 |  分类于 技术沉淀 |  |  阅读次数 4516
前言
Hybrid开发模式目前几乎每家公司都有涉及和使用，这种开发模式兼具良好的Native用户交互体验的优势与WebApp跨平台的优势，而这种模式，在Android中必然需要WebView作为载体来展示H5内容和进行交互，而WebView的各种安全性、兼容性的问题，我想大多数人与它友谊的小床已经翻了，特别是4.2版本之前的addjavascriptInterface接口引起的漏洞，可能导致恶意网页通过Js方法遍历刚刚通过addjavascriptInterface注入进来的类的所有方法从中获取到getClass方法，然后通过反射获取到Runtime对象，进而调用Runtime对象的exec方法执行一些操作，恶意的Js代码如下：
1
2
3
4
5
6
7
8
9	function execute(cmdArgs) {
    for (var obj in window) {
        if ("getClass" in window[obj]) {
            alert(obj);
            return  window[obj].getClass().forName("java.lang.Runtime")  
                 .getMethod("getRuntime",null).invoke(null,null).exec(cmdArgs);
        }
    }
}
为了避免这个漏洞，即需要限制Js代码能够调用到的Native方法，官方于是在从4.2开始的版本可以通过为可以被Js调用的方法添加@JavascriptInterface注解来解决，而之前的版本虽然不能通过这种方法解决，但是可以使用Js的prompt方法进行解决，只不过需要和前端协商好一套公共的协议，除此之外，为了避免WebView加载任意url，也需要对url进行白名单检测，由于Android碎片化太严重，WebView也存在兼容性问题，WebView的内核也在4.4版本进行了改变，由webkit改为chromium，此外WebView还有一个非常明显的问题，就是内存泄露，根本原因就是Activity与WebView关联后，WebView内部的一些操作的执行在新线程中，这些时间无法确定，而可能导致WebView一直持有Activity的引用，不能回收。下面就谈谈怎样正确安全的让Native与H5交互
Native与H5怎样安全的进行交互？
要使得H5内的Js与Native之间安全的相互进行调用，我们除了可以通过添加@JavascriptInterface注解来解决（>=4.2），还有通过prompt的方式，不过如果使用官方的方式，这就需要对4.2以下做兼容了，这样使得我们一个app中有两套Js与Native交互的方式，这样极其不好维护，我们应该只需要一套Js与Native交互的方式，所以，我们借助Js中的prompt方法来实现一套安全的Js与Native交互的JsBridge框架
Js与Native代码相互调用
Native Invoke Js:
我们知道如果Native需要调用Js中的方法，只需要使用WebView:loadUrl();方法即可直接调用指定Js代码，如：
1	mWebView.loadUrl("javascript:setUserName('zhengxiaoyong');");
这样就直接调用了Js中的setUserName方法并把zhengxiaoyong这个名字传到这个方法中去了，接下来就是Js自己处理了
Js Invoke Native:
而如果Js要调用Native中的Java方法呢？这就需要我们自己实现了，因为我们不采取JavascriptInterface的方式，而采取prompt方式
对WebView熟悉的同学们应该都知道Js中对应的window.alert()、window.confirm()、window.prompt()这三个方法的调用在WebChromeClient中都有对应的回调方法，分别为：
onJsAlert()、onJsConfirm()、onJsPrompt()，对于它们传入的message，都可以在相应的回调方法中接收到，所以，对于Js调Native方法，我们可以借助这个信道，和前端协定好一段特定规则的message，这个规则中应至少包含这些信息：
所调用Native方法所在类的类名
所调用Native的方法名
Js调用Native方法所传入的参数
所以基于这些信息，很容易想到使用http协议的格式来协定规则，如下格式：
scheme://host:port/path?query
对应的我们协定prompt传入message的格式为:
jsbridge://class:port/method?params
这样以来，前端和app端协商好后，以后前端需要通过Js调用Native方法来获取一些信息或功能，就只需要按照协议的格式把需要调用的类名、方法名、参数放入对应得位置即可，而我们会在onJsPrompt方法中接受到，所以我们根据与前端协定好的协议来进行解析，我们可以用一个Uri来包装这段协议，然后通过Uri:getHost、getPath、getQuery方法获取对应的类名，方法名，参数数据，最后通过反射来调用指定类中指定的方法
而此时会有人问？port是用来干嘛的？params格式是KV还是什么格式？
当然，既然和前端协定好了协议的格式了，那么params肯定也是需要协定好的，可以用KV格式，也可以用一串Json字符串表示，为了解析方便，还是建议使用Json格式
而port是用来干嘛的呢？
port我们并不会直接操作它，它是由Js代码自动生成的，port的作用是为了标识Js中的回调function,当Js调用Native方法时，我们会得到本次调用的port号，我们需要在Native方法执行完毕后再把该port、执行的后结果、是否调用成功、调用失败的msg等信息通过调用Js的onComplete方法传入，这时候Js凭什么知道你本次返回的信息是哪次调用的结果呢？就是通过port号，因为在Js调用Native方法时我们会把自动生成的port号和此次回调的function绑定在一起，这样以来Native方法返回结果时把port也带过来，就知道是哪次回调该用哪个function方法来处理
自动生成port和绑定function回调的Js代码如下：
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
24	generatePort: function () {
    return Math.floor(Math.random() * (1 << 50)) + '' + increase++;
},
//调用Native方法
callMethod: function (clazz, method, param, callback) {
    var port = PrivateMethod.generatePort();
    if (typeof callback !== 'function') {
        callback = null;
    }
    //绑定对应port的function回调函数
    PrivateMethod.registerCallback(port, callback);
    PrivateMethod.callNativeMethod(clazz, port, method, param);
},
onComplete: function (port, result) {
    //把Native返回的Json字符串转为JSONObject
    var resultJson = PrivateMethod.str2Json(result);
    //获取对应port的function回调函数
    var callback = PrivateMethod.getCallback(port).callback;
    PrivateMethod.unRegisterCallback(port);
    if (callback) {
        //执行回调
        callback && callback(resultJson);
    }
}
Js代码上已经注释的很清楚了，就不多解释了。
经过上面介绍，那么在Native方法执行完成后，当然就需要把结果返回给Js了，那么结果的格式又是什么呢？返回给Js方法又是什么呢？
没错，还是需要和前端进行协定，建议数据的返回格式为Json字符串，基本格式为：
1
2
3
4
5
6
7	resultData = {
    status: {
        code: 0,//0:成功，1:失败
        msg: '请求超时'//失败时候的提示，成功可为空
    },
    data: {}//数据，无数据可以为空
};
其中定义了一个status，这样的好处是无论在Native方法调用成功与否、Native方法是否有返回值，Js中都可以收到返回的信息，而这个Json字符串至少都会包含一个statusJson对象来描述Native方法调用的状况
而返回给Js的方法自然是上面的onComplete方法：
1	javascript:RainbowBridge.onComplete(port,resultData);
ps:RainbowBridge是我的JsBridge框架的名字

至此Js调用Native的流程就分析完成了，一切都看起来那么美妙，因为，我们自己实现一套Js Invoke Native的主要目的是让Js调用Native更加安全，同时也只维护一套JsBridge框架更加方便，那么这个安全性表现在哪里了？
我们知道之前原生的方式漏洞就是恶意Js代码可能会调用Native中的其它方法，那么答案出来了，如果需要让Js Invoke Native保证安全性，只需要限制我们通过反射可调用的方法，所以，在JsBridge框架中，我们需要对Js能调用的Native方法给予一定的规则，只有符合这些规则Js才能调用，而我的规则是：
1、Native方法包含public static void 这些修饰符（当然还可能有其它的，如：synchronized）
2、Native方法的参数数量和类型只能有这三个：WebView、JSONObject、JsCallback。为什么要传入这三个参数呢？
2.1、第一个参数是为了提供一个WebView对象，以便获取对应Context和执行WebView的一些方法
2.2、第二个参数就是Js中传入过来的参数，这个肯定要的
2.3、第三个参数就是当Native方法执行完毕后，把执行后的结果回调给Js对应的方法中
所以符合Js调用的Native方法格式为：
1
2
3
4	public static void ***(WebView webView, JSONObject data, JsCallback callback) {
	//get some info ...
	JsCallback.invokeJsCallback(callback, true, result, null);
}
判断Js调用的方法是否符合该格式的代码为，符合则存入一个Map中供Js调用：
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
21	private void putMethod(Class<?> clazz) {
    if (clazz == null)
        return;
    ArrayMap<String, Method> arrayMap = new ArrayMap<>();
    Method method;
    Method[] methods = clazz.getDeclaredMethods();
    int length = methods.length;
    for (int i = 0; i < length; i++) {
        method = methods[i];
        int methodModifiers = method.getModifiers();
        if ((methodModifiers & Modifier.PUBLIC) != 0 && (methodModifiers & Modifier.STATIC) != 0 && method.getReturnType() == void.class) {
            Class<?>[] parameterTypes = method.getParameterTypes();
            if (parameterTypes != null && parameterTypes.length == 3) {
                if (WebView.class == parameterTypes[0] && JSONObject.class == parameterTypes[1] && JsCallback.class == parameterTypes[2]) {
                    arrayMap.put(method.getName(), method);
                }
            }
        }
    }
    mArrayMap.put(clazz.getSimpleName(), arrayMap);
}
对于有返回值的方法，并不需要设置它的返回值，因为方法的结果最后我们是通过JsCallback.invokeJsCallback来进行对Js层的回调，比如我贴一个符合该格式的Native方法：
1
2
3
4
5
6
7
8
9	public static void getOsSdk(WebView webView, JSONObject data, JsCallback callback) {
    JSONObject result = new JSONObject();
    try {
        result.put("os_sdk", Build.VERSION.SDK_INT);
    } catch (JSONException e) {
        e.printStackTrace();
    }
    JsCallback.invokeJsCallback(callback, true, result, null);
}
Js调Native代码执行耗时操作情况处理
一般情况下，比如我们通过Js调用Native方法来获取AppName、OsSDK版本、IMSI号、用户信息等都不会有问题，但是，假如该Native方法需要执行一些耗时操作，如：IO、sp、Bitmap Decode、SQLite等，这时为了保护UI的流畅性，我们需要让这些操作执行在异步线程中，待执行完毕再把结果回调给Js，而我们可以提供一个线程池来专门处理这些耗时操作，如：
1
2
3
4
5
6
7
8
9	public static void doAsync(WebView webView, JSONObject data, final JsCallback callback) {
    AsyncTaskExecutor.runOnAsyncThread(new Runnable() {
        @Override
        public void run() {
            //IO、sp、Bitmap Decode、SQLite
            JsCallback.invokeJsCallback(callback, true, result, null);
        }
    });
}
【注】：对于WebView，它的方法的调用只能在主线程中调用，当设计到WebView的方法调用时，切记不可以放在异步线程中调用，否则就GG了.
Js调Native流程图

JsBridge效果图

RainbowBridge:github地址
白名单Check
上面我们介绍了JsBridge的基本原理，实现了Js与Native相互调用，而且还避免了恶意Js代码调用Native方法的安全问题，通过这样我们保证了Js调用Native方法的安全性，即Js不能随意调用任意Native方法，不过，对于WebView容器来说，它并不关心所加载的url是Js代码还是网页地址，它所做的工作就是执行我们传入的url，而WebView加载url的方式有两种：get和post，方式如下：
1
2	mWebView.loadUrl(url);//get
mWebView.postUrl(url,data);//post
对于这两种方式，也有不同的应用点，一般get方式用于查，也就是传入的数据不那么重要，比如：商品列表页、商品详情页等，这些传入的数据只是一些商品类的信息。而post方式一般用于改，post传入的数据往往是比较私密的，比如：订单界面、购物车界面等，这些界面只有在把用户的信息post给服务器后，服务器才能正确的返回相应的信息显示在界面上。所以，对于post方式涉及到用户的私密信息，我们总不能给一个url就把私密数据往这个url里面发吧，当然不可能的，这涉及到安全问题，那么就需要一个白名单机制来检查url是否是我们自己的，是我们自己的那么即可以post数据，不是我们自己的那就不post数据，而白名单的定义通常可以以我们自己的域名来判断，搞一个正则表达式，所以我们可以重写WebView的postUrl方法：
1
2
3
4
5
6
7
8	@Override
public void postUrl(String url, byte[] postData) {
    if (JsBridgeUrlCheckUtil.isTrustUrl(url)) {
        super.postUrl(url, postData);
    } else {
        super.postUrl(url, null);
    }
}
这样就对不是我们自己的url进行了拦截，不把数据发送到不是我们自己的服务器中
至此，白名单的Check还没有完成，因为这只是对WebView加载Url时候做的检查，而在WebView内各中链接的跳转、其中有些url还可能被运营商劫持注入了广告，这就有可能在WebView容器内的跳转到某些界面后，该界面的url并不是我们自己的，但是它里面有Js代码调用Native方法来获取一些数据，虽然说Js并不能随便调我们的Native方法，但是有些我们指定可以被调用的Native方法可能有一些获取设备信息、读取文件、获取用户信息等方法，所以，我们也应该在Js调用Native方法时做一层白名单Check，这样才能保证我们的信息安全
所以，白名单检测需要在两个地方进行检测：
1、WebView:postUrl()前检测url的合法性
2、Js调用Native方法前检测当前界面url的合法性
具体代码如下：
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
21	@Override
public void postUrl(String url, byte[] postData) {
    if (JsBridgeUrlCheckUtil.isTrustUrl(url)) {
        super.postUrl(url, postData);
    } else {
        super.postUrl(url, null);
    }
}

 /**
 * @param webView WebView
 * @param message rainbow://class:port/method?params
 */
public void call(WebView webView, String message) {
    if (webView == null || TextUtils.isEmpty(message))
        return;
    if (JsBridgeUrlCheckUtil.isTrustUrl(webView.getUrl())) {
        parseMessage(message);
        invokeNativeMethod(webView);
    }
}
移除默认内置接口
WebView内置默认也注入了一些接口，如下：
1
2
3
4
5
6	//移除默认内置接口,防止远程代码执行漏洞攻击
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
    mWebView.removeJavascriptInterface("searchBoxJavaBridge_");
    mWebView.removeJavascriptInterface("accessibility");
    mWebView.removeJavascriptInterface("accessibilityTraversal");
}
这些接口虽然不会影响用prompt方式实现的Js与Native交互，但是在使用addJavascriptInterface方式时，有可能有安全问题，最好移除
WebView相关
WebView的配置
下面给出WebView的通用配置：
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
33	WebSettings webSettings = mWebView.getSettings();
webSettings.setJavaScriptEnabled(true);
webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
webSettings.setSupportZoom(false);
webSettings.setBuiltInZoomControls(false);
webSettings.setAllowFileAccess(true);
webSettings.setDatabaseEnabled(true);
webSettings.setDomStorageEnabled(true);
webSettings.setGeolocationEnabled(true);
webSettings.setAppCacheEnabled(true);
webSettings.setAppCachePath(getApplicationContext().getCacheDir().getPath());
webSettings.setDefaultTextEncodingName("UTF-8");
//屏幕自适应
webSettings.setUseWideViewPort(true);
webSettings.setLoadWithOverviewMode(true);
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
} else {
    webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
}
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
    webSettings.setDisplayZoomControls(false);
}
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    webSettings.setLoadsImagesAutomatically(true);
} else {
    webSettings.setLoadsImagesAutomatically(false);
}

mWebView.setScrollBarStyle(WDWebView.SCROLLBARS_INSIDE_OVERLAY);
mWebView.setHorizontalScrollBarEnabled(false);
mWebView.setHorizontalFadingEdgeEnabled(false);
mWebView.setVerticalFadingEdgeEnabled(false);
其中有一项配置，是在4.4以上版本时设置网页内图片可以自动加载，而4.4以下版本则不可自动加载，原因是4.4WebView内核的改变，使得WebView的性能更优，所以在4.4以下版本不让图片自动加载，而是先让WebView加载网页的其它静态资源：js、css、文本等等，待网页把这些静态资源加载完成后，在onPageFinished方法中再把图片自动加载打开让网页加载图片：
1
2
3
4
5
6
7	@Override
public void onPageFinished(WebView view, String url) {
    super.onPageFinished(view, url);
    if (!mWebView.getSettings().getLoadsImagesAutomatically()) {
        mWebView.getSettings().setLoadsImagesAutomatically(true);
    }
}
WebView的独立进程
通常来说，WebView的使用会带来诸多问题，内存泄露就是最常见的问题，为了避免WebView内存泄露，目前最流行的有两种做法：
1、独立进程，简单暴力，不过可能涉及到进程间通信
2、动态添加WebView，对传入WebView中使用的Context使用弱引用，动态添加WebView意思在布局创建个ViewGroup用来放置WebView，Activity创建时add进来，在Activity停止时remove掉
个人推荐独立进程，好处主要有两点，一是在WebViewActivity使用完毕后直接干掉该进程，防止了内存泄露，二是为我们的app主进程减少了额外的内存占用量
使用独立进程还需注意一点，这个进程中在有多个WebViewActivity，不能在Activity销毁时就干掉进程，不然其它Activity也会蹦了，此时应该在该进程创建一个Activity的维护集合，集合为空时即可干掉进程
关于WebView的销毁，如下：
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
11	private void destroyWebView(WebView webView) {
    if (webView == null)
        return;
    webView.stopLoading();
    ViewParent viewParent = webView.getParent();
    if (viewParent != null && viewParent instanceof ViewGroup)
        ((ViewGroup) viewParent).removeView(webView);
    webView.removeAllViews();
    webView.destroy();
    webView = null;
}
WebView的兼容性
不同版本硬件加速的问题
1
2
3
4
5
6
7
8
9
10	if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1 && shouldOpenHardware()) {
    mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
}
public static boolean shouldOpenHardware () {
    if ("samsung".equalsIgnoreCase(Build.BRAND))
        return false;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
        return true;
    return true;
}
不同设备点击WebView输入框键盘的不弹起
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
12	mWebView.setOnTouchListener(new View.OnTouchListener() {
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        try {
            if (mWebView != null)
                mWebView.requestFocus();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
});
三星手机硬件加速关闭后导致H5弹出的对话框出现不消失情况
1
2
3
4
5
6	String brand = android.os.Build.BRAND;
if ("samsung".equalsIgnoreCase(brand) && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
}
不同版本shouldOverrideUrlLoading的回调时机
对于shouldOverrideUrlLoading的加载时机，有些同学经常与onProgressChanged这个方法的加载时机混淆，这两个方法有两点不同：
1、shouldOverrideUrlLoading只会走Get方式的请求，Post方式的请求将不会回调这个方法，而onProgressChanged对Get和Post都会走
2、shouldOverrideUrlLoading都知道在WebView内部点击链接（Get）会触发，它在Get请求打开界面时也会触发，shouldOverrideUrlLoading还有一点特殊，就是在按返回键返回到上一个页面时时不会触发的，而onProgressChanged在只要界面更新了都会触发
对于shouldOverrideUrlLoading的返回值，返回true为剥夺WebView对该此请求的控制权，交给应用自己处理，所以WebView也不会加载该url了，返回false为WebView自己处理
对于shouldOverrideUrlLoading的调用时机，也会有不同，在3.0以上是会正常调用的，而在3.0以下，并不是每次都会调用，可以在onPageStarted方法中做处理，也没必要了，现在应该都适配4.0以上了
页面重定向导致WebView:goBack()无效的处理
像一些界面有重定向，比如：淘宝等，需要按多次（>1）才能正常返回，一般都是二次，所以可以把那些具有重定向的界面存入一个集合中，在拦截返回事件中这样处理：
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
25	@Override
public void onBackPressed() {
    if (mWebView == null)
        return;
    WebBackForwardList backForwardList = mWebView.copyBackForwardList();
    if (backForwardList != null && backForwardList.getSize() != 0) {
        int currentIndex = backForwardList.getCurrentIndex();
        WebHistoryItem historyItem = backForwardList.getItemAtIndex(currentIndex - 1);
        if (historyItem != null) {
            String backPageUrl = historyItem.getUrl();
            if (TextUtils.isEmpty(backPageUrl))
                return;
            int size = REDIRECT_URL.size();
            for (int i = 0; i < size; i++) {
                if (backPageUrl.contains(REDIRECT_URL.get(i)))
                    mWebView.goBack();
            }
        }
    }
    if (mWebView.canGoBack()) {
        mWebView.goBack();
    } else {
        this.finish();
    }
}
这里处理是在按返回键时，如果上一个界面是重定向界面，则直接调用goBack，或者也可以finish当前Activity
WebView无法加载不信任网页SSL错误的处理
有时我们的WebView会加载一些不信任的网页，这时候默认的处理是WebView停止加载了，而那些不信任的网页都不是由CA机构信任的，这时候你可以选择继续加载或者让手机内的浏览器来加载：
1
2
3
4
5
6	@Override
public void onReceivedSslError(WebView view, final SslErrorHandler handler, SslError error) {
    //继续加载
    handler.proceed();
    //或者其它处理 ...
}
自定义WebView加载出错界面
出错的界面的显示，可以在这个方法中控制：
1
2
3
4	@Override
public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
    super.onReceivedError(view, request, error);
}
你可以重新加载一段Html专门用来显示错误界面，或者用布局显示一个出错的View，这时候需要把出错的WebView内容清除，可以使用：
1
2
3
4
5
6	@Override
public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
    super.onReceivedError(view, request, error);
    view.loadDataWithBaseURL(null,"","text/html","UTF-8",null);
    errorView.setVisibility(View.VISIBLE);
}
获取位置权限的处理
如果在WebView中有获取地理位置的请求，那么可以直接在代码中默认处理了，没必要弹出一个框框让用户每次都确认：
1
2
3
4
5	@Override
public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
    super.onGeolocationPermissionsShowPrompt(origin, callback);
    callback.invoke(origin, true, false);
}
打造一个通用的WebViewActivity界面
一个通用的WebViewActivity当然是样式和WebView内部处理的策略都统一样，这里只对样式进行说明，因为WebView内部的处理各个公司都不一样，但应该都需要包含这么几点吧：
1、白名单检测
2、Url的跳转
3、出错的处理
4、…
一个WebViewActivity界面，最主要的就是Toolbar标题栏的设计了，因为不同的app的WebViewActivity界面Toolbar上有不同的icon和操作，比如：分享按钮、刷新按钮、更多按钮，都不一样，既然需要通用，即可让调用者传入某个参数来动态改变这些东西吧，比如传一个ToolbarStyle来标识此WebViewActivity的风格是什么样的，背景色、字体颜色、图标等，包括点击时的动画效果，作为通用的界面，必须是让调用者简单操作，不可能调用时传入一个图标id还是一个Drawable，所以，主要需要用到tint，来对字体、图标的颜色动态改变，代码如下：
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
15	public static ColorStateList createColorStateList(int normal, int pressed) {
    int[] colors = new int[]{normal, pressed};
    int[][] states = new int[2][];
    states[0] = new int[]{-android.R.attr.state_pressed};
    states[1] = new int[]{android.R.attr.state_pressed};
    return new ColorStateList(states, colors);
}

public static Drawable tintDrawable(Drawable drawable, int color) {
    final Drawable tintDrawable = DrawableCompat.wrap(drawable.mutate());
    ColorStateList colorStateList = ColorStateList.valueOf(color);
    DrawableCompat.setTintMode(tintDrawable, PorterDuff.Mode.SRC_IN);
    DrawableCompat.setTintList(tintDrawable, colorStateList);
    return tintDrawable;
}
H5与Native界面互相唤起
对于H5界面，有些操作往往是需要唤起Native界面的，比如：H5中的登录按钮，点击后往往唤起Native的登录界面来进行登录，而不是直接在H5登录，这样一个app就只需要一套登录了，而我们所做的便是拦截登录按钮的url：
1
2
3
4
5	@Override
public boolean shouldOverrideUrlLoading(WebView view, String url) {
    parserURL(url); //解析url,如果符合跳转native界面的url规则，则跳转native界面
    return super.shouldOverrideUrlLoading(view, url);
}
这个规则我们可以在Native的Activity的intent-filter中的data来定义，如下：
1
2
3
4
5
6
7
8
9
10	<activity android:name=".LoginActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data
            android:host="native"
            android:path="/login"
            android:scheme="activity"/>
    </intent-filter>
</activity>
解析url过程是判断scheme、host、path的是否有完全与之匹配的，有则唤起
而Native唤H5，其实也是一个url的解析过程，只不过需要配置WebViewActivity的intent-filter的data，WebViewActivity的scheme配置为http和https
startActivity VS UrlRouter
上面说到了H5与Native互相调起，其实这个可以在app内做成一套界面跳转的方式，摒弃startActivity，为什么原生的跳转方式不佳？
1、因为原生的跳转需要确定该Activity是已经存在的，否则编译将报错，这样带来的问题是不利于协同开发，如：A、B同学分别正在开发项目的两个不同的模块，此时B刚好需要跳A同学的某一个界面，如商品列表页跳商品详情页，这时候B就必须写个TODO，待B完成该模块后再写了。而通过url跳转，只需要传入一串url即可
2、原生的跳转Activity与目标Activity是耦合的，跳转Activity完全依赖于目标Activity
3、原生的跳转方式不利于管理所传递来的参数，获取参数时需要在跳转Activity的地方确定传递了几个参数、什么类型的参数，这样以来跳转的方式多了，就比较混乱了。当然一个原生跳转良好的设计是在目的Activity实现一个静态的start方法，其它界面要跳直接调用即可
4、最后一个就是在有参数传递的情况下，每次跳转都要写好多代码啊
而UrlRouter框架的实现原理，一种实现是可以维护一套Activity与url的映射表，这种方式还是没有摆脱不利于协同开发这个毛病，另外一种是通过一串指定规则的url与manifest中配置的data匹配，具体跳转则是通过intent.setData()来设置跳转的url，这种方式比较好，不过需要处理下匹配到多个Activity时优先选择的问题
JsBridge地址：RainbowBridge

Hybrid APP底层依赖于Native提供的容器（UIWebview），上层使用Html&Css&JS做业务开发，底层透明化、上层多多样化
Hybrid是有缺点的，Hybrid体验就肯定比不上Native，所以使用有其场景，但是对于需要快速试错、快速占领市场的团队来说，Hybrid一定是不二的选择，团队生存下来后还是需要做体验更好的原生APP。

① Hybrid中Native与前端各自的工作是什么

② Hybrid的交互接口如何设计

③ Hybrid的Header如何设计

④ Hybrid的如何设计目录结构以及增量机制如何实现

⑤ 资源缓存策略，白屏问题......

在做Hybrid架构设计之前需要分清Native与前端的界限，首先Native提供的是一宿主环境，要合理的利用Native提供的能力，要实现通用的Hybrid平台架构，
交互设计
① NativeUI组件，header组件、消息类组件
② 通讯录、系统、设备信息读取接口
③ H5与Native的互相跳转，比如H5如何跳到一个Native页面，H5如何新开Webview做动画跳到另一个H5页面
资源访问机制
Native首先需要考虑如何访问H5资源，做到既能以file的方式访问Native内部资源，又能使用url的方式访问线上资源；需要提供前端资源增量替换机制，以摆脱APP迭代发版问题，避免用户升级APP。这里就会涉及到静态资源在APP中的存放策略，更新策略的设计，复杂的话还会涉及到服务器端的支持。
账号信息设计
账号系统是重要并且无法避免的，Native需要设计良好安全的身份验证机制，保证这块对业务开发者足够透明，打通账户信息。
Hybrid开发调试
功能设计完并不是结束，Native与前端需要商量出一套可开发调试的模

交互设计:

app自身可以自定义url schema，并且把自定义的url注册在调度中心， 例如
ctrip://wireless 打开携程App
前端框架定义了一个全局变量BNJS作为Native与前端交互的对象，只要引入了糯米提供的这个JS库，并且在糯米封装的Webview容器中，前端便获得了调用Native的能力这样做有一个前提是，Native本身已经十分稳定了，很少新增功能了，否则在直连情况下就会面临一个尴尬，因为web站点永远保持最新的，就会在一些低版本容器中调用了没有提供的Native能力而报错。

这里提一点，APP安装后会在手机上注册一个schema，比如淘宝是taobao://，Native会有一个进程监控Webview发出的所有schema://请求，然后分发到“控制器”hybridapi处理程序，Native控制器处理时会需要param提供的参数（encode过），处理结束后将携带数据获取Webview window对象中的callback（hybrid_1446276509894）调用之
数据返回的格式约定是：
{
  data: {},
  errno: 0,
  msg: "success"
}
真实的数据在data对象中，如果errno不为0的话，便需要提示msg，这里举个例子如果错误码1代表该接口需要升级app才能使用的话：
{
  data: {},
  errno: 1,
  msg: "APP版本过低，请升级APP版本"
}
代码实现
这里给一个简单的代码实现，真实代码在APP中会有所变化：

 1 window.Hybrid = window.Hybrid || {}; 2 var bridgePostMsg = function (url) { 3     if ($.os.ios) { 4         window.location = url; 5     } else { 6         var ifr = $('<iframe style="display: none;" src="' + url + '"/>'); 7         $('body').append(ifr); 8         setTimeout(function () { 9             ifr.remove();10         }, 1000)11     }12 };13 var _getHybridUrl = function (params) {14     var k, paramStr = '', url = 'scheme://';15     url += params.tagname + '?t=' + new Date().getTime(); //时间戳，防止url不起效16     if (params.callback) {17         url += '&callback=' + params.callback;18         delete params.callback;19     }20     if (params.param) {21         paramStr = typeof params.param == 'object' ? JSON.stringify(params.param) : params.param;22         url += '&param=' + encodeURIComponent(paramStr);23     }24     return url;25 };26 var requestHybrid = function (params) {27     //生成唯一执行函数，执行后销毁28     var tt = (new Date().getTime());29     var t = 'hybrid_' + tt;30     var tmpFn;31 32     //处理有回调的情况33     if (params.callback) {34         tmpFn = params.callback;35         params.callback = t;36         window.Hybrid[t] = function (data) {37             tmpFn(data);38             delete window.Hybrid[t];39         }40     }41     bridgePostMsg(_getHybridUrl(params));42 };43 //获取版本信息，约定APP的navigator.userAgent版本包含版本信息：scheme/xx.xx.xx44 var getHybridInfo = function () {45     var platform_version = {};46     var na = navigator.userAgent;47     var info = na.match(/scheme\/\d\.\d\.\d/);48 49     if (info && info[0]) {50         info = info[0].split('/');51         if (info && info.length == 2) {52             platform_version.platform = info[0];53             platform_version.version = info[1];54         }55     }56     return platform_version;57 };

因为Native对于H5来是底层，框架&底层一般来说是不会关注业务实现的，所以真实业务中Native调用H5场景较少，这里不予关注了。
常用交互API
良好的交互设计是成功的第一步，在真实业务开发中有一些API一定会用到。
跳转
跳转是Hybrid必用API之一，对前端来说有以下跳转：
① 页面内跳转，与Hybrid无关
② H5跳转Native界面
③ H5新开Webview跳转H5页面，一般为做页面动画切换
如果要使用动画，按业务来说有向前与向后两种，forward&back，所以约定如下，首先是H5跳Native某一个页面

 1 //H5跳Native页面 2 //=>baidubus://forward?t=1446297487682&param=%7B%22topage%22%3A%22home%22%2C%22type%22%3A%22h2n%22%2C%22data2%22%3A2%7D 3 requestHybrid({ 4     tagname: 'forward', 5     param: { 6         //要去到的页面 7         topage: 'home', 8         //跳转方式，H5跳Native 9         type: 'native',10         //其它参数11         data2: 212     }13 });

比如携程H5页面要去到酒店Native某一个页面可以这样：

 1 //=>schema://forward?t=1446297653344&param=%7B%22topage%22%3A%22hotel%2Fdetail%20%20%22%2C%22type%22%3A%22h2n%22%2C%22id%22%3A20151031%7D 2 requestHybrid({ 3     tagname: 'forward', 4     param: { 5         //要去到的页面 6         topage: 'hotel/detail', 7         //跳转方式，H5跳Native 8         type: 'native', 9         //其它参数10         id: 2015103111     }12 });

比如H5新开Webview的方式跳转H5页面便可以这样：

 1 requestHybrid({ 2     tagname: 'forward', 3     param: { 4         //要去到的页面，首先找到hotel频道，然后定位到detail模块 5         topage: 'hotel/detail  ', 6         //跳转方式，H5新开Webview跳转，最后装载H5页面 7         type: 'webview', 8         //其它参数 9         id: 2015103110     }11 });

back与forward一致，我们甚至会有animattype参数决定切换页面时的动画效果，真实使用时可能会封装全局方法略去tagname的细节，这时就和糯米对外释放的接口差不多了。
Header 组件的设计
最初我其实是抵制使用Native提供的UI组件的，尤其是Header，因为平台化后，Native每次改动都很慎重并且响应很慢，但是出于两点核心因素考虑，我基本放弃了抵抗：
① 其它主流容器都是这么做的，比如微信、手机百度、携程
② 没有header一旦网络出错出现白屏，APP将陷入假死状态，这是不可接受的，而一般的解决方案都太业务了
PS：Native吊起Native时，如果300ms没有响应需要出loading组件，避免白屏
因为H5站点本来就有Header组件，站在前端框架层来说，需要确保业务的代码是一致的，所有的差异需要在框架层做到透明化，简单来说Header的设计需要遵循：
① H5 header组件与Native提供的header组件使用调用层接口一致
② 前端框架层根据环境判断选择应该使用H5的header组件抑或Native的header组件
一般来说header组件需要完成以下功能：
① header左侧与右侧可配置，显示为文字或者图标（这里要求header实现主流图标，并且也可由业务控制图标），并需要控制其点击回调
② header的title可设置为单标题或者主标题、子标题类型，并且可配置lefticon与righticon（icon居中）
③ 满足一些特殊配置，比如标签类header
所以，站在前端业务方来说，header的使用方式为（其中tagname是不允许重复的）：

 1 //Native以及前端框架会对特殊tagname的标识做默认回调，如果未注册callback，或者点击回调callback无返回则执行默认方法 2 // back前端默认执行History.back，如果不可后退则回到指定URL，Native如果检测到不可后退则返回Naive大首页 3 // home前端默认返回指定URL，Native默认返回大首页 4 this.header.set({ 5     left: [ 6         { 7             //如果出现value字段，则默认不使用icon 8             tagname: 'back', 9             value: '回退',10             //如果设置了lefticon或者righticon，则显示icon11             //native会提供常用图标icon映射，如果找不到，便会去当前业务频道专用目录获取图标12             lefticon: 'back',13             callback: function () { }14         }15     ],16     right: [17         {18             //默认icon为tagname，这里为icon19             tagname: 'search',20             callback: function () { }21         },22     //自定义图标23         {24         tagname: 'me',25         //会去hotel频道存储静态header图标资源目录搜寻该图标，没有便使用默认图标26         icon: 'hotel/me.png',27         callback: function () { }28     }29     ],30     title: 'title',31     //显示主标题，子标题的场景32     title: ['title', 'subtitle'],33 34     //定制化title35     title: {36         value: 'title',37         //标题右边图标38         righticon: 'down', //也可以设置lefticon39         //标题类型，默认为空，设置的话需要特殊处理40         //type: 'tabs',41         //点击标题时的回调，默认为空42         callback: function () { }43     }44 });

因为Header左边一般来说只有一个按钮，所以其对象可以使用这种形式：

 1 this.header.set({ 2     back: function () { }, 3     title: '' 4 }); 5 //语法糖=> 6 this.header.set({ 7     left: [{ 8         tagname: 'back', 9         callback: function(){}10     }],11     title: '',12 });

为完成Native端的实现，这里会新增两个接口，向Native注册事件，以及注销事件：

1 var registerHybridCallback = function (ns, name, callback) {2   if(!window.Hybrid[ns]) window.Hybrid[ns] = {};3   window.Hybrid[ns][name] = callback;4 };5 6 var unRegisterHybridCallback = function (ns) {7   if(!window.Hybrid[ns]) return;8   delete window.Hybrid[ns];9 };

Native Header组件的实现：
 Native Header组件的封装
请求类
虽然get类请求可以用jsonp的方式绕过跨域问题，但是post请求却是真正的拦路虎，为了安全性服务器设置cors会仅仅针对几个域名，Hybrid内嵌静态资源是通过file的方式读取，这种场景使用cors就不好使了，所以每个请求需要经过Native做一层代理发出去。

这个使用场景与Header组件一致，前端框架层必须做到对业务透明化，业务事实上不必关心这个请求是由浏览器发出还是由Native发出：
1 HybridGet = function (url, param, callback) {2 };3 HybridPost = function (url, param, callback) {4 };
真实的业务场景，会将之封装到数据请求模块，在底层做适配，在H5站点下使用ajax请求，在Native内嵌时使用代理发出，与Native的约定为：

 1 requestHybrid({ 2     tagname: 'ajax', 3     param: { 4         url: 'hotel/detail', 5         param: {}, 6         //默认为get 7         type: 'post' 8     }, 9     //响应后的回调10     callback: function (data) { }11 });

常用NativeUI组件
最后，Native会提供几个常用的Native级别的UI，比如loading加载层，比如toast消息框：

 1 var HybridUI = {}; 2 HybridUI.showLoading(); 3 //=> 4 requestHybrid({ 5     tagname: 'showLoading' 6 }); 7  8 HybridUI.showToast({ 9     title: '111',10     //几秒后自动关闭提示框，-1需要点击才会关闭11     hidesec: 3,12     //弹出层关闭时的回调13     callback: function () { }14 });15 //=>16 requestHybrid({17     tagname: 'showToast',18     param: {19         title: '111',20         hidesec: 3,21         callback: function () { }22     }23 });

Native UI与前端UI不容易打通，所以在真实业务开发过程中，一般只会使用几个关键的Native UI。
账号系统的设计
根据上面的设计，我们约定在Hybrid中请求有两种发出方式：
① 如果是webview访问线上站点的话，直接使用传统ajax发出
② 如果是file的形式读取Native本地资源的话，请求由Native代理发出
因为静态html资源没有鉴权的问题，真正的权限验证需要请求服务器api响应通过错误码才能获得，这是动态语言与静态语言做入口页面的一个很大的区别。
以网页的方式访问，账号登录与否由是否带有秘钥cookie决定（这时并不能保证秘钥的有效性），因为Native不关注业务实现，而每次载入都有可能是登录成功跳回来的结果，所以每次载入后都需要关注秘钥cookie变化，以做到登录态数据一致性。
以file的方式访问内嵌资源的话，因为API请求控制方为Native，所以鉴权的工作完全由Native完成，接口访问如果没有登录便弹出Native级别登录框引导登录即可，每次访问webview将账号信息种入到webview中，这里有个矛盾点是Native种入webview的时机，因为有可能是网页注销的情况，所以这里的逻辑是：
① webview载入结束
② Native检测webview是否包含账号cookie信息
③ 如果不包含则种入cookie，如果包含则检测与Native账号信息是否相同，不同则替换自身
④ 如果检测到跳到了注销账户的页面，则需要清理自身账号信息
如果登录不统一会就会出现上述复杂的逻辑，所以真实情况下我们会对登录接口收口。
简单化账号接口
平台层面觉得上述操作过于复杂，便强制要求在Hybrid容器中只能使用Native接口进行登录和登出，前端框架在底层做适配，保证上层业务的透明，这样情况会简单很多：
① 使用Native代理做请求接口，如果没有登录直接Native层唤起登录框
② 直连方式使用ajax请求接口，如果没有登录则在底层唤起登录框（需要前端框架支持）
简单的登录登出接口实现：

 1 /* 2 无论成功与否皆会关闭登录框 3 参数包括： 4 success 登录成功的回调 5 error 登录失败的回调 6 url 如果没有设置success，或者success执行后没有返回true，则默认跳往此url 7 */ 8 HybridUI.Login = function (opts) { 9 };10 //=>11 requestHybrid({12     tagname: 'login',13     param: {14         success: function () { },15         error: function () { },16         url: '...'17     }18 });19 //与登录接口一致，参数一致20 HybridUI.logout = function () {21 };

账号信息获取
在实际的业务开发中，判断用户是否登录、获取用户基本信息的需求比比皆是，所以这里必须保证Hybrid开发模式与H5开发模式保持统一，否则需要在业务代码中做很多无谓的判断，我们在前端框架会封装一个User模块，主要接口包括：
1 var User = {};2 User.isLogin = function () { };3 User.getInfo = function () { };
这个代码的底层实现分为前端实现，Native实现，首先是前端的做法是：
当前端页面载入后，会做一次异步请求，请求用户相关数据，如果是登录状态便能获取数据存于localstorage中，这里一定不能存取敏感信息
前端使用localstorage的话需要考虑极端情况下使用内存变量的方式替换localstorage的实现，否则会出现不可使用的情况，而后续的访问皆是使用localstorage中的数据做判断依据，以下情况需要清理localstorage的账号数据：
① 系统登出
② 访问接口提示需要登录
③ 调用登录接口
这种模式多用于单页应用，非单页应用一般会在每次刷新页面先清空账号信息再异步拉取，但是如果当前页面马上就需要判断用户登录数据的话，便不可靠了;处于Hybrid容器中时，因为Native本身就保存了用户信息，封装的接口直接由Native获取即可，这块比较靠谱。
Hybrid的资源
目录结构
Hybrid技术既然是将静态资源存于Native，那么就需要目录设计，经过之前的经验，目录结构一般以2层目录划分：

如果我们有两个频道酒店与机票，那么目录结构是这样的：

 1 webapp //根目录 2 ├─flight 3 ├─hotel //酒店频道 4 │  │  index.html //业务入口html资源，如果不是单页应用会有多个入口 5 │  │  main.js //业务所有js资源打包 6 │  │ 7 │  └─static //静态样式资源 8 │      ├─css  9 │      ├─hybrid //存储业务定制化类Native Header图标10 │      └─images11 ├─libs12 │      libs.js //框架所有js资源打包13 │14 └─static15     ├─css16     └─images

最初设计的forward跳转中的topage参数规则是：频道/具体页面=>channel/page，其余资源会由index.html这个入口文件带出。
增量机制
真实的增量机制需要服务器端的配合，我这里只能简单描述，Native端会有维护一个版本映射表：

{
  flight: 1.0.0,
  hotel: 1.0.0,
  libs: 1.0.0,
  static: 1.0.0
}

这个映射表是每次大版本APP发布时由服务器端生成的，如果酒店频道需要在线做增量发布的话，会打包一个与线上一致的文件目录，走发布平台发布，会在数据库中形成一条记录：
channel	ver	md5
flight	1.0.0	1245355335
hotel	1.0.1	455ettdggd
 
 
 
当APP启动时，APP会读取版本信息，这里发现hotel的本地版本号比线上的小，便会下载md5对应的zip文件，然后解压之并且替换整个hotel文件，本次增量结束，因为所有的版本文件不会重复，APP回滚时可用回到任意想去的版本，也可以对任意版本做BUG修复。
结语
github上代码会持续更新，现在界面反正不太好看，大家多多包涵吧，这里是一些效果图：

Hybrid方案是快速迭代项目，快速占领市场的神器，希望此文能对准备接触Hybrid技术的朋友提供一些帮助，并且再次感谢明月同学的配合。


Hybrid:跨语言通讯开发模式,通讯层是重点

基本:
Android调用H5:webview类的 loadUrl 方法可以直接执行js代码
例:webview.loadUrl("javascript: alert('hello world')");

H5调用Android:webview可以拦截H5发起的任意url请求，webview通过约定的规则对拦截到的url进行处理（消费），即可实现H5调用Android
例:
var ifm = document.createElement('iframe');
ifm.src = 'jsbridge://namespace.method?[...args]';

P.S：注册私有协议的做法很常见，我们经常遇到的在网页里拉起一个系统app就是采用私有协议实现的。app在安装完成之后会注册私有协议到OS，浏览器发现自身不能识别的协议（http、https、file等）时，会将链接抛给OS，OS会寻找可识别此协议的app并用该app处理链接。比如在网页里以 itunes:// 开头的链接是Apple Store的私有协议，点击后可以启动Apple Store并且跳转到相应的界面。国内软件开发商也经常这么做，比如支付宝的私有协议 alipay:// ，腾讯的 tencent:// 等等。

桥协议的具体实现:
调用方会将调用的api、参数、以及请求签名（由调用方生成）带上传给被调用方，被调用方处理完之后会吧结果以及请求签名回传调用方，调用方再根据请求签名找到本次请求对应的回调函数并执行，至此完成了一次通讯闭环。
H5调用Native（以Android为例）示意图：

Jsbridge作为通用协议:需要和业务层进行解耦
总的原则是H5提供内容，Native提供容器，在有可能的条件下对Android原生webview进行优化和改造（参考阿里Hybrid容器的JSM），提升H5的渲染效率。但关键界面、交互性强(支付,动画)的的界面使用Native
打开的界面都是Native的导航组件+webview来组成，这样即使H5加载失败或者太慢用户可以选择直接关闭

手机连接流程
首先，手机要通过无线网络协议，从基站获得无线链路分配，才能跟网络进行通讯。 无线网络基站、基站控制器这方面，会给手机进行信号的分配，已完成手机连接和交互。 获得无线链路后，会进行网络附着、加密、鉴权，核心网络会检查你是不是可以连接在这个网络上，是否开通套餐，是不是漫游等。核心网络有SGSN和GGSN，在这一步完成无线网络协议和有线以太网的协议转换。 再下一步，核心网络会给你进行APN选择、IP分配、启动计费。 再往下面，才是传统网络的步骤：DNS查询、响应，建立TCP链接，HTTP GET，RTTP RESPONSE 200 OK，HTTP RESPONSE DATA，LAST HTTP RESPONSE DATA，开始UI展现。