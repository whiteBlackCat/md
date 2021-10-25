步骤:
创建一个新项目：mkdir mysql-test && cd mysql-test
创建一个 package.json 文件：npm init -y
安装mysql模块: npm install mysql –save
创建一个app.js文件并将下面的代码段复制进去。
运行该文件: node app.js。会看到一条 “Connected!”(已连接上了)消息。
app.js:
const mysql = require('mysql')
const connection = mysql.createConnecntion({
host:'localhost',
user:'user',
password:'password',
database:''
)}
//建立SQL链接
connection.connection(err=>{
if(err)throw err;
console.log('connented';})
connection.end(err=>{})

使用grunt自动化:
监听文件修改grunt-contrib-watch 都会运行已经预定义好的任务，并且会使用 grunt-execute 来运行 node app.js 命令。
具体查看grunt使用

//SQL查询
connection.query('SELECT*FROM employee',(err,rows)=>{
//查询操作
})
//insert查询
const obj = {}
connection.query(INSERT INTO employee SET ?',obj,(err,rows)=>{
//查询操作
})
具体上npm查看mysql模块