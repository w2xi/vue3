import { reactive, effect } from '../../utils/reactive.js'

//* 遍历数组 for ... in

// 之前为了追踪普通对象的遍历，我们在 ownKeys 拦截函数中进行了手动追踪 使用了一个 ITERATE_KEY (Symbol)
// 对于普通对象来说，新增属性或删除属性都会触发执行；
// 对于数组而言：
//   1. arr[100] = 'baz' 新增元素 (本质上也是隐式地改变数组长度)
//   2. arr.length = 10  改变数组长度
//  都需要触发执行

const arr = reactive([1, 2])

effect(() => {
  for (let index in arr) {
    // ownKeys 拦截函数
    console.log(index)
  }
})

arr[2] = 3 // 新增
// arr.length = 2 // 修改数组length属性
