set命令:

$ bash script.sh
script.sh是在一个新的 Shell 里面执行,set命令用来修改 Shell 环境的运行参数

set -u:
执行脚本的时候，如果遇到不存在的变量，Bash 默认忽略它
在脚本头部添加set -u时,改变这一行为,脚本报错,并不再执行 等同set -o nounset

set -x:
用来在运行结果之前，先输出执行的那一行命令
这在连续输出时,方便调试定位,等同set

报错:
如果脚本里面有运行失败的命令（返回值非0），Bash 默认会继续执行后面的命令
为防止错误积累:command || exit 1
引申:
# 写法一
command || { echo "command failed"; exit 1; }

# 写法二
if ! command; then echo "command failed"; exit 1; fi

# 写法三
command
if [ "$?" -ne 0 ]; then echo "command failed"; exit 1; fi

set -e:
脚本只要发生错误，就终止执行(根据返回值来判断，一个命令是否运行失败)
set +e表示关闭-e选项，set -e表示重新打开-e选项 之间的代码不会返回非零值终止
使用command || true也可以,等同于set -o errexit

set -o pipefail
使set -e适用于管道命令,使得任意子命令失败便终止,而非最后一个命令