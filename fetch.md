# WorkerOrGlobalScope.fetch(): 
Window 和 WorkerGlobalScope 都实现了 WorkerOrGlobalScope,便可使用fetch方法

# 语法
## Promise<Response> fetch(input[, init]);

?input
  一个 USVString 字符串，包含要获取资源的 URL。一些浏览器会接受 blob: 和 data: 作为 schemes.
  一个 Request 对象。 如:new Request('flowers.jpg',myInit);

init 可选
  method: 请求使用的方法，如 GET、POST。
  headers: 请求的头信息，形式为 Headers 的对象或包含 ByteString 值的对象字面量。
  body: 请求的 body 信息：可能是一个 Blob、BufferSource、FormData、URLSearchParams 或者 USVString 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
  mode: 请求的模式，如 cors、 no-cors 或者 same-origin。
  credentials: 请求的 credentials，如 omit、same-origin 或者 include。为了在当前域名内自动发送 cookie ， 必须提供这个选项， 从 Chrome 50 开始， 这个属性也可以接受 FederatedCredential 实例或是一个 PasswordCredential 实例。
  cache:  请求的 cache 模式: default 、 no-store 、 reload 、 no-cache 、 force-cache 或者 only-if-cached 。
  redirect: 可用的 redirect 模式: follow (自动重定向), error (如果产生重定向将自动终止并且抛出一个错误), 或者 manual (手动处理重定向). 在Chrome中，Chrome 47之前的默认值是 follow，从 Chrome 47开始是 manual。
  referrer: 一个 USVString 可以是 no-referrer、client或一个 URL。默认是 client。
  referrerPolicy: 指定了HTTP头部referer字段的值。可能为以下值之一： no-referrer、 no-referrer-when-downgrade、 origin、 origin-when-cross-origin、 unsafe-url 。
  integrity: 包括请求的  subresource integrity 值 （ 例如： sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。

与ajax区别:
  1. 仅当网络故障时或请求被阻止时，才会标记为 reject. 404及5XX仅改变ok 属性
  2. 可接受跨域cookie
  3. 可能需要手动设置是否发送cookie


function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  })
  .then(response => response.json()) // parses response to JSON
}












## PS
USVString 对应 unicode 标量值的所有可能序列的集合。在JavaScript中返回时， USVString 映射到 String 。它通常仅用于执行文本处理的 API，需要一串 unicode 标量值才能进行操作。除了不允许不成对的代理代码之外， USVString 等同于 DOMString 。 USVString 中存在的不成对的代理代码由浏览器转换为 Unicode '替换字符' U+FFFD, (�).

Unicode 标量值（ Unicode scalar values ）：字符的代号。

不成对的代理代码（ Unpaired surrogate codepoints ）：高代理代码后面没有低代理代码，或者低代理代码之前没有高代理代码。



URL.createObjectURL(object);
object
用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。​
返回值
一个DOMString包含了一个对象URL，该URL可用于指定源 object的内容。


Content-Security-Policy 
由于指定服务器源和脚本终端,可防止xss
Content-Security-Policy: <policy-directive>; <policy-directive>