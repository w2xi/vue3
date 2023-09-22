import { reactive } from '../../utils/reactive.js'
import { effect } from '../../utils/effect.js'

// 迭代器方法: keys / values / entries

const m = new Map([
  ['a', 1],
  ['b', 2]
])
const p = reactive(m)

effect(() => {
  // for ... of 会读取 p 上面的 Symbol.iterator 方法
  for (let [key, value] of p.entries()) {
    // key value 如果是可代理的 也应该是响应式数据
    console.log(key, value)
  }
})

// 需要触发响应
p.set('b', 3)
