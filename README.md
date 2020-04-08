# webpack-vue-ssr
运行下面的指令，就可以看到简单的ssr页面 默认端口3000。
```
git clone https://github.com/seasonSevent/webpack-vue-ssr.git
yarn || npm install
npm run dev //开发环境
npm run start //打包运行
npm run build //打包ssr需要的json文件 
```
> 由于只是简单搭建，所有可能会有一些瑕疵。欢迎提出`issues`
---

### 关于本项目项目的搭建
- 目录结构
```
├── ./build  // webpack配置目录
│   ├── ./build/set-dev-server.js  // 热更新配置
│   ├── ./build/webpack.base.conf.js // 通用配置
│   ├── ./build/webpack.client.conf.js // 客户端配置
│   └── ./build/webpack.server.conf.js // 服务端配置
├── ./server // 服务端代码和页面模板
│   ├── ./server/index.template.html
│   └── ./server/server.js
├── ./src // vue 项目结构
│   ├── ./src/app.js
│   ├── ./src/App.vue
│   ├── ./src/components
│   ├── ./src/entry-client.js
│   ├── ./src/entry-server.js
│   ├── ./src/page
│   │   ├── ./src/page/About.vue
│   │   └── ./src/page/Home.vue
│   ├── ./src/router
│   │   └── ./src/router/index.js
│   ├── ./src/store
│   │   └── ./src/store/index.js
│   └── ./src/until
│       └── ./src/until/title-mixin.js
├── ./static //静态资源
│   └── ./static/favicon.ico
├── ./LICENSE
├── ./package.json 
├── ./postcss.config.js
├── ./README.md
```
### 生产环境配置
 - 随意进一个目录创建文件夹  
    `mkdir webpack-vue-ssr`  
    我这里使用`yarn`看个人喜好使用`npm`或`yarn`
    首先下载必须要的依赖包,如下:
    `yarn add express vue -S`  
    `yarn add vue-server-renderer  webpack webpack-cli -D`  
    `mkdir build && mkdir server && mkdir src && touch index.template.html`
    执行完上列命令目录结构应该是如下:
    ```
       webpack-vue-ssr
       |    node_modules
       |    build
       |    server
       |    src
       |    index.template.html
       |    package.json
       |    yarn.lock
    ``` 
    在`index.template.html`中写:
    ```html
       <!DOCTYPE html>
       <html lang="en">
       <head>
           <title>{{ title }}</title>
       </head>
       <body>
       <!--    <div id="app"></div>-->
           <!--vue-ssr-outlet-->
       </body>
       </html>
    ```
    然后在`server`文件夹里面创建`index.js`
    ```javascript
       // server/index.js
       const express = require('express');
       const app = express();
       const fs = require("fs");
       const path = require('path')
       const {createBundleRenderer} = require("vue-server-renderer");
       const resolve = dir => path.resolve(__dirname,dir)

       // 假设我们现在已经生成客户端和服务端json       
       const bundle = require("../dist/vue-ssr-server-bundle.json")
       const clientManifest = require("../dist/vue-ssr-client-manifest.json")
   
       const renderer = createBundleRenderer(bundle,{
            runInNewContext:false,
            template: fs.readFileSync(resolve("../index.template.html",'utf-8')),
            clientManifest
       })

       app.get("*",(req,res)=>{
           const context = {
               title:"hello ssr!",
               url:req.url
           }
   
           renderer.renderToString(context,(err,html)=>{
               res.send(html)
           })
       })
      
       app.listen(3000,()=>{
          console.log(`started listen port is 3000`);   
       })   
    ```
    `src`下面的目录结构:  
    在编写创建之前我们还下载一些需要用到的依赖包:  
    `yarn add vuex vue-router vuex-router-sync -D`
    ```
    |   components
    |   page
        |   Home.vue
        |   About.vue
    |   router   
        |   index.js
    |   store
        |   index.js
    |   app.js
    |   App.vue
    |   entry-client.js
    |   entry-server.js
    ```
    然后来编写代码
    ```JavaScript
    //app.js
    import Vue from "vue"
    import App from "./app.vue"
    import {createRouter} from "./router"
    import {createStore} from "./store";
    import {sync} from "vuex-router-sync";

    export function createApp(){
       const router = createRouter();
       const store = createStore();
       
       //同步路由状态(route state)到store
       sync(store,router)
   
       const app = new Vue({
           router,
           store,
           render:h=>h(App)
       })
       return {app,router,store};
    } 
   ```
   ```javascript
    //router index.js
    import Vue from "vue"
    import VueRouter from "vue-router";
    
    Vue.use(VueRouter)
    
    export function createRouter() {
        return new VueRouter({
            mode:"history",
            routes:[
                {
                    name:"home",
                    path:"/",
                    component:() => import("../page/Home")
                },
                {
                    name: "about",
                    path:"/about",
                    component:()=>import("../page/About")
                }
            ]
        })
    }
   ```
   ```javascript
   // store index.js
   import Vue from "vue"
   import Vuex from "vuex"
   
   Vue.use(Vuex)
   
   const fetchItem = function () {
       return new Promise((resolve, reject) => {
           setTimeout(()=>{
               resolve("item 组件返回ajax数据")
           },1000)
       })
   }
   
   export function createStore() {
       const store =  new Vuex.Store({
           state:{
               items:""
           },
           actions:{
               fetchItem({commit}){
                   return fetchItem().then(data=>{
                       commit("setItem",data);
                   }).catch(err =>{
                       console.log(err)
                   })
               }
           },
           mutations:{
               setItem(state, data){
                   state.items = data;
               }
           }
       })
   
       if (typeof window !== "undefined" && window.__INITAL_STATE__){
           console.log('window.__INITIAL_STATE__', window.__INITIAL_STATE__);
           store.replaceState(window.__INITIAL_STATE__);
       }
   
       return store;
   }    
   ```
   ```vue
   // App.vue
    <template>
        <div class="app">
            <h3>hello ssr! hot </h3>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/about">About</router-link></li>
            </ul>
            <router-view :key="$route.path"></router-view>
        </div>
    </template>
    
    <script>
        export default {
            name: "App"
        }
    </script>
    
    <style scoped>
        .app{
            width:1200px;
            min-height: 100vh;
            background-color:pink;
        }
    </style>
   ```
   ```vue
   // Home.vue
   <template>
       <div class="home">
           home 界面
       </div>
   </template>
   
   <script>
       export default {
           name: "Home",
       }
   </script>
   
   <style scoped>
   
   </style>
   ```
   ```vue
   // About.vue
   <template>
       <div class="about">
           <h3>about page</h3>
           <div>
               {{item}}
           </div>
       </div>
   </template>
   
   <script>
       export default {
           name: "About",
           // 执行store方法
           asyncData({store,route}){
               return store.dispatch("fetchItem")
           },
           // 获取数据
           computed:{
               item(){
                   return this.$store.state.items;
               }
           }
       }
   </script>
   
   <style scoped>
   
   </style>
   ```
   [entry-client.js](https://github.com/seasonSevent/webpack-vue-ssr/blob/master/src/entry-client.js)  
   [entry-server.js](https://github.com/seasonSevent/webpack-vue-ssr/blob/master/src/entry-server.js)  
   客户端和服务端的代码没有任何改变可以直接去查看源代码;
 - `webpack`配置
    编写之前我们需要下载的依赖如下:  
    `yarn add vue-loader vue-style-loader vue-template-compiler autoprefixer postcss-loader css-loader babel-core babel-loader file-loader webpack-merge webpack-node-externals -D`
    ```javascript
   // webpack.base.conf.js 
       const path = require("path");
       const VUeLoaderPlugin = require("vue-loader/lib/plugin")
       
       module.exports ={
           mode:"production",
           output: {
               path:path.resolve(__dirname,"../dist"),
               filename: "[name].[chunkhash].js",
               publicPath: "/"
           },
           resolve: {
               extensions: [".js",".vue",".json"],
               alias: {
                   "@":path.resolve(__dirname,"../src"),
               }
           },
           module: {
               rules:[
                   {
                       test:/\.vue$/,
                       use:"vue-loader"
                   },
                   {
                       test:/\.css$/,
                       use:["vue-style-loader","css-loader","postcss-loader"]
                   },
                   {
                       test:/\.js$/,
                       use:"babel-loader",
                       exclude: /node_modules/
                   },
                   {
                       test:/\.(png|svg|jpg|gif)$/,
                       use:["file-loader"]
                   },
                   {
                       test:/\.(woff|woff2|eot|ttf|otf)$/,
                       use:["file-loader"]
                   }
               ]
           },
           plugins:[
               new VUeLoaderPlugin()
           }
    ```
    为了能运行`autoprefixer`我们可以在根目录下创建postcss.config.js
    ```javascript
       module.exports = {
           plugins:[
               require("autoprefixer")
           ]
       }
    ```
    ```javascript
       // webpack.client.conf.js
       const path = require("path");
       const merge = require("webpack-merge")
       const baseConfig = require("./webpack.base.conf")
       const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
              
       module.exports = merge(baseConfig,{
           mode:process.env.NODE_ENV  || "development",
           entry:path.resolve(__dirname,"..","src/entry-client.js"),
           plugins:[
               new VueSSRClientPlugin()
           ]
       })
    ```
   ```javascript
      // webpack.server.conf.js
       const path = require("path");
       const merge = require("webpack-merge")
       const nodeExternals = require("webpack-node-externals")
       const baseConfig = require("./webpack.base.conf")
       const VueSSRClientPlugin = require("vue-server-renderer/server-plugin")
       
       module.exports = merge(baseConfig,{
           entry: path.join(__dirname, '../src/entry-server.js'),
           target:"node",
           devtool:"source-map",
           output:{
               libraryTarget:"commonjs2"
           },
           externals:nodeExternals({
               whitelist:/\.css$/
           }),
           plugins:[
               new VueSSRClientPlugin()
           ]
       })
    ```
 - `添加npm run 指令`  
    在上面我们已经讲生产环境搭建完成，为了方便运行我们一般会在`package.json`中的`scripts`中添加命令
    ```
         "scripts": {
           "start": "node ./server/index.js",
           "build": "npm run build:client && npm run build:server",
           "build:client": "webpack --config ./build/webpack.client.conf.js",
           "build:server": "webpack --config ./build/webpack.server.conf.js"
         },
    ```
    接下来运行`npm run build`，进入你所指定的端口就可以看到`ssr`项目了。  
    关于后面的开发环境，我也没怎么弄明白，所有就不写了。大家直接看代码自己了解，或者去`vue ssr`文档去查看。