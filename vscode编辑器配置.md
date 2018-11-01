格式化:
	编辑器自带:
		1. 文件 -> 首选项:
			"editor.detectIndentation": false    关闭根据文件类型自动设置tabsize
		2. 项目配置(编辑器)
			创建.editorconfig文件 <<
				root = true

				[*]
				charset = utf-8
				indent_style = tab
				indent_size = 4
				insert_final_newline = true
				trim_trailing_whitespace = true

				[*.md]
				max_line_length = off
				trim_trailing_whitespace = false
				
	插件Beautify:
		文件 -> 首选项 -> 设置 ->  扩展 -> beautify config  部分配置
		创建.jsbeautifyrc << 
			{
				"brace_style": "none,preserve-inline",  // 花括号折叠
				"indent_size": 2,  // html tabsize
				"indent_char": " ", // 缩进使用字符
				"jslint_happy": true,  // 搭配jslint使用
				"unformatted": [""],  // 不需要格式化的标签类型  注意 template 也是默认不格式化的，.vue 的template 标签如果需要格式化请在 .jsbeautifyrc 重新定义不带 template 的声明属性
				"css": {
					"indent_size": 2
				}
			}
   
	使用插件eslint + prettier:
		{
			"editor.tabSize":2,  #代码缩进修改成2个空格
			"editor.formatOnSave": true,  #每次保存的时候自动格式化
			"eslint.autoFixOnSave": false,  #每次保存的时候将代码按eslint格式进行修复
			"prettier.eslintIntegration": true,  #让prettier使用eslint的代码格式进行校验
			"prettier.semi": false,  #去掉代码结尾的分号
			"prettier.singleQuote": true,  #使用带引号替代双引号
			"javascript.format.insertSpaceBeforeFunctionParenthesis": true  #让函数(名)和后面的括号之间加个空格
		}