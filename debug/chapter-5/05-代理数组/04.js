import { reactive } from '../../utils/reactive.js'
import { effect } from '../../utils/effect.js'

//* 数组的查找方法

const arr1 = reactive([1])

effect(() => {
  console.log(arr1.includes(1))
})

arr1[0] = 0

// 会按照预期工作 (it works as expected)
// true
// false

console.log('*************')

const obj2 = {}
const arr2 = reactive([obj2])

effect(() => {
  console.log(arr2.includes(arr2[0]))
})

// 结果是 false，显然不是我们预期的结果
// 分析:
// arr2.includes 方法内部，this 指向 arr2，因此 this[index] 得到的也是一个 代理对象
// arr2[0] 会被get拦截，最终得到的是一个代理对象
// 现在问题变成了 对同一个 obj 的代理对象相等么 ？
//* no 并不相等
//* example:
// const obj = {}
// new Proxy(obj, {}) === new Proxy(obj, {}) //* false
// 在 get 拦截函数中，当访问的元素值是一个对象时，
// 我们会使用 reactive 将其转为一个全新的 proxy
// 所以，可以在这上面做点文章，使用一个 Map，保存 对象到代理对象的一个隐射
// 当再次访问该对象时，直接返回代理对象，即可解决该问题

console.log('*************')

const obj3 = {}
const arr3 = reactive([obj3])

effect(() => {
  console.log(arr3.includes(obj3))
})

//* 得到结果是: false，而不是我们预期的 true
// 分析得知，和之前的情况类似，arr3.includes 内部访问的是 代理对象
// 而 obj3 是一个 普通对象，显然，它们是不相等的
//? 那么如何解决呢 ？
//* [solution] 拦截 includes 函数
// arr3.includes 会访问 includes 方法，
// 因此会触发 get 拦截函数
