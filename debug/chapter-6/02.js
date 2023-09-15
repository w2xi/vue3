import { effect, ref, reactive } from '../utils/reactive.js'

const refVal1 = ref(1)
const refVal2 = reactive({ value: 1 })

// 如何区分 refVal1 和 refVal2 ?
// 在 ref 方法内部给 包裹对象新增 __v_ifRef 属性
