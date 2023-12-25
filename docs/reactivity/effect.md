# 响应式系统

## 引子

## 响应式数据和副作用函数

副作用函数指的是会产生副作用的函数，如下代码所示：

```js{4}
function effect() {
  document.body.innerText = 'Hello Vue3'
}
```

当执行 `effect` 函数时，会设置 body 的文本内容，但除了 effect 函数之外的任何函数都可以读取或设置 body 的文本内容。

也就是说 effect 函数的执行会直接或间接地影响其他函数地执行，这时我们说 effect 函数产生了副作用。

副作用很容易产生，例如一个函数修改了全局变量，如下面的代码所示：

```js{4}
let foo = 'bar'

function effect() {
  foo = 'baz'
}
```

了解了什么是副作用函数，再来看看什么是响应式数据。

假设在一个副作用函数中读取了某个对象的属性：

```js{4}
function effect() {
  document.body.innerText = obj.text
}
```

如上代码所示，副作用函数 `effect` 的执行会读取 `obj.text` 的值，然后将值设置给 `body.innerText`，当 `obj.text` 的值发生变化时，我们希望副作用函数 `effect` 可以重新执行。

```js{4}
obj.text = 'Hello vue3' // 修改 obj.text 的值
```

很明显，修改 `obj.text` 的值并不会让 `effect` 副作用函数重新执行。

因为 `obj` 现在只是一个普通对象，并不是响应式数据。

接下来我们来看看如何让数据变成响应式数据。

## 响应式数据的基本实现

现在我们已经知道：
- 副作用函数 `effect` 的执行会触发 `obj.text` 的读取操作
- 修改 `obj.text` 的值会触发 `obj.text` 的设置操作

因此，如果我们可以拦截 `obj` 对象的读取和赋值操作，当读取 `obj.text` 时，我们可以把副作用函数 `effect` 存储到一个 '桶' 里；当修改 `obj.text` 时，把它从 '桶' 里取出来执行，从而达到了我们的目的。

```js{4}
function effect() {
  document.body.innerText = obj.text
}
```

现在问题的关键变成了：如何才能拦截一个对象的读取和设置操作？

在 `ES6` 之前，只能通过 `Object.defineProperty` 函数来实现，这也是 vue2 的实现方式。在 `ES6+` 中，可以使用 `Proxy` 来实现，这也是 vue3 采用的方式。

在 [前置知识](../prerequisites/proxy-and-reflect.md) 一节中，我们已经了解了如何使用 `Proxy` 拦截一个对象的读取和设置操作，这里就直接上代码：


```js{4}
// 存储副作用函数的桶
const bucket = new Set()
// 原始数据
const data = { text: 'Hello' }
// 代理
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, prop, receiver) {
    // 将副作用函数存储到桶中
    bucket.add(effect)
    return Reflect.get(target, prop, receiver)
  },
  // 拦截设置操作
  set(target, prop, value, receiver) {
    const result = Reflect.set(target, prop, value, receiver)
    // 执行副作用函数
    bucket.forEach(fn => fn())
    return result
  }
})
```

如上代码所以，我们创建了一个桶 `bucket`，它是 `Set` 数据类型，接着使用`Proxy` 来拦截原始数据的读取和设置操作，从而实现了响应式数据。

现在使用下面的代码来测试一下：

```js{4}
function effect() {
  document.body.innerText = obj.text
}
// 执行副作用函数，触发读取操作
effect()

setTimeout(() => {
  // 2 秒后修改响应式数据
  obj.text = 'Hello Vue3!'
}, 2000)
```

在浏览器中运行上面的代码，可以得到预期的效果。

但是，上面的很多代码都是硬编码的，这样就非常不灵活，接下来我们尝试去掉这种硬编码的方式。

## 设计一个完善的响应式系统

