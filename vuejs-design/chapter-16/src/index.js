import { generate } from './generate.js'
import { parse } from './parse.js'
import { transform } from './transform.js'
import { dump } from './util.js'

const ast = parse('<div><p>{{ msg }}</p><p>React</p></div>')

console.log('[模板AST]:')
console.dir(ast, { depth: null })

console.log('[dump]:')
dump(ast)

transform(ast)
console.log('[JS AST]:')
console.dir(ast.jsNode, { depth: null })

// 代码生成
const code = generate(ast.jsNode)
console.log('[render function string]:')
console.log(code)

// output:
// [render function string]:
// `return function render(_ctx) {
//     return h('div', [h('p', _ctx.msg), h('p', 'React')])
// }`

// 得到渲染函数
const render = new Function(code)()

console.log('[render function]:')
console.log(render.toString())
// output:
// function render(_ctx) {
//     return h('div', [h('p', _ctx.msg), h('p', 'React')])
// }
