import { isObject, traverse, hasOwn } from './index.js'

const bucket = new WeakMap()
const ITERATE_KEY = Symbol()

// 当前注册（激活）的副作用函数
let activeEffect
// ! 副作用函数栈，activeEffect 指向栈顶，保证 activeEffect 始终指向正确的副作用函数
// ! 用来解决 effect 嵌套问题
const effectStack = []

// 用来注册副作用函数
export function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const result = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return result
  }
  // activeEffect.deps 用来存储与该副作用函数相关联的依赖集合
  effectFn.deps = []
  effectFn.options = options
  if (!options.lazy) {
    // 执行副作用函数
    effectFn()
  }
  return effectFn
}

// 清除依赖关系
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    // 依赖集合
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  // 重置
  effectFn.deps.length = 0
}

export function reactive(obj) {
  return createReactive(obj)
}
export function shallowReactive(obj) {
  return createReactive(obj, true)
}

export function readonly(obj) {
  return createReactive(obj, false, true)
}

export function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}

/**
 * 将对象转为响应式对象
 * @param {Object} obj 代理对象
 * @param {Boolean} isShallow 是否浅响应
 * @param {Boolean} isReadonly 是否只读
 * @returns
 */
function createReactive(obj, isShallow = false, isReadonly = false) {
  const proxy = new Proxy(obj, {
    get(target, prop, receiver) {
      if (prop === 'raw') {
        return target
      }
      if (!isReadonly && typeof prop !== 'symbol') {
        // 非只读 且 非symbol类型 才建立响应式联系
        track(target, prop)
      }
      const result = Reflect.get(target, prop, receiver)
      if (isShallow) {
        // 浅响应
        return result
      }
      if (isObject(result)) {
        return isReadonly ? readonly(result) : reactive(result)
      }
      return result
    },
    set(target, prop, newVal, receiver) {
      if (isReadonly) {
        console.warn(`prop "${prop}" in ${target} is readonly`)
        return true
      }
      const oldVal = target[prop]
      const type = Array.isArray(target)
        ? Number(prop) < target.length
          ? 'SET'
          : 'ADD'
        : hasOwn(target, prop)
        ? 'SET'
        : 'ADD'
      const res = Reflect.set(target, prop, newVal, receiver)

      if (target === receiver.raw) {
        // 说明 receiver 是 target 的代理对象
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          // 排除 NaN 类型
          trigger(target, prop, type, newVal)
        }
      }
      return res // 一定要有返回值: Boolean 类型
    },
    // 拦截 prop in obj
    has(target, prop) {
      track(target, prop)
      return Reflect.has(target, prop)
    },
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/ownKeys
    // 拦截 for ... in | Object.keys | Reflect.ownKeys | ...
    ownKeys(target) {
      console.log('xxxx')
      // 如果目标对象 target 是数组，则使用 length 属性建立响应联系
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, prop) {
      if (isReadonly) {
        console.warn(`prop "${prop}" in ${target} is readonly`)
        return true
      }
      const hadKey = hasOwn(target, prop)
      // 执行删除操作
      const res = Reflect.deleteProperty(target, prop)
      if (res && hadKey) {
        // 只有当被删除的属性是对象自己的属性并且成功删除时，才触发更新
        trigger(target, prop, 'DELETE')
      }
      return res
    }
  })
  return proxy
}

// 在 get 拦截器中调用 track 函数追踪变化
export function track(target, prop) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(prop)
  if (!deps) {
    depsMap.set(prop, (deps = new Set()))
  }
  deps.add(activeEffect) // 收集副作用函数
  activeEffect.deps.push(deps)
}

// 在 set 拦截器中调用 trigger 函数触发变化
export function trigger(target, prop, type, newVal) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(prop)
  // ! 解决无限循环问题
  const effectsToRun = new Set()
  effects &&
    effects.forEach(effectFn => {
      // ! 用来解决 在副作用函数中执行 proxy.count++ 类似问题，即
      // ! 如果 trigger 触发执行的副作用函数和当前正在执行的副作用函数相同，则不触发执行
      if (activeEffect !== effectFn) {
        effectsToRun.add(effectFn)
      }
    })
  // 只有操作类型是 `ADD` | `DELETE` 时，才触发与 ITERATE_KEY 相关联的副作用函数重新执行
  if (type === 'ADD' || type === 'DELETE') {
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects &&
      iterateEffects.forEach(effectFn => {
        if (activeEffect !== effectFn) {
          effectsToRun.add(effectFn)
        }
      })
  }
  if (type === 'ADD' && Array.isArray(target)) {
    // 如果是新增操作且 target 是数组，说明需要触发 length 属性对应的 副作用函数的执行
    const lengthEffects = depsMap.get('length')
    lengthEffects &&
      lengthEffects.forEach(effectFn => {
        if (activeEffect !== effectFn) {
          effectsToRun.add(effectFn)
        }
      })
  }
  if (Array.isArray(target) && prop === 'length') {
    // 设置数组长度
    depsMap.forEach((effects, key) => {
      // 只有当 key 是数组索引且 key 大于等于新设置的数组长度时才会触发执行
      if (key >= newVal) {
        effects.forEach(effectFn => {
          if (activeEffect !== effectFn) {
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }
  // 触发依赖更新
  effectsToRun.forEach(effectFn => {
    const options = effectFn.options
    if (options.scheduler) {
      options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}

// 计算属性
export function computed(fn) {
  // 缓存上一次计算的值
  let value
  // 标识是否是脏数据. 如果是脏数据需要重新计算求值，否则从缓存拿
  let dirty = true
  const getter = typeof fn === 'function' ? fn : fn.get
  const setter = fn.set
  let obj

  const effectFn = effect(getter, {
    // 依赖项发生变化 执行调度函数
    scheduler() {
      if (!dirty) {
        dirty = true
        // 当计算属性依赖的响应式数据变化时，手动调用 trigger 触发响应 执行副作用函数
        trigger(obj, 'value')
      }
    },
    lazy: true // 懒执行 (副作用函数)
  })

  obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      // 当读取 value 时，手动追踪依赖
      track(obj, 'value')
      return value
    },
    set value(newVal) {
      if (typeof setter === 'function') {
        setter(newVal)
      }
    }
  }
  return obj
}

/**
 * 观测的响应式数据变化，执行回调
 * @param {Object|Function} source 对象或者getter
 * @param {Function} cb 回调函数
 */
export function watch(source, cb, options = {}) {
  // 定义旧值和新值
  let oldValue, newValue
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    // 递归读取对象属性
    getter = () => traverse(source)
  }
  // 存储用户注册的过期回调
  let cleanup
  function onInvalidate(fn) {
    cleanup = fn
  }

  // 提取 scheduler 为一个独立的函数
  const job = () => {
    // 执行副作用函数 得到新值
    newValue = effectFn()
    if (cleanup) {
      // 调用过期回调
      cleanup()
    }
    cb(newValue, oldValue, onInvalidate)
    // 更新旧值
    oldValue = newValue
  }

  const effectFn = effect(getter, {
    // 懒执行
    lazy: true,
    scheduler() {
      // flush: 'pre'(组件更新前) | 'post'(组件更新后) | sync (同步，默认方式)
      if (options.flush === 'post') {
        const p = Promise.resolve()
        p.then(job)
      } else {
        job()
      }
    }
  })

  if (options.immediate) {
    // 表示立即执行回调
    job()
  } else {
    oldValue = effectFn()
  }
}
