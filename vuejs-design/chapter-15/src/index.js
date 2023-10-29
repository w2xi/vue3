import { generate } from './generate.js'
import { parse, tokenize } from './parse.js'
import { transform } from './transform.js'
import { dump } from './util.js'

const template = '<p>Vue</p>'
const tokens = tokenize(template)

console.log('[tokens]', tokens)

// output:

// [
//   { type: 'tag', name: 'p' },
//   { type: 'text', content: 'Vue' },
//   { type: 'tagEnd', name: 'p' },
// ]

const ast = parse('<div><p>Vue</p><p>React</p></div>')

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
// function render() {
//     return h('div', [h('p', 'Vue'), h('p', 'React')])
// }
