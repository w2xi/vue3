import { reactive } from '../utils/reactive.js'
import { effect } from '../utils/effect.js'
import { ref, toRefs } from '../utils/ref.js'

//? 1. 如何区分 refVal1 和 refVal2 ?
// 在 ref 方法内部给 包裹对象新增 __v_isRef 属性，后面自动脱 ref 会用到
const refVal1 = ref(1)
const refVal2 = reactive({ value: 1 })

//? 2. 响应式丢失问题
const obj = reactive({ foo: 1, bar: 2 })
const newObj = { ...obj } // ... 导致响应式丢失

effect(() => {
  console.log(newObj.foo)
})

// 不会触发响应，因为丢失响应式了
newObj.foo = 11

console.log('***** 解决响应式丢失问题 ******')

// 那如何解决响应式丢失的问题呢 ？
// 考虑如下实现：
// newObj2 对象具有和 obj 同名的属性，且属性是访问器属性
// 读取 newObj2 对象的属性其实读取的是 obj 对象对应的属性，从而达到建立响应式联系
const newObj2 = {
  // foo: toRef(obj, 'foo'),
  // bar: toRef(obj, 'bar'),
  ...toRefs(obj)
}

effect(() => {
  console.log(newObj2.foo.value)
})

// 可以触发响应
newObj2.foo.value = 111
