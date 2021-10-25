Git简介
突出特点:合并追踪（merge tracing）
特点：
初始化简单;网络依赖低;唯一commit id;Branch管理容易;更少的仓库污染
与SVN区别：分布式;元数据存储非文件式;SHA-1值非快照

版本库简介
几个版本控制软件相互比较的重要依据：
（1）版本库模型（Repository model）：描述了多个源码版本库副本间的关系，有客户端/服务器和分布式两种模式。在客户端/服务器模式下，每一用户通过客户端访问位于服务器的主版本库，每一客户机只需保存它所关注的文件副本，对当前工作副本（working copy）的更改只有在提交到服务器之后，其它用户才能看到对应文件的修改。而在分布式模式下，这些源码版本库副本间是对等的实体，用户的机器除了保存他们的工作副本外，还拥有本地版本库的历史信息。
（2）并发模式（Concurrency model）：描述了当同时对同一工作副本/文件进行更改或编辑时，如何管理这种冲突以避免产生无意义的数据，有排它锁和合并模式。在排它锁模式下，只有发出请求并获得当前文件排它锁的用户才能对对该文件进行更改。而在合并模式下，用户可以随意编辑或更改文件，但可能随时会被通知存在冲突（两个或多个用户同时编辑同一文件），于是版本控制工具或用户需要合并更改以解决这种冲突。因此，几乎所有的分布式版本控制软件采用合并方式解决并发冲突。
（3）历史模式（History model）：描述了如何在版本库中存贮文件的更改信息，有快照和改变集两种模式。在快照模式下，版本库会分别存储更改发生前后的工作副本；而在改变集模式下，版本库除了保存更改发生前的工作副本外，只保存更改发生后的改变信息。
（4）变更范围（Scope of change）：描述了版本编号是针对单个文件还是整个目录树。
（6）原子提交性（Atomic commit）：描述了在提交更改时，能否保证所有更改要么全部提交或合并，要么不会发生任何改变。
（7）部分克隆（Partial checkout/clone）：是否支持只拷贝版本库中特定的子目录。

Windows环境下，使用Git方法：
1、 Cygwin（Windows上运行的Linux环境）
2、 msysgit

创建SSH Key(通信加密)
命令：ssh-keygen  -C  "username@email.com"  -t  rsa
说明：username@email.com为git账号邮箱;在github账号设置内添上SSH公钥内容(id_rsa.pub文件)

HEAD文件存放根节点的信息，Git采用树形结构来存储版本信息，那么HEAD就表示根；refs目录存储了你在当前版本控制目录下的各种不同引用（引用指的是你本地和远程所用到的各个树分支的信息），它有heads、remotes、stash、tags四个子目录，分别存储对不同的根、远程版本库、Git栈和标签的四种引用


usage概括： git <command> [command参数]
command参数可以使用该命令查看： git help <command>

Git 工作流程如下：
1.在工作目录中修改某些文件。 
2.对修改后的文件进行快照，然后保存到暂存区域。 git add
3. 提交更新，将保存在暂存区域的文件快照永久转储到 Git 目录中。 git commit

多人协作的工作模式通常如下：
（1）首先将远程仓库克隆为本地仓库
git clone git@github.com:xxx/LearnGit.git
（2）在本地创建和远程分支对应的分支
git checkout -b <本地分支名> origin/<远程分支名>
本地和远程分支的名称最好一致；
（3）在本地分支完成任务后，可以试图用git push <远程主机名> <本地分支名>推送自己的修改；
（2）如果推送失败，则表明远程分支比本地更新，需要先用git pull试图合并；
（3）如果pull失败并提示“no tracking information”，则说明本地分支和远程分支的链接关系没有创建，用命令git branch --set-upstream-to=<远程主机名>/<远程分支名>  <本地分支名>创建链接；
（4）如果合并有冲突，则解决冲突，并在本地提交（add => commit）；
（5）没有冲突或者解决掉冲突后，再用git push <远程主机名> <本地分支名>推送就能成功。


配置文件:
etc/gitconfig 文件：所有用户对象,--system选项
~/.gitconfig 文件：该用户对象,--global选项
.git/config 文件：当前项目对象,无选项
从上往下逐级覆盖

分支职责
master : 最为稳定功能最为完整的随时可发布的代码；
develop : 开发分支；
feature : 开发新功能的分支, 基于 develop, 完成后 merge 回 develop  	如:hotfix 

Config操作:
为命令配置别名(具体看用户目录下.gitconfig文件)
git config --global alias.co checkout
git config：更改Git的各种设置
		 --list 看所有用户配置

忽略文件(夹)
在仓库根目录下创建名称为“.gitignore”的文件，写入不需要的文件夹名或文件，每个元素占一行，如
bin
*.db
参考: https://github.com/github/gitignore
原则：
操作系统自动生成的文件，比如缩略图；
编译生成的中间文件、可执行文件.如Java编译产生的.class；
	带有敏感信息的配置文件，如存放口令的配置文件。
git add -f test.class  强制添加被忽略的文件
git check-ignore -v App.class.gitignore:3:*.class App.class




Tag操作:
$ git tag: 查看版本(按字母顺序排列)
[name] : 创建版本
[name] [$id]: 给指定提交创建版本 (可由git log --pretty=oneline --abbrev-commit  查看$id)
-d: [name] :删除版本(本地)
-r: 查看远程版本
	-a: [name] -m 'yourMessage' : 创建带注释的tag
-s: 通过-s用私钥签名一个标签，签名采用PGP签名

$ git show [name]: 查看版本详细情况
$ git push origin :refs/tags/[name]: 删除远程版本
$ git push origin [name]/--tags: 将版本推送到远程

子模块相关:
$ git submodule init : 初始化,只在首次检出仓库时运行一次就行
		add [url] [path] : 添加
		update : 更新,每次更新或切换分支后都需要运行一下
删除子模块：
1) $ git rm --cached [path]
2) 编辑“.gitmodules”及“ .git/config”文件，将子模块的相关配置节点删除掉
3) 手动删除子模块残留的目录
 
分支:
$ git branch : 查看分支列表
-r # 查看远程分支
-v # 查看各个分支最后提交信息
-a # 列出所有分支
--merged # 查看已经被合并到当前分支的分支
--no-merged # 查看尚未被合并到当前分支的分支
[name] : 新建
[new_branch] [start_point] 基于另一个起点（分支名称，提交名称或则标签名称），创建新的分支(分支中的分支)
-f [existing_branch] [start_point] 创建同名新分支，覆盖已有分支
-d/-D [name] : 删除 -d只能删除已合并的分支，-D强制删除一个分支
--set-upstream-to [origin]/[master]:设置上游分支,将当前分支与远程分支建立联系(git pull提示no tracking information时的解决方法)
--set-upstream develop origin/develop 作用同上

$ git checkout :　当前分支简略修改信息
[name]：切换(工作区只有当前分支文件信息,切换会载入分支最新提交代码,未提交的代码会丢失)
-b [name]：新建并切换
-- [file]  将文件文件恢复到最近提交状态
--track origin/<branchname>: 建立追踪
跟踪分支是与远程分支有直接关系的本地分支。(决定了pull会拉取远端哪个分支)
-m/-M [existing_branch] [new_branch] 移动或重命名分支，当新分支不存在时(-m失败?-M覆盖)
[$id] 将当前目录回复成指定提交状态
[$id] -b [new_branch] 创建并切换分支,然后同上

$ git merge [origin]/[dev] : 在当前分支合并dev,默认ff模式
--no-ff: 非ff模式，该次合并后生成提交记录
--no-commit [branch] 合并但不提交
--squash [branch]  把一条分支上的内容合并到另一个分支上的一个提交

变基:
git rebase master [branch] 将master rebase到branch.能修改提交历史,可以使log成一条直线更加直观.但仅适用于未推送的本地修改,贸然清理远端历史容易影响仓库使用

远程仓库:
$ git remote: 查看远程仓库名称列表
-v: 查看远程服务器地址和仓库名称
add [name] [url]: 添加远程仓库别名
set-url --push [name] [newUrl]: 修改远程仓库
show origin: 查看远程服务器仓库状态
rm [repository] : 删除远程仓库
set-head origin master :设置远程仓库的HEAD指向master

$ git pull/fetch/push [remoteName] [localBranchName] [:remotelBranchName]: 拉取/推送远程仓库,fetch需手动合并
push -u [origin] [master]: -u 初始化远程分支

$ git clone [url] 注意：
（1）不能使用别名
（2）默认情况下，从远程clone到本地的库只能看到master分支

Stash:
$ git stash: 将目前的工作现场保存
		list: 查看所有保存的工作现场
		push/pop/apply stash@{[num]} 将文件给push到临时空间/从临时空间回复(apply不会删除该条stash)
注意点：
（1）未被版本控制纳入的新文件不会被保存
（2）如果修改分支下的已被追踪的文件，不管有没有对修改的文件进行add操作，如果执行stash，所有修改会被纳入保存的现场，而文件会恢复成修改前的状态。恢复现场后，文件又呈现被修改后的状态。特别的是，如果修改的文件在stash前已经被add了，恢复现场后，暂存区的内容就会清空，相当于这个文件从未被add一样。

Log:
git log  历史记录
--oneline   (--pretty=oneline)  一行显示
--abbrev-commit 版本号部分显示
--graph  查看分支合并图
--stat 查看提交统计信息
--since/before="6 hours" 显示最近6小时/6小时之前提交记录
	[file] 查看该文件每次提交记录
-p -2 查看最近两次详细修改内容的diff
-1 HEAD~3 显示比HEAD早3个提交的那个提交

杂项:
$ git ls-files 看已经被提交的所有文件列表
ls-remote  显式地获得远程引用的完整列表
	commit -a -m "log_message" (-a是提交所有改动，-m是加入log信息)
--amend # 修改最后一次提交记录
	add <fileName>  把内容暂存,纳入版本控制(commit前必须)
rm –cached: add后，commit前的撤销
status : 展示当前分支的状态（是否commit，是否push）
reset 
--hard HEAD^ 回退到上一个版本
		--hard HEAD^^ 回退到上上个版本
		--hard e9efa77 回退到具体版本
--soft [$id] 更改引用的指向(复位版本库)，不改变暂存区和工作区
--mixed [$id] (默认)更改引用的指向及重置暂存区，但是不改变工作区
备注：git reset命令既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用HEAD时，表示最新的版本。
		HEAD [file]: 抛弃暂存区中文件的修改
[file]: 从暂存区恢复到工作文件,git add <file>的反射操作
	revert [$id]: 恢复某次提交的状态，恢复动作本身也创建了一次提交对象
注意:重置的默认值是HEAD，而检出(checkout)的默认值是暂存区  
ssh -T git@github.com  验证秘钥是否生成
	show [$id] [file] 显示某次提交的[某文件]内容
	remove [file] 从版本库中删除文件
		[file] --cached 从版本库中删除文件记录，但不删除文件
	mv [file1] [file2] 重命名文件
diff 显示未提交的本地更改内容
[branch] 将本地分支和参数指定的分支进行diff
[branch1] [branch2] 对这两个分支进行diff
		"@{yesterday}" 查看昨天的改变   
--staged 
--stat则只给出统计信息
--cached 比较暂存区和版本库差异
	clean 清除未跟踪的文件
		-dn 列出那些文件将被清除  
		-f 清除未跟踪的文件  
-df 清除未跟踪的文件和目录  
		-dfx 清除包括.gitignore忽略的所有文件  
		-X Remove only files ignored by git  
	init 初始化一个版本仓库    



图表 git log –pretty=format 常用的选项
选项	说明
%H	提交对象（commit）的完整哈希字串
%h	提交对象的简短哈希字串
%T	树对象（tree）的完整哈希字串
%t	树对象的简短哈希字串
%P	父对象（parent）的完整哈希字串
%p	父对象的简短哈希字串
%an	作者（author）的名字
%ae	作者的电子邮件地址
%ad	作者修订日期（可以用 –date= 选项定制格式）
%ar	作者修订日期，按多久以前的方式显示
%cn	提交者(committer)的名字
%ce	提交者的电子邮件地址
%cd	提交日期
%cr	提交日期，按多久以前的方式显示
%s	提交说明
图表 限制 git log 输出的选项
选项	说明
%H	提交对象（commit）的完整哈希字串
-(n)	仅显示最近的 n 条提交
–since, –after	仅显示指定时间之后的提交
–until, –before	仅显示指定时间之前的提交
–author	仅显示指定作者相关的提交
–committer	仅显示指定提交者相关的提交
–grep	仅显示含指定关键字的提交
-S	仅显示添加或移除了某个关键字的提交
 
遇到冲突时的分支合并 
如果你在两个不同的分支中，对同一个文件的同一个部分进行了不同的修改，Git就没法干净的合并它们。 
示例：
<<<<<<< HEAD:index.html<div id="footer">contact : email.support@github.com</div>
=======
<div id="footer"> please contact us at support@github.com
</div>
>>>>>>> iss53:index.html
这表示HEAD所指示的版本（也就是你的master分支所在的位置，因为你在运行merge命令的时候已经检出到了这个分支）在这个区段的上半部分（=======的上半部分），而iss53分支所指示的版本在=======的下半部分。为了解决冲突，你必须选择使用由=======分割的两部分中的一个，或者你也可以自行合并这些内容。 
在你解决了所有文件里的冲突之后，对每个文件使用 git add命令来将其标记为冲突已解决。一旦暂存这些原本有冲突的文件，Git就会将它们标记为冲突已解决。 


Git 只能追踪文本文件变化,无法追踪二进制文件(比如视屏文件,.docx文件)
文本文件编码:建议utf-8  (注意windows记事本编辑的文件会在开头加上0xefbbbf 可能会由此引发一些问题)
Git reflog 查看每一次命令(包括回退历史,这是log不具有的)
.git目录是版本库,其中含有stage(暂存区 git add操作后的文件位置),git commit便把stage内容保存到当前分支 .git同级其余内容均属于工作区
提交修改的表现:多次修改文件,提交的只是进行过git add的那次
撤销:
未add: git checkout --file
未commit: git reset HEAD file/git reset  --hard HEAD(区别:前者不会被reflog 记录)
rm file 等同于直接在工作区删除 git rm file = rm file + add file
分支的创建,合并,删除都只是指针操作(ff模式)
ff模式合并后,分支记录会消失,--no-ff 禁用ff模式
git pull --allow-unrelated-histories 

被track的文件  使用gitignore规则无效