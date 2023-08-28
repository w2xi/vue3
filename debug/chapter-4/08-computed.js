// 计算属性 computed & 懒执行(lazy)的 computed

import { reactive, effect, computed } from '../utils/reactive.js'

const data = {
  foo: 1
}
const proxy = reactive(data)

// 计算属性功能：
// 1. 惰性求值，需要的时候才求值
// 2. 第一次求值之后，如果依赖项没有发生变化，再求访问时，不应该重新计算求值，因此需要缓存之前的值；
//    如果依赖项发生变化，需要重新计算求值
const computedFoo = computed({
  get() {
    return proxy.foo
  },
  set(newVal) {
    proxy.foo = newVal
  }
})

console.log(computedFoo.value) // 1

proxy.foo = 2

// 改变 foo 后，需要重新求值
console.log(computedFoo.value) // 2

computedFoo.value = 3

console.log(computedFoo.value) // 3

console.log('--------------')

//? 在一个 effect 中读取计算属性的值
effect(() => {
  console.log(computedFoo.value)
})

// 当 proxy.foo 值发生变化的时候，副作用函数会重新执行么 ？
// 显然不会
// 分析发现，这本质上是一个 effect 嵌套问题
// 计算属性内部有自己的 effect，并且是懒执行的，只有当读取的时候才会执行
// 对于计算属性的 getter 来说，它里面访问的响应式数据只会把 computed 内部的
// effect 收集为依赖；而当把 计算属性用于另一个 effect 时，就会发生 effect 嵌套，
// 外层的 effect 不会被内层的 effect 响应式数据收集
//! [solution]: 读取计算属性时，手动调用 track 函数追踪依赖；当计算属性的响应式数据改变时，手动调用 trigger 函数触发响应

proxy.foo = 'x'
