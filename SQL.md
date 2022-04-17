大小写不敏感
";"是命令分隔符
文本使用单引号

构成:

1. DML 数据操作语言
   SELECT, UPDATE,DELETE,INSERT,INFO
2. DDL数据定义语言:
   CREATE DATABASE,ALERT DATABASE,CREATE TABLE,ALERT TABLE,DROP TABLE,CREATE INDEX,DROP INDEX

语法:
选择数据 -> 结果集: SELECT DISTINCT COL1,COL2 FROM TABLE WHERE COL1 运算符 值  ORDERBY COL [DESC]
DISTINCT去除重复 *选择所有列
ORDERBY 根据字段排序
GROUP BY:将指定列相同值合同成一列
HAVING: 过滤
运算符 =,<>,>,<,>=,<=,BETWEEN,LIKE
where子句结合:and,or
插入行数据: INSERT INFO TABLE (COL1,COL2,...) VALUES (VALUE1,VALUE2,...)
更新表: UPDATE TABLE SET COL=VALUE WHERE子句
删除记录: DELETE FROM TABLE WHERE子句
规定返回记录数目: SELECT TOP number|percent column_name FROM TABLE
LIKE: '%'通配  '_'任一字符  [abc]:任一指定字符  [^abc]: 任一非指定字符
IN: IN ('A','B')
BETWEEN: BETWEEN VAL1 AND VAL2  两值之间的范围,可以是数字,文本,日期
AS: 为列,表设置别名 SELECT COL AS COLUMN FROM TABLE AS TAB1
JOIN 多表结果集的列关系

1. INNER JOIN 表中存在至少一匹配时返回行
2. LEFT JOIN 左表返回所有行
3. RIGHT JOIN 右表返回所有行
4. FULL JOIN 匹配均返回

例: SELECT COL FROM TABLE1 JOIN TABLE2 ON 子句

UNION: 合并结果集,要求列数相等,类型相同 弄人剔除重复值
UNION ADD: 保留重复值
将一个表数据插入另一个中: SELECT COL INTO TABLE1 FROM TABLE2 WHERE 子句
创建表: CREATE TABLE {列名 数据类型,...} [NOT NULL] [UNIQUE] [PRIMARY KEY] [CHECK] [DEFAULT]
数据类型: interger(size), int(size), decimal(size), char(size), varchar(size), date(yyyy-mm-dd)
[]:其他列设置,如其名

创建索引:查询快,更新慢
CREATE_INDEX NAME ON TABLE (COL)
ALTER TABLE ADD/DROP COLUMN COL

视图: 结果集的可视化表
CREATE VIEW NAME AS 查询语句

函数:
SELECT function(col) FROM TABLE
Aggregate:合计  多输入-> 单输出
AVG: 平均值
count,first,max,sum,scalar,ucase,mid

MYSQL：
链接数据库：resource mysql_connect([string server[,string ussername[,string password[,bool new_link[,int client_flags]]]]])
创建数据库和表：resource mysql_query(string query[,resource link_identifier])相连接标识符关联的服务器中当前活动数据库发送一条查询 无责返回上个链接
创建数据库：CREATE DATABASE database_name //此处用于上面的string query      mysql_select_db("database_name")选择数据库  
向表添加数据：INSERT INTO table_name[(column1,column2,...)]     VALUES(value1,value2,..)  //SQL大小写不敏感     所有的数据库操作放在mysql_query()内
更新表中数据 UPDATE table_name   SET column_name = new_value  WHERE column = some_value
mysql_query("SELECT *FROM fruit")?  mysql_fetch_array()?
