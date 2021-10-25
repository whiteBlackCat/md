The Single Responsibility Principle（单一职责SRP） 
The Open/Closed Principle（开闭原则OCP） 
The Liskov Substitution Principle（里氏替换原则LSP） 
The Interface Segregation Principle（接口分离原则ISP） 
The Dependency Inversion Principle（依赖反转原则DIP）

open for extension（对扩展开放）：当新需求出现的时候，可以通过扩展现有模型达到目的。Close for modification（对修改关闭）：不允许对该实体做任何修改。
目标：这些需要执行多样行为的实体应该设计成不需要修改就可以实现各种的变化
意义：用最少的代码进行项目维护。 




SRP：A class should have only one reason to change 
类发生更改的原因应该只有一个 
目的：通过解耦和使得每个类职责单一，易于维护。

根据Role Stereotypes来区分职责： 
Information holder – 该对象设计为存储对象并提供对象信息给其它对象。 
Structurer – 该对象设计为维护对象和信息之间的关系 
Service provider – 该对象设计为处理工作并提供服务给其它对象 
Controller – 该对象设计为控制决策一系列负责的任务处理 
Coordinator – 该对象不做任何决策处理工作，只是delegate工作到其它对象上 
Interfacer – 该对象设计为在系统的各个部分转化信息（或请求） 
一旦你知道了这些概念，那就狠容易知道你的代码到底是多职责还是单一职责了。 



LSP：Subtypes must be substitutable for their base types. 
派生类型必须可以替换它的基类型。 
在面向对象编程里，继承提供了一个机制让子类和共享基类的代码，这是通过在基类型里封装通用的数据和行为来实现的，然后已经及类型来声明更详细的子类型，为了应用里氏替换原则，继承子类型需要在语义上等价于基类型里的期望行为。 
里氏替换原则(LSP)的妨碍（译者注：就是妨碍实现LSP的代码）不是基于我们所想的继承子类应该在行为里确保更新代码，而是这样的更新是否能在当前的期望中得到实现。 （更新能否实现期望？？？）
减少LSP妨碍 策略 

契约（Contracts） 
契约清单有2种形式：执行说明书（executable specifications）和错误处理，在执行说明书里，一个详细类库的契约也包括一组自动化测试，而错误处理是在代码里直接处理的，例如在前置条件，后置条件，常量检查等，可以从Bertrand Miller的大作《契约设计》中查看这个技术。检查使用测试驱动开发（Test-Driven Development）来指导你代码的设计 
设计可重用类库的时候可随意使用契约设计技术 
对于你自己要维护和实现的代码，使用契约设计趋向于添加很多不必要的代码，如果你要控制输入，添加测试是非常有必要的，如果你是类库作者，使用契约设计，你要注意不正确的使用方法以及让你的用户使之作为一个测试工具。 

避免继承 
避免LSP妨碍的另外一个测试是：如果可能的话，尽量不用继承，在Gamma的大作《Design Patterns – Elements of Reusable Object-Orineted Software》中，我们可以看到如下建议： 

Favor object composition over class inheritance 
尽量使用对象组合而不是类继承 
有些书里讨论了组合比继承好的唯一作用是静态类型，基于类的语言（例如，在运行时可以改变行为），与JavaScript相关的一个问题是耦合，当使用继承的时候，继承子类型和他们的基类型耦合在一起了，就是说及类型的改变会影响到继承子类型。组合倾向于对象更小化，更容易想静态和动态语言语言维护。 
里氏替换原则（LSP）的本质不是真的和继承有关，而是行为兼容性。JavaScript是一个动态语言，一个对象的契约行为不是对象的类型决定的，而是对象期望的功能决定的。里氏替换原则的初始构想是作为继承的一个原则指南，等价于对象设计中的隐式接口。 
