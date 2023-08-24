import { reactive, effect } from './utils/reactive.js'

// 分支切换
// 副作用函数内部存在三元表达式

const obj = { name: 'wang', ok: true }

const proxy = reactive(obj)

let result

// 当 proxy.ok 为 true，会追踪 `ok` 和 `name` 属性
// 此时对应关系是
// obj
//   └── ok
//       └── effectFn()
//   └── name
//       └── effectFn()
// 当 proxy.ok 被设置为 false，会触发副作用函数的执行，
// 由于此时 proxt.name 不会被读取，只会触发 proxy.ok 的读取操作，
// 因此，理想情况下 副作用函数effectFn 不应该被 proxy.name 所对应的依赖集合收集
// 所以，现在要做的就是，在重新执行副作用函数之前，需要把 对应关系清除掉

effect(() => {
  result = proxy.ok ? proxy.name : '-'
  console.log(result, '-----')
})

// proxy.ok = false

// proxy.name = 'ethan' // 副作用函数执行了
