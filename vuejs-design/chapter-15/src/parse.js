import { isAlpha } from './util.js'

/**
 * 模板解析
 * @param {String} str 模板字符串
 * @returns {Object}
 */
export function parse(str) {
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

// 定义状态机的状态
const State = {
  initial: 1, // 初始化状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称状态
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6 // 结束标签名称状态
}

/**
 * 接收模板字符串作为参数，并将模板切割为 Token 返回
 * @param {String} str 模板字符串
 * @returns {Array}
 */
export function tokenize(str) {
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
