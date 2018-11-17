前端模块管理工具:
包管理工具,包不具有固定结构(不提供一套构建工具),更像静态资源共享平台.
包资源资源涵盖html,css,js,图片等
Bower仅将发布者公开的git地址记录在数据库
安装: 宽松的规范;添加bower.json及相关信息,但缺乏稳定性

命令:
Bower -help
Usage:
 
    bower <command> [<args>] [<options>]
Commands:
 
    cache                  Managebowercache
    help                    DisplayhelpinformationaboutBower
    home                    Opens a package homepageintoyourfavoritebrowser
    info                    Infoof a particularpackage
    init                    Interactivelycreate a bower.jsonfile
    install                Install a package locally
    link                    Symlink a package folder
    list                    Listlocalpackages - and possibleupdates
    login                  AuthenticatewithGitHuband storecredentials
    lookup                  Lookup a package URLbyname
    prune                  Removeslocalextraneouspackages
    register                Register a package
    search                  Searchfor a package byname
    update                  Update a localpackage
    uninstall              Remove a localpackage
    unregister              Remove a package fromtheregistry
    version                Bump a package version
Options:
 
    -f, --force            Makesvariouscommandsmoreforceful
    -j, --json              OutputconsumableJSON
    -l, --loglevel          Whatleveloflogsto report
    -o, --offline          Do not hitthenetwork
    -q, --quiet            Onlyoutputimportantinformation
    -s, --silent            Do not outputanything, besideserrors
    -V, --verbose          Makesoutputmoreverbose
    --allow-root            Allowsrunningcommandsas root
    -v, --version          OutputBowerversion
    --no-color              Disablecolors
See 'bower help <command>' for moreinformationon a specificcommand.

cache:bower缓存管理
help:显示Bower命令的帮助信息
home:通过浏览器打开一个包的github发布页
info:查看包的信息
init:创建json文件
install:安装包到项目
link:在本地bower库建立一个项目链接
list:列出项目已安装的包
lookup:根据包名查询包的URL
prune:删除项目无关的包
register:注册一个包
search:搜索包
update:更新项目的包
uninstall:删除项目的包



配置文件: .bowerrc
{
  "directory" : "components",
  "json"      : "bower.json",
  "endpoint"  : "https://Bower.herokuapp.com",
  "searchpath"  : "",
  "shorthand_resolver" : ""
}
directory：存放库文件的子目录名。
json：描述各个库的json文件名。
endpoint：在线索引的网址，用来搜索各种库。
searchpath：一个数组，储存备选的在线索引网址。如果某个库在endpoint中找不到，则继续搜索该属性指定的网址，通常用于放置某些不公开的库。
shorthand_resolver：定义各个库名称简写形式。

bower.json文件的使用可以让包的安装更容易，你可以在应用程序的根目录下创建一个名为“bower.json”的文件，并定义它的依赖关系。bower.json的作用是：
保存项目的库信息，供项目二次安装时使用（重复使用）
向com 提交你的库时，该网站会读取 bower.json，列入在线索引。
其中dependencies 记录着生产环境依赖的库；devDependencies 记录着开发时依赖的 node package。其版本规则见 npm 的version rules。