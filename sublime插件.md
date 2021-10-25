Package Control:
安装方法：
1.CTRL+` ，出现控制台
2.粘贴以下代码至控制台
import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)

Emmet,JSFormat,LESS,Less2CSS,Alignment,sublime-autoprefixer,Bracket Highlighter,Git,jQuery,DocBlockr,Color​Picker,AutoFileName,Nodejs,Trailing spaces,FileDiffs,GBK Encoding Support,Git​Gutter

sublime text3配置Node环境
1、下载Nodejs插件，下载地址为：
https://github.com/tanepiper/SublimeText-Nodejs
解压后文件名改为Nodejs
 
2、打开Sublime Text3，点击菜单“Perferences” =>“Browse Packages”打开“Packages”文件夹，并将第1部的Nodejs文件夹剪切进来
 
3、打开文件“Nodejs.sublime-build”，将代码 "encoding": "cp1252" 改为 "encoding": "utf8" ，将代码 "cmd": ["taskkill /F /IM node.exe & node", "$file"] 改为 "cmd": ["node", "$file"] ，保存文件
 
4、打开文件“Nodejs.sublime-settings”，将代码 "node_command": false改为 "node_command": "D:\\Program Files\\nodejs\\node.exe" ，将代码 "npm_command": false 改为 "npm_command": "D:\\Program Files\\nodejs\\npm.cmd" ，保存文件
 
5、编写一个测试文件test.js，按“ctrl+B"运行代码