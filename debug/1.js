const o = {
  foo: 'bar',
  name: 'wang'
}

// 当前激活的副作用函数，我们需要收集的就是它
// 当 对象属性值发生变化的时候 就重新执行该函数
let ectiveEffect

// 假设有个 `桶` 用来收集依赖项
const bucket = new Set() // 防止添加重复依赖项

const proxy = new Proxy(o, {
  get(target, prop) {
    if (!ectiveEffect) return target[prop]
    // 需要收集依赖项
    bucket.add(ectiveEffect)
    return target[prop]
  },
  set(target, prop, newVal) {
    target[prop] = newVal
    // 触发依赖更新
    bucket.forEach(fn => fn())
    return true
  }
})

function effect(fn) {
  ectiveEffect = fn
  fn()
  ectiveEffect = null // reset
}

let result

// 假设有一个叫 `副作用` 的一个函数，它会在 foo 属性每次变化的时候 重新执行
// 这样就可以达到我们需要的效果
effect(() => {
  result = proxy.foo
})
// 可以认为 副作用函数就是订阅者 订阅了 代理属性
// 所以就需要建立一个 依赖关系
// target ( WeakMap )
//    ---- foo ( Map )
//          --- fn 副作用函数 ( Set )
effect(() => {
  proxy.name
})

// 问题:
// 1. proxy.foo // 这样读取 不应该依赖追踪 因为 无副作用函数
// 2. 副作用执行后 需要置空 activeFn，防止读取其他属性时 添加错误依赖项

console.log(result) // bar

proxy.foo = 'baz' // 修改值 导致副作用函数重新执行

// we expect input:
console.log(result) // baz

console.log(bucket.size)

console.log(proxy.name) // wang
