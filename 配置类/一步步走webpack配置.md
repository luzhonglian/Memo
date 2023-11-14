# 一步步走 webpack 配置

- [一步步走 webpack 配置](#一步步走-webpack-配置)
  - [HTML](#html)
  - [CSS/Less/Scss](#csslessscss)
    - [CSS](#css)
    - [LESS](#less)
    - [SCSS](#scss)
    - [CSS 和 JS 分离](#css-和-js-分离)
    - [CSS 做兼容](#css-做兼容)
    - [CSS 压缩](#css-压缩)
  - [图片](#图片)
    - [图片压缩](#图片压缩)
  - [字体图标](#字体图标)
  - [Eslint](#eslint)
  - [Babel](#babel)
  - [找 BUG：SourceMap](#找-bugsourcemap)
  - [打包加速的方法](#打包加速的方法)
    - [oneOf](#oneof)
    - [include/exclude](#includeexclude)
    - [开启 babel 和 eslint 的编译缓存](#开启-babel-和-eslint-的编译缓存)
    - [开文件系统缓存](#开文件系统缓存)
    - [开多线程](#开多线程)
  - [分包](#分包)
  - [Preload/Prefetch](#preloadprefetch)
  - [Runtime](#runtime)

## HTML

```
npm i html-webpack-plugin -D
```

```javascript
    //指定输出的html模板
    new HTMLPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
```

## CSS/Less/Scss

```javascript
//用于做公共配置
function getStyleLoader(pre) {
  return [
    MiniCssExtractPlugin.loader, //详见[CSS 和 JS 分离]一节
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"], //做兼容
        },
      },
    },
    pre,
  ].filter(Boolean);
}
```

### CSS

```
npm i css-loader style-loader -D
```

```javascript
{
        test: /\.css$/,
        use: getStyleLoader(),
},
```

### LESS

```
npm i less-loader -D
```

```javascript
{
        test: /\.less$/,
        use: getStyleLoader("less-loader"),

},
```

### SCSS

```
npm i sass-loader sass -D
```

```javascript
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader("sass-loader"),

      },
```

### CSS 和 JS 分离

style-loader 最终将 css 文件以用 js 创建 style 标签的形式实现，有可能出现闪屏的问题，故做分离，使最终通过 link 引入

```
npm i mini-css-extract-plugin -D
```

```javascript
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].chunk.css",
    }),
```

### CSS 做兼容

```
npm i postcss-loader postcss postcss-preset-env -D
```

在 package.json 里做浏览器筛选

```json
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
```

### CSS 压缩

```
npm i css-minimizer-webpack-plugin -D
```

```javascript
    new CssMinimizerPlugin(),
```

## 图片

```javascript
          {
            test: /\.(jpe?g|png|gif|webp|svg)$/i,
            type: "asset", //图片的加载器是自带的，选则即可
            //. type的类型 https://webpack.docschina.org/guides/asset-modules
            //. asset是自动选择 大小<8k ? 转成base64打进js : 文件复制到输出目录
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, //. 手动改成10kb，base64优点是少一次请求，缺点是体积更大
              },
            },
            generator: {
              //. 更改输出路径 hash值 ext扩展名 query携带的参数
              filename: "pics/[hash:5][ext][query]",
            },
          }
```

### 图片压缩

仅压缩静态图片

```
npm i image-minimizer-webpack-plugin imagemin -D
```

无损压缩

```
npm install imagemin-gifsicle imagemin-jpegtran imagemin-optipng imagemin-svgo -D
```

！！！这里无损的压缩普遍下不下来，即使科学上网，反正我是没成功，此处仅作备忘

## 字体图标

```javascript
          {
            test: /\.(ttf|woff2?|mp4)$/i,
            type: "asset/resource", ///resource不转base64直接输出单文件
            generator: {
              filename: "media/[hash:5][ext][query]",
            },
          }
```

## Eslint

用于统一 js 的书写方式，及时报错

```
npm i eslint-webpack-plugin eslint eslint-plugin-import -D
```

新建.eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true, //启用browser全局变量
    es2021: true, //启用node全局变量
  },
  // extends: ["eslint:recommended"],
  // 可以直接用别人做好的规则
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-var": 2, /// 0无视，1警告，2禁止,此处是不允许用var
  },
  plugins: ["import"], ///以免动态导入语法报错
};
```

新建.eslintignore,用于不检查输出的文件

```
dist
```

用 eslint 插件缩小检查范围以及开启编译缓存

```javascript
    new ESLintPlugin({
      context: path.resolve(__dirname, "../src"),///指定检查文件的根目录
      cache: true,
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslint-cache"
      ),
    }),
```

## Babel

```
npm i babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
```

用 core-js 做 es6+的 polyfill

```
npm i core-js
```

```javascript
          {
            test: /\.m?js$/, //? mjs-->可使用es6 module模块化的js文件，不用type='module'来引入
            include: path.resolve(__dirname,'../src'),
            //只处理src
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      useBuiltIns: "usage",
                      corejs: 3,//配置corejs自动按需引入
                    },
                  ],
                ],
                cacheDirectory: true, //开启babel编译缓存
                cacheCompression: false, //关闭编译后的代码压缩
                plugins: ["@babel/plugin-transform-runtime"],
                //. babel会给公共方法加一些辅助代码，每一个使用到公共方法的文件都会加入该辅助代码
                //. 所以可以把这些辅助代码单独提取出来作为一个独立的模块，以减小重复引入
              },
            },
          }
```

## 找 BUG：SourceMap

开发模式

```javascript
 mode: "development",
devtool: "cheap-module-source-map",
//开发模式不会压缩代码，只用行映射即可
```

生产模式

```javascript
  mode: "production",
  devtool: "source-map",
//生产模式会压缩代码，so行、列都要
//！！！真上线不要用sourceMap，会暴露源码
```

## 打包加速的方法

### oneOf

文件命中一个 loader 后还会往下匹配，oneOf 使文件命中一个 loader 后即不往下继续找其他 loader

```javascript
oneOf: [
  {
    test: /\.css$/,
    use: getStyleLoader(),
  },
  //....
];
```

### include/exclude

在 babel 和 eslint 中限定/排除需要处理的文件范围

### 开启 babel 和 eslint 的编译缓存

开启缓存后只编译修改后的文件，上面示例已开启  
-eslint 在 eslintPlugin 里设置 cache 为 true  
-babel 设置 cacheDirectory 为 true

### 开文件系统缓存

```javascript
module.exports = {
  cache: {
    type: "filesystem",
    // 默认缓存到 node_modules/.cache/webpack 中
    //没变化的文件不用重编译
  },
  //...
};
```

### 开多线程

这种方法不适合小型项目，因为开一个 thread 的启动就要花 600ms

```
npm i thread-loader -D
```

```javascript
const os = require("os");
const threads = os.cpus().length; //此处是核数拉满
```

- Babel 多线程是在 use 里加入

```javascript
{
    loader: "thread-loader",
    options: { works: threads },
},
```

- Eslint 多线程

```javascript
new ESLintPlugin({
  //...
  threads,
});
```

- 压缩 js 的 terser 开启多线程

```javascript
const TerserWebpackPlugin = require("terser-webpack-plugin");
module.exports = {
  plugins: [
    //...
    new TerserWebpackPlugin({
      parallel: threads,
    }),
  ],
};
```

## 分包

分包方法

- 用 import 动态导入会自动分包
- 多入口根据依赖会自动分包

分包好处

- 把需要立即加载的和非立即加载的代码分割，提升首屏速度
- 提升缓存性能，因缓存以文件为单位，省得一个文件变化导致因未分包而导致不相关代码的缓存也跟着失效

配置

```javascript
  optimization: {
    splitChunks: {
      chunks: "all",
      ///在SPA中，一是把node_modules打包成一个文件，二是把动态导入的文件输出成一个文件
    },
  },
```

配置 chunk 的名称

```javascript
  output: {
    //...
    chunkFilename: "[name]-[contenthash:5].chunk.js",
  },
```

```javascript
//动态导入中命名
import(/* webpackChunkName:"myAdd" */ "./add");
```

## Preload/Prefetch

作用：把**此时用不到**但以后可能用的到的资源先下载了  
嘎嘎好用，就是兼容性差了些  
preload：
赶紧下好，领导随时要来检查，网络请求 priority 为 high  
prefetch:
空余时间下载好，领导以后可能会来检查，网络请求 priority 为 lowest

```
npm i @vue/preload-webpack-plugin -D
```

```javascript
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
module.exports = {
  plugins: [
    //...
    new PreloadWebpackPlugin({
      rel: "preload",
      as: "script",
      //如果是prefetch
      //rel:"prefetch"
    }),
  ],
};
```

## Runtime

假设 A 文件引入了 B 文件，  
B 变化后 hash（文件名）变，  
A 因为靠其文件名引入了 B，所以 A 的内容也变了  
导致的 A 的 hash（文件名）变  
**！！！问题就在于，A 的内容实质上是没变的，缓存却因为文件名变了而失效了，太不得劲了**  
解决方案：用一个 runtime 文件来存放 hash，使得 A 可以不用显式引入 B 的 hash

```javascript
module.exports = {
  optimization: {
    //...
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
};
```
