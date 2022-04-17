# Shell

## 概念

Shell 是一个用 C 语言编写的程序，它是用户使用 Linux 的桥梁。Shell 既是一种命令语言，又是一种程序设计语言。
Shell 是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务
Shell 脚本（shell script），是一种为 shell 编写的脚本程序

## 运行shell脚本

1. 作为可执行程序

```javascript
//  test.sh(后缀名对于程序不重要)
#!/bin/bash  // '#!'标记告诉系统脚本所需的解释器,应置于文件首行
// $ chmod +x ./test.sh  # chmod 使脚本具有执行权限,一般指linux. 以'./'开头,这样避免系统去PATH寻找该文件,而在当前目录找
```

## 语法

### 变量

命名基本同JS,赋值时变量名和等号之间不能有空格
使用时以`${var}`形式,`{}`用于确定变量边界可不加,这在字符串,变量混合时尤其有用
readonly 命令将变量设为只读
unset 删除变量,只读变量不能删除

### 变量作用域

1. 局部: 在脚本或命令中定义，仅在当前shell实例中有效
2. 环境: 所有的程序，包括shell启动的程序，都能访问环境变量
3. shell: shell变量是由shell程序设置的特殊变量。shell变量中有一部分是环境变量，有一部分是局部变量

### 字符串

同PHP
单引号: 字符原样输出,其中变量无效; 字符串内不能出现单个单引号(转义也不行),成对以字符串拼接
双引号: 允许变量,可以转义
字符串:
 长度:`${#string}`
 截取:`${string:start:end}`
 查找:`expr index "$string" io`  $string为字符变量,io为查找对象
数组:仅一维
声明:`数组名=(值1 值2 ... 值n)` 空格分离
使用:`${array_name[@]}` 获取数组所有元素

注释:

1. 单行注释: 以#开头
2. 多行代码注释:
   1. 可取巧使用{}声明匿名函数
   2. (EOF可用任何标志代替)

```bash
:<<EOF
注释内容...
EOF
```

Shell穿参:
$n获取;0为文件名 1及以后为相应参数
如:$ ./test.sh 1 2 3  对应 $0=>./test.sh $1=>1 $2=>2 $3=>3
特殊字符:
$#: 参数个数
$*: 以一个单字符串显示所有向脚本传递的参数
$$ 脚本运行的当前进程ID号
$! 后台运行的最后一个进程的ID号
$@ 与$*相同，但是使用时加引号，并在引号中返回每个参数
$- 显示Shell使用的当前选项
$? 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误

原生bash不支持基本数学运算,可通过其他命令实现如 awk 和 expr，expr  例`expr 2 + 2`
注意:

1. 表达式和运算符之间要有空
2. 反引号
3. \*代替*
[] 执行基本的算数运算如result=$[a+b]

关系运算符:
-eq: 相等; -ne: 不相等; -gt: 大于; -lt: 小于; -ge: 大于等于; -le: 小于等于
布尔运算:
!: 非; -o: 或; -a: 与
字符串运算符:
=: 字符串是否相等; !=: 与前相反; -z:字符串长度是否为0; -n: 前相反; str:字符串是否为空
文件测试运算符:
-b file 检测文件是否是块设备文件
-c file 检测文件是否是字符设备文件
-d file 检测文件是否是目录
-f file 检测文件是否是普通文件（既不是目录，也不是设备文件 )
-g file 检测文件是否设置了 SGID 位
-k file 检测文件是否设置了粘着位(Sticky Bit)
-p file 检测文件是否是有名管道
-u file 检测文件是否设置了 SUID 位
-r file 检测文件是否可读
-w file 检测文件是否可写
-x file 检测文件是否可执行
-s file 检测文件是否为空（文件大小是否大于0）
-e file 检测文件（包括目录）是否存在

echo:
普通字符串: echo "string"  """可省略,转义(\n 换行,\c 不换行),变量
read var 将用户输入值付给var; -e开启转义
显示结果定向至文件: echo "It is a test" > myfile

printf:移植性好,格式化输出,不会自动添加换行
语法: printf  format-string  [arguments...] 例:printf "%-10s %-8s %-4.2f\n" 郭靖 男 66.1234

流程控制:不允许空语句
if condition
then
 do something
else
 do other
fi
循环:
for var in item1 item2 ... itemN
do
    command

while condition
do
    command
done

until condition
do
    command
done

case 值 in
模式1)
    command1
    ;;
模式2）
    command1
    ;;
esac

函数:
定义:
[ function ] funname [()]
{
    action;
    [return int;]
}
当无return时,以最后一条命令运行结果，作为返回值。 return后跟数值n(0-255)
调用: funname 1 2 3 4 5 6 7 8 9 34 73  内部使用$n n>9时使用${n}

Shell 输入/输出
command > file 将输出重定向到 file。
command < file 将输入重定向到 file。
command >> file 将输出以追加的方式重定向到 file。
n > file 将文件描述符为 n 的文件重定向到 file。
n >> file 将文件描述符为 n 的文件以追加的方式重定向到 file。
n >& m 将输出文件 m 和 n 合并。
n <& m 将输入文件 m 和 n 合并。
<< tag 将开始标记 tag 和结束标记 tag 之间的内容作为输入。
需要注意的是文件描述符 0 通常是标准输入（STDIN），1 是标准输出（STDOUT），2 是标准错误输出（STDERR）

文件包含:
. filename   # 注意点号(.)和文件名中间有一空格
或者
source filename
