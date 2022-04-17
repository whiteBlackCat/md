> **Q**: Java代码从编写到运行的全过程：
1. 编写代码,编译成字节码文件：将编码后的源程序编译成字节码文件 .class
2. 类装载(classloader): 为运行程序寻找或装载所需要的类
3. 字节码校验(bytecode verifier): 校验class的代码，保证安全性，比如对象类型，对象访问权限
4. 解释(interprter)：机器不认识字节码文件，需要被解释器解释后才能运行
5. 运行: 最后代码可以在运行环境中进行运行

> **Q**: 简述java安全机制
<pre>
类装载器结构(class loader): 装载和寻找程序执行所需要的类
class文件检查器(the class file verifier): 虚拟机校验装载的字节码文件的完整性，通过四趟进行校验
第一趟：检查文件结构，比如检查文件是否符合JavaClass文件的节本结构
第二趟：类型数据的语义检查,例如检查final类有没有被子化等
第三趟：字节码验证，确保操作数栈总是包含正确的数值以及正确的类型。
第四趟：符号引用的验证，由于Java程序是动态链接的，所以Class文件检查器在进行第四次扫描中，必须检查相互引用类之间的兼容性。
</pre>

> **Q**: 内置于JVM的一些安全特性
<pre>
a) 类型安全的引用转换
b) 自动垃圾回收机制
c) 空引用检查
d) 结构化的内存访问
</pre>

> **Q**: 简述java面向对象的三大特性
<pre>
<bold>封装:</bold> 将属性私有化只有类内部才能使用，提供对外使用的公有方法，就像常见的java bean,属性都是priavte,set和get方法都是共有的。为什么不直接将类的属性设置为public供外部使用，因为直接使用的话，无法对属性进行相应的处理再获取，或者有些共有属性只读，不能修改，就不能直接将属性设置为公有供外部使用。
<bold>继承:</bold> 子类继承父类的方法和属性，并且可以重写父类方法或者可以扩展新方法。java是单继承语言，就是一个子类，只能继承一个父类。java的继承属提高了java的程序复用性和扩展性
<bold>多态:</bold> 指java不同类的对象可以对同一函数调用进行响应，也就是函数调用可以根据发送对象的不同而采用不同的行为方式。java多态分为运行时多态和编译时多态，编译时多态指方法的重载，即在编译时就可以确定使用哪个方法，运行时多态是指Java在运行时个根据调用方法的实例类型来决定调用哪个方法。所以多态是指在继承的基础上，对父类的引用可以指向子类对象，调用子类重写的方法，就是子类向上转型成父类，但是子类特有的扩展方法无法使用，可以通过强制类型转换实现调用特有方法
</pre>

- 抽象类:用abstract修饰的类，含有不提供具体实现的抽象方法，抽象类不能被实例化，需要由子类继承抽象类实现父类的抽象方法。
- 接口：特殊的抽象类，该类中包含常量和抽象方法，子类可以实现多个接口，并且需要实现所有的抽象方法。
#### 区别：
1. 抽象类可以包含静态属性和静态方法或者普通方法，但是接口只能包含常量和抽象方法
2. 抽象类不能使private,但是接口只能是public的子类只能继承一个抽象类，子类可以实现多个接口
#### 适用场景：
接口相比抽象类更加抽象，抽象类是对事物的抽象，即对类的抽象，而接口是对行为的抽象。抽象类是对整个类整体包含属性，行为，但是接口只是对类局部行为进行抽象。比如鸟和飞机都可以飞，可以将鸟和飞机都设计成抽象类，将飞这个行为定义成接口，鸟和飞机都实现这个接口，都具有飞的行为了。更多类型的鸟可以继承鸟父类，更多种类的飞机则可以进行继承飞机抽象类，所以这就是抽象类和接口的区别。


> **Q**: 简述java类的初始化顺序:
<pre>
普通类: 静态变量->静态代码块->普通属性->普通代码块->构造函数
继承了父类的子类：父类的静态变量->父类的静态代码块->子类的静态变量->子类的静态代码块->父类的普通变量->父类的普通代码块->
父类的构造函数->子类的普通变量->子类的普通代码块->子类的构造函数
</pre>

> **Q**: 简述Java内存区域
<pre>
Java内存区域指的就是JVM的内存区域，从划分区域来讲可以分为程序计数器，Java栈，堆，本地方法栈，方法区;
程序计数器：线程私有区域,用来记录每个线程指令执行的地址，在JVM中，多线程的执行是线程间轮流获得CPU的执行时间的，因此在某个时刻只有一条线程指令是被CPU内核执行，多线程间的切换需要记录每个线程的执行位置，因此每个线程都有自己独立的程序计数器，并且不会互相干扰，因此程序计数器是每个线程私有区域。
JAVA栈：线程私有区域，Java栈中存放的是栈帧，每个栈帧又包括局部变量表，操作数栈，指向当前方法所属类的运行时常量池的引用，方法返回地址等信息。当执行一个方法时，该方法的栈帧入账，当方法执行完毕后，该方法的栈帧出栈。
局部变量表：用来存储方法的局部变量，如果是基本的数据类型，存储的则是局部变量的直接量，如果是引用类型的变量，则存储指向对象的引用，局部变量的大小在编译期就可以知道了，所以运行期间局部变量表的大小不变。
操作数栈： 用来处理程序的计算过程
指向运行时常量池的引用： 执行运行时所属类的运行时常量池
方法返回地址：方法执行完后需要返回到调用他的位置，因此需要存储这个地址
每个线程的执行方法是不同的，所以JAVA栈也是每个线程私有的。
本地方法栈： 跟Java栈类似，不过本地方法栈存储的是需要执行的本地方法栈帧，本地方法是由其它语言编写的
Java堆：线程共享区域，Java堆存储的是数组和对象本身，JVM中只有一个Java堆，也是jvm垃圾回收的主要区域，如果堆内存不够来分配内存实例则会出现内存溢出
方法区：现场共享区域，存储着每个类的基本信息包括，静态变量常量，方法以及编译期编译后的代码。方法区中有个重要的部分是运行时常量池，运行时常量池用来存储编译期生成的常量，当然也可以动态创建运行时常量池空间，比如String,intern。
</pre>

> **Q**: 简述Java内存模型
<pre>
Java内存模型是一组程序线程访问共享变量的规则。Java内存模型中将线程私有数据的存储区域定义为工作内存，将线程间共享的变量数据定义为主内存。

工作内存为每个线程私有的内存区域，存储着线程的指令执行位置，执行方法的相关信息，每个线程不能访问其它线程工作内存的数据，因此工作内存中的本地变量操作是线程安全的。
主内存存储着实例对象和其它的类的基本信息，是多个线程间共有的，如果某个线程访问或者操作主内存的同一个变量，先要从主内存中刷新变量到线程的工作内存中，计算完后将变量从工作内存中刷新到主内存中，当多个线程访问或者操作的时候，则会出现变量不安全。
为了解决多线程间的执行问题，Java从原子性，一致性和可见性提供了解决方案。
</pre>