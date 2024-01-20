let _mount = mount
function createApp(options = {}) {
  function $mount(el) {
    let template = ''
    if (typeof el === 'string') {
      template = document.querySelector(el).innerHTML
    } else {
      template = el.innerHTML
    }
  }

  return {
    mount: $mount
  }
}

function h(tag, props, children) {
  return {
    tag,
    props,
    children
  }
}

// 渲染函数
function render() {
  return h(
    'ul',
    {
      class: 'red',
      onClick() {
        console.log('click')
      }
    },
    [h('li', null, 'Vue'), h('li', null, 'React'), h('li', null, 'Angular')]
  )
}

function mount(vnode, container) {
  const el = document.createElement(vnode.tag)

  if (vnode.props) {
    for (let key in vnode.props) {
      if (key.startsWith('on')) {
        // 事件绑定
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, vnode.props[key])
      } else {
        el.setAttribute(key, vnode.props[key])
      }
    }
  }
  if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => {
      mount(child, el)
    })
  } else {
    // string
    el.textContent = vnode.children
  }

  container.appendChild(el)
}
