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
