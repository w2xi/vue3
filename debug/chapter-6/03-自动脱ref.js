import { reactive } from '../utils/reactive.js'
import { effect } from '../utils/effect.js'
import { toRefs, proxyRefs } from '../utils/ref.js'

// 自动脱 ref
// toRefs 函数解决了响应式丢失的问题，但也带来了新的问题
// toRefs 会把响应式数据第一层属性值转换为 ref，
// 所以需要通过 value 属性访问值，如下面代码所示:

const obj = reactive({ foo: 1, bar: 2 })
const newObj = { ...toRefs(obj) }

effect(() => {
  // 通过 value 访问属性值
  console.log(newObj.foo.value)
})

newObj.foo.value = 111

console.log('****** 自动脱 ref *******')

// 显然这会增加用户的心智负担
// 我们肯定不想在模板中这样使用: {{ foo.value }}
// 因此就需要自动脱 ref 的能力. 自动脱 ref 指的是属性的访问行为，
// 即 如果读取的属性是一个 ref, 则直接将该 ref 对应的 value 属性值返回
// 比如：newObj.foo // 1

const obj2 = reactive({ foo: 1, bar: 2 })
const newObj2 = proxyRefs({ ...toRefs(obj2) })

effect(() => {
  // 无需通过 value 访问属性值 自动脱 ref
  console.log(newObj2.foo)
})

newObj2.foo = 111
