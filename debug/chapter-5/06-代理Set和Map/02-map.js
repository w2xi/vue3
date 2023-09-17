import { reactive } from '../../utils/reactive.js'
import { effect } from '../../utils/effect.js'

// Map 的响应式
// map.get 建立响应式联系
// map.set 触发响应

const m = new Map()
m.set('a', 1)

const p = reactive(m)

effect(() => {
  // console.log('size: ', p.size);
  console.log(p.get('a'))
})

// p.set('b', 1)
p.set('a', 2)
