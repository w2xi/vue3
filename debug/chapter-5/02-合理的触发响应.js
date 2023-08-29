import { reactive, effect } from '../utils/reactive.js'

//* 合理触发响应

// 1. 修改的值和之前的值相同，不应该触发响应

const data = {
  bar: 1,
  foo: NaN
}
const proxy = reactive(data)

effect(() => {
  // console.log(proxy.bar)
  // console.log(proxy.foo)
})

// 不应该触发响应。根据新旧值判断即可解决问题
proxy.bar = 1

// 这也会触发 副作用函数的重新执行。因此需要在set拦截器中做额外的处理
proxy.foo = NaN

NaN === NaN // false

// 2

const obj = {}
const proto = { bar: 1 }
const child = reactive(obj)
const parent = reactive(proto)
// 设置 parent 为 child 的原型
Object.setPrototypeOf(child, parent)

effect(() => {
  // 由于 child 自身没有 bar 属性，因此会沿着原型链查找 bar 属性
  // child.bar -> parent.bar
  // 因此，child 和 parent 的 bar 属性都会和 副作用函数建立联系
  console.log(child.bar)
})

// 副作用函数会执行两次
// 分析：
//    1. 触发 child 的 set 拦截函数，然后执行 Reflect.set(obj, 'bar', 2, child)
//    2. 由于 child 上没有 bar 属性，因此会找到其原型，并调用原型的内部[[Set]]方法
//    3. 由于 parent 本身也是代理对象，就相当于执行了它的 set 拦截函数
// 因此，child 和 parent 的 set 拦截函数都没触发了，所以副作用函数执行了两次
//? 怎么解决呢？执行了两次，屏蔽一次就行了
// 执行 child.bar = 2 时，会在 set 拦截函数执行如下两步操作:
// Reflect.set(obj, 'bar', 2, child)   // child 的 set 拦截函数
// Reflect.set(proto, 'bar', 2, child) // parent 的 set 拦截函数
// 可以看到，receiver 都是 child，因此可以通过 receiver 来进行判断
// 判断 reveiver 是否是 target 的代理对象，是才触发更新，
// 从而屏蔽了由原型引起的更新
child.bar = 2

console.log(child.raw === obj) // true
console.log(parent.raw === proto) // true
