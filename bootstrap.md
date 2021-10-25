优点：对不同分辨率设备灵活性强，解决多设备显示适应问题
缺点：兼容设备工作量大，代码累赘（加载时间长），多方面影响达不到最佳效果
核心：媒体查询  低端浏览器正常显示就行  根据不同分辨套用不同样式（于是先设计多个样式，再用媒查带入）

媒查方式：
css3
@media mediatype and|not|only (media feature) {
    CSS-Code;
}
css2
<link rel="stylesheet" media="mediatype and|not|only (media feature)" href="mystylesheet.css">
Mediatype：
all	用于所有设备      print	用于打印机和打印预览
screen	用于电脑屏幕，平板电脑，智能手机等。
speech	应用于屏幕阅读器等发声设备
Media feature：
aspect-ratio	定义输出设备中的页面可见区域宽度与高度的比率
color	定义输出设备每一组彩色原件的个数。如果不是彩色设备，则值等于0
color-index	定义在输出设备的彩色查询表中的条目数。如果没有使用彩色查询表，则值等于0
device-aspect-ratio	定义输出设备的屏幕可见宽度与高度的比率。
device-height	定义输出设备的屏幕可见高度。
device-width	定义输出设备的屏幕可见宽度。
grid	用来查询输出设备是否使用栅格或点阵。
height	定义输出设备中的页面可见区域高度。
max-aspect-ratio	定义输出设备的屏幕可见宽度与高度的最大比率。
max-color	定义输出设备每一组彩色原件的最大个数。
max-color-index	定义在输出设备的彩色查询表中的最大条目数。
max-device-aspect-ratio	定义输出设备的屏幕可见宽度与高度的最大比率。
max-device-height	定义输出设备的屏幕可见的最大高度。
max-device-width	定义输出设备的屏幕最大可见宽度。
max-height	定义输出设备中的页面最大可见区域高度。
max-monochrome	定义在一个单色框架缓冲区中每像素包含的最大单色原件个数。
max-resolution	定义设备的最大分辨率。
max-width	定义输出设备中的页面最大可见区域宽度。
min-aspect-ratio	定义输出设备中的页面可见区域宽度与高度的最小比率。
min-color	定义输出设备每一组彩色原件的最小个数。
min-color-index	定义在输出设备的彩色查询表中的最小条目数。
min-device-aspect-ratio	定义输出设备的屏幕可见宽度与高度的最小比率。
min-device-width	定义输出设备的屏幕最小可见宽度。
min-device-height	定义输出设备的屏幕的最小可见高度。
min-height	定义输出设备中的页面最小可见区域高度。
min-monochrome	定义在一个单色框架缓冲区中每像素包含的最小单色原件个数
min-resolution	定义设备的最小分辨率。
min-width	定义输出设备中的页面最小可见区域宽度。
monochrome	定义在一个单色框架缓冲区中每像素包含的单色原件个数。如果不是单色设备，则值等于0
orientation	定义输出设备中的页面可见区域高度是否大于或等于宽度。
resolution	定义设备的分辨率。如：96dpi, 300dpi, 118dpcm
scan	定义电视类设备的扫描工序。
width	定义输出设备中的页面可见区域宽度。

要点：
1.兼容移动设备
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
2.IE8既不支持HTML5也不支持CSS3 Media
<!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
  <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
<![endif]-->
3.<meta http-equiv="X-UA-Compatible" content="IE=edge">


模板
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- 上述3个meta标签*必须*放在最前面，任何其他内容都*必须*跟随其后！ -->
    <title>Bootstrap 101 Template</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <h1>你好，世界！</h1>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="js/bootstrap.min.js"></script>
  </body>
</html>


禁止响应式布局有如下几步：
移除 此 CSS 文档中提到的设置浏览器视口（viewport）的标签：<meta>。
通过为 .container 类设置一个 width 值从而覆盖框架的默认 width 设置，例如 width: 970px !important; 。请确保这些设置全部放在默认的 Bootstrap CSS 文件的后面。注意，如果你把它放到媒体查询中，也可以略去 !important 。
如果使用了导航条，需要移除所有导航条的折叠和展开行为。
对于栅格布局，额外增加 .col-xs-* 类或替换掉 .col-md-* 和 .col-lg-*。 不要担心，针对超小屏幕设备的栅格系统能够在所有分辨率的环境下展开。


响应式Web设计流程如下。
（1）确定需要兼容的设备类型、屏幕尺寸
通过用户研究，了解用户使用的设备分布情况，确定需要兼容的设备类型、屏幕尺寸。
设备类型：包括移动设备（智能手机、平板电脑等）和PC。对于移动设备，设计和实现的时候注意增加手势的功能。
屏幕尺寸：包括各种手机屏幕的尺寸（包括横向和竖向）、各种平板电脑的尺寸（包括横向和竖向）、普通电脑屏幕和宽屏。
在设计中要注意以下问题：
在响应式设计页面时，确定页面适用的尺寸范围。例如，1688搜索结果页面，跨度可以从手机到宽屏电脑，而1688首页由于结构过于复杂，想直接迁移到手机上不太现实，不如重新设计一个手机版的首页。
结合用户需求和实现成本，对适用的尺寸进行取舍。如一些功能操作的页面，用户一般没有在移动端进行操作的需求，没有必要进行响应式设计。
（2）制作线框原型
针对确定需要适应的几个尺寸，分别制作不同的线框原型，需要考虑清楚不同尺寸下，页面的布局如何变化，内容尺寸如何缩放，功能、内容的删减，甚至针对特殊的环境作特殊化的设计等。这个过程需要设计师和开发人员密切沟通。
（3）测试线框原型
将图片导入到相应的设备进行一些简单的测试，可以尽早发现可访问性、可读性等方面的问题。
（4）视觉设计
由于移动设备的屏幕像素密度与传统电脑屏幕不一样，在设计的时候需要保证内容文字的可读性、控件可点击区域的面积等。
（5）脚本实现
与传统的Web开发相比，响应式设计的页面由于页面布局、内容尺寸发生了变化，最终的成品更有可能与设计稿出入较大，需要开发人员和设计师多沟通。
例如，在下面示例中将页面父级容器宽度设置为固定的980px，对于桌面浏览环境，该宽度适用于任何宽于1024像素的分辨率。通过Media Query来监测那些宽度小于980px的设备分辨率，并将页面的宽度设置由固定方式改为流式版式，布局元素的宽度随着浏览器窗口的尺寸变化进行调整。当可视部分的宽度进一步减小到650px以下时，主要内容部分的容器宽度会增大至全屏，而侧边栏将被置于主内容部分的下方，整个页面变为单栏布局。

 
在本示例中，主要应用了下面几个技术和技法。
Media Query JavaScript。对于那些尚不支持Media Query的浏览器，在页面中调用css3-mediaqueries.js。
使用CSS Media Query实现自适应页面设计，使用CSS根据分辨率宽度的变化来调整页面布局结构。
设计弹性图片和多媒体。通过max-width: 100%和height: auto实现图片的弹性化。通过width: 100%和height: auto实现内嵌元素的弹性化。
字号自动调整的问题，通过-webkit-text-size-adjust:none禁用iPhone中Safari的字号自动调整。
第1步：新建HTML5类型文档，编写HTML代码。使用HTML5标签来更加语义化地实现这些结构，包括页头、主要内容部分、侧边栏和页脚。
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>无标题文档</title>
</head>
<body>
<div id="pagewrap">
     <header id="header">
         <hgroup>
             <h1 id="site-logo">Demo</h1>
             <h2 id="site-description">Site Description</h2>
         </hgroup>
         <nav>
             <ul id="main-nav">
                  <li><a href="#">Home</a></li>
             </ul>
         </nav>
         <form id="searchform">
              <input type="search">
         </form>
     </header>
     <div id="content">
         <article class="post"> blog post </article>
     </div>
     <aside id="sidebar">
         <section class="widget"> widget </section>
     </aside>
     <footer id="footer"> footer </footer>
</div>
</body>
</html>
第2步：IE是永恒的话题，对于HTML5标签，IE9之前的版本无法提供支持。目前的最佳解决方案仍是通过html5.js来帮助这些旧版本的IE浏览器创建HTML5元素节点。因此，这里添加如下兼容技法，调用该JS文件。
<!--[if lt IE 9]>
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
第3步：设计HTML5块级元素样式。首先仍是浏览器兼容问题，虽然经过上一步努力已经可以在低版本的IE中创建HTML5元素节点，但还是需要在样式方面做些工作，将这些新元素声明为块级样式。
article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section {
        display: block;
}
第4步：设计主要结构的CSS样式。这里将忽略细节样式设计，而将注意力集中在整体布局上。整体设计在默认情况下页面容器的固定宽度为980像素，页头部分（header）的固定高度为160像素，主要内容部分（content）的宽度为600像素，左浮动。侧边栏（sidebar）右浮动，宽度为280像素。
<style type="text/css">
#pagewrap {
     width: 980px;
     margin: 0 auto;
}
#header { height: 160px; }
#content {
     width: 600px;
     float: left;
}
#sidebar {
     width: 280px;
     float: right;
}
#footer { clear: both; }
</style>
第5步：初步完成了页面结构的HTML和默认结构样式，当然，具体页面细节样式就不再烦琐，读者可以参考本节的示例源代码。
此时预览页面效果，由于还没有做任何Media Query方面的工作，页面还不能随着浏览器尺寸的变化而改变布局。在页面中调用css3-mediaqueries.js文件，解决IE8及其以前版本支持CSS3 Media Query。
<!--[if lt IE 9]>
      <script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.
　　   js"></script>
<![endif]-->
第6步：创建CSS样式表，并在页面中调用：
<link href="media-queries.css" rel="stylesheet" type="text/css">
第7步：借助Media Query技术设计响应式布局。
当浏览器可视部分宽度大于650px、小于980px时（流式布局），将pagewrap的宽度设置为95%，将content的宽度设置为60%，将sidebar的宽度设置为30%。
@media screen and (max-width: 980px) {
   #pagewrap { width: 95%; }
   #content {
       width: 60%;
       padding: 3% 4%;
   }
   #sidebar { width: 30%; }
   #sidebar .widget {
       padding: 8% 7%;
       margin-bottom: 10px;
   }
}
第8步：当浏览器可视部分宽度小于650px时（单栏布局），将header的高度设置为auto；将searchform绝对定位在top: 5px的位置；将main-nav、site-logo、site-description的定位设置为static；将content的宽度设置为auto（主要内容部分的宽度将扩展至满屏），并取消float设置；将sidebar的宽度设置为100%，并取消float设置。
@media screen and (max-width: 650px) {
   #header { height: auto; }
   #searchform {
        position: absolute;
        top: 5px;
        right: 0;
   }
   #main-nav { position: static; }
   #site-logo {
        margin: 15px 100px 5px 0;
        position: static;
   }
   #site-description {
        margin: 0 0 15px;
        position: static;
   }
   #content {
        width: auto;
        float: none;
        margin: 20px 0;
   }
   #sidebar {
        width: 100%;
        float: none;
        margin: 0;
   }
}
第9步：480px是iPhone横屏时的宽度，当浏览器可视部分的宽度小于该数值时，禁用HTML节点的字号自动调整。默认情况下，iPhone会将过小的字号放大，这里可以通过-webkit-text-size-adjust属性进行调整。将main-nav中的字号设置为90%。
@media screen and (max-width: 480px) {
 html {
        -webkit-text-size-adjust: none;
 }
 #main-nav a {
         font-size: 90%;
         padding: 10px 8px;
 }
}
第10步：设计弹性图片。为图片设置max-width: 100%和height: auto，实现其弹性化。对于IE，仍然需要做一点额外的工作。
img {
  max-width: 100%;
  height: auto;
   width: auto\9; /* ie8 */
}
第11步：设计弹性内嵌视频。对于视频也需要做max-width: 100%的设置，但是Safari对embed的该属性支持不是很好，所以使用以width: 100%来代替。
.video embed,.video object,.video iframe {
     width: 100%;
     height: auto;
     min-height: 300px;
}
第12步：iPhone中的初始化缩放。在默认情况下，iPhone中的Safari浏览器会对页面进行自动缩放，以适应屏幕尺寸。这里可以使用以下的meta设置，将设备的默认宽度作为页面在Safari的可视部分宽度，并禁止初始化缩放。
<meta name="viewport" content="width=device-width; initial-scale=1.0">



Bootstrap 3 Snippets 插件
CDN
Component	Snippet code
CDN link (both CSS & JS)	bs3-cdn
CDN link (CSS only)	bs3-cdn:css
CDN link (JS only)	bs3-cdn:js
Local
Component	Snippet code
Link to local bootstrap files	bs3-local
Templates
Component	Snippet code
HTML5 Template Layout	bs3-template:html5
Forms
Component	Snippet code
Form	bs3-form
Inline Form	bs3-form:inline
Horizontal Form	bs3-form:horizontal
Tables
Component	Snippet code
Table	bs3-table
Bordered Table	bs3-table:bordered
Condensed Table	bs3-table:condensed
Hover Table	bs3-table:hover
Striped Table	bs3-table:striped
Input Fields (Form fields)
Note: you can add " :h " to the end of any input field snippet to make it compatible with Bootstrap 3 horizontal forms. E.g.
bs3-input:text:h
bs3-input:hidden:h
Component	Snippet code	Options
Label	bs3-input:label	
Text Input	bs3-input:text	:h
Email Input	bs3-input:email	:h
Password Input	bs3-input:password	:h
Hidden Input	bs3-input:hidden	:h
Url Input	bs3-input:url	:h
Color Input	bs3-input:color	:h
Number Input	bs3-input:number	:h
Range Input	bs3-input:range	:h
Date Input	bs3-input:date	:h
Week Input	bs3-input:week	:h
Month Input	bs3-input:month	:h
Time Input	bs3-input:time	:h
Tel Input	bs3-input:tel	:h
Search Input	bs3-input:search	:h
Reset Input	bs3-input:reset	:h
Submit Input	bs3-input:submit	:h
Checkbox Input	bs3-input:checkbox	:h
Radio Box Input	bs3-input:radio	:h
Select Box	bs3-select	:h
Textarea	bs3-textarea	:h
Alerts
Component	Snippet code
Alert Box (Default)	bs3-alert
Danger Alert Box	bs3-alert:danger
Info Alert Box	bs3-alert:info
Success Alert Box	bs3-alert:success
Warning Alert Box	bs3-alert:warning
Badges
Component	Snippet code
Badge (Default)	bs3-badge
Breadcrumbs
Component	Snippet code
Breadcrumbs	bs3-breadcrumbs
Carousel
Component	Snippet code
Carousel	bs3-carousel
Buttons
Note: all button snippets below can have any of the following options append to the end of the snippet *.
:danger
:default
:disabled
:info
:primary
:success
:warning
An example:
bs3-button:success
bs3-large-button:disabled
bs3-block-button:warning
Component	Snippet code	Options
Button	bs3-button	*
Block Button	bs3-block-button	*
Mini Button	bs3-xs-button	*
Small Button	bs3-sm-button	*
Large Button	bs3-lg-button	*
Grid
Note: The bs3-col snippet can be used both on its own or with the addition of a colon followed by the number of columns required: E.g.
bs3-col
bs3-col:6
bs3-col:12
Component	Snippet code	Options
Column	bs3-col	:1-12
Row	bs3-row	
Container	bs3-container	
Icons
Component	Snippet code
Glyphicon	bs3-icon:glyphicon
Icon (Font Awesome)	bs3-icon
Images
Component	Snippet code
Thumbnail	bs3-thumbnail
Thumbnail with content	bs3-thumbnail:content
Labels
Component	Snippet code
Label	bs3-label
Danger Label	bs3-label:danger
Info Label	bs3-label:info
Success Label	bs3-label:success
Warning Label	bs3-label:warning
Pagination
Component	Snippet code
Pager	bs3-pager
Aligned Pager	bs3-pager:aligned
Pagination	bs3-pagination
Pagination:small	bs3-pagination:sm
Pagination:large	bs3-pagination:lg
Navigation
Component	Snippet code
Navbar (basic navbar)	bs3-navbar
Navbar Brand Element	bs3-navbar:brand
Navbar Button	bs3-navbar:button
Navbar Form	bs3-navbar:form
Navbar Link	bs3-navbar:link
Navbar Text	bs3-navbar:text
Navbar Fixed-Botton	bs3-navbar:fixed-bottom
Navbar Fixed-Top	bs3-navbar:fixed-top
Navbar Inverse	bs3-navbar:inverse
Navbar Responsive	bs3-navbar:responsive
Navbar Static-Top	bs3-navbar:static-top
Jumbotron
Component	Snippet code
Jumbotron (ex Hero Unit)	bs3-jumbotron
Panels
Component	Snippet code
Panel	bs3-panel
Panel (contextual)	bs3-panel:{warning,success,info,danger,primary}
Panel (with heading)	bs3-panel:heading
Panel (with footer)	bs3-panel:footer
List-groups
Component	Snippet code
List group	bs3-list-group
List group (with badges)	bs3-list-group:badges
List group (linked list)	bs3-list-group:linked
List group (with content)	bs3-list-group:content
Media Objects
Component	Snippet code
Media Object	bs3-media-object
Clearfix
Component	Snippet code
Clearfix	bs3-clearfix
Wells
Component	Snippet code
Well	bs3-well
Well (small)	bs3-well:sm
Well (large)	bs3-well:lg
Tabs
Component	Snippet code
Tabs pane	bs3-tabs
Input-groups
Component	Snippet code
Input group	bs3-input-group
Input group(addon & text-field)	bs3-input-group:addon:text
Input group (addon)	bs3-input-group-addon
Input group (button)	bs3-input-group-btn
Input group (text-field & btn)	bs3-input-group:text:btn



