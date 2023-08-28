// 调度执行
// * 需求：trigger 触发副作用函数执行时，改变副作用函数的执行时机

import { reactive, effect } from '../utils/reactive.js'

const data = { count: 0 }
const proxy = reactive(data)

// 将同一个副作用函数的多次执行 转换为 执行一次
const jobQueue = new Set()
// 注册微任务
const p = Promise.resolve()
// 是否正在刷新队列
let isFlushing = false

function flushJob() {
  if (isFlushing) return
  isFlushing = true
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    isFlushing = false
  })
}

effect(
  () => {
    console.log(proxy.count)
  },
  {
    // 调度，改变副作用函数的执行时机
    scheduler(effectFn) {
      // #example1
      jobQueue.add(effectFn)
      flushJob()
      // #example2
      // setTimeout(effectFn, 0)
    }
  }
)

// * #example1 改变副作用函数的执行次数

proxy.count++
proxy.count++

// outout:
// 0
// 2
// 2

// 现在我们期望得到:
// 0
// 2

// * #example2 改变副作用函数的执行时机
// proxy.count++

// console.log('end')

// output:
// 0
// 1
// end

// 如果我们期望输出：
// 0
// end
// 1

// 我们应该如何实现呢？
// 改造 effect 函数，传入配置项，比如 schedular 调度函数，然后在在 schedular 中执行 副作用函数
