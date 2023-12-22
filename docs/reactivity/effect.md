# 响应式系统

## 响应式数据和副作用函数

副作用函数指的是会产生副作用的函数，如下代码所示：

```js{4}
function effect() {
  document.body.innerText = 'Hello Vue3'
}
```

当执行 `effect` 函数时，会设置 body 的文本内容