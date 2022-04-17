# javascript 测试框架
运行环境: node.js,浏览器
特点: 测试持续运行

## 加载断言模块
chai,expect.js,should.js

## 语法

套件: descript(str,func) : 一组相关测试
用例: it(str,func) 测试单元


## 规约
测试文件应与测试源码脚本同名,后缀为.test.js, .spec.js

## 运行
mocha file/folder --recursive 递归执行
--reporter -spec 指定报告生成格式
--growl 桌面显示测试结果
--watch 监视指定的测试脚本自动运行mocha

## 配置
文件: mocha.opts

运行es6测试文件:
配置: --compiler js;babrl-core/register


异步测试:
1. 单例调用done(),如: it(str,func(done){}). 当注入done后,测试会等待done的结果
2. 异步放回promise
**ps**:不可两个都有

钩子:
1. before,after: 测试期间只运行一次
2. beforeEach,afterEach: 每个单例前,后调用

当it无二参,测试结果标记为待测试
only(): 仅运行指定套件/用例
skip(): 忽略指定套件/用例

this.skip()能在运行中途终止测试套件/用例
this.retries(n): 指定重新运行用例/套件失败次数
this.timeout()  this.slow()
