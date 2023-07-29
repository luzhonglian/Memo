## cookie 的运作模式

浏览器发送用户信息->服务器  
服务器响应 set-cookie->浏览器  
浏览器保存 cookie  
cookie 是明文 e.g->username='lzl'

```
let value = encodeURIComponent(username.value);
let twoDays = 2 * 24 * 3600;
document.cookie = `username=${value};max-age=${twoDays}`;
```

## 存储明文不安全，所以有了 Session

步骤和上面的一样，唯一不同是存储的是服务器生成的 sessionID  
提高了安全性

## Session 的问题

多个服务器/要跨域，session 得共享  
例如：登录了新浪微博，进入新浪博客后自动登录

**解决方案 1：session 持久化，比如放进数据库，但工程量比较大且数据库崩了就 GG**

**解决方案 2：服务器不保存 session，换玩法--->JWT**

## JWT

JWT:json web token  
由 header,payload,signature 三部分组成 token  
服务器只保存 secret

### **header,payload** 都是 json 对象，生成 token 时要由 Base64URL 算法转成字符串

### **signature** 使用 Header 里面指定的签名算法（默认是 HMAC SHA256）生成

```javascript
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret);
```

最后三者用.拼接组成 token 发给浏览器

> 客户端收到服务器返回的 JWT，可以储存在 Cookie 里面，也可以储存在 localStorage。
> 此后，客户端每次与服务器通信，都要带上这个 JWT。你可以把它放在 Cookie 里面自动发送，但是这样不能跨域，所以更好的做法是放在 HTTP 请求的头信息 Authorization 字段里面。

```
Authorization: Bearer <token>
```

> http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html

## 演变过程

明文->服务器和浏览器同担的 sessionID->浏览器担主任的 JWT
