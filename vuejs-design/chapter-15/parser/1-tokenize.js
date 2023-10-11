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

console.log(tokens)

// output:

// [
//   { type: 'tag', name: 'p' },
//   { type: 'text', content: 'Vue' },
//   { type: 'tagEnd', name: 'p' },
// ]
