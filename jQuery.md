jQuery(selector, [context]) = $(context).find(selector)
jQuery(html, props) 创建带属性的元素
:contains("王五") 包含特定文本的选择器
is(':visible')/is(':animated') 判断可见/动画状态
$('div:gt(1)'):解析过程
  获取所有div 在进行gt选择器判断 true留下
  gt源码 gt:function(a,i,m) {} a当前DOM  i索引  m数组jQuery正则解析产物
  m[0]:进一步匹配内容 如:gt(1)  m[1]:选择器引导符 如':' m[2]:选择器函数 如gt
  m[3]:选择器参数 如1  m[4]:选择器参数中的所有参数(字符串和,包括两侧小括号)