import { reactive, effect } from '../../utils/reactive.js'

// 代理 Set

const s = new Set([1])
const p = reactive(s)

effect(() => {
  // 下面这样访问会报错，意思是 在不兼容的 receiver 上调用了 Set.prototype.size 方法
  // TypeError: Method get Set.prototype.size called on incompatible receiver #<Set>
  // size 是一个访问器属性，因此我们需要去修正 receiver 为原始 target
  console.log(p.size)
})

// 这需要触发副作用函数执行
// add 和 delete 都可能会改变 size 的大小

p.add(2)
p.delete(2)
