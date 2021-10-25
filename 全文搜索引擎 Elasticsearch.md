1.安装:
下载压缩包:
$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.5.1.zip
$ unzip elasticsearch-5.5.1.zip
$ cd elasticsearch-5.5.1/ 

启动 Elastic:
$ ./bin/elasticsearch
如果这时报错"max virtual memory areas vm.maxmapcount [65530] is too low"，要运行下面的命令。
$ sudo sysctl -w vm.max_map_count=262144
如果一切正常，Elastic 就会在默认的9200端口运行
端口信息:
$ curl localhost:9200
{
  "name" : "atntrTf",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "tf9250XhQ6ee4h7YI11anA",
  "version" : {
    "number" : "5.5.1",
    "build_hash" : "19c13d0",
    "build_date" : "2017-07-18T20:44:24.823Z",
    "build_snapshot" : false,
    "lucene_version" : "6.6.0"
  },
  "tagline" : "You Know, for Search"
}
按下 Ctrl + C，Elastic 就会停止运行
远程访问:
修改 Elastic 安装目录的config/elasticsearch.yml文件，去掉network.host的注释，将它的值改成0.0.0.0(或者具体ip)，然后重新启动 Elastic。

Elastic 本质上是一个分布式数据库，允许多台服务器协同工作，每台服务器可以运行多个 Elastic 实例。
单个 Elastic 实例称为一个节点（node）。一组节点构成一个集群（cluster）。
Elastic 会索引所有字段，经过处理后写入一个反向索引（Inverted Index）。查找数据的时候，直接查找该索引。
所以，Elastic 数据管理的顶层单位就叫做 Index（索引）。它是单个数据库的同义词。每个 Index （即数据库）的名字必须是小写。
下面的命令可以查看当前节点的所有 Index。

$ curl -X GET 'http://localhost:9200/_cat/indices?v'
Index 里面单条的记录称为 Document（文档）。许多条 Document 构成了一个 Index。Document 使用 JSON 格式表示.同一个 Index 里面的 Document，不要求有相同的结构（scheme），但是最好保持相同，这样有利于提高搜索效率。

Type:Document 的分组,是虚拟的逻辑分组，用来过滤 Document.不同的 Type 应该有相似的结构（schema）,这是与关系型数据库的表的一个区别(7.x 版将会彻底移除 Type,那有何意义?)

新建及删除index:
$ curl -X PUT 'localhost:9200/weather'     DELETE 

中文分词设置:安装ik
$ ./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v5.5.1/elasticsearch-analysis-ik-5.5.1.zip
每个index需要单独设置
$ curl -X PUT 'localhost:9200/accounts' -d '    // accounts index名
{
  "mappings": {
    "person": {  // type名
      "properties": {
        "user": {
          "type": "text",
          "analyzer": "ik_max_word",  // 字段文本的分词器
          "search_analyzer": "ik_max_word"  // 搜索词的分词器
        },
        "title": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        },
        "desc": {
          "type": "text",
          "analyzer": "ik_max_word",
          "search_analyzer": "ik_max_word"
        }
      }
    }
  }
}'

数据操作:
增加记录:
$ curl -X PUT 'localhost:9200/accounts/person/1' -d '
{
  "user": "张三",
  "title": "工程师",
  "desc": "数据库管理"
}' 
此处1是记录的id,使用post可以不需要,返回随机id
对于不存在的index会自动创建

查看记录:
$ curl 'localhost:9200/accounts/person/1?pretty=true'
返回的数据中，found字段表示查询成功，_source字段返回原始记录。

更新 PUT   删除 DELETE

全文搜索:
$ curl 'localhost:9200/accounts/person/_search'  -d '
{
  "query" : { "match" : { "desc" : "管理" }},
  "from": 1, // 指定移位
  "size": 1  // 返回数据数量
}'

逻辑:
Or: "query" : { "match" : { "desc" : "软件 系统" }}
And:
"query": {
    "bool": {
      "must": [
        { "match": { "desc": "软件" } },
        { "match": { "desc": "系统" } }
      ]
    }
  }