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

## Reflect

首先看下 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 对 Reflect 的描述：

> Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 proxy handler (en-US) 的方法相同。Reflect 不是一个函数对象，因此它是不可构造的。

最重要的一点，`Reflect` 提供的静态方法和 `Proxy 的 handler` 拦截对象方法名一一对应，后面会看到。

## 拦截 get / set 操作

<code>handler.get()</code> 和 <code>handler.set()</code> 分别用于拦截 get 和 set 操作

```js{4}
const obj = { foo: 'bar' }
const p = new Proxy(obj, {
    get(target, prop) {
        console.log(`拦截 get 操作 '${prop}'`)
        return Reflect.get(target, prop)
    },
    set(target, prop, value) {
        console.log(`拦截 set 操作 '${prop}'`)
        return Reflect.set(target, prop)
    },
})

p.foo
p.foo = 'baz'
```

## 拦截枚举操作

<code>handler.ownKeys()</code> 用于拦截:

- Object.keys()
- for ... in
- <code>...</code> 扩展符

举几个栗子🌰🌰🌰

1. 拦截对象的枚举操作

```js{4}
const obj = { foo: 'bar', baz: 'bar' }
const p = new Proxy(obj, {
    ownKeys(target) {
        console.log('拦截枚举操作', target)
        return Reflect.ownKeys(target)
    }
})

for (let key in p) {
    console.log(key)
}
```

2. 拦截数组的枚举操作

```js{4}
const obj = [1, 2]
const p = new Proxy(obj, {
    ownKeys(target) {
        console.log('拦截枚举操作', target)
        return Reflect.ownKeys(target)
    }
})

for (let key in p) {
    console.log(key)
}
```

3. 拦截 Object.keys()

```js{4}
const obj = { foo: 'bar' }
const p = new Proxy(obj, {
    ownKeys(target) {
        console.log('拦截 Object.keys() 操作', target)
        return Reflect.ownKeys(target)
    }
})

Object.keys(p)

// or
// for (let key in Object.keys(p)) {
//     console.log(key)
// }
```

4. 拦截 <code>...</code> 扩展符

```js{4}
const obj = { foo: 'bar' }
const p = new Proxy(obj, {
    ownKeys(target) {
        console.log('拦截 ... 操作符', target)
        return Reflect.ownKeys(target)
    }
})

const o = { ...p }
```

## 拦截 `in` 操作符

<code>handler.has()</code> 用于拦截 `in` 操作符

```js{4}
const obj = { foo: 'bar' }
const p = new Proxy(obj, {
    has(target, prop) {
        console.log('拦截 in 操作符', target)
        return Reflect.has(target, prop)
    }
})

'foo' in p
```

## 拦截 delete 操作

<code>handler.deleteProperty()</code> 用于拦截对象属性的 `delete` 操作

```js{4}
const obj = { foo: 'bar' }
const p = new Proxy(obj, {
    deleteProperty(target, prop) {
        console.log('拦截 delete 操作', target)
        return Reflect.deleteProperty(target, prop)
    }
})

delete p.foo
```

## 拦截函数调用

<code>handler.apply()</code> 可以拦截函数调用

```js{4}
const sum = (a, b) => a + b
const p = new Proxy(sum, {
    apply(target, thisArg, argumentsList) {
        console.log('拦截函数调用', argumentsList)
        return Reflect.apply(target, thisArg, argumentsList)
    }
})

console.log(p(1, 2))
```