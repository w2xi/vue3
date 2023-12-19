# 使用VSCode调试源码

之前发布在掘金，移到 Github 后发现图片直接被 ban 了，emm...

https://juejin.cn/post/7300118821532172303 (后面再把图片移过来把)

## 1. clone vue3源码到本地

```bash
git clone https://github.com/vuejs/core.git vue3
```

## 2. 安装依赖

使用 vscode 打开 vue3 项目，在项目中的 [.github/contributing.md](https://github.com/vuejs/core/blob/main/.github/contributing.md) 文件中，我们可以看到Vue官方对源码架构的介绍和对开发的一些介绍。

从 [#development-setup](https://github.com/vuejs/core/blob/main/.github/contributing.md#development-setup) 可以知道 Node.js 的版本需要满足 `>= 18.12` 且 pnpm 的版本需要满足 `>= 8`，并且 Vue3 的依赖管理是基于 pnpm 的，如果没有就执行 `npm i pnpm -g` 安装一下。

安装依赖：
```bash
pnpm install
```

## 3. 运行项目

[#scripts](https://github.com/vuejs/core/blob/main/.github/contributing.md#scripts) 介绍了vue3提供的打包

看到 `nr dev` (需要安装 `ni` npm 包)，该命令等价于 `npm run dev`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4598b29d47c04ad7be46d6fe2e6a98af~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1035&h=477&s=53188&e=png&b=ffffff)

执行该命令:
```bash
# 加上 -s 参数会生成对应的 source map 文件，用于 debug 调试
npm run dev -s
```

然后再 `packages/vue` 目录下会看到生成了 `dist` 目录，这就是打包后的vue3源码，`vue.global.js` 文件可以直接用于 `HTML` 中

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adf7b248ba944079a992043037eb9f96~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=261&h=96&s=3477&e=png&b=24282f)

## 4. 跑个 demo 

在 `packages/vue/examples` 目录下，有很多官方提供的示例，可以看到它们都是一些 HTML 文件，并且都引用了 `vue.global.js` 文件

```html
<script src="../../dist/vue.global.js"></script>
<div id="demo">...</div>
```

新建 `debug` 目录，在该目录下新建 `hello.html`，内容如下：

```html
<script src="../../dist/vue.global.js"></script>
<div id="app">
    <div>{{ msg }}</div>
</div>
<script>
const { createApp } = Vue
createApp({
    setup() {
        return {
            msg: 'Hello Vue.js'
        }
    }
}).mount('#app')
</script>
```

执行 `npm run serve`，会在本地开启一个 http 服务：
```
Serving!                                       
      - Local:    http://localhost:60741             
      - Network:  http://192.168.152.195:60741       
      This port was picked because 3000 is in use.   
      Copied local address to clipboard!
```

在浏览器打开该地址，可以看到:

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31a30f21a1d2498598ef7febe03f8fa7~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=574&h=103&s=7984&e=png&b=ffffff)


## 5. 使用 VSCode debug 调试

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4637578cf6574522a3f2c1b24f2b2075~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=407&h=345&s=17191&e=png&b=2a2e36)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89c0f8b06b9b416386fc8bae96fb5448~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=761&h=589&s=81912&e=png&b=262b32)

添加配置，选择 `Chomre: Launch`，然后修改配置的 `name` 和 `url`

```json
"configurations": [
    {
      "name": "Hello Vue.js",
      "request": "launch",
      "type": "chrome",
      "url": "http://localhost:60741", // 上面你本地起的 http 服务地址
      "webRoot": "${workspaceFolder}"
    },
    ...
]
```

打一个断点，点击开始调试

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e071bec530d942a1bcd8c72de7734dcf~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1920&h=634&s=97823&e=png&b=262b32)

打开 `hello.html` 文件

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e98cfc3b21445097f9ae50e3195ee4~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=582&h=292&s=16305&e=png&b=ffffff)

可以看到，成功进入断点

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d27b1ce1c734e4fada25bd56e91a8f9~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1456&h=875&s=95531&e=png&b=272b33)

接下来就可以愉快的调试源码了！