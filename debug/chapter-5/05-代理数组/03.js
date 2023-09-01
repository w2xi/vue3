import { reactive, effect } from '../../utils/reactive.js'

//* 遍历数组 for ... of

// 自定义迭代器
function createIterator(arr) {
  let index = 0
  let len = arr.length
  return {
    next() {
      return {
        value: index < len ? arr[index] : undefined,
        done: index++ < len
      }
    }
  }
}
const iterate = createIterator([1, 2])
// console.log(iterate.next())
// console.log(iterate.next())
// console.log(iterate.next())

const arr = reactive([1, 2])

effect(() => {
  // for of 会访问 arr[index] 和 arr.length
  // 因此，数组的索引和length 属性都和副作用函数建立了联系
  for (let item of arr) {
    console.log(item)
  }
})

// 因此，更新，新增，改变数组长度都能触发响应
// 但是，有个问题: for ... of 访问的是数组内部的 Symbol.iterator 属性，因此会建立
// Symbol.iterator 属性和副作用函数之间的联系，但是为了避免发生错误，因该屏蔽该属性
// arr[1] = 3
// arr[2] = 3
arr.length = 1
