Promise核心说明

尽管Promise已经有自己的规范，但目前的各类Promise库，在Promise的实现细节上是有差异的，部分API甚至在意义上完全不同。但Promise的核心内容，是相通的，它就是then方法。在相关术语中，promise指的就是一个有then方法，且该方法能触发特定行为的对象或函数。
Promise可以有不同的实现方式，因此Promise核心说明并不会讨论任何具体的实现代码。



起步：用这一种方式理解Promise
回想一下Promise解决的是什么问题？回调。例如，函数doMission1()代表第一件事情，现在，我们想要在这件事情完成后，再做下一件事情doMission2()，应该怎么做呢？
先看看我们常见的回调模式。doMission1()说：“你要这么做的话，就把doMission2()交给我，我在结束后帮你调用。”所以会是：
doMission1(doMission2);
Promise模式又是如何呢？你对doMission1()说：“不行，控制权要在我这里。你应该改变一下，你先返回一个特别的东西给我，然后我来用这个东西安排下一件事。”这个特别的东西就是Promise，这会变成这样：
doMission1().then(doMission2);
可以看出，Promise将回调模式的主从关系调换了一个位置（翻身做主人！），多个事件的流程关系，就可以这样集中到主干道上（而不是分散在各个事件函数之内）。
好了，如何做这样一个转换呢？从最简单的情况来吧，假定doMission1()的代码是：
function doMission1(callback){
  var value = 1;
  callback(value);
}
那么，它可以改变一下，变成这样：
function doMission1(){
  return {
    then: function(callback){
      var value = 1;
      callback(value);
    }
  };
}
这就完成了转换。虽然并不是实际有用的转换，但到这里，其实已经触及了Promise最为重要的实现要点，即Promise将返回值转换为带then方法的对象。



进阶：Q的设计路程
从defer开始
design/q0.js是Q初步成型的第一步。它创建了一个名为defer的工具函数，用于创建Promise：
var defer = function () {
  var pending = [], value;
  return {
    resolve: function (_value) {
      value = _value;
      for (var i = 0, ii = pending.length; i < ii; i++) {
        var callback = pending[i];
        callback(value);
      }
      pending = undefined;
    },
    then: function (callback) {
      if (pending) {
        pending.push(callback);
      } else {
        callback(value);
      }
    }
  }
};
这段源码可以看出，运行defer()将得到一个对象，该对象包含resolve和then两个方法。请回想一下jQuery的Deferred（同样有resolve和then），这两个方法将会是近似的效果。then会参考pending的状态，如果是等待状态则将回调保存（push），否则立即调用回调。resolve则将肯定这个Promise，更新值的同时运行完所有保存的回调。defer的使用示例如下：
var oneOneSecondLater = function () {
  var result = defer();
  setTimeout(function () {
    result.resolve(1);
  }, 1000);
  return result;
};
oneOneSecondLater().then(callback);
这里oneOneSecondLater()包含异步内容（setTimeout），但这里让它立即返回了一个defer()生成的对象，然后将对象的resolve方法放在异步结束的位置调用（并附带上值，或者说结果）。
到此，以上代码存在一个问题：resolve可以被执行多次。因此，resolve中应该加入对状态的判断，保证resolve只有一次有效。这就是Q下一步的design/q1.js（仅差异部分）：
resolve: function (_value) {
  if (pending) {
    value = _value;
    for (var i = 0, ii = pending.length; i < ii; i++) {
      var callback = pending[i];
      callback(value);
    }
    pending = undefined;
  } else {
    throw new Error("A promise can only be resolved once.");
  }
}
对第二次及更多的调用，可以这样抛出一个错误，也可以直接忽略掉。
分离defer和promise
在前面的实现中，defer生成的对象同时拥有then方法和resolve方法。按照定义，promise关心的是then方法，至于触发promise改变状态的resolve，是另一回事。所以，Q接下来将拥有then方法的promise，和拥有resolve的defer分离开来，各自独立使用。这样就好像划清了各自的职责，各自只留一定的权限，这会使代码逻辑更明晰，易于调整。请看design/q3.js：（q2在此跳过）

var isPromise = function (value) {
  return value && typeof value.then === "function";
};
 
var defer = function () {
  var pending = [], value;
  return {
    resolve: function (_value) {
      if (pending) {
        value = _value;
        for (var i = 0, ii = pending.length; i < ii; i++) {
          var callback = pending[i];
          callback(value);
        }
        pending = undefined;
      }
    },
    promise: {
      then: function (callback) {
        if (pending) {
          pending.push(callback);
        } else {
          callback(value);
        }
      }
    }
  };
};
如果你仔细对比一下q1，你会发现区别很小。一方面，不再抛出错误（改为直接忽略第二次及更多的resolve），另一方面，将then方法移动到一个名为promise的对象内。到这里，运行defer()得到的对象（就称为defer吧），将拥有resolve方法，和一个promise属性指向另一个对象。这另一个对象就是仅有then方法的promise。这就完成了分离。
前面还有一个isPromise()函数，它通过是否有then方法来判断对象是否是promise（duck-typing的判断方法）。为了正确使用和处理分离开的promise，会像这样需要将promise和其他值区分开来。
实现promise的级联
接下来会是相当重要的一步。到前面到q3为止，所实现的promise都是不能级联的。但你所熟知的promise应该支持这样的语法：
?
1
promise.then(step1).then(step2);
以上过程可以理解为，promise将可以创造新的promise，且取自旧的promise的值（前面代码中的value）。要实现then的级联，需要做到一些事情：
    then方法必须返回promise。
    这个返回的promise必须用传递给then方法的回调运行后的返回结果，来设置自己的值。
    传递给then方法的回调，必须返回一个promise或值。
design/q4.js中，为了实现这一点，新增了一个工具函数ref：
var ref = function (value) {
  if (value && typeof value.then === "function")
    return value;
  return {
    then: function (callback) {
      return ref(callback(value));
    }
  };
};
这是在着手处理与promise关联的value。这个工具函数将对任一个value值做一次包装，如果是一个promise，则什么也不做，如果不是promise，则将它包装成一个promise。注意这里有一个递归，它确保包装成的promise可以使用then方法级联。为了帮助理解它，下面是一个使用的例子：
ref("step1").then(function(value){
  console.log(value); // "step1"
  return 15;
}).then(function(value){
  console.log(value); // 15
});
你可以看到value是怎样传递的，promise级联需要做到的也是如此。
design/q4.js通过结合使用这个ref函数，将原来的defer转变为可级联的形式：
var defer = function () {
  var pending = [], value;
  return {
    resolve: function (_value) {
      if (pending) {
        value = ref(_value); // values wrapped in a promise
        for (var i = 0, ii = pending.length; i < ii; i++) {
          var callback = pending[i];
          value.then(callback); // then called instead
        }
        pending = undefined;
      }
    },
    promise: {
      then: function (_callback) {
        var result = defer();
        // callback is wrapped so that its return
        // value is captured and used to resolve the promise
        // that "then" returns
        var callback = function (value) {
          result.resolve(_callback(value));
        };
        if (pending) {
          pending.push(callback);
        } else {
          value.then(callback);
        }
        return result.promise;
      }
    }
  };
};
原来callback(value)的形式，都修改为value.then(callback)。这个修改后效果其实和原来相同，只是因为value变成了promise包装的类型，会需要这样调用。
then方法有了较多变动，会先新生成一个defer，并在结尾处返回这个defer的promise。请注意，callback不再是直接取用传递给then的那个，而是在此基础之上增加一层，并把新生成的defer的resolve方法放置在此。此处可以理解为，then方法将返回一个新生成的promise，因此需要把promise的resolve也预留好，在旧的promise的resolve运行后，新的promise的resolve也会随之运行。这样才能像管道一样，让事件按照then连接的内容，一层一层传递下去。
加入错误处理
promise的then方法应该可以包含两个参数，分别是肯定和否定状态的处理函数（onFulfilled与onRejected）。前面我们实现的promise还只能转变为肯定状态，所以，接下来应该加入否定状态部分。
请注意，promise的then方法的两个参数，都是可选参数。design/q6.js（q5也跳过）加入了工具函数reject来帮助实现promise的否定状态：
7
var reject = function (reason) {
  return {
    then: function (callback, errback) {
      return ref(errback(reason));
    }
  };
};
它和ref的主要区别是，它返回的对象的then方法，只会取第二个参数的errback来运行。design/q6.js的其余部分是：
var defer = function () {
  var pending = [], value;
  return {
    resolve: function (_value) {
      if (pending) {
        value = ref(_value);
        for (var i = 0, ii = pending.length; i < ii; i++) {
          value.then.apply(value, pending[i]);
        }
        pending = undefined;
      }
    },
    promise: {
      then: function (_callback, _errback) {
        var result = defer();
        // provide default callbacks and errbacks
        _callback = _callback || function (value) {
          // by default, forward fulfillment
          return value;
        };
        _errback = _errback || function (reason) {
          // by default, forward rejection
          return reject(reason);
        };
        var callback = function (value) {
          result.resolve(_callback(value));
        };
        var errback = function (reason) {
          result.resolve(_errback(reason));
        };
        if (pending) {
          pending.push([callback, errback]);
        } else {
          value.then(callback, errback);
        }
        return result.promise;
      }
    }
  };
};
这里的主要改动是，将数组pending只保存单个回调的形式，改为同时保存肯定和否定的两种回调的形式。而且，在then中定义了默认的肯定和否定回调，使得then方法满足了promise的2个可选参数的要求。
你也许注意到defer中还是只有一个resolve方法，而没有类似jQuery的reject。那么，错误处理要如何触发呢？请看这个例子：
var defer1 = defer(),
promise1 = defer1.promise;
promise1.then(function(value){
  console.log("1: value = ", value);
  return reject("error happens"); 
}).then(function(value){
  console.log("2: value = ", value);
}).then(null, function(reason){
  console.log("3: reason = ", reason);
});
defer1.resolve(10);
 
// Result:
// 1: value = 10
// 3: reason = error happens
可以看出，每一个传递给then方法的返回值是很重要的，它将决定下一个then方法的调用结果。而如果像上面这样返回工具函数reject生成的对象，就会触发错误处理。
融入异步
终于到了最后的design/q7.js。直到前面的q6，还存在一个问题，就是then方法运行的时候，可能是同步的，也可能是异步的，这取决于传递给then的函数（例如直接返回一个值，就是同步，返回一个其他的promise，就可以是异步）。这种不确定性可能带来潜在的问题。因此，Q的后面这一步，是确保将所有then转变为异步。
design/q7.js定义了另一个工具函数enqueue：
var enqueue = function (callback) {
  //process.nextTick(callback); // NodeJS
  setTimeout(callback, 1); // Na?ve browser solution
};
显然，这个工具函数会将任意函数推迟到下一个事件队列运行。
design/q7.js其他的修改点是（只显示修改部分）：
?
var ref = function (value) {
  // ...
  return {
    then: function (callback) {
      var result = defer();
      // XXX
      enqueue(function () {
        result.resolve(callback(value));
      });
      return result.promise;
    }
  };
};
 
var reject = function (reason) {
  return {
    then: function (callback, errback) {
      var result = defer();
      // XXX
      enqueue(function () {
        result.resolve(errback(reason));
      });
      return result.promise;
    }
  };
};
 
var defer = function () {
  var pending = [], value;
  return {
    resolve: function (_value) {
      // ...
          enqueue(function () {
            value.then.apply(value, pending[i]);
          });
      // ...
    },
    promise: {
      then: function (_callback, _errback) {
          // ...
          enqueue(function () {
            value.then(callback, errback);
          });
          // ...
      }
    }
  };
};
即把原来的value.then的部分，都转变为异步。
到此，Q提供的Promise设计原理q0~q7，全部结束。
结语
即便本文已经是这么长的篇幅，但所讲述的也只到基础的Promise。大部分Promise库会有更多的API来应对更多和Promise有关的需求，例如all()、spread()，不过，读到这里，你已经了解了实现Promise的核心理念，这一定对你今后应用Promise有所帮助。
在我看来，Promise是精巧的设计，我花了相当一些时间才差不多理解它。Q作为一个典型Promise库，在思路上走得很明确。可以感受到，再复杂的库也是先从基本的要点开始的，如果我们自己要做类似的事，也应该保持这样的心态一点一点进步。



什么是 Promise
一个 Promise 对象代表一个目前还不可用，但是在未来的某个时间点可以被解析的值。它允许你以一种同步的方式编写异步代码。例如，如果你想要使用 Promise API 异步调用一个远程的服务器，你需要创建一个代表数据将会在未来由 Web 服务返回的 Promise 对象。唯一的问题是目前数据还不可用。当请求完成并从服务器返回时数据将变为可用数据。在此期间，Promise 对象将扮演一个真实数据的代理角色。接下来，你可以在 Promise 对象上绑定一个回调函数，一旦真实数据变得可用这个回调函数将会被调用。
Promise 对象曾经以多种形式存在于许多语言中。
去除厄运的回调金字塔(Pyramid of Doom)
Javascript 中最常见的反模式做法是回调内部再嵌套回调。
// 回调金字塔
asyncOperation(function(data){
 // 处理 `data`
 anotherAsync(function(data2){
   // 处理 `data2`
   yetAnotherAsync(function(){
     // 完成
   });
 });
});
引入 Promises 之后的代码
promiseSomething()
.then(function(data){
  // 处理 `data`
  return anotherAsync();
})
.then(function(data2){
  // 处理 `data2`
  return yetAnotherAsync();
})
.then(function(){
  // 完成
});
Promises 将嵌套的 callback，改造成一系列的.then的连缀调用，去除了层层缩进的糟糕代码风格。Promises 不是一种解决具体问题的算法，而已一种更好的代码组织模式。接受新的组织模式同时，也逐渐以全新的视角来理解异步调用。
各个语言平台都有相应的 Promise 实现
Java's java.util.concurrent.Future
Python's Twisted deferreds and PEP-3148 futures
F#'s Async
.Net's Task
C++ 11's std::future
Dart's Future
Javascript's Promises/A/B/D/A+
下面我来相信了解一下 javascript 语言环境下各个规范的一些细节。
Promises/A 规范
promise 表示一个最终值，该值由一个操作完成时返回。
promise 有三种状态：**未完成** (unfulfilled)，**完成** (fulfilled) 和**失败** (failed)。
promise 的状态只能由**未完成**转换成完成，或者**未完成**转换成**失败** 。
promise 的状态转换只发生一次。
promise 有一个 then 方法，then 方法可以接受 3 个函数作为参数。前两个函数对应 promise 的两种状态 fulfilled 和 rejected 的回调函数。第三个函数用于处理进度信息（对进度回调的支持是可选的）。
promiseSomething().then(function(fulfilled){
    //当promise状态变成fulfilled时，调用此函数
  },function(rejected){
    //当promise状态变成rejected时，调用此函数
  },function(progress){
    //当返回进度信息时，调用此函数
  });
如果 promise 支持如下连个附加方法，称之为可交互的 promise
get(propertyName)
获得当前 promise 最终值上的一个属性，返回值是一个新的 promise。
call(functionName, arg1, arg2, ...)
调用当然 promise 最终值上的一个方法，返回值也是一个新的promise。
Promises/B 规范
在 Promises/A 的基础上，Promises/B 定义了一组 promise 模块需要实现的 API
when(value, callback, errback_opt)
如果 value 不是一个 promise ，那么下一事件循环callback会被调用，value 作为 callback 的传入值。如果 value 是一个 promise，promise 的状态已经完成或者变成完成时，那么下一事件循环 callback 会被调用，resolve 的值会被传入 callback；promise 的状态已经失败或者变成失败时，那么下一事件循环 errback 会被调用，reason 会作为失败的理由传入 errback。
asap(value, callback, errback_opt)
与 when 最大的区别，如果 value 不是一个 promise，会被立即执行，不会等到下一事件循环。
enqueue(task Function)
尽可能快地在接下来的事件循环调用 task 方法。
get(object, name)
返回一个获得对象属性的 promise。
post(object, name, args)
返回一个调用对象方法的 promise。
put(object, name, value)
返回一个修改对象属性的 promise。
del(object, name)
返回一个删除对象属性的 promise。
makePromise(descriptor Object, fallback Function)
返回一个 promise 对象，该对象必须是一个可调用的函数，也可能是可被实例化的构造函数。
第一个参数接受一个描述对象，该对象结构如下，
?
1
{ "when": function(errback){...}, "get": function(name){...}, "put": function(name, value){...}, "post": function(name, args){...}, "del": function(name){...}, }
上面每一个注册的 handle 都返回一个 resolved value或者 promise。
第二个参数接受一个 fallback(message,...args) 函数，当没有 promise 对象没有找到对应的 handle 时该函数会被触发，返回一个 resolved value 或者 promise。
defer()
返回一个对象，该对象包含一个 resolve(value) 方法和一个 promise 属性。
当 resolve(value) 方法被第一次调用时，promise 属性的状态变成 完成，所有之前或之后观察该 promise 的 promise 的状态都被转变成 完成。value 参数如果不是一个 promise ，会被包装成一个 promise 的 ref。resolve 方法会忽略之后的所有调用。
reject(reason String)
返回一个被标记为 失败 的 promise。
一个失败的 promise 上被调用 when(message) 方法时，会采用如下两种方法之一
1. 如果存在 errback，errback 会以 reason 作为参数被调用。when方法会将 errback 的返回值返回。
2. 如果不存在 errback，when 方法返回一个新的 reject 状态的promise 对象，以同一 reason 作为参数。
ref(value)
如果 value 是 promise 对象，返回 value 本身。否则，返回一个resolved 的 promise，携带如下 handle。
1. when(errback),忽略 errback，返回 resolved 值
2. get(name)，返回 resolved 值的对应属性。
3. put(name, value) ，设置 resolved 值的对应属性。
4. del(name)，删除 resolved 值的对应属性。
5. post(name, args), 调用 resolved 值的对应方法。
6. 其他所有的调用都返回一个 reject，并携带 "Promise does not handle NAME" 的理由。
isPromise(value) Boolean
判断一个对象是否是 promise
method(name String)
获得一个返回 name 对应方法的 promise。返回值是 "get", "put", "del" 和 "post" 对应的方法，但是会在下一事件循环返回。
Promises/D 规范
为了增加不同 promise 实现之间的可互操作性，Promises/D 规范对promise 对象和 Promises/B 规范做了进一步的约定。以达到鸭子类型的效果（Duck-type Promise）。
简单来说Promises/D 规范，做了两件事情，
1、如何判断一个对象是 Promise 类型。
2、对 Promises/B 规范进行细节补充。
甄别一个 Promise 对象
Promise 对象必须是实现 promiseSend 方法。
1. 在 promise 库上下文中，如果对象包含 promiseSend 方法就可以甄别为promise 对象
2. promiseSend 方法必须接受一个操作名称，作为第一个参数
3. 操作名称是一个可扩展的集合，下面是一些保留名称
1. when，此时第三个参数必须是 rejection 回调。
1. rejection回调必须接受一个 rejection 原因(可以是任何值)作为第一个参数
2. get，此时第三个参数为属性名（字符串类型）
3. put，此时第三个参数为属性名（字符串类型）,第四个参数为新属性值。
4. del，此时第三个参数为属性名
5. post，此时第三个参数为方法的属性名，接下来的变参为方法的调用参数
6. isDef
4. promiseSend方法的第二个参数为 resolver 方法
5. promiseSend方法可能接受变参
6. promiseSend方法必须返回undefined
对 Promises/B 规范的补充
Promises/D 规范中对 Promises/B 规范中定义的ref、reject、def、defer方法做了进一步细致的约束，此处略去这些细节。
Promises/A+ 规范
前面提到的 Promises/A/B/D 规范都是有CommonJS组织提出的，Promises/A+是有一个自称为Promises/A+ 组织发布的，该规范是以Promises/A作为基础进行补充和修订，旨在提高promise实现之间的可互操作性。
Promises/A+ 对.then方法进行细致的补充，定义了细致的Promise Resolution Procedure流程，并且将.then方法作为promise的对象甄别方法。
此外，Promises/A+ 还提供了兼容性测试工具，以确定各个实现的兼容性。
实现一个迷你版本的Promise
上面扯了这么多规范，现在我们看看如何实现一个简单而短小的Promise。
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
 
function Promise() {
 // store state which can be PENDING, FULFILLED or REJECTED
 var state = PENDING;
 
 // store value or error once FULFILLED or REJECTED
 var value = null;
 
 // store sucess & failure handlers attached by calling .then or .done
 var handlers = [];
}
2、状态变迁
仅支持两种状态变迁，fulfill和reject
// ...
 
function Promise() {
  // ...
 
 function fulfill(result) {
  state = FULFILLED;
  value = result;
 }
 
 function reject(error) {
  state = REJECTED;
  value = error;
 }
 
}
fulfill和reject方法较为底层，通常更高级的resolve方法开放给外部。
// ...
 
function Promise() {
 
 // ...
 
 function resolve(result) {
  try {
   var then = getThen(result);
   if (then) {
    doResolve(then.bind(result), resolve, reject)
    return
   }
   fulfill(result);
  } catch (e) {
   reject(e);
  }
 }
}
resolve方法可以接受一个普通值或者另一个promise作为参数，如果接受一个promise作为参数，等待其完成。promise不允许被另一个promise fulfill，所以需要开放resolve方法。resolve方法依赖一些帮助方法定义如下:
/**
 * Check if a value is a Promise and, if it is,
 * return the `then` method of that promise.
 *
 * @param {Promise|Any} value
 * @return {Function|Null}
 */
function getThen(value) {
 var t = typeof value;
 if (value && (t === 'object' || t === 'function')) {
  var then = value.then;
  if (typeof then === 'function') {
   return then;
  }
 }
 return null;
}
 
/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 *
 * @param {Function} fn A resolver function that may not be trusted
 * @param {Function} onFulfilled
 * @param {Function} onRejected
 */
function doResolve(fn, onFulfilled, onRejected) {
 var done = false;
 try {
  fn(function (value) {
   if (done) return
   done = true
   onFulfilled(value)
  }, function (reason) {
   if (done) return
   done = true
   onRejected(reason)
  })
 } catch (ex) {
  if (done) return
  done = true
  onRejected(ex)
 }
}
这里resolve和doResolve之间的递归很巧妙，用来处理promise的层层嵌套（promise的value是一个promise）。
构造器
// ...
 
function Promise(fn) {
  // ...
  doResolve(fn, resolve, reject);
}
.done方法
// ...
function Promise(fn) {
 // ...
 
 function handle(handler) {
  if (state === PENDING) {
   handlers.push(handler);
  } else {
   if (state === FULFILLED &&
    typeof handler.onFulfilled === 'function') {
    handler.onFulfilled(value);
   }
   if (state === REJECTED &&
    typeof handler.onRejected === 'function') {
    handler.onRejected(value);
   }
  }
 }
 
 this.done = function (onFulfilled, onRejected) {
  // ensure we are always asynchronous
  setTimeout(function () {
   handle({
    onFulfilled: onFulfilled,
    onRejected: onRejected
   });
  }, 0);
 }
 // ...
}
.then方法
// ...
function Promise(fn) {
  // ...
  this.then = function (onFulfilled, onRejected) {
   var self = this;
   return new Promise(function (resolve, reject) {
    return self.done(function (result) {
     if (typeof onFulfilled === 'function') {
      try {
       return resolve(onFulfilled(result));
      } catch (ex) {
       return reject(ex);
      }
     } else {
      return resolve(result);
     }
    }, function (error) {
     if (typeof onRejected === 'function') {
      try {
       return resolve(onRejected(error));
      } catch (ex) {
       return reject(ex);
      }
     } else {
      return reject(error);
     }
    });
   });
  }
  // ...
}
$.promise
jQuery 1.8 之前的版本，jQuery的 then 方法只是一种可以同时调用 done 、fail 和 progress 这三种回调的速写方法，而 Promises/A 规范的 then 在行为上更像是 jQuery 的 pipe。 jQuery 1.8 修正了这个问题，使 then 成为 pipe 的同义词。不过，由于向后兼容的问题，jQuery 的 Promise 再如何对 Promises/A 示好也不太会招人待见。
此外，在 Promises/A 规范中，由 then 方法生成的 Promise 对象是已执行还是已拒绝，取决于由 then 方法调用的那个回调是返回值还是抛出错误。在 JQuery 的 Promise 对象的回调中抛出错误是个糟糕的主意，因为错误不会被捕获。
小结
最后一个例子揭示了，实现 Promise 的关键是实现好 doResolve 方法，在完事以后触发回调。而为了保证异步 setTimeout(fun, 0); 是关键一步。
Promise 一直用得蛮顺手的，其很好的优化了 NodeJS 异步处理时的代码结构。但是对于其工作原理却有些懵懂和好奇，于是花了些精力查阅并翻译了Promise 的规范，以充分的理解 Promise 的细节。





Promise的用例:
    执行规则
    多个远程验证
    超时处理
    远程数据请求
    动画
    将事件逻辑从应用逻辑中解耦
    消除回调函数的恐怖三角
    控制并行的异步操作
JavaScript promise是一个承诺将在未来返回值的对象。是具有良好定义的行为的数据对象。promise有三种可能的状态：
    Pending（待定）
    Rejected（拒绝）
    Resolved（已完成）
一个已经拒绝或者完成的承诺属于已经解决的。一个承诺只能从待定状态变成已经解决的状态。之后，承诺的状态就不变了。承诺可以在它对应的处理完成之后很久还存在。也就是说，我们可以多次取得处理结果。我们通过调用promise.then()来取得结果，这个函数一直到承诺对应的处理结束才会返回。我们可以灵活的串联起一堆承诺。这些串联起来的“then”函数应该返回一个新的承诺或者最早的那个承诺。
通过这个样式，我们可以像写同步代码一样来写非同步代码。主要是通过组合承诺来实现：
    堆栈式任务：多处散落在代码中的，对应同一个承诺。
    并行任务：多个承诺返回同一个承诺。
    串行任务：一个承诺，然后接着执行另一个承诺。
    上面几种的组合。
为什么要这么麻烦？只用基本的回调函数不行吗？
回调函数的问题
回调函数适合简单的重复性事件，例如根据点击来让一个表单有效，或者保存一个REST调用的结果。回调函数还会使代码形成一个链，一个回调函数调用一个REST函数，并为REST函数设置一个新的回调函数，这个新的回调函数再调用另一个REST函数，依此类推。代码的横向增长大于纵向的增长。回调函数看起来很简单，直到我们需要一个结果，而且是立刻就要，马上就用在下一行的计算中。 
'use strict';
var i = 0;
function log(data) {console.log('%d %s', ++i, data); };
  
function validate() {
  log("Wait for it ...");
  // Sequence of four Long-running async activities
  setTimeout(function () {
   log('result first');
   setTimeout(function () {
     log('result second');
     setTimeout(function () {
      log('result third');
      setTimeout(function () {
        log('result fourth')
      }, 1000);
     }, 1000);
   }, 1000);
  }, 1000);
  
};
validate();
我使用timeout来模拟异步操作。管理异常的方法是痛苦的，很容易玩漏下游行为。当我们编写回调,那么代码组织变得混乱。图2显示了一个模拟验证流可以运行在NodeJS REPL。在下一节，我们将从pyramid-of-doom模式迁移到一个连续的promise。
Figure
 
'use strict';
var i = 0;
function log(data) {console.log('%d %s', ++i, data); };
  
// Asynchronous fn executes a callback result fn
function async(arg, callBack) {
  setTimeout(function(){
   log('result ' + arg);
   callBack();
  }, 1000);
};
  
function validate() {
  log("Wait for it ...");
  // Sequence of four Long-running async activities
  async('first', function () {
   async('second',function () {
     async('third', function () {
      async('fourth', function () {});
     });
   });
  });
};
validate();
在NodeJS REPL执行的结果
 
$ node scripts/examp2b.js
1 Wait for it ...
2 result first
3 result second
4 result third
5 result fourth
$
 
我曾经遇到一个AngularJS动态验证的情况，根据对应表的值，动态的限制表单项的值。限制项的有效值范围被定义在REST服务上。
我写了一个调度器，根据请求的值，去操作函数栈，以避免回调嵌套。调度器从栈中弹出函数并执行。函数的回调会在结束时重新调用调度器，直到栈被清空。每次回调都记录所有从远程验证调用返回的验证错误。
我认为我写的玩意儿是一种反模式。如果我用Angular的$http调用提供的promise，在整个验证过程中我的思维会更近似线性形式，就像同步编程。平展的promise链是可读的。继续...
 
使用Promises
其中采用了kew promise库。Q库同样适用。要使用该库，首先使用npm将kew库导入到NodeJS，然后加载代码到NodeJS REPL。
Figure
 
'use strict';
var Q = require('kew');
var i = 0;
  
function log(data) {console.log('%d %s', ++i, data); };
  
// Asynchronous fn returns a promise
function async(arg) {
  var deferred = Q.defer();
  setTimeout(function () {
    deferred.resolve('result ' + arg);\
  }, 1000);
  return deferred.promise;
};
  
// Flattened promise chain
function validate() {
  log("Wait for it ...");
  async('first').then(function(resp){
    log(resp);
    return async('second');
  })
  .then(function(resp){
    log(resp);
    return async('third')
  })
  .then(function(resp){
    log(resp);
    return async('fourth');
  })
  .then(function(resp){
    log(resp);
  }).fail(log);
};
validate();
输出和使用嵌套回调时相同：
 
$ node scripts/examp2-pflat.js
1 Wait for it ...
2 result first
3 result second
4 result third
5 result fourth
$
该代码稍微“长高”了，但我认为更易于理解和修改。更易于加上适当的错误处理。在链的末尾调用fail用于捕获链中错误，但我也可以在任何一个then里面提供一个reject的处理函数做相应的处理。
服务器 或 浏览器
Promises在浏览器中就像在NodeJS服务器中一样有效。下面的地址， http://jsfiddle.net/mauget/DnQDx/，指向JSFiddle的一个展示如何使用一个promise的web页面。 JSFiddle所有的代码是可修改的。我故意操作随意动作。你可以试几次得到相反的结果。它是可以直接扩展到多个promise链, 就像前面NodeJS例子。
2015624113608681.jpg (572×265)
并行 Promises
考虑一个异步操作喂养另一个异步操作。让后者包括三个并行异步行为,反过来,喂最后一个行动。只有当所有平行的子请求通过才能通过。这是灵感来自偶遇一打MongoDB操作。有些是合格的并行操作。我实现了promises的流流程图。
2015624113731418.jpg (454×366)
我们怎么会模拟那些在该图中心行的并行promises？关键是，最大的promise库有一个全功能，它产生一个包含一组子promises的父promie。当所有的子promises通过，父promise通过。如果有一个子promise拒绝，父promise拒绝。
 
让十个并行的promises每个都包含一个文字promise。只有当十个子类通过或如果任何子类拒绝，最后的then方法才能完成。
Figure
var promiseVals = ['To ', 'be, ', 'or ',
  'not ', 'to ', 'be, ', 'that ',
  'is ', 'the ', 'question.'];
  
var startParallelActions = function (){
  var promises = [];
  
  // Make an asynchronous action from each literal
  promiseVals.forEach(function(value){
    promises.push(makeAPromise(value));
  });
  
  // Consolidate all promises into a promise of promises
  return Q.all(promises);
};
  
startParallelActions ().then( . . .
下面的地址， http://jsfiddle.net/mauget/XKCy2/，针对JSFiddle在浏览器中运行十个并行promises,随机的拒绝或通过。这里有完整的代码用于检查和变化if条件。重新运行,直到你得到一个相反的完成。2015624114246516.png (554×370)
孕育 Promise
许多api返回的promise都有一个then函数——他们是thenable。通常我只是通过then处理thenable函数的结果。然而，$q，mpromise，和kew库拥有同样的API用于创建，拒绝，或者通过promise。这里有API文档链接到每个库的引用部分。我通常不需要构造一个promise,除了本文中的包装promise的未知描述和timeout函数。请参考哪些我创建的promises。
Promise库互操作
大多数JavaScript promise库在then级别进行互操作。你可以从一个外部的promise创建一个promise，因为promise可以包装任何类型的值。then可以支持跨库工作。除了then，其他的promise函数则可能不同。如果你需要一个你的库不包含的函数，你可以将一个基于你的库的promise包装到一个新的，基于含有你所需函数的库创建的promise里面。例如，JQuery的promise有时为人所诟病。那么你可以将其包装到Q，$q，mpromise，或者kew库的promise中进行操作。
 
结语
现在我写了这篇文章，而一年前我却是犹豫要不要拥抱promise的那个。我只是单纯地想完成一项工作。 我不想学习新的API，或是打破我原来的代码（因为误解了promise）。我曾经如此错误地认为！当我下了一点注时，就轻易就赢得了可喜的成果





Javascript中的异步编程规范Promises/A详细介绍
作者： 字体：[增加 减小] 类型：转载 时间：2014-06-06 我要评论
这篇文章主要介绍了Javascript中的异步编程规范Promises/A详细介绍,同时介绍了jQuery 中的 Deferred 和 Promises,需要的朋友可以参考下
Javascript里异步编程逐渐被大家接受，先前大家一般通过回调嵌套，setTimeout、setInterval等方式实现，代码看起来非常不直观，不看整个代码逻辑很难快速理解。Javascript里异步函数大概有I/O函数（Ajax、postMessage、img load、script load等）、计时函数（setTimeout、setInterval）等。
这些我们都很熟悉，在复杂的应用中往往会嵌套多层，甚至以为某些步骤未完成而导致程序异常，最简单的例子：比如你往DOM中注入节点，你必须等待节点注入后在操作这个节点，当大量节点注入的时候，时间往往很难把握。如果我们得代码依赖第三方api的数据。我们无法获悉一个API响应的延迟时间，应用程序的其他部分可能会被阻塞，直到它返回结果。Promises对这个问题提供了一个更好的解决方案，它是非阻塞的，并且与代码完全解耦 。
那么，我看看Javascript里异步编程，首先推荐大家看看相对来说比较流行的Promises/A规范。
Promises/A规范
注：为了便于理解，描述可能和Promises/A规范有所出入；
CommonJS之Promises/A规范，通过规范API接口来简化异步编程，使我们的异步逻辑代码更易理解。
遵循Promises/A规范的实现我们称之为Promise对象，Promise对象有且仅有三种状态：unfulfilled（未完成）、fulfilled（已完成）、failed（失败/拒绝）；初始创建的时候是unfulfilled（未完成）状态，状态只可以从unfulfilled（未完成）变成fulfilled（已完成），或者unfulfilled（未完成）变成failed（失败/拒绝）。状态一旦变成fulfilled（已完成）或者failed（失败/拒绝），状态就不能再变了。
Promises/A规范提供了一个在程序中描述延时（或将来）概念的解决方案。主要的思想不是执行一个方法然后阻塞应用程序等待结果返回后再回调其他方法，而是返回一个Promise对象来满足未来监听。fulfilled状态和failed状态都可以被监听。Promise通过实现一个then接口来返回Promise对象来注册回调：
复制代码代码如下:
then(fulfilledHandler, errorHandler, progressHandler)；
then接口用于监听一个Promise的不同状态。fulfilledHandler用于监听fulfilled（已完成）状态，errorHandler用于监听failed（失败/拒绝）状态，progressHandler用于监听unfulfilled（未完成）状态。Promise不强制实现unfulfilled（未完成）的事件监听（例如我们知道旧版本的jQuery（1.5，1.6）的Deferred就是一个Promise的实现，但没有实现对unfulfilled（未完成）状态的监听来回调progressHandler）。
一般认为，then接口返回的是一个新的Promise对象，而不是原来的Promise对象，这个新的新的Promise对象可以理解为是原来Promise对象的一个视图，它只包含原有Promise对象的一组方法，这些方法只能观察原有Promise对象的状态，而无法更改deferred对象的内在状态。这样可以避免多个调用者之间的冲突，多个调用者可以通过改变新的Promise对象状态而不影响别的调用者。
另外，Promise提供了resolve（实现状态由未完成到已完成）和reject（实现状态由未完成到拒绝或失败）两个接口实现状态的转变。
发一张图片帮助理解一下：

有了Promise，就可以以同步的思维去编写异步的逻辑了。在异步函数里，不能使用try/catch捕获异常，也不能抛出异常。有了Promise，我们可以直接显式定义errorHandler，相当于捕获异常。
以下是几个遵循Promises/A规范的类库，when，q，rsvp.js，jQuery.Deferred等等。


$.ajax()操作完成后，如果使用的是低于1.5.0版本的jQuery，返回的是XHR对象，你没法进行链式操作；如果高于1.5版，返回的是deferred对象，可以进行链式操作。
当延迟成功时调用一个函数或者数组函数，功能与原success类似。
语法：deferred.done/fail/always(doneCallbacks[,doneCallbacks])
返回值:Deferred Object
Then?
promise()在原来的deferred对象上返回另一个deferred对象，后者只开放与改变执行状态无关的方法（比如done()方法和fail()方法），屏蔽与改变执行状态有关的方法（比如resolve()方法和reject()方法），从而使得执行状态不能被改变。(难道执行状态要手动添加？？)

2.7、总结
（1） 生成一个对象。　　
指定操作成功时的回调函数　　
指定操作失败时的回调函数　　
没有参数时，返回一个新的对象，该对象的运行状态无法被改变；接受参数时，作用为在参数对象上部署接口。　　
手动改变对象的运行状态为已完成，从而立即触发方法。　　
这个方法与正好相反，调用后将对象的运行状态变为已失败，从而立即触发方法。　　
.Deferred()生成一个deferred对象。　　
（2）deferred.done()指定操作成功时的回调函数　　
（3）deferred.fail()指定操作失败时的回调函数　　
（4）deferred.promise()没有参数时，返回一个新的deferred对象，该对象的运行状态无法被改变；接受参数时，作用为在参数对象上部署deferred接口。　　
（5）deferred.resolve()手动改变deferred对象的运行状态为"已完成"，从而立即触发done()方法。　　
（6）deferred.reject()这个方法与deferred.resolve()正好相反，调用后将deferred对象的运行状态变为"已失败"，从而立即触发fail()方法。　　
（7）.when() 为多个操作指定回调函数。
除了这些方法以外，deferred对象还有二个重要方法，上面的教程中没有涉及到。
（8）deferred.then()
有时为了省事，可以把done()和fail()合在一起写，这就是then()方法。
如果then()有两个参数，那么第一个参数是done()方法的回调函数，第二个参数是fail()方法的回调方法。如果then()只有一个参数，那么等同于done()。
（9）deferred.always()
这个方法也是用来指定回调函数的，它的作用是，不管调用的是deferred.resolve()还是deferred.reject()，最后总是执行。

Promise的函数参数会立即执行（调用resolve函数，改变状态触发then内相应函数，但不会立即执行（何时，顺序？））
状态机？？？   Promise接收的函数参数是同步执行的，但then方法中的回调函数执行则是异步的（会表现出两个promise一级一级交替执行）

then 回调动作的触发时机是 promise 被执行完。
Then的函数参数的返回值：
return 一个同步的值 ，或者 undefined（当没有返回一个有效值时，默认返回undefined），then方法将返回一个resolved状态的Promise对象，Promise对象的值就是这个返回值。
return 另一个 Promise，then方法将根据这个Promise的状态和值创建一个新的Promise对象返回。
throw 一个同步异常，then方法将返回一个rejected状态的Promise, 值是该异常。

用例：
var p = new Promise(function(resolve, reject){
 resolve("success");
});
p.then(function(value){
 console.log(value);
});
Promise.resolve(...)可以接收一个值或者是一个Promise对象作为参数。当参数是普通值时，它返回一个resolved状态的Promise对象，对象的值就是这个参数；当参数是一个Promise对象时，它直接返回这个Promise参数。
Promise回调函数中的第一个参数resolve，会对Promise执行"拆箱"动作。即当resolve的参数是一个Promise对象时，resolve会"拆箱"获取这个Promise对象的状态和值，但这个过程是异步的。（花时间，reject不行）

将一个普通的函数封装成一个 promise 实例，有3个关键步骤，第一步是在函数内部构造一个 promise 实例，第二步是部署函数执行完去改变 promise 的状态为已完成，第三步就是返回这个 promise 实例。
var showMsg = function(){
    // 构造promise实例
    var promise = new E.Promise();
    setTimeout(function(){
        alert( 'hello' );
        // 改变promise的状态
        promise.resolve( 'done' );
    }, 5000 );
    // 返回promise实例
    return promise;
};
when 方法是将多个 promise 实例存到一个数组中，等到该数组的所有 promise 实例都是已完成状态才去执行已完成的回调，一旦有一个实例是已拒绝的状态，则立即执行已拒绝的回调。
*Battery API    *fetch API (XHR的替代品)？？？？         *ServiceWorker API
当判断出 promise 并不需要真正执行时，我们并不需要 使用 new 创建 Promise 对象，而是可以直接调用 Promise.resolve() 和 Promise.reject()
catch 当一个 promise 被拒绝(reject)时,catch 方法会被执行
通常我们在 reject 方法里处理执行失败的结果，而在catch 里执行异常结果：
 Promise.all 方法可以接收多个 promise 作为参数，以数组的形式，当这些 promise 都成功执行完成后才调用回调函数。一旦 promise 被拒绝，catch 方法会捕捉到首个被执行的reject函数：
Promise.race：Promise.race([req1, req2]).then(function(one) {}   在所有的 promise 中只要有一个执行结束，它就会触发

异步依赖异步回调
回调函数的优点是简单，轻量级（不需要额外的库）。缺点是各个部分之间高度耦合（Coupling），流程会很混乱，而且每个任务只能指定一个回调函数。某个操作需要经过多个非阻塞的IO操作，每一个结果都是通过回调，产生意大利面条式（spaghetti）的代码

观察者模式
我们假定，存在一个"信号中心"，某个任务执行完成，就向信号中心"发布"（publish）一个信号，其他任务可以向信号中心"订阅"（subscribe）这个信号，从而知道什么时候自己可以开始执行。这就叫做"发布/订阅模式"（publish-subscribe pattern），又称"观察者模式"（observer pattern）。
var pubsub = (function(){
  var q = {}
    topics = {},
    subUid = -1;
  //发布消息
  q.publish = function(topic, args) {
    if(!topics[topic]) {return;}
    var subs = topics[topic],
      len = subs.length;
    while(len--) {
      subs[len].func(topic, args);
    }
    return this;
  };
  //订阅事件
  q.subscribe = function(topic, func) {
    topics[topic] = topics[topic] ? topics[topic] : [];
    var token = (++subUid).toString();
    topics[topic].push({
      token : token,
      func : func
    });
    return token;
  };
  return q;
  //取消订阅就不写了，遍历topics，然后通过保存前面返回token，删除指定元素
})();
//触发的事件
var f2 = function(topics, data) {
  console.log("logging:" + topics + ":" + data);
  console.log("this is function2");
}
 
function f1(){
  　setTimeout(function () {
　　　　　　// f1的任务代码
　　　　　　console.log("this is function1");
    //发布消息'done'
    pubsub .publish('done', 'hello world');
　　　　}, 1000);
}
pubsub.subscribe('done', f2);
f1();
上面代码的运行结果为：
this is function1
logging:done:hello world
this is function2
观察者模式的实现方法有很多种，也可以直接借用第三方库。这种方法的性质与"事件监听"类似（观察者模式和自定义事件非常相似），但是明显优于后者。观察者模式和事件监听一样具有良好的去耦性，并且有一个消息中心，通过对消息中心的处理，可以良好地监控程序运行。

JQ？？？
function f1(){
  var def = $.Deferred();
  setTimeout(function () {
    // f1的任务代码
    console.log("this is f1");
    def.resolve(); 
  }, 500);
  return def.promise();
}
 
function f2(){
  console.log("this is f2");
}
 
f1().then(f2);




Deferred()生成一个deferred对象。　　
（2）deferred.done()指定操作成功时的回调函数　　
（3）deferred.fail()指定操作失败时的回调函数　　
（4）deferred.promise()没有参数时，返回一个新的deferred对象，该对象的运行状态无法被改变；接受参数时，作用为在参数对象上部署deferred接口。　　
（5）deferred.resolve()手动改变deferred对象的运行状态为"已完成"，从而立即触发done()方法。　　
（6）deferred.reject()这个方法与deferred.resolve()正好相反，调用后将deferred对象的运行状态变为"已失败"，从而立即触发fail()方法。　　
（7）.when() 为多个操作指定回调函数。
除了这些方法以外，deferred对象还有二个重要方法，上面的教程中没有涉及到。
（8）deferred.then()
有时为了省事，可以把done()和fail()合在一起写，这就是then()方法。
如果then()有两个参数，那么第一个参数是done()方法的回调函数，第二个参数是fail()方法的回调方法。如果then()只有一个参数，那么等同于done()。
（9）deferred.always()
这个方法也是用来指定回调函数的，它的作用是，不管调用的是deferred.resolve()还是deferred.reject()，最后总是执行。

Then的链式用法与非链式：链式时，若报错则断链；有需要，需传参数（返回值）；报错一旦被处理（包括不含reject参数的then），状态会变更为已处理；可暂停（then返回新promise）（这里暂停意味着让当前的promise稍后处理）；异步处理（导致“慢半拍”，比timeout快）



// Exhibit A
var p = new Promise(/*...*/);
p.then(func1);
p.then(func2);

// Exhibit B
var p = new Promise(/*...*/);
p.then(func1)
.then(func2);

如果你认真以上两段代码等同的话，那么Promises只不过是一个一维的回调函数数组。然而，其实不是这样的。每一个then()调用都返回一个forked promise。因此，ExhibitA中，如果func1()抛出一个异常，func2()仍旧正常调用。
在ExhibitB中，如果func1()抛出一个错误，fun2()将不会被调用，因为第一个调用返回了一个新的promise，这个在func1()中会被拒绝。结果是func2()被跳过。
总结：promises可以被fork成多个路径，类似复杂的流程图。