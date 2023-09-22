import { reactive } from '../utils/reactive.js'
import { effect } from '../utils/effect.js'

const data = {
  foo: 1,
  get bar() {
    return this.foo
  }
}

console.log(data.bar) // 1
console.log(Reflect.get(data, 'bar', { foo: 'x' })) // x

// Reflect.get(target, propertyKey[, receiver])
// receiver：
//     如果 target 指定了 getter，receiver 则为 getter 调用时的 this 值

const obj = {
  foo: 1,
  get bar() {
    // 访问器属性 bar
    return this.foo
  }
}
const proxy = reactive(obj)

effect(() => {
  // 读取 proxy.bar，被 get 拦截器拦截
  // 内部的 this 指向 data
  // 然后读取 data.foo，而不是 proxy.foo，从而导致无法建立 foo 属性和副作用函数之间的依赖关系
  console.log(proxy.bar)
  //! [solution]: Reflect.get(target, prop, receiver) 指定 receiver
})

proxy.foo++
