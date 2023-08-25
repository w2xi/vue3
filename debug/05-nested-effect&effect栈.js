// * 嵌套的 effect
// !【Solution】: 副作用函数执行之后，使用 effectStack 副作用函数栈进行处理
// ! 注意: 不能简单在地在副作用函数执行之后，重置 activeEffect = null，这会导致外层副作用 activeEffect 为 null，从而无法正确收集依赖

import { reactive, effect } from './utils/reactive.js'

const data = {
  foo: 'bar',
  bar: 'baz'
}

const proxy = reactive(data)

// * 嵌套的 effect
// 这里，effectFn1 内部嵌套了 effectFn2
// 显然，effecFn1 的执行会导致 effectFn2 的执行
// ? 那么什么场景会出现这种情况呢？
// 拿 Vue 来举例，其实组件的渲染函数就是在 effect 中执行的

// 组件A
// const ComponentA = {
//   render() { return ... }
// }
// 在一个 effect 中执行组件的渲染函数：
// effect(() => {
//   ComponentA.render()
// })
// 当组件发生嵌套时，例如，组件A嵌套组件B:
// const ComponentB = {
//   render() {
//     return <ComponentA /> // JSX 写法
//   }
// }
// 此时就发生了 effect 嵌套，相当于：
// effect(() => {
//   ComponnetA.render()
//   effect(() => {
//     ComponnetB.render()
//   })
// })

effect(function effectFn1() {
  console.log('effectFn1 执行')
  effect(function effectFn2() {
    console.log('effectFn2 执行')
    proxy.bar
  })
  proxy.foo
})

proxy.bar = 'xxx'
