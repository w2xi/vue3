import { baseCompile } from './compile.js'
import { generate } from './codegen.js'
import { parse } from './parse.js'
import { transform } from './transform.js'
import { dump } from './util.js'

/**
 * 将模板编译为渲染函数
 * @param {String} template 模板
 * @returns
 */
export function compileToFunction(template) {
  const { code } = baseCompile(template)
  const render = new Function(code)()
  return render
}

// console.log(
//   '[render]:',
//   compileToFunction('<div><p>{{ msg }}</p><p>React</p></div>').toString()
// )

const ast = parse(
  '<div id="foo" class="bar"><p>{{ msg }}</p><p>React</p></div>'
)

console.log('[模板AST]:')
console.dir(ast, { depth: null })

transform(ast)
console.log('[JS AST]:')
// console.dir(ast, { depth: null })
console.dir(ast.codegenNode, { depth: null })

const { code } = generate(ast)
console.log('[render function string]:')
console.log(code)

// output:
// [render function string]:
// 'return function render(_ctx) {
//     return h('div', [h('p', _ctx.msg), h('p', 'React')])
// }'

// const render = new Function(code)()

// console.log('[render function]:')
// console.log(render.toString())
// output:
// 'function render(_ctx) {
//     return h('div', [h('p', _ctx.msg), h('p', 'React')])
// }'
