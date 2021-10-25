border-radius不允许负数（失效）最大50%大于
Clip：rect (top, right, bottom, left)|auto|inherit  裁剪窗口（目标）距左上距离（left>right 区域为0）窗口外内容不显示（内容应指文字，图片 背景不算）注意！！！目前试验知需配合position:absolute/fixed;
图片合并技术（css Sprite）许多小图整合到大图（节省资源）。IE6不支持Alpha透明通道的png图片（表现蓝背景），尽管filter可修复（却不支持背景定位？）。此时考虑img配合clip属性
background-position的百分比：bgi与box的差值取为100%
Border 不设颜色为initial，会与字体同色
Background：none清默认（默认不总是无属性）
Webkit-appearance  修改成各种默认样式外观，如按钮（不规范属性 ）

Placeholder  颜色修改：
WebKit和Blink：::-webkit-input-placeholder 
Mozilla Firefox 19+：::-moz-placeholder 
IE10: :-ms-input-placeholder 

img内容部分（同结构加载），background-image（晚）修饰性。
图片类型：base64  雪碧图（减少http请求） webp（压缩比稿） svg
使用方式：普通图片（无任何要求） 等宽高比
Q：图片加载延迟导致页面抖动
A：利用padding占位（以%形式，注意宽高比，图片绝对定位）
优化总结：
1减少请求 图片大小  注意清晰度
懒加载：将图片的真实地址缓存在一个自定义的属性(lazy-src)中，而src地址使用一个1×1的全透明的占位图片来代替，当然占位图片也可以是其他的图片。

在水平方向，文字的排布主要受到以下属性影响
·word-break, word-spacing, word-wrap
·letter-spacing
·white-space
·text-align
·hyphenate-character, hyphenate-limit-after, hyphenate-limit-before, hyphenate-limit-lines, hyphens
·justify-content
在纵向，文本排布主要受line-height属性影响，在有行内盒参与的情况下就复杂了，

一个行内盒的vertical-align可以有这样几种取值：
baseline sub super top text-top middle bottom text-bottom 

link与@import
引入样式表    style内@import url(‘.css’)  要求最上方
问题：同时使用两种方式在ie6,7,8非并行下载；
      Link的样式表中含@import时所有浏览器不并行下载（ie下该表甚至最后加载）
  有script标签时，在ie内script比import先下载
Shorthand properties：复合属性 未提供的属性则默认（注意覆盖）

Trident（IE）、Gecko（firefox）、Presto（opera）、Webkit（safari，chrome）

background: radial-gradient(center, shape, size, start-color, ..., last-color);
center：渐变起点的位置，可以为百分比，默认是图形的正中心。
shape：渐变的形状，ellipse表示椭圆形，circle表示圆形。默认为ellipse
size：渐变到哪里停止 closest-side：最近边； farthest-side：最远边； closest-corner：最近角； farthest-corner：最远角
div { background: radial-gradient(red 5%, green 15%, blue 60%); }不均匀变色


a的color属性：
当a无href时可继承（此时不具有锚点作用），有href时不可继承，color：inherit在IE7以下不支持

Css nesting用法：建议在同一个选择器上
.btn{
:hover{}
:link{}
}
不建议为省字节而在父子级selector上使用（不便于搜索） 
&用法：快速代替父级selector



滚动条消失：
html { -ms-overflow-style:none; overflow:-moz-scrollbars-none; }
html::-webkit-scrollbar{width:0px}//滚动条样式

Input具有padding，border，width，height默认样式
Input的type值：
Color：调色板  值以url编码，如%23000000
Tel：手机端唤出数字键盘，同text
Email：手机端唤出英文键盘，同text
Search、Url：同text
Number：手机端唤出键盘，同text
Range：同number
Date,month,week,time,datetime,datetime-local

表单共有属性（filedset外）：
Disabled（表单提交后禁用可防止重复提交），form，name，readOnly，tabIndex，type，value
单选type“select-one”  多选type“select-multiple” 
<button><button type=”submit”>  type“submit”  会触发提交
<button type=”button”>type”button”  reset-reset  不会触发提交

Text Autosizer/Font Boosting/Font inflation:webkit在移动端特性， 原始页面较大，内容较小，自动提升字体大小
仅在未限定尺寸的文本流中有效，给元素指定宽高，就可以避免 Font Boosting 被触发。Max-height无副作用替换

input type="hidden"的作用
1、收集或发送信息
2、确定用户身份 比cookie简单，实用性更强
3、onclick="document.form.command.value="xx""区分按钮值
4、沟通不同form
5、沟通窗口

meta标签的作用有：
搜索引擎优化（SEO），定义页面使用语言，自动刷新并指向新的页面，实现网页转换时的动态效果，控制页面缓冲，网页定级评价，控制网页显示的窗口
name属性
用法：<meta name="参数"content="具体的参数值">便于搜索引擎机器人查找信息和分类信息
主要属性：
Keywords，description，robots（all,none,index,noindex,follow,nofollow 主要就是文件，链接是否可被查询），author，generator（软件制作），COPYRIGHT，revisit-after
http-equiv：
Expires，Pragma（cache模式），Refresh，Set-Cookie(cookie设定)，Window-target(显示窗口的设定)，content-Type(显示字符集的设定)，content-Language（显示语言的设定）
Cache-Control
（Cache-Control指定请求和响应遵循的缓存机制。在请求消息或响应消息中设置Cache-Control并不会修改另一个消息处理过程中的缓存处理过程。请求时的缓存指令包括no-cache、no-store、max-age、max-stale、min-fresh、only-if-cached，响应消息中的指令包括public、private、no-cache、no-store、no-transform、must-revalidate、proxy-revalidate、max-age。各个消息中的指令含义如下
Public指示响应可被任何缓存区缓存
Private指示对于单个用户的整个或部分响应消息，不能被共享缓存处理。这允许服务器仅仅描述当用户的部分响应消息，此响应消息对于其他用户的请求无效
no-cache指示请求或响应消息不能缓存
no-store用于防止重要的信息被无意的发布。在请求消息中发送将使得请求和响应消息都不使用缓存。
max-age指示客户机可以接收生存期不大于指定时间（以秒为单位）的响应
min-fresh指示客户机可以接收响应时间小于当前时间加上指定时间的响应
max-stale指示客户机可以接收超出超时期间的响应消息。如果指定max-stale消息的值，那么客户机可以接收超出超时期指定值之内的响应消息。）
Imagetoolbar（是否显示图片工具栏），Content-Script-Type（脚本的类型）

动态网页需结合数据库等  以asp，php等后缀  降低维护工作量   登录，注册，管理 由服务器合成

Img易等比缩放 VS text,background

css部分选择器的特殊性
id值：0,1,0,0
类属性值/属性选择器/伪类：0,0,1,0
元素和伪元素：0,0,0,1

Vw

Object Oriented CSS  主要原则：  分离结构和皮肤 / 容器和内容
CSS格式
1. OOCSS，双class，如：class="box box-#"，基本的CSS样式在class box中，然后直添加背景样式在唯一的class中。
2. Sass @extend ，一个class，如class="box-3"，然后在基本规则上创建一个多选择器规则，如.box-1, .box-2 {generics}。
3. 嚣张的CSS 添加所有的基本CSS到一个唯一的class上，没有“瘦身”。


资源加载优化:
按需加载(评估业务),Lazyload,滚屏加载,Media Query,第三方资源异步加载
Loading进度条;
Favicon.ico:默认的图标：域名目录下的favicon.ico
图片:精灵图,html大小重设,iconfont css svg
服务器:Gzip压缩,长cache,静态资源域名(减少cookie),CDN加速
代码:合并,压缩,更新策略
接口:合并

单页应用,离线资源,预加载
版本管理:
首次加载不可避免，还是会请求网络。
服务端有更新的时候，客户端不能够快速感知，页面可能还停留在一个“旧的版本”上，尤其是网络速度较慢时，可能还是需要经过好几秒，页面才会更新至最新版本。因此如果应用对数据的新旧很敏感的话，这种方案就不适合
数据更新后，需要重新渲染界面，界面刷新的性能消耗比正常情况更多，而且增加了程序的复杂度，容易出错。

css的charset:
1.An HTTP "charset" parameter in a "Content-Type" field (or similar parameters in other protocols)
2.BOM and/or @charset (see below) 例@charset "ISO-8859-1";
3.<link charset=""> or other metadata from the linking mechanism (if any)
4.charset of referring style sheet or document (if any)
5.Assume UTF-8

导入外部字体:
@font-face {
    font-family: 'DistantGalaxyRegular'; // 在对外使用时的字体名
    src: url('font/distgrg_-webfont.eot'); // 默认字体来源
    src: url('font/distgrg_-webfont.eot?#iefix') format('embedded-opentype'), // 可选字体来源
         url('font/distgrg_-webfont.woff') format('woff'),
         url('font/distgrg_-webfont.ttf') format('truetype'),
         url('font/distgrg_-webfont.svg#DistantGalaxyRegular') format('svg');
    font-weight: normal;
    font-style: normal;
}

常用html字体:
font-family:Cambria, Georgia, serif;
font-family:'Arial Narrow', Arial, Helvetica, sans-serif;
12px Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif

伪元素选择器内如:content:’\e614’引入字体图标
猜测这些是由引入的图标库内已经编辑完,只需使用即可

wbr软换行:
实际用处:对于一个由多个单词组合成的长文本(如CanvasRenderingContext2D.globalCompositeOperation)在宽度不够时,需要足够灵活的换行方式以达到方便阅读的效果.这是只需在各单词结合点手动添加<wbr>如:Canvas<wbr>Rendering<wbr>Context2D<wbr>.global<wbr>Composite<wbr>Operation

word-break:break-all 允许任意非CJK(Chinese/Japanese/Korean)文本间的单词断行
word-wrap:break-word   overflow-wrap则是css3上其替代品
两者区别: 前者会拆分单词,后者不会

设置Opacity小于1的值,该层在便在普通层之上(普通层按文档流顺序),在position层之下

堆栈上下文
一组具有共同双亲的元素，按照堆栈顺序一起向前或向后移动构成了所谓的堆栈上下文。充分理解堆栈上下文是真正掌握z-index和堆栈顺序工作原理的关键。

每 一个堆栈上下文都有一个HTML元素作为它的根元素。当一个新的堆栈上下文在一个元素上形成，那么这个堆栈上下文会限制所有的子元素以堆栈的顺序存储在一 个特别的地方。那意味着一旦一个元素被包含在处于底部堆栈顺序的堆栈上下文中，那么就没有办法先出现于其他处于更高的堆栈顺序的不同堆栈上下文元素，就算 z-index值是十亿也不行！

现在，堆栈上下文有三种方法可以在一个元素上形成：

当一个元素是文档的根元素时（<html>元素）
当一个元素有一个position值而不是static，有一个z-index值而不是auto
当一个元素有一个opacity值小于1
前两种形成堆栈上下文的方法具有很大意义并且被广大Web开发者所理解（即使他们不知道这些被叫做什么）。第三种方法（opacity）几乎从来没在w3c说明文档之外被提及过。

在同样的堆栈上下文里的堆栈顺序
下面是几条基本的规则，来决定在一个单独的堆栈上下文里的堆栈顺序（从后向前）：

堆栈上下文的根元素
定位元素（和他们的子元素）带着负数的z-index值（高的值被堆叠在低值的前面；相同值的元素按照在HTML中出现的顺序堆叠）
非定位元素（按照在HTML中出现的顺序排序）
定位元素（和他们的子元素）带着auto的z-index值（按照在HTML中出现的顺序排序）
定位元素（和他们的子元素）带着正z-index值（高的值被堆叠在低值的前面；相同值的元素按照在HTML中出现的顺序堆叠）
注 解：定位元素带有负的z-index值被在一个堆栈上下文中先排序，这意味着他们出现在所有其他元素的后面。正因如此，它使一个元素出现在自己父元素之后 成为可能，这以前通常是不可能的事。当然，这局限于它的父元素与它在同一个堆栈上下文，并且不是那个堆栈上下文的根元素。一个伟大的例子如Nicolas Gallagher的CSS不用图像降低阴影。

background-image:linear-gradient([<angle> | to <side-or-corner>]? , <color-stop-list>)
angle支持: deg、rad、grad或turn
side-or-corner支持: top、right、bottom、left、left top、top right、bottom right或者left bottom
color-stop: <color length>形式
大小: border-box或者background-size
位置: background-position

垂直方向居中:flex,inline-block
父级添加伪类:height:100%,display:inline-block;vertical-align:middle  
子元素:display:inline-block;vertical-align:middle

去滚动条: html,body{width:100%;height:100%;overflow:hidden}

层叠样式规则：
1、找出所有匹配选择符的声明
2、显示权重排序（！important具有更高权重）
3、特殊性排序
4、声明顺序排序

每英寸的实际像素值（ppi）

字体系列：
serif（成比例，有衬线）：Times，Garamond，New Century Schoolbook   
Sans serif（比例，无衬线）Helvertica，Geneva，Verdant，Arial，Univers
Mono space（无比例）Courier，Andale Mono   
Cursive（模拟）Zapf Chancery，Author，Comic Sans    Fantasy

auto：流体特性根据剩余分配   当限制过于约束时，后侧（这根书写方向有关）被强制设成auto   width与margin同设auto，margin优先变成0

负边界使得子元素可以大于父元素
行高作用于内容，无内容高度依旧为0     内联元素内容框不含行高
overflow-clip:rect(上，右，下，左)|auto|inherit    适用块级元素，带溢出内容的替换元素   决定溢出内容影藏范围
z-index层叠顺序：同级相比，后辈元素（不论z-index高低）与相应先代元素分组在一起（使得同级高的，后代永远高）
display：compact 足够空间就显示下一个元素？？？   run-in：两个块级元素拼合成一个块级（其中内容以内联元素处理）
font-size-adjust不同字体近似大小    font-stretch字体宽度调整



label的for属性与表单的id属性结合应用1:
上传input隐藏(display及.clip类名),label添加样式
    .clip {  
      position: absolute;
      clip: rect(0 0 0 0);
    }

		.btn {
			padding: 1em 2em;
			border: 2px solid;
			border-bottom-width: 4px;
			transition: color 1s;
		}
		.btn4 {
			color: #eea163;
		}

		.btn4:hover {
			animation: zigzag 1s linear infinite;
			background:
				linear-gradient(135deg, rgba(238, 161, 99, .25) .25em, transparent .25em) -.5em 0,
				linear-gradient(225deg, rgba(238, 161, 99, .25) .25em, transparent .25em) -.5em 0,
				linear-gradient(315deg, rgba(238, 161, 99, .25) .25em, transparent .25em) 0 0,
				linear-gradient(45deg, rgba(238, 161, 99, .25) .25em, transparent .25em) 0 0;
			background-size: 0.75em 0.75em;
			color: #63b0ee;
		}

		@keyframes zigzag {
			to {
				background-position: 1em 0, 1em 0, -0.75em 0, -0.75em 0;
			}
		}

		.btn6 {
			color: #f9879b;
		}

		.btn6:hover {
			animation: pulse 1s ease-in infinite;
			background: radial-gradient(circle, rgba(249, 135, 155, .25) 43%, rgba(0, 0, 0, 0) 50%) 0 0/1em 1em, radial-gradient(circle, rgba(249, 135, 155, .25) 43%, rgba(0, 0, 0, 0) 50%) .5em .5em/2em 2em;
			color: #0bdcb7;
		}

		@keyframes pulse {
			50% {
				background-position: 0.66em 0.66em, -0.33em -0.33em;
			}

			100% {
				background-size: 2em 2em, 1em 1em;
				background-position: -1.5em -1.5em, -1em -1em;
			}
		}

多行文本省略:
     width: 50px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;