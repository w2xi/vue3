import { reactive, effect } from '../../utils/reactive.js'

//* Topic: 数组的索引和长度

// 我们知道，当设置的索引大于数组原先的长度时，数组的长度会发生改变
// example: const arr = [1,2,3]; arr[100] = 100; 此时 arr.length = 100
// 因此，如果在 effect 中读取了 length 属性，在数组长度发生变化时，我们也应该要触发执行
// 但是目前还做不到这一点

const arr = reactive([1, 2, 3])

effect(() => {
  console.log(arr.length)
})

// 需要触发执行
// 修改索引值会会影响长度
arr[100] = 100

console.log('*****************')

effect(() => {
  console.log(arr[0])
  console.log(arr[1])
})

// 反过来
// 修改数组长度也会影响 数组元素
// 当修改的长度大于等于当前访问的索引时，才需要触发执行
// 因此访问的索引小于修改的长度时不会被影响
arr.length = 1
