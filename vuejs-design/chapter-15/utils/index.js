/**
 * 打印AST节点信息
 * @param {*} node ast节点
 * @param {*} indent 缩进
 */
export function dump(node, indent = 0) {
  const type = node.type
  const desc =
    node.type === 'Root'
      ? ''
      : node.type === 'Element'
      ? node.tag
      : node.content
  // 打印节点的类型和描述信息
  console.log(`${'-'.repeat(indent)}${type}: ${desc}`)

  // 递归地打印子节点
  if (node.children) {
    node.children.forEach(n => dump(n, indent + 2))
  }
}

// =============================== AST 工具函数 ===============================

export function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value
  }
}

export function createIdentifier(name) {
  return {
    type: 'Identifier',
    name
  }
}

export function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements
  }
}

export function createCallExpression(callee, args) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments: args
  }
}

// =============================== AST 工具函数 ===============================

// 转换标签节点
export function transformElement(node) {
  // 将转换代码编写在退出阶段的回调函数中，
  // 这样可以保证该标签节点的子节点全部被处理完毕、
  return () => {
    if (node.type !== 'Element') {
      return
    }
    // 1. 创建 h 调用函数
    // h 函数的第一个参数是标签名称，因此以 node.tag 来创建一个字符串字面量节点
    // 作为第一个参数
    const callExp = createCallExpression('h', [createStringLiteral(node.tag)])
    // 2. 处理 h 函数调用的参数
    node.children.length === 1
      ? // 如果当前标签节点只有一个子节点，则直接使用子节点的 jsNode 作为参数
        callExp.arguments.push(node.children[0].jsNode)
      : // 如果当前标签节点有多个子节点，则创建一个 ArrayExpression 节点作为参数
        callExp.arguments.push(
          // 数组的每个元素都是子节点的 jsNode
          createArrayExpression(node.children.map(c => c.jsNode))
        )
    // 3. 将当前标签节点对应的 JS AST 添加到 jsNode 属性下
    node.jsNode = callExp
  }
}

// 转换文本节点
export function transformText(node) {
  if (node.type !== 'Text') {
    return
  }
  node.jsNode = createStringLiteral(node.content)
}

export function transformRoot(node) {
  // 将逻辑编写在退出阶段的回调函数中，保证子节点全部被处理完毕
  return () => {
    if (node.type !== 'Root') {
      return
    }
    // node 是根节点，根节点的第一个子节点就是模板的根节点，
    // 当然，这里我们暂时不考虑模板存在多个根节点的情况
    const vnodeJSAST = node.children[0].jsNode
    // 创建 render 函数的声明语句节点，将 vnodeJSAST 作为 render 函数体的返回语句
    node.jsNode = {
      type: 'FunctionDecl',
      id: { type: 'Identifier', name: 'render' },
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAST
        }
      ]
    }
  }
}
