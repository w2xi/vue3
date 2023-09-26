// ?将模板编译为渲染函数的过程

// 模板解析，ast转换，代码生成

// ?#parse
// 模板 -> parse(str) -> 模板 AST
const template = `<div id="app">app</div>`
const templateAST = parse(template)

// ?#transform
// 模板 AST -> transform(ast) -> JS AST
const jsAST = transform(templateAST)

// ?#generate
// jsAST -> generate(ast) -> 渲染函数字符串 (类似这种形式: `function render() {/*...*/}`)
const code = generate(jsAST)
