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
console.log('[render function]:')
console.log(code)

// output:
// [render function]:
// function render(_ctx) {
//     return h('div', [h('p', _ctx.msg), h('p', 'React')])
// }

const render = new Function(code)
