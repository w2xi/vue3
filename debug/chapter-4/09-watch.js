import { reactive } from '../utils/reactive.js'
import watch from '../utils/watch.js'

// watch
// 观测响应式数据的变化，然后执行相应的回调函数

const data = {
  foo: 1
}
const proxy = reactive(data)

// 观测 对象
watch(proxy, (value, oldValue) => {
  console.log(value, oldValue)
})
// 观测 getter
watch(
  () => proxy.foo,
  (value, oldValue) => {
    console.log(value, oldValue)
  }
)
// 监听 proxy 的变化，并触发回调
proxy.foo++

console.log('------- line -------')

// 立即执行的 watch
watch(
  () => proxy.foo,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
  },
  { immediate: true }
)
