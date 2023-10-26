import {
  dump,
  transformElement,
  transformText,
  transformRoot
} from '../utils/index.js'

// 定义状态机的状态
const State = {
  initial: 1, // 初始化状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6 // 结束标签名称状态
}

// 判断是否是字母
function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}

// 接收模板字符串作为参数，并将模板切割为 Token 返回
function tokenize(str) {
  // 初始状态
  let currentState = State.initial
  let chars = ''
  const tokens = []

  while (str) {
    const char = str[0]
    switch (currentState) {
      case State.initial:
        if (char === '<') {
          currentState = State.tagOpen
        } else if (isAlpha(char)) {
          currentState = State.text
          chars += char
        }
        break
      case State.tagOpen:
        if (isAlpha(char)) {
          currentState = State.tagName
          chars += char
        } else if (char === '/') {
          currentState = State.tagEnd
        }
        break
      case State.tagName:
        if (isAlpha(char)) {
          chars += char
        } else if (char === '>') {
          currentState = State.initial
          // 收集 token
          tokens.push({ type: 'tag', name: chars })
          chars = ''
        } else if (char === '/') {
          currentState = State.tagEnd
        }
        break
      case State.text:
        if (isAlpha(char)) {
          chars += char
        } else if (char === '<') {
          currentState = State.tagOpen
          // 收集 token
          tokens.push({ type: 'text', content: chars })
          chars = ''
        }
        break
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName
          chars += char
        } else if (char === '>') {
          // 处理半闭合标签 <img />
          currentState = State.initial
          tokens.push({ type: 'tag', name: chars })
          chars = ''
        }
        break
      case State.tagEndName:
        if (isAlpha(char)) {
          chars += char
        } else if (char === '>') {
          currentState = State.initial
          tokens.push({ type: 'tagEnd', name: chars })
          chars = ''
        }
        break
    }
    // 每次消费一个字符
    str = str.slice(1)
  }

  return tokens
}

const template = '<p>Vue</p>'
const tokens = tokenize(template)

console.log('[tokens]', tokens)

// output:

// [
//   { type: 'tag', name: 'p' },
//   { type: 'text', content: 'Vue' },
//   { type: 'tagEnd', name: 'p' },
// ]

function parse(str) {
  // 对模板标记化
  const tokens = tokenize(str)
  // 根节点
  const root = {
    type: 'Root',
    children: []
  }
  // 维持一个元素栈，栈顶节点就是当前遍历节点的父节点
  // (遇到开始表标签，入栈；遇到结束标签，出栈)
  const elementStack = [root]

  for (let i = 0; i < tokens.length; i++) {
    // 父元素节点
    const parent = elementStack[elementStack.length - 1]
    const token = tokens[i]
    if (token.type === 'tag') {
      // 开始标签
      const elementNode = {
        type: 'Element',
        tag: token.name, // 标签名称
        children: []
      }
      parent.children.push(elementNode)
      // 入栈
      elementStack.push(elementNode)
    } else if (token.type === 'text') {
      // 文本节点
      const textNode = {
        type: 'Text',
        content: token.content
      }
      parent.children.push(textNode)
    } else if (token.type === 'tagEnd') {
      // 结束标签
      // 出栈
      elementStack.pop()
    }
  }

  return root
}

const ast = parse('<div><p>Vue</p><p>React</p></div>')

console.log('[ast]:')
console.dir(ast, { depth: null })

// output:
// {
//   type: 'Root',
//   children: [
//     {
//       type: 'Element',
//       tag: 'div',
//       children: [
//         {
//           type: 'Element',
//           tag: 'p',
//           children: [ { type: 'Text', content: 'Vue' } ]
//         },
//         {
//           type: 'Element',
//           tag: 'p',
//           children: [ { type: 'Text', content: 'React' } ]
//         }
//       ]
//     }
//   ]
// }

console.log('[dump]:')
dump(ast)

/**
 * AST 转换
 * @param {Object} ast
 */
function transform(ast) {
  const context = {
    // 当前转换的节点
    currentNode: null,
    // 当前节点在父节点的 children 中的位置索引
    childIndex: 0,
    // 当前转换节点的父节点
    parent: null,
    // 用于替换节点的函数，接收新节点作为参数
    replaceNode(node) {
      // 替换节点
      context.parent.children[context.childIndex] = node
      // 更新当前节点
      context.currentNode = node
    },
    // 移除当前节点
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1)
        // 置空当前节点
        context.currentNode = null
      }
    },
    // 注册 nodeTransforms 数组 (解耦)
    nodeTransforms: [transformRoot, transformElement, transformText]
  }
  traverseNode(ast, context)
  console.log('[dump transform]:')
  dump(ast)
}

/**
 * 深度优先遍历 AST 节点
 * @param {Object} ast
 */
function traverseNode(ast, context) {
  context.currentNode = ast
  // 先序遍历

  const exitFns = []
  const transforms = context.nodeTransforms
  for (let i = 0; i < transforms.length; i++) {
    // 执行转换操作
    // 返回待执行的一个回调函数
    const onExit = transforms[i](context.currentNode, context)
    if (onExit) {
      exitFns.push(onExit)
    }
    // 由于转换函数可能移除当前节点，因此需要在转换函数执行之后检查当前节点是否存在，如果不存在，则直接返回
    if (!context.currentNode) return
  }

  const children = context.currentNode.children
  if (children) {
    children.forEach((child, index) => {
      context.parent = context.currentNode
      context.childIndex = index
      traverseNode(child, context)
    })
  }

  let size = exitFns.length
  // 回调函数反序执行，其本质和后续遍历没啥区别
  // 保证了 先处理子节点 再处理父节点
  while (size--) {
    exitFns[size]()
  }

  // 后序遍历
  // const transforms = context.nodeTransforms
  // for (let i = 0; i < transforms.length; i++) {
  //   // console.log(ast.tag || ast.content || ast.type)
  //   // 执行转换操作
  //   transforms[i](context.currentNode, context)
  //   // 由于转换函数可能移除当前节点，因此需要在转换函数执行之后检查当前节点是否存在，如果不存在，则直接返回
  //   if (!context.currentNode) return
  // }
}

transform(ast)
console.log('[JS AST]:')
console.dir(ast.jsNode, { depth: null })

/**
 * 编译
 * @param {String} template 模板
 * @returns {String} 渲染函数字符串代码
 */
function compile(template) {
  // 模板 AST
  const ast = parse(template)
  // 将模板 AST 转换为 JS AST
  transform(ast)
  // 代码生成
  const code = generate(ast.jsNode)

  return code
}

/**
 * 代码生成
 * @param {Object} ast JS AST
 * @returns {String}
 */
function generate(node) {
  // 上下文
  const context = {
    // 存储最终生成的渲染函数代码
    code: '',
    push(code) {
      context.code += code
    }
  }
}
