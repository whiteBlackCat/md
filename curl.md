$ curl www.sina.com  发起get请求
$ curl -o path url  相应保存到绝对path
$ curl -L url  当请求status为 301时,自动跳转(Location字段)
$ curl -i url 显示头信息带相应  -I 只含有头信息
$ curl -v url 显示通信过程
$ curl --trace-ascii output.txt url 更加详细的通信  ascii用于转ascii码
发送POST表单:
$ curl -X POST--data-urlencode "date=April 1" example.com/form.cgi  -urlencode编码  使用GET以外的请求需使用-X
上传文件:
$ curl --form upload=@localfilename --form press=OK [URL]  upload:获取文件字段 每个表单字段前有--form  press=OK其余表单信息
设置Referer
$ curl --referer http://www.example.com http://www.example.com
设置User Agent:
$ curl --user-agent "[User Agent]" [URL]
使用cookie:
$ curl --cookie "name=xxx" www.example.com  具体的cookie的值，可以从http response头信息的`Set-Cookie`字段中得到
$ curl -c cookie-file http://example.com  保存cookie到cookie-file
$ curl -b cookie-file http://example.com 使用cookie-file作为cookie信息
增加头信息:
$ curl --header "Content-Type:application/json" http://example.com
HTTP认证:
$ curl --user name:password example.com