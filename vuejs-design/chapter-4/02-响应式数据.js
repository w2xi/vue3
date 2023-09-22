// ? 问题: 如何处理数据属性和副作用函数之间的依赖关系
//    假设有多个 effect，读取不同的属性，那么如何正确处理 属性 和 副作用函数之间的依赖关系呢 ？
// !  使用 WeakMap -> Map -> Set

const o = {
  foo: 'bar',
  name: 'wang'
}

let activeFn

const bucket = new WeakMap()

const proxy = new Proxy(o, {
  get(target, prop) {
    if (!activeFn) return target[prop]

    let targetMap = bucket.get(target)
    if (!targetMap) {
      targetMap = new Map()
      bucket.set(target, targetMap)
    }
    let set = targetMap.get(prop)
    if (!set) {
      set = new Set()
      targetMap.set(prop, set)
    }
    set.add(activeFn) // 收集依赖
    console.log(targetMap.keys())

    return target[prop]
  },
  set(target, prop, newVal) {
    target[prop] = newVal
    const targetMap = bucket.get(target)
    if (!targetMap) return
    const set = targetMap.get(prop)
    if (!set) return

    // 触发依赖更新
    set.forEach(fn => fn())

    return true
  }
})

function effect(fn) {
  activeFn = fn
  fn()
  activeFn = null // reset
}

let result

effect(() => {
  result = proxy.foo
})
// 可以认为 副作用函数就是订阅者 订阅了 代理属性
// 所以就需要建立一个 依赖关系
// target ( WeakMap )
//    └── foo ( Map )
//          └── fn 副作用函数 ( Set )
effect(() => {
  console.log(proxy.name) // if `name` changed, callback will call again
})

console.log(result) // bar

proxy.foo = 'baz' // 修改值 导致副作用函数重新执行

console.log(result) // baz

proxy.name = 'Ethan'
