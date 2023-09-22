// ? 问题： 如果对象是嵌套的，如何对子孙对象进行代理呢 ？
//    解决方法：在 get 拦截器中 判断当前访问的值是否是对象类型，
//             如果是，则将其转换为 proxy
//             显然，这是一种惰性处理；相比vue2 直接递归地处理 data 数据，vue3 这种处理方式更加高效

const data = {
  foo: 'bar',
  info: {
    name: 'wang'
  }
}

// 当前注册（激活）的副作用函数
let activeEffect
// 用来注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
  activeEffect = null
}

const bucket = new WeakMap()

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
}
// 在 set 拦截器中调用 trigger 函数触发变化
function trigger(target, prop) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const deps = depsMap.get(prop)
  if (!deps) return
  // 触发依赖更新
  deps.forEach(fn => fn())
}

function isObject(val) {
  return val && typeof val === 'object'
}

const proxy = reactive(data)

let result

effect(() => {
  result = proxy.info.name
})

console.log(result) // wang

proxy.info.name = 'ethan'

console.log(proxy.info.name) // ethan
