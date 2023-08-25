// ? 问题：副作用函数中 proxy.count++ 导致无限递归循环
// 解决：当在副作用函数中更新 proxy.count 时，activeEffect 的值指向当前副作用函数，
// 它和收集依赖的 副作用函数是同一个！！！这不就正好可以解决问题了么！

import { reactive, effect } from './utils/reactive.js'

const data = {
  count: 0
}

const proxy = reactive(data)

// proxy.count++ <=> proxy.count = proxy.count + 1
// 读取 proxy.count 触发依赖收集，设置触发副作用函数执行 ......
// 显然这会导致副作用函数无限递归循环
// 那这个问题应该如何解决呢？
// * 我们注意到，当在副作用函数中更新 proxy.count 时，activeEffect 的值指向当前副作用函数，
// * 它和收集依赖的 副作用函数是同一个！！！这不就正好可以解决问题了么！

effect(() => {
  proxy.count++
  console.log(proxy.count)
})
