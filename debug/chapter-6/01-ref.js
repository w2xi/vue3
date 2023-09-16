import { effect } from '../utils/reactive.js'
import { ref } from '../utils/ref.js'

// 原始值的响应式方案 ref
// 顾名思义，原始值，即 string number boolean null undefined symbol bigint
// 但是 JS 底层并没有提供对原始值的代理能力
// 例如：let foo = 'bar';
// 显然 JS 无法代理变量 foo 的读取和设置
// 但是如果我们把原始值包装为一个对象，例如:
// const wrapper = { value: '原始值' }
// 访问 wrapper.value 就是读取`原始值` 从而利用之前实现的 reactive
// 从而实现原始值的代理方案

console.log('****** 原始值 ******')

const name = ref('Jonna')

effect(() => {
  console.log(name.value)
})

name.value = 'Anke'

console.log('****** 对象 ******')

const info = ref({ name: 'xiao' })

effect(() => {
  console.log(info.value.name)
})

// 都需要触发响应
info.value.name = 'Anna'
info.value = {
  name: 'Lisa'
}

console.log('****** 数组 ******')

const arr = ref([1])

effect(() => {
  for (let item of arr.value) {
    console.log(item)
  }
})

arr.value.push(2)

console.log('****** 集合 ******')

const map = ref(new Map([['a', 1]]))

effect(() => {
  map.value.forEach((value, key) => {
    console.log(key, value)
  })
})

map.value.set('a', 2)
