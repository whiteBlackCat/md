gpedit.msc—–组策略
Nslookup——-IP地址侦测器 ，是一个 监测网络中 DNS 服务器是否能正确实现域名解析的命令行工具。 它在 Windows NT/2000/XP 中均可使用 , 但在 Windows 98 中却没有集成这一个工具。
explorer——-打开资源管理器
logoff———注销命令
shutdown——-60秒倒计时关机命令
lusrmgr.msc—-本机用户和组
services.msc—本地服务设置
oobe/msoobe /a—-检查XP是否激活
notepad——–打开记事本
cleanmgr——-垃圾整理
net start messenger—-开始信使服务
compmgmt.msc—计算机管理
net stop messenger—–停止信使服务
conf———–启动netmeeting
dvdplay——–DVD播放器
charmap——–启动字符映射表
diskmgmt.msc—磁盘管理实用程序
calc———–启动计算器
dfrg.msc——-磁盘碎片整理程序
chkdsk.exe—–Chkdsk磁盘检查
devmgmt.msc— 设备管理器
regsvr32 /u *.dll—-停止dll文件运行
drwtsn32—— 系统医生
rononce -p—-15秒关机
dxdiag———检查DirectX信息
regedt32——-注册表编辑器
Msconfig.exe—系统配置实用程序
rsop.msc——-组策略结果集
mem.exe——–显示内存使用情况
regedit.exe—-注册表
winchat——–XP自带局域网聊天
progman——–程序管理器
winmsd———系统信息
perfmon.msc—-计算机性能监测程序
winver———检查Windows版本
sfc /scannow—–扫描错误并复原
taskmgr—–任务管理器（2000/xp/2003
winver———检查Windows版本
wmimgmt.msc—-打开windows管理体系结构(WMI)
wupdmgr——–windows更新程序
wscript——–windows脚本宿主设置
write———-写字板
winmsd———系统信息
wiaacmgr——-扫描仪和照相机向导
winchat——–XP自带局域网聊天
mem.exe——–显示内存使用情况
Msconfig.exe—系统配置实用程序
mplayer2——-简易widnows media player
mspaint——–画图板
mstsc———-远程桌面连接
mplayer2——-媒体播放机
magnify——–放大镜实用程序
mmc————打开控制台
mobsync——–同步命令
dxdiag———检查DirectX信息
iexpress——-木马捆绑工具，系统自带
fsmgmt.msc—–共享文件夹管理器
utilman——–辅助工具管理器
diskmgmt.msc—磁盘管理实用程序
dcomcnfg——-打开系统组件服务
ddeshare——-打开DDE共享设置
osk————打开屏幕键盘
odbcad32——-ODBC数据源管理器
oobe/msoobe /a—-检查XP是否激活 114. logoff———注销命令
notepad——–打开记事本
nslookup——-网络管理的工具向导
ntbackup——-系统备份和还原
narrator——-屏幕“讲述人”
ntmsmgr.msc—-移动存储管理器
ntmsoprq.msc—移动存储管理员操作请求
netstat -an—-(TC)命令检查接口
syncapp——–创建一个公文包
sysedit——–系统配置编辑器
sigverif——-文件签名验证程序
ciadv.msc——索引服务程序
shrpubw——–创建共享文件夹
secpol.msc—–本地安全策略
syskey———系统加密，一旦加密就不能解开，保护windows xp系统的双重密码
services.msc—本地服务设置
Sndvol32——-音量控制程序
sfc.exe——–系统文件检查器
sfc /scannow—windows文件保护
ciadv.msc——索引服务程序
tourstart——xp简介（安装完成后出现的漫游xp程序）
taskmgr——–任务管理器
eventvwr——-事件查看器
eudcedit——-造字程序
compmgmt.msc—计算机管理
packager——-对象包装程序
perfmon.msc—-计算机性能监测程序
charmap——–启动字符映射表
cliconfg——-SQL SERVER 客户端网络实用程序
Clipbrd——–剪贴板查看器
conf———–启动netmeeting
certmgr.msc—-证书管理实用程序
regsvr32 /u *.dll—-停止dll文件运行
regsvr32 /u zipfldr.dll——取消ZIP支持
cmd.exe——–CMD命令提示符
chkdsk.exe—–Chkdsk磁盘检查 

磁盘操作:
fdisk 
	/mbr 重建主引导记录
	/cmbr [n] 重建第n硬盘的主引导记录
format c: /q /u /autotest
	/q 快速格式化 
	/u 不可恢复 
	/autotest 不提示 
	/s 创建 MS-DOS 引导盘 

目录操作:
DIR [目录名或文件名] [/S][/W][/P][/A] 列出目录
	/s 查找子目录
	/w 只显示文件名 
	/p 分页
	/a 显示隐藏文件
MD (MKDIR) [目录名] 创建目录
CD (CHDIR) [目录名] 
	AA 进入当前文件夹下的AA目录
	.. 进入上一个文件夹
	\ 返回根目录
	c:\windows 进入c:\windows文件夹
RD ( RMDIR) [目录名] 删除目录

文件操作
删除目录及其文件： rmdir [目录名或文件名] [/S][/W][/P][/A] 
del [目录名或文件名] [/f][/s][/q] 删除
	/f 删除只读文件
	/s 删除该目录及其下的所有内容 
	/q 删除前不确认  
copy [源文件或目录] [目标目录] 复制文件 
attrib [参数][源文件或目录]