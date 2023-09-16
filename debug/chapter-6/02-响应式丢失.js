import { effect, reactive } from '../utils/reactive.js'
import { ref } from '../utils/ref.js'

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

// 抽离重复结构 封装成 toRef 函数
function toRef(obj, prop) {
  return {
    get value() {
      return obj[prop]
    },
    set value(newVal) {
      obj[prop] = newVal
    }
  }
}
// 如果响应式数据键非常多，直接调用 toRefs 一次性转换
function toRefs(obj) {
  const ret = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}

effect(() => {
  console.log(newObj2.foo.value)
})

// 可以触发响应
newObj2.foo.value = 111
