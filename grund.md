npm install grunt-cli -g

Gruntfile.js 

module.exports = function(grunt) {

  // 配置Grunt各种模块的参数
  grunt.initConfig({
    jshint: { /* jshint的参数 */ },
    concat: { /* concat的参数 */ },
    uglify: { /* uglify的参数 */ },
    watch:  { /* watch的参数 */ }
  });

  // 从node_modules目录加载模块文件
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 每行registerTask定义一个任务  定义具体的任务。第一个参数为任务名，第二个参数是一个数组，表示该任务需要依次使用的模块
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('check', ['jshint']);

};


实例: grunt-contrib-cssmin模块

module.exports = function(grunt) {

  grunt.initConfig({
    cssmin: {
      minify: {
        expand: true, // 如果设为true，就表示下面文件名的占位符（即*号）都要扩展成具体的文件名。
		cwd: 'css/',  // 需要处理的文件（input）所在的目录。
		src: ['*.css', '!*.min.css'],  // 表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
		dest: 'css/',  // 表示处理后的文件名或所在目录。
		ext: '.min.css'  // 表示处理后的文件后缀名。
		// filter：一个返回布尔值的函数，用于过滤文件名。只有返回值为true的文件，才会被grunt处理。
        // dot：是否匹配以点号（.）开头的系统文件。
        // makeBase：如果设置为true，就只匹配文件路径的最后一部分。比如，a?b可以匹配/xyz/123/acb，而不匹配/xyz/acb/123。
	  },
      combine: {
	    files: {
		  'css/out.min.css': ['css/part1.min.css', 'css/part2.min.css']
		}
	  }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // require('load-grunt-tasks')(grunt);  使用该句自动分析package.json文件，自动加载所找到的grunt模块。

  grunt.registerTask('default', ['cssmin:minify','cssmin:combine']);

};

通配符:
*：匹配任意数量的字符，不包括/。
?：匹配单个字符，不包括/。
**：匹配任意数量的字符，包括/。
{}：允许使用逗号分隔的列表，表示“or”（或）关系。
!：用于模式的开头，表示只返回不匹配的情况。



常用模块:
grunt-contrib-clean：删除文件。
grunt-contrib-compass：使用compass编译sass文件。
grunt-contrib-concat：合并文件。
grunt-contrib-copy：复制文件。
grunt-contrib-cssmin：压缩以及合并CSS文件。
grunt-contrib-imagemin：图像压缩模块。
grunt-contrib-jshint：检查JavaScript语法。
grunt-contrib-uglify：压缩以及合并JavaScript文件。
grunt-contrib-watch：监视文件变动，做出相应动作


grunt-contrib-jshint
jshint用来检查语法错误，比如分号的使用是否正确、有没有忘记写括号等等。它在grunt.initConfig方法里面的配置代码如下。

jshint: {
	options: {
		eqeqeq: true,
		trailing: true
	},
	files: ['Gruntfile.js', 'lib/**/*.js']
},
上面代码先指定jshint的检查项目，eqeqeq表示要用严格相等运算符取代相等运算符，trailing表示行尾不得有多余的空格。然后，指定files属性，表示检查目标是Gruntfile.js文件，以及lib目录的所有子目录下面的JavaScript文件。

grunt-contrib-concat
concat用来合并同类文件，它不仅可以合并JavaScript文件，还可以合并CSS文件。

concat: {
  js: {
    src: ['lib/module1.js', 'lib/module2.js', 'lib/plugin.js'],
    dest: 'dist/script.js'
  }
  css: {
    src: ['style/normalize.css', 'style/base.css', 'style/theme.css'],
    dest: 'dist/screen.css'
  }
},
js目标用于合并JavaScript文件，css目标用语合并CSS文件。两者的src属性指定需要合并的文件（input），dest属性指定输出的目标文件（output）。

grunt-contrib-uglify
uglify模块用来压缩代码，减小文件体积。

uglify: {
  options: {
    banner: bannerContent,
    sourceMapRoot: '../',
    sourceMap: 'distrib/'+name+'.min.js.map',
    sourceMapUrl: name+'.min.js.map'
  },
  target : {
	expand: true,
	cwd: 'js/origin',
	src : '*.js',
	dest : 'js/'
  }
},
上面代码中的options属性指定压缩后文件的文件头，以及sourceMap设置；target目标指定输入和输出文件。

grunt-contrib-copy
copy模块用于复制文件与目录。

copy: {
  main: {
    src: 'src/*',
    dest: 'dest/',
  },
},
上面代码将src子目录（只包含它下面的第一层文件和子目录），拷贝到dest子目录下面（即dest/src目录）。如果要更准确控制拷贝行为，比如只拷贝文件、不拷贝目录、不保持目录结构，可以写成下面这样：

copy: {
  main: {
    expand: true,
    cwd: 'src/',
    src: '**',
    dest: 'dest/',
    flatten: true,
    filter: 'isFile',
  },
},
grunt-contrib-watch
watch模块用来在后台运行，监听指定事件，然后自动运行指定的任务。

watch: {
   scripts: {
    files: '**/*.js',
    tasks: 'jshint',
	options: {
      livereload: true,
    },
   },
   css: {
    files: '**/*.sass',
    tasks: ['sass'],
    options: {
      livereload: true,
    },
   },
},
设置好上面的代码，打开另一个进程，运行grunt watch。此后，任何的js代码变动，文件保存后就会自动运行jshint任务；任何sass文件变动，文件保存后就会自动运行sass任务。

需要注意的是，这两个任务的options参数之中，都设置了livereload，表示任务运行结束后，自动在浏览器中重载（reload）。这需要在浏览器中安装livereload插件。安装后，livereload的默认端口为localhost:35729，但是也可以用livereload: 1337的形式重设端口（localhost:1337）。

其他模块
下面是另外一些有用的模块。

（1）grunt-contrib-clean

该模块用于删除文件或目录。

clean: {
  build: {
    src: ["path/to/dir/one", "path/to/dir/two"]
  }
}
（2）grunt-autoprefixer

该模块用于为CSS语句加上浏览器前缀。

autoprefixer: {
  build: {
    expand: true,
    cwd: 'build',
    src: [ '**/*.css' ],
    dest: 'build'
  }
},
（3）grunt-contrib-connect

该模块用于在本机运行一个Web Server。

connect: {
  server: {
    options: {
      port: 4000,
      base: 'build',
      hostname: '*'
    }
  }
}
connect模块会随着grunt运行结束而结束，为了使它一直处于运行状态，可以把它放在watch模块之前运行。因为watch模块需要手动中止，所以connect模块也就会一直运行。

（4）grunt-htmlhint

该模块用于检查HTML语法。

htmlhint: {
    build: {
        options: {
            'tag-pair': true,
            'tagname-lowercase': true,
            'attr-lowercase': true,
            'attr-value-double-quotes': true,
            'spec-char-escape': true,
            'id-unique': true,
            'head-script-disabled': true,
        },
        src: ['index.html']
    }
}
上面代码用于检查index.html文件：HTML标记是否配对、标记名和属性名是否小写、属性值是否包括在双引号之中、特殊字符是否转义、HTML元素的id属性是否为唯一值、head部分是否没有script标记。

（5）grunt-contrib-sass模块

该模块用于将SASS文件转为CSS文件。

sass: {
    build: {
		options: {
            style: 'compressed'
        },
        files: {
            'build/css/master.css': 'assets/sass/master.scss'
        }
    }
}
上面代码指定输出文件为build/css/master.css，输入文件为assets/sass/master.scss。

（6）grunt-markdown

该模块用于将markdown文档转为HTML文档。

markdown: {
    all: {
      files: [
        {
          expand: true,
          src: '*.md',
          dest: 'docs/html/',
          ext: '.html'
        }
      ],
      options: {
        template: 'templates/index.html',
      }
    }
},