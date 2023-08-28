import { reactive, effect } from '../utils/reactive.js'

// has | ownKeys | deleteProperty 拦截器

const data = {
  foo: 1
}
const proxy = reactive(data)

effect(() => {
  // 'foo' in proxy // has 拦截
  // for ... in 循环 // ownKeys 拦截
  for (const key in proxy) {
    console.log(key)
  }
})

// proxy.foo++ // 单纯更新属性值 不应该触发副作用函数的执行，没必要浪费性能
// proxy.bar = 2 // 新增属性，需要触发副作用函数重新执行

delete proxy.foo // 如果删除的属性在对象上，会影响 for 循环，因此需要手动触发 执行副作用函数

console.log(proxy)
