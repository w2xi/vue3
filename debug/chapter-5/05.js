import { reactive, effect, watch } from '../utils/reactive.js'

// 代理数组
// 分析：
// 对数组的读取或访问有如下一些方式：
// 1. 索引访问数组元素: arr[0]
// 2. 数组长度属性: arr.length
// 3. 遍历数组: for index in arr
// 4. 迭代器遍历: for item of arr
// 5. 数组的原型方法
//   - 不改变数组：find join concat map filter includes 等
//   - 该变数组：push pop shift unshift sort splice fill

const p = reactive([1, 2, 3])

effect(() => {
  // console.log(p[0]);
})

// 可以正常触发响应
p[0] = 4

// Topic1. 数组的索引和长度

// 我们知道，当设置的索引大于数组原先的长度时，数组的长度会发生改变
// example: const arr = [1,2,3]; arr[100] = 100; 此时 arr.length = 100
// 因此，如果在 effect 中读取了 length 属性，在数组长度发生变化时，我们也应该要触发执行
// 但是目前还做不到这一点

effect(() => {
  // console.log(p.length)
})

// 需要触发执行
// 修改索引值会会影响长度
p[100] = 100

console.log('**********************')

effect(() => {
  // console.log(p[0])
  // console.log(p[1])
})

// 反过来
// 修改数组长度也会影响 数组元素
// 当修改的长度大于等于当前访问的索引时，才需要触发执行
// 因此访问的索引小于修改的长度时不会被影响
p.length = 1

effect(() => {
  for (let index in p) {
    console.log(index)
  }
})
