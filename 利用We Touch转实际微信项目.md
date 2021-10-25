清除组件自带样式:
ui-input组件: 实际渲染 => div.ui-input>input.ui-input-inner.input-placeholder
	微信有WeTouch没有: 
		.input-placeholder 在 input 上: 实际修改样式使用.input-placeholder::-webkit-input-placeholder

ui-picker组件: =>div.ui-cell-box>div.weui-cell__hd + (div.ui-cell-primary.ui-picker-select-box>div.ui-picker-select>span.ui-popup-picker-value) + div.weui-cell__ft
	就是说使用cell组件包裹了一层
	
ui-image: div.ui-image-container>img.ui-image
	多了懒加载控制,及图片预览(previewer组件)的配合使用
	img VS image: 统一做块盒,添加mode="aspectFit",使用外容器控制图片大小
	mode="aspectFit" 会为.ui-image-container添加style="display:cell" 日了狗了
	
ui-swiper>ui-swiper-item:div.ui-swiper>div.ui-swiper-group>div.ui-swiper-item
	没有特别样式  作为框架设置.ui-swiper .ui-swiper-group .ui-swiper-item这样的样式还让不改了
	
ui-map: style内height:400px


默认盒模型:border-box  注意w,h及p混合使用情况
ui-virtual-input: 
	感觉不错:不能输入中文,特殊功能如:小数,身份证,安全数字虚拟
	
事件对象e发生变化:
	表单事件的e只有detail内容,其余没有
	form的submit事件e 等同于微信e.detail.value
	input的input事件e 等同于微信e.detail.value
	input的blur事件e 接近浏览器
	tap事件 至少能使用dataset(同微信)
	picker的change事件e只有值
	
this.setData方法仍可用

动态样式只能使用vue,不能微信   只能外双引号,内单引号

页面跳转穿参:
	由于没有page实例,由getCurrentPage()获取的page页面都需要重新考虑,(目前唯一的稍微较好的方式是在app.globalData内保存使用,使用完就删除)
	
缓存:一旦开启缓存,无论从何处访问该页均留下变量数据,没有开启则均没有,需要考虑使用场景(与app不同)

图标使用阿里图标库: 统一使用规范

require的模块(使用export default导出)会有default中间路径

hidden 与flex布局不能同用
wx.showModal 与 ui.showConfirm最接近


flyio: 使用别名后 options内的headers总是无效???