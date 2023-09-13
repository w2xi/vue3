import { reactive, effect } from '../../utils/reactive.js'

// 代理 forEach (Map)

const m = new Map([['a', 1]])
const p = reactive(m)

effect(() => {
  p.forEach((value, key, map) => {
    console.log(value, key, map)
  })
})

p.set('b', 2)

console.log('*******************')

const key = { key: 1 }
const value = new Set([1, 2, 3])
const p2 = reactive(new Map([[key, value]]))

effect(() => {
  p2.forEach((value, key) => {
    console.log(value.size)
  })
})

// p2.get(key) 拿到的 value 默认是一个原始数据，因此执行 delete 方法时不会触发响应式
// 因此，在拦截 get 方法时，如果拿到的是一个对象，则使用 reactive 将其转换为响应式对象，
// 这样在执行 delete 方法时就能触发副作用函数的重新执行
p2.get(key).delete(1)

console.log('*********** forEach value **********')

const p3 = reactive(new Map([['a', 1]]))

effect(() => {
  // forEach 循环不仅关心集合的键，还关心集合的值
  p3.forEach((value, key) => {
    console.log(value)
  })
})

// 也应该触发更新
p3.set('a', 2)
