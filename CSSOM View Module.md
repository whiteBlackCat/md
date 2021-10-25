Window视图属性
1.innerWidth 属性和innerHeight 属性
窗体的内部宽度，不包括用户界面元素，比如窗框
  innerWidth 属性和innerHeight 属性
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
						即将测试


2.outerWidth属性和outerHeight属性
整个浏览器窗体的大小，包括任务栏等
outerWidth属性和outerHeight属性
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
						即将测试

3.pageXOffset和pageYOffset   
整个页面滚动的像素值（水平方向的和垂直方向的）

pageXOffset属性和pageYOffset属性
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
						即将测试


4. screenX and screenY
浏览器窗口在显示器中的位置
screenX属性和screenY属性
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					不正确	即将测试



二、Screen视图属性
1. availWidth和availHeight
显示器可用宽高，不包括任务栏





availWidth属性和availHeight属性
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试



2. colorDepth
表示显示器的颜色深度。兼容性参见下表：
colorDepth
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
		不正确				即将测试

PS：一般浏览器（包括低版本IE）都返回32，因为现在的浏览器一般都支持透明通道的。但是，FireFox 3.6 一直到现在的FireFox 6浏览器screen.colorDepth返回的却是24。


3. pixelDepth
该属性基本上与colorDepth一样。其兼容性如下表：
pixelDepth
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
			不正确				即将测试



4. width和height
表示显示器屏幕的宽高。其兼容性还是很不错的，参见下表：
width属性和height属性
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试



















三、文档视图(DocumentView)和元素视图(ElementView)方法
1. elementFromPoint()
返回给定坐标处所在的元素。是个在目前而言，兼容性不错的方法
elementFromPoint()
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
		不正确			不正确		即将测试



2.getBoundingClientRect()
得到矩形元素的界线，返回的是一个对象，包含 top, left, right, 和 bottom四个属性值，大小都是相对于文档视图左上角计算而来

getBoundingClientRect()
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.5	FF 3.6	FF 4b1	FF 6	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
						即将测试






3. getClientRects()
返回元素的数个矩形区域，返回的结果是个对象列表，具有数组特性（显示的个数就是文字的行数）。这里的矩形选区只针对inline box，因此，只针对a, span, em这类标签元素
getClientRects()
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.5	FF 3.6	FF 4b1	FF 6	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
有bug		 部分支持					即将测试



4. scrollIntoView()
让元素滚动到可视区域（不属于草案方法）
scrollIntoView()
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试









四、元素视图属性
1. clientLeft和clientTop
表示内容区域的左上角相对于整个元素左上角的位置（包括边框）。其兼容性不错，如下：
clientLeft和clientTop
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试



2. clientWidth和clientHeight
内容区域的高度和宽度，包括padding大小，但是不包括边框和滚动条。
clientWidth和clientHeight
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试







3. offsetLeft和offsetTop
表示相对于最近的祖先定位元素（CSS position 属性被设置为 relative、absolute 或 fixed 的元素）的左右偏移值。
offsetLeft和offsetTop
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试




4. offsetParent
第一个祖定位元素（即用来计算上面的offsetLeft和offsetTop的元素），兼容性让人欣慰：
offsetParent
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试
offsetParent元素只可能是下面这几种情况：
<body>
position不是static的元素
<table>, <th> 或<td>，但必须要position: static。


5. offsetWidth和offsetHeight
整个元素的尺寸（包括边框）。兼容性与上面一致：
offsetWidth和offsetHeight
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试



6. scrollLeft和scrollTop
表示元素滚动的像素大小。可读可写。这个玩意貌似我们用得比较多。兼容性还是可以的：
scrollLeft和scrollTop
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试




6.scrollWidth和scrollHeight
表示整个内容区域的宽高，包括隐藏的部分。如果元素没有隐藏的部分，则相关的值应该等用于clientWidth和clientHeight。当你向下滚动滚动条的时候，scrollHeight应该等用于scrollTop + clientHeight。
兼容性有些微妙：
scrollWidth和scrollHeight
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
不正确					不正确	 部分	即将测试





















五、鼠标位置(Mouse position)

1. clientX,clientY
相对于window，为鼠标相对于window的偏移。在iphone上，这对值返回的位置就等同于下面要提到的pageX/Y。兼容性不赖：
clientX,clientY
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试


2. offsetX, offsetY
表示鼠标相对于当前被点击元素padding box的左上偏移值，各个浏览器的兼容性五花八门，如下：
offsetX, offsetY
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
有bug			border box	border box	content box	即将测试







3. pageX, pageY
为鼠标相对于document的坐标。IE6~IE8浏览器是不支持的。如下：
pageX, pageY
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
						即将测试


4. screenX, screenY
鼠标相对于显示器屏幕的偏移坐标。久违的兼容性过得去的属性：
sscreenX, screenY
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.0	FF 3.5	FF 3.6	FF 4b1	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
					即将测试



5. x, y
相当于clientX/clientY。既然已经有了clientX/clientY，为什么还需要x, y呢？莫非是为了少写几个字母？谁知道呢！
x, y
IE 5.5	IE 6	IE 7	IE8	IE9 pr3	FF 3.5	FF 3.6	FF 4b1	FF 6	Saf 4.0 Win	Saf 5.0 Win	Chrome 4	Chrome 5	Opera 10.10	Opera 10.53	Opera 10.60	Konqueror 4.x
	page X/Y					即将测试



