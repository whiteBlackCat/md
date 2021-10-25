包含块（Containing Block）视觉格式化模型的一个重要概念，为包含元素提供位置，尺寸计算作参考(不会被其所限)
形成(live)条件：
  1.根元素（初始包含块）：根元素html
  2.对于其它元素：position为relative/static，包含块由它最近的块级、单元格（table cell）或者行内块（inline-block）祖先元素的内容框创建。
3.如果元素position: fixed，包含块由视口创建。
4.如果元素position: absolute，包含块由最近的position为absolute、relative或fixed的祖先元素创建，无则：
.如果祖先元素是行内元素，direction决定起始：
.否则，祖先的补白边形成包含块
.如果不存在这样的祖先元素，则元素的包含块为初始包含块

子box尺寸>containing block尺寸，则子box溢出CB(显示效果由overflow属性值决定)

Box 是 CSS 布局的对象和基本单位   元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器,它决定了其子元素将如何定位，以及和其他元素的关系和相互作用）

block-level box:display 属性为 block, list-item, table 的元素，会生成 block-level box
inline-level box:display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box

BFC布局规则：
内部的Box会在垂直方向一个接一个地放置
(非块级box会在相邻的所有集合外层生成一个匿名的块级盒参与排布)
Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠每个元素的margin box的左边， 与包含块border box的左边相接触(不修改默认排布方向时)。即使存在浮动也是如此
BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。(作用:BFC的区域不会与float box重叠（可用此分列）;计算BFC的高度时，浮动元素也参与计算)

！！！block元素不一定是BFC

生成BFC条件:
根元素
float属性不为none
position为absolute或fixed
display为inline-block, table-cell, table-caption, flex, inline-flex
overflow不为visible
相邻margin条件:
1.处于常规文档流（非float和绝对定位）的块级盒子,并且处于同一个BFC当中。
2.没有线盒，没有空隙，没有padding和border将他们分隔开都属于垂直方向上相邻的外边距，可以是:
元素的margin-top/bottom与其第一/最后一个常规文档流的子元素的margin-top/bottom
元素的margin-bottom与其下一个常规文档流的兄弟元素的margin-top

正常流中有两种格式化上下文：块级格式化上下文（block formatting context，简称BFC）和行内格式化上下文（inline formatting context,IFC）.在块级格式化上下文中，盒呈纵向排布，在行内格式化上下文中，盒则呈横向排布。

有一类盒被称为块容器，它们能够包含块级盒。块容器要么创建块级格式化上下文，这样它内部仅仅包含块级盒，要么创建一个行内格式化上下文，这样它内部仅仅包含行内级元素。（也就是说，块容器中不可能既包含块级盒，又包含行内级盒，一旦他的子盒中有块级盒，所有行内级盒都会被自动创建匿名盒包裹）。

在非块级格式化上下文中的块容器总是会创建新的块级格式化上下文：如display为inline-blocks, table-cells, 和table-captions所生成的盒。而自身也在块级格式化上下文中的块容器，则只有overflow不为visible的情形下才会创建新的块级格式化上下文。

Display:[|inline][grid|table]特殊格式化
Ffc:（flex formatting context）自适应格式化上下文  display值为flex或者inline-flex

在BFC分列布局中若要间距，此时只能给浮动元素margin（非浮动元素margin效果与非BFC下一样，从contain边算）

自适应布局:
1.overflow:auto/hidden IE7+
2.display:inline-block IE6/IE7
3.display:table-cell IE8+

Display:table会生成display:table-cell的盒子

