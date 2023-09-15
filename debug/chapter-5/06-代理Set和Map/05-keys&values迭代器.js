import { reactive, effect } from '../../utils/reactive.js'

console.log('********* map.keys() *********')

const p1 = reactive(new Map([['a', 1]]))

effect(() => {
  // keys() 只关注 key 不关注 value
  // 因此当 key 发生变化需要触发响应; value 变化不应该触发响应
  for (const key of p1.keys()) {
    console.log(key)
  }
})

// 值发生变化 不应该触发响应
p1.set('a', 2) // ok

console.log('********* map.values() *********')

// const p2 = reactive(new Map([['age', 21]]))

effect(() => {
  for (const value of p2.values()) {
    console.log(value)
  }
})

// 需要触发响应
// p2.set('age', 22) // ok
