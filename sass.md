Sass (Syntactically Awesome StyleSheets)
成熟、稳定、强大的 CSS 扩展语言
预处理提供特性:
1.变量: $前缀
2.折叠(nesting)
3.分块:@import文件如_partial.scss
4.Import:导入不产生http请求(被sass处理过,实际只有一整个文件) 不需扩展名
5.Mixins:
6.Extend
7.Operators: 


两种语法:
1.SCSS: CSS3 语法的扩充,支持css hacks及浏览器专属语法
2.Sass:缩排语法.通过缩排表嵌套,换行分隔属性
$ sass-convert style.sass style.scss   转换

使用:
1.命令行
2.独立Ruby模块
3.包含 Ruby on Rails 和 Merb 作为支持 Rack 的框架的插件

安装: gem install sass   (windows需安装Ruby)
运行Sass:
sass input.scss output.css
监视文件(支持目录)改动并更新css:
sass --watch input.scss:output.css

Ruby代码:
engine = Sass::Engine.new("#main {background-color: #0000ff}", :syntax => :scss)
engine.render #=> "#main { background-color: #0000ff; }\n"


Rack/Rails/Merb 插件:查文档

缓存:加快大量文件重编

选项
Options can be set by setting the {Sass::Plugin::Configuration#options Sass::Plugin#options} hash in environment.rb in Rails or config.ru in Rack...

Sass::Plugin.options[:style] = :compact
...or by setting the Merb::Plugin.config[:sass] hash in init.rb in Merb...

Merb::Plugin.config[:sass][:style] = :compact
...or by passing an options hash to {Sass::Engine#initialize}. All relevant options are also available via flags to the sass and scss command-line executables. Available options are:

{#style-option} :style : Sets the style of the CSS output. See Output Style.

{#syntax-option} :syntax : The syntax of the input file, :sass for the indented syntax and :scss for the CSS-extension syntax. This is only useful when you're constructing {Sass::Engine} instances yourself; it's automatically set properly when using {Sass::Plugin}. Defaults to :sass.

{#property_syntax-option} :property_syntax : Forces indented-syntax documents to use one syntax for properties. If the correct syntax isn't used, an error is thrown. :new forces the use of a colon after the property name. 例如： color: #0f3 or width: $main_width. :old forces the use of a colon before the property name. 例如： :color #0f3 or :width $main_width. By default, either syntax is valid. This has no effect on SCSS documents.

{#cache-option} :cache : Whether parsed Sass files should be cached, allowing greater speed. Defaults to true.

{#read_cache-option} :read_cache : If this is set and :cache is not, only read the Sass cache if it exists, don't write to it if it doesn't.

{#cache_store-option} :cache_store : If this is set to an instance of a subclass of {Sass::CacheStores::Base}, that cache store will be used to store and retrieve cached compilation results. Defaults to a {Sass::CacheStores::Filesystem} that is initialized using the :cache_location option.

{#never_update-option} :never_update : Whether the CSS files should never be updated, even if the template file changes. Setting this to true may give small performance gains. It always defaults to false. Only has meaning within Rack, Ruby on Rails, or Merb.

{#always_update-option} :always_update : Whether the CSS files should be updated every time a controller is accessed, as opposed to only when the template has been modified. Defaults to false. Only has meaning within Rack, Ruby on Rails, or Merb.

{#always_check-option} :always_check : Whether a Sass template should be checked for updates every time a controller is accessed, as opposed to only when the server starts. If a Sass template has been updated, it will be recompiled and will overwrite the corresponding CSS file. Defaults to false in production mode, true otherwise. Only has meaning within Rack, Ruby on Rails, or Merb.

{#poll-option} :poll : When true, always use the polling backend for {Sass::Plugin::Compiler#watch} rather than the native filesystem backend.

{#full_exception-option} :full_exception : Whether an error in the Sass code should cause Sass to provide a detailed description within the generated CSS file. If set to true, the error will be displayed along with a line number and source snippet both as a comment in the CSS file and at the top of the page (in supported browsers). Otherwise, an exception will be raised in the Ruby code. Defaults to false in production mode, true otherwise. Only has meaning within Rack, Ruby on Rails, or Merb.

{#template_location-option} :template_location : A path to the root sass template directory for your application. If a hash, :css_location is ignored and this option designates a mapping between input and output directories. May also be given a list of 2-element lists, instead of a hash. Defaults to css_location + "/sass". Only has meaning within Rack, Ruby on Rails, or Merb. Note that if multiple template locations are specified, all of them are placed in the import path, allowing you to import between them. Note that due to the many possible formats it can take, this option should only be set directly, not accessed or modified. Use the {Sass::Plugin::Configuration#template_location_array Sass::Plugin#template_location_array}, {Sass::Plugin::Configuration#add_template_location Sass::Plugin#add_template_location}, and {Sass::Plugin::Configuration#remove_template_location Sass::Plugin#remove_template_location} methods instead.

{#css_location-option} :css_location : The path where CSS output should be written to. This option is ignored when :template_location is a Hash. Defaults to "./public/stylesheets". Only has meaning within Rack, Ruby on Rails, or Merb.

{#cache_location-option} :cache_location : The path where the cached sassc files should be written to. Defaults to "./tmp/sass-cache" in Rails and Merb, or "./.sass-cache" otherwise. If the :cache_store option is set, this is ignored.

{#unix_newlines-option} :unix_newlines : If true, use Unix-style newlines when writing files. Only has meaning on Windows, and only when Sass is writing the files (in Rack, Rails, or Merb, when using {Sass::Plugin} directly, or when using the command-line executable).

{#filename-option} :filename : The filename of the file being rendered. This is used solely for reporting errors, and is automatically set when using Rack, Rails, or Merb.

{#line-option} :line : The number of the first line of the Sass template. Used for reporting line numbers for errors. This is useful to set if the Sass template is embedded in a Ruby file.

{#load_paths-option} :load_paths : An array of filesystem paths or importers which should be searched for Sass templates imported with the @import directive. These may be strings, Pathname objects, or subclasses of {Sass::Importers::Base}. This defaults to the working directory and, in Rack, Rails, or Merb, whatever :template_location is. The load path is also informed by {Sass.load_paths} and the SASS_PATH environment variable.

{#filesystem_importer-option} :filesystem_importer : A {Sass::Importers::Base} subclass used to handle plain string load paths. This should import files from the filesystem. It should be a Class object inheriting from {Sass::Importers::Base} with a constructor that takes a single string argument (the load path). Defaults to {Sass::Importers::Filesystem}.

{#line_numbers-option} :line_numbers : When set to true, causes the line number and file where a selector is defined to be emitted into the compiled CSS as a comment. Useful for debugging, especially when using imports and mixins. This option may also be called :line_comments. Automatically disabled when using the :compressed output style or the :debug_info/:trace_selectors options.

{#trace_selectors-option} :trace_selectors : When set to true, emit a full trace of imports and mixins before each selector. This can be helpful for in-browser debugging of stylesheet imports and mixin includes. This option supersedes the :line_comments option and is superseded by the :debug_info option. Automatically disabled when using the :compressed output style.

{#debug_info-option} :debug_info : When set to true, causes the line number and file where a selector is defined to be emitted into the compiled CSS in a format that can be understood by the browser. Useful in conjunction with the FireSass Firebug extension for displaying the Sass filename and line number. Automatically disabled when using the :compressed output style.

{#custom-option} :custom : An option that's available for individual applications to set to make data available to {Sass::Script::Functions custom Sass functions}.

{#quiet-option} :quiet : When set to true, causes warnings to be disabled.

Syntax Selection
The Sass command-line tool will use the file extension to determine which syntax you are using, but there's not always a filename. The sass command-line program defaults to the indented syntax but you can pass the --scss option to it if the input should be interpreted as SCSS syntax. Alternatively, you can use the scss command-line program which is exactly like the sass program but it defaults to assuming the syntax is SCSS.

Encodings
When running on Ruby 1.9 and later, Sass is aware of the character encoding of documents. By default, Sass assumes that all stylesheets are encoded using whatever coding system your operating system defaults to. For many users this will be UTF-8, the de facto standard for the web. For some users, though, it may be a more local encoding.

If you want to use a different encoding for your stylesheet than your operating system default, you can use the @charset declaration just like in CSS. Add @charset "encoding-name"; at the beginning of the stylesheet (before any whitespace or comments) and Sass will interpret it as the given encoding. Note that whatever encoding you use, it must be convertible to Unicode.

Sass will also respect any Unicode BOMs and non-ASCII-compatible Unicode encodings as specified by the CSS spec, although this is not the recommended way to specify the character set for a document. Note that Sass does not support the obscure UTF-32-2143, UTF-32-3412, EBCDIC, IBM1026, and GSM 03.38 encodings, since Ruby does not have support for them and they're highly unlikely to ever be used in practice.

Output Encoding

In general, Sass will try to encode the output stylesheet using the same encoding as the input stylesheet. In order for it to do this, though, the input stylesheet must have a @charset declaration; otherwise, Sass will default to encoding the output stylesheet as UTF-8. In addition, it will add a @charset declaration to the output if it's not plain ASCII.

When other stylesheets with @charset declarations are @imported, Sass will convert them to the same encoding as the main stylesheet.

Note that Ruby 1.8 does not have good support for character encodings, and so Sass behaves somewhat differently when running under it than under Ruby 1.9 and later. In Ruby 1.8, Sass simply uses the first @charset declaration in the stylesheet or any of the other stylesheets it @imports.


在sass命令中使用--scss 将按scss编译,在scss命令中同理
Encoding:默认同系统;可通过@charset指定

特点:
Nested rules: 规则可嵌套  如:p{/.../ a{/../}}
引用父选择符:&
嵌套属性:(简写复合属性) 如:
  font:  2px/3px  {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
Placeholder Selectors: %
如a%foo{/../}  当进行.on {@extend %foo;} 则编译成a.on{/../}
Comments:/**/及// 后者编译后会移除 comments首字符为!则不会
Variables:$   如:$width: 5em;  注意:使用范围不超过定义范围

mixin例:
@mixin firefox-message($selector) {
  body.firefox #{$selector}:before {
    content: "Hi, Firefox users!";
  }
}

@include firefox-message(".header");
被编译为：

body.firefox .header:before {
  content: "Hi, Firefox users!"; }

数据类型:
1.数字（例如 1.2、13、10px）
2.文本字符串，无论是否有引号（例如 "foo"、'bar'、baz）
3.颜色（例如 blue、#04a3f9、rgba(255, 0, 0, 0.5)）
4.布尔值（例如 true、false）
5.空值（例如 null）
6.值列表，用空格或逗号分隔（例如 1.5em 1em 0 2em、Helvetica, Arial, sans-serif）

值列表:nth,join function; @each rule

值运算:+,-,*,/,%,关系运算
除法运算使用场景:
1.如果数值或它的任意部分是存储在一个变量中或是函数的返回值。
2.如果数值被圆括号包围。
3.如果数值是另一个数学表达式的一部分。
使用#{}后不参与除法运算

颜色参与运算:
1.分段相加(r.g.b)
2.对于alpha通道,alpha必须相同,且不参与运算
3.Alpha通道通过opacify,transparentize(rgba,alpha) 前者加,后者调
4.ie-hex-str()将rgba转换成hex

字符串运算:
1.“+”: 链接字符,当含引号与不含引号字符相加时,结果形式同左侧
2.#{} 形式的表达式可以被用来在字符串中添加动态值

布尔运算: and, or, not
圆括号: ( )改变运算优先级
函数: 预定义函数 如:hsl()
关键词参数: hsl($hue: 0, $saturation: 100%, $lightness: 50%)  方便,灵活
插值(Interpolation) :  #{} 及 变量 可应用到选择器,属性
变量默认值:!default 
例: $content: "Second content?" !default; 当$content未赋值时值为"Second content?"

@import:当文件扩展名为.sass或.scss,直接引入并合并,变量及minix生效
然而当:
1.文件的扩展名是 .css。
2.文件名以 http:// 开头。
3.文件名是 url()。
4.@import 包含了任何媒体查询（media queries）
只做css解析
能同时引入多个文件;还能nest(在一条rules内使用@import,文件内容原地覆盖)(@mixin or @charset只能在文档顶层使用)

@media:能nest

片段: 在文件名前加下划线如_colors.scss;不会被编译成css,只用引用用途

@extend: 使一个selector继承另外一个single selector(无关系选择器,但包括伪类,元素选择器)全部属性
如:
.seriousError {
  @extend .error; // .error所有属性在此处替换
  border-width: 3px;
}
原理 .error, .seriousError {/.../}  可以多个extend,链式使用;不支持Selector Sequences (如 .foo .bar)
If the two sequences do share some selectors, then those selectors will be merged together and only the differences (if any still exist) will alternate. In this example, both sequences contain the id #admin, so the resulting selectors will merge those two ids:

#admin .tabbar a {
  font-weight: bold;
}
#admin .overview .fakelink {
  @extend a;
}
这被编译为：

#admin .tabbar a,
#admin .tabbar .overview .fakelink,
#admin .overview .tabbar .fakelink {
  font-weight: bold; }

只用于extend的Selectors: 使用占位选择器(本身不会被编译成css,只能扩展.或#)
!optional:当@extend对象不存在或不会生成实际有效选择器时,该标志允许为空非出错

@debug  prints the value of a SassScript expression 如: @debug 10em + 12em;
@warn prints the value of a SassScript expression
区别:
1.You can turn warnings off with the --quiet command-line option or the :quiet Sass option.
2.A stylesheet trace will be printed out along with the message so that the user being warned can see where their styles caused the warning.

@mixin adjust-location($x, $y) {
  @if unitless($x) {
    @warn "Assuming #{$x} to be in pixels";
    $x: 1px * $x;
  }
  @if unitless($y) {
    @warn "Assuming #{$y} to be in pixels";
    $y: 1px * $y;
  }
  position: relative; left: $x; top: $y;
}

Control Directives:
@if: 如
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
@for:如
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
@each: 如
@each $animal in puma, sea-slug, egret, salamander {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
  }
}
@while: 如
$i: 6;
@while $i > 0 {
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
@mixin: 如
@mixin clearfix {
  display: inline-block;
  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  * html & { height: 1px }
}
@include: 使用 mixin 如:
.page-title {
  @include large-text;
  padding: 4px;
  margin-top: 10px;
}
带参数minix例:
@mixin sexy-border($color, $width) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
Variable Arguments: 基本同es扩展运算符在函数参数上的应用 例
@mixin box-shadow($shadows...) {
  -moz-box-shadow: $shadows;
  -webkit-box-shadow: $shadows;
  box-shadow: $shadows;
}

.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
这里形参扩展,实参也能扩展

@content:
@mixin apply-to-ie6-only {
  * html {
    @content;
  }
}
/* 这里include便可以添加style */
@include apply-to-ie6-only {
  #logo {
    background-image: url(/logo.gif);
  }
}

Function Directives: 如
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }


Sass与scss异同:
1.后者使用’;’及’{}’而非前者的换行
