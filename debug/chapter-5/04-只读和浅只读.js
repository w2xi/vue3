import { reactive, readonly, shallowReadonly } from '../utils/reactive.js'
import { effect } from '../utils/effect.js'

// 只读 & 浅只读
// 应用：比如，组件接收的 props 是只读的

// 只读意味着:
// 1. 不能设置和删除
// 2. 无需追踪依赖
const p = readonly({ foo: 1, bar: { a: 1 } })
const shallowP = shallowReadonly({ bar: { a: 1 } })

effect(() => {
  p.bar.a
})

p.bar.a = 2 // 修改会得到一个警告

effect(() => {
  shallowP.bar.a
})

shallowP.bar.a = 2 // 可以修改，但不是响应式的

console.log(shallowP) // { bar: { a: 2 } }

console.log('------------')

const original = reactive({
  foo: {
    bar: 1
  },
  baz: 0
})
const copy = readonly(original)

effect(() => {
  // 读取 copy.baz，触发 copy 的 set 拦截函数，此时 target 是 original
  // Reflect.get(original, 'baz') 触发 original 的 set 拦截函数
  // 因此 副作用函数 和 copy.baz，original.baz 都建立了联系
  console.log(copy.baz)
})

original.baz = 2 // 触发副作用函数执行
