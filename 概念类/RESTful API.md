# 概述

浏览器与服务器交流数据(API)的一种规范  
核心是：动词+宾语->表明目的  
服务器用 http 状态码说明结果

## 动词+宾语->表明目的

动次->GET/POST/PUT/PATCH/DELETE  
宾语->URL 只用名词

```
　POST /transaction HTTP/1.1
　Host: 127.0.0.1
```

## 设计

**对于只能用 GET/POST 的浏览器，用 X-HTTP-Method-Override 扩展方法**

```

POST /api/Person/4 HTTP/1.1
X-HTTP-Method-Override: PUT
```

**使用查询以避免多级的 URL 影响语义的明确**

```
GET /authors/12?categories=2
```

**服务器返回数据格式为 JSON 以使结构化数据标准**

> https://www.ruanyifeng.com/blog/2011/09/restful.html  https://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html
