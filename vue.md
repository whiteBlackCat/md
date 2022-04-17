# Vue

## Vuex

特点:单一状态树,使用一个对象包含全部的应用状态;响应式
mutation:推荐改变state状态的唯一方法,仅能被commit调用
action:可含异步操作,是推荐mutation的入口

### 注册模块

1. 实例化store时的module配置
2. store.registerModule方法

开启命名空间后:

1. 需要添加路径访问,如:diapatch('account/login')
2. 模块内分发action,如: dispath('login',data,{root:true})
3. 模块内注册全局action {root:true,handle:func}

### mapgetter,mapstate

#### 入参

1. string[]: 每个元素均可在getter,state找到同名属性
2. {name:state=>state.proper}: 重新定义访问名和访问的属性
**PS**: 对于使用了命名空间或者异步注册store模块,方式2应当使用module.name的方式替代name
