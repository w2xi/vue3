import { reactive, watch } from '../utils/reactive.js'

const data = {
  foo: 1
}
const proxy = reactive(data)

// 过期的副作用
//? 考虑 两个异步请求产生的类似竞态问题
// 前后两次修改 proxy.foo，先后发起异步请求，第一次记为 A，第二次记为 B
// 但是 A，B 请求那个先到来是不确定的
// 如果 B 先到来，那么 A 将覆盖 B 的结果，显然这不是我们需要的结果
// 我们需要的最近发起请求的结果，即 B
//? 那么如何解决这个问题呢 ？
// 想一个办法，在第二次发起请求之前，让前一次请求过期

let id = 0
let result
watch(
  () => proxy.foo,
  async (newVal, oldVal, onInvalidate) => {
    id++
    let expired = false
    // 第一次执行回调时，会注册过期回调
    // 第二次执行回调时，会执行第一次注册的过期回调，从而让第一次请求失效
    onInvalidate(() => {
      expired = true
    })
    const res = await getUserInfo(id, id === 1 ? 2000 : 1000)
    console.log(res)

    if (!expired) {
      result = res
    }
  }
)

proxy.foo++
proxy.foo++

setTimeout(() => {
  console.log('最终结果:')
  console.log(result)
}, 3000)

function getUserInfo(id, time) {
  console.log(`第${id}次请求，delay: ${time}`)
  return new Promise(resolve => {
    setTimeout(resolve, time, { id, time, name: 'wang', address: 'ShangHai' })
  })
}
