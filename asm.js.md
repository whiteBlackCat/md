与JS两点差异:
	1. 变量为静态
	2. 取消垃圾回收机制
JS引擎识别asm后跳过语法分析,直接转成汇编.浏览器调用WebGL通过GPU执行asm

数据类型: 32位带符号整数; 64位带符号浮点数     其他类型通过 TypedArray  调用
声明数据类型: 变量 | 0表示整数，+变量表示浮点数   例: var x = a | 0;   函数参数及返回值同理

垃圾回收: 手动控制
读写内存:
var buffer = new ArrayBuffer(32768);
var HEAP8 = new Int8Array(buffer);
function compiledCode(ptr) {
  HEAP[ptr] = 12;
  return HEAP[ptr + 4];
}  
指针:
size_t strlen(char *ptr) {
  char *curr = ptr;
  while (*curr != 0) {
    curr++;
  }
  return (curr - ptr);
}
编译成:
function strlen(ptr) {
  ptr = ptr|0;
  var curr = 0;
  curr = ptr;
  while (MEM8[curr]|0 != 0) {
    curr = (curr + 1)|0;
  }
  return (curr - ptr)|0;
}

与WebAssembly比较:  asm.js 是文本，WebAssembly 是二进制字节码

Emscripten: 生成 asm.js 的主要工具
C/C++ ⇒ LLVM ==> LLVM IR ⇒ Emscripten ⇒ asm.js
安装: 官方文档或者
$ git clone https://github.com/juj/emsdk.git
$ cd emsdk
$ ./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
$ ./emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit
$ source ./emsdk_env.sh
最后一行非常重要。每次重新登陆或者新建 Shell 窗口，都要执行一次这行命令source ./emsdk_env.sh。
实例:
hello.cc:
#include <iostream>

int main() {
  std::cout << "Hello World!" << std::endl;
}

转成 asm.js:
$ emcc hello.cc
$ node a.out.js
Hello World!
emcc命令用于编译源码，默认生成a.out.js。使用 Node 执行a.out.js，就会在命令行输出 Hello World。注意，asm.js 默认自动执行main函数。

emcc语法:
# 生成 a.out.js
$ emcc hello.c

# 生成 hello.js
$ emcc hello.c -o hello.js

# 生成 hello.html 和 hello.js
$ emcc hello.c -o hello.html

 C/C++ 调用 JavaScript:
 example1.cc:
 
#include <emscripten.h>

int main() {
  EM_ASM({ alert('Hello World!'); });
}
EM_ASM是一个宏，会调用嵌入的 JavaScript 代码。注意，JavaScript 代码要写在大括号里面。将这个程序编译成 asm.js:  $ emcc example1.cc -o example1.html

C/C++ 与 JavaScript 的通信:
example2.cc:
#include <emscripten.h>
#include <iostream>

int main() {
  int val1 = 21;
  int val2 = EM_ASM_INT({ return $0 * 2; }, val1);

  std::cout << "val2 == " << val2 << std::endl;
}
EM_ASM_INT表示 JavaScript 代码返回的是一个整数，它的参数里面的$0表示第一个参数，$1表示第二个参数，以此类推。EM_ASM_INT的其他参数会按照顺序，传入 JavaScript 表达式
然后，将这个程序编译成 asm.js。$ emcc example2.cc -o example2.html

宏列表:
EM_ASM：调用 JS 代码，没有参数，也没有返回值。
EMASMARGS：调用 JS 代码，可以有任意个参数，但是没有返回值。
EMASMINT：调用 JS 代码，可以有任意个参数，返回一个整数。
EMASMDOUBLE：调用 JS 代码，可以有任意个参数，返回一个双精度浮点数。
EMASMINT_V：调用 JS 代码，没有参数，返回一个整数。
EMASMDOUBLE_V：调用 JS 代码，没有参数，返回一个双精度浮点数。

JavaScript 调用 C / C++ 代码:
example4.cc:
#include <emscripten.h>

extern "C" {
  double SquareVal(double val) {
    return val * val;
  }
}

int main() {
  EM_ASM({
    SquareVal = Module.cwrap('SquareVal', 'number', ['number']);
    var x = 12.5;
    alert('Computing: ' + x + ' * ' + x + ' = ' + SquareVal(x));
  });
}
EM_ASM执行 JS 代码，里面有一个 C 语言函数SquareVal。这个函数必须放在extern "C"代码块之中定义，而且 JS 代码还要用Module.cwrap()方法引入这个函数。
Module.cwrap()接受三个参数，含义如下。
C 函数的名称，放在引号之中。
C 函数返回值的类型。如果没有返回值，可以把类型写成null。
函数参数类型的数组。

Module.ccall()方法，可以在 JS 代码之中调用 C 函数。
var result = Module.ccall('int_sqrt', // C 函数的名称
  'number', // 返回值的类型
  ['number'], // 参数类型的数组
  [28] // 参数数组
); 

将example4.cc编译成 asm.js。
$  emcc -s EXPORTED_FUNCTIONS="['_SquareVal', '_main']" example4.cc -o example4.html
注意，编译命令里面要用-s EXPORTED_FUNCTIONS参数给出输出的函数名数组，而且函数名前面加下划线。本例只输出两个 C 函数，所以要写成['_SquareVal', '_main']。

C 函数输出为 JavaScript 模块:
example5.cc:
extern "C" {
  double SquareVal(double val) {
    return val * val;
  }
}
编译这个函数  $ emcc -s EXPORTED_FUNCTIONS="['_SquareVal']" example5.cc -o example5.js
-s EXPORTED_FUNCTIONS参数告诉编译器，代码里面需要输出的函数名。函数名前面要加下划线。

Node 调用 C 函数:
example6.c:
#include <stdio.h>
#include <emscripten.h>

void sayHi() {
  printf("Hi!\n");
}

int daysInWeek() {
  return 7;
}
编译:$ emcc -s EXPORTED_FUNCTIONS="['_sayHi', '_daysInWeek']" example6.c -o example6.js

node脚本test.js
var em_module = require('./api_example.js');

em_module._sayHi();
em_module.ccall("sayHi");
console.log(em_module._daysInWeek());
Node 脚本调用 C 函数有两种方法，一种是使用下划线函数名调用em_module._sayHi()，另一种使用ccall方法调用em_module.ccall("sayHi")。
Node 脚本调用 C 函数有两种方法，一种是使用下划线函数名调用em_module._sayHi()，另一种使用ccall方法调用em_module.ccall("sayHi")。