import { reactive } from './reactive.js'

export function ref(val) {
  // 包裹对象
  const wrapper = {
    value: val
  }
  // 在 wrapper 对象上定义不可枚举属性: __v_isRef
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })
  // 将包裹对象变为响应式数据
  return reactive(wrapper)
}

// 抽离重复结构 封装成 toRef 函数
export function toRef(obj, prop) {
  const wrapper = {
    get value() {
      return obj[prop]
    },
    set value(val) {
      obj[prop] = val
    }
  }
  // 定于不可枚举属性: __v_isRef
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })

  return wrapper
}
// 如果响应式数据键非常多，直接调用 toRefs 一次性转换
export function toRefs(obj) {
  const ret = {}
  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }
  return ret
}
