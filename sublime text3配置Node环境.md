1、下载Nodejs插件，下载地址为：
https://github.com/tanepiper/SublimeText-Nodejs
解压后文件名改为Nodejs
 
2、打开Sublime Text3，点击菜单“Perferences” =>“Browse Packages”打开“Packages”文件夹，并将第1部的Nodejs文件夹剪切进来
 
3、打开文件“Nodejs.sublime-build”，将代码 "encoding": "cp1252" 改为 "encoding": "utf8" ，将代码 "cmd": ["taskkill /F /IM node.exe & node", "$file"] 改为 "cmd": ["node", "$file"] ，保存文件
 
4、打开文件“Nodejs.sublime-settings”，将代码 "node_command": false改为 "node_command": "D:\\Program Files\\nodejs\\node.exe" ，将代码 "npm_command": false 改为 "npm_command": "D:\\Program Files\\nodejs\\npm.cmd" ，保存文件
 
5、编写一个测试文件test.js，按“ctrl+B"运行代码