// 计算属性 computed

import { reactive, effect } from './utils/reactive.js'

const data = {
  foo: 1
}
const proxy = reactive(data)

function ref(val) {
  let _value = val
  const obj = {
    get value() {
      return _value
    },
    set value(newVal) {
      _value = newVal
    }
  }
  return reactive(obj)
}

function computed(fn) {
  let cache
  let dirty = true // 是否是脏数据. 脏数据需要重新计算求值，否则从缓存拿
  const getter = typeof fn === 'function' ? fn : fn.get
  const setter = fn.set
  return {
    get value() {
      if (dirty) {
        const result = effect(getter, {
          scheduler(effectFn) {
            // 依赖项的变化会触发调度函数的执行
            effectFn()
            dirty = true
          }
        })
        dirty = false
        cache = result
        return result
      } else {
        // 从缓存拿数据
        console.log('cache', cache)
        return cache
      }
    },
    set value(newVal) {
      if (typeof setter === 'function') {
        setter(newVal)
      }
    }
  }
}

// 计算属性功能：
// 1. 惰性求值，需要的时候才求值
// 2. 第一次求值之后，如果依赖项没有发生变化，再求访问时，不应该重新计算求值，因此需要缓存之前的值；
//    如果依赖项发生变化，需要重新计算求值
const foo = computed({
  get() {
    return proxy.foo
  },
  set(newVal) {
    proxy.foo = newVal
  }
})

console.log(foo.value) // 1

proxy.foo = 2

// 改变 foo 后，需要重新求值
console.log(foo.value)

foo.value = 3

console.log(foo.value) // 3
