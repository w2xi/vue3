import { reactive } from '../../utils/reactive.js'
import { effect } from '../../utils/effect.js'

//* 隐式修改数组长度

const arr = reactive([1])

effect(function effectFn1() {
  // push 方法会读取 length 属性，因此 length 和 副作用函数effectFn1建立联系
  // 同时也会设置 length 属性
  arr.push(1)
})

effect(function effectFn2() {
  // 分析:
  // 这里 push 方法也会读取和设置 length
  // 读取 length: 建立和 effectFn2 副作用函数的联系
  // 设置 length: 首先触发 effectFn1 函数，内部会设置 length 属性，
  // 然后 触发 effectFn2 函数，如此循环往复，最后导致栈溢出
  arr.push(1)
})

//* 问题的根本原因是，push 方法会间接读取 length 属性
// 因此只要 `屏蔽` 对 length 属性的读取，就可以避免建立响应式联系
// 不过这需要重写 push 方法
// 除了 push 之外，pop / shift / unshift / splice 都需要做类似的处理

console.log(arr) // [1,1,1]
