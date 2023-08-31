export function isObject(val) {
  return val && typeof val === 'object'
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
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

function createIterator(arr) {
  let index = 0
  return {
    next() {
      return index < arr.length
        ? { value: arr[index++], done: false }
        : { value: undefined, done: true }
    }
  }
}

const iterate = createIterator([1, 2])
// console.log(iterate.next())
// console.log(iterate.next())
// console.log(iterate.next())
