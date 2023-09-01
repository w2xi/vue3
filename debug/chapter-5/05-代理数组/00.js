import { reactive, effect, watch } from '../../utils/reactive.js'

// 代理数组
// 分析：
// 数组本身也是对象 不过是一个特殊的对象
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
  console.log(p[0])
})

// 可以正常触发响应 因为已经建立了联系
p[0] = 4
