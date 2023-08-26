export function isObject(val) {
  return val && typeof val === 'object'
}

// 递归遍历 obj
export function traverse(obj, seen = new Set()) {
  // 避免循环引用
  if (seen.has(obj)) return
  seen.add(obj)
  for (let key in obj) {
    if (isObject(obj[key])) {
      traverse(obj[key])
    } else {
      obj[key]
    }
  }
  return obj
}
