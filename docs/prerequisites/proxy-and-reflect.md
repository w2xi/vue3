# Proxy & Reflect

## Proxy

首先看下 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 对 Proxy 的描述：

> Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

语法:
```js{4}
const p = new Proxy(target, handler)
```
<code>p</code>: 代理对象  
<code>target</code>: 被包装的目标对象  
<code>handler</code>: 拦截操作的处理对象。当触发拦截操作时，执行对应拦截的处理方法

### 拦截 get / set

```js{4}
const obj = { foo: 'bar' }
const p = new Proxy(obj, {
    get(target, prop) {
        console.log(`查找属性 '${prop}'`)
        return target[prop]
    },
    set(target, prop, value) {
        console.log(`赋值属性 '${prop}'`)
        target[prop] = value
        return true
    },
})

p.foo
p.foo = 'baz'
```

### 拦截枚举操作

### 拦截函数调用

