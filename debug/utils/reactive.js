const bucket = new WeakMap()

// 当前注册（激活）的副作用函数
let activeEffect
// 用来注册副作用函数
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
    activeEffect = null
  }
  // activeEffect.deps 用来存储与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
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

function reactive(val) {
  const proxy = new Proxy(val, {
    get(target, prop, receiver) {
      const result = Reflect.get(target, prop, receiver)
      // 如果访问的是一个对象，则将该对象转换为 proxy
      if (isObject(result)) {
        return reactive(result)
      }
      track(target, prop)
      return result
    },
    set(target, prop, newVal, receiver) {
      Reflect.set(target, prop, newVal, receiver)
      trigger(target, prop)
      return true // 这里一定要加上返回值 且为 truthy 的值 不然 nodejs 会报错 坑！！！
    }
  })
  return proxy
}

// 在 get 拦截器中调用 track 函数追踪变化
function track(target, prop) {
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
function trigger(target, prop) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(prop)
  if (!effects) return
  // ! 解决无限循环问题
  const effectsToRun = new Set(effects)
  // 触发依赖更新
  effectsToRun.forEach(effectFn => effectFn())
}

function isObject(val) {
  return val && typeof val === 'object'
}

export { reactive, effect }
