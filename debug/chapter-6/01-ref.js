import { effect, ref } from '../utils/reactive.js'

// 实现 ref 方法

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
