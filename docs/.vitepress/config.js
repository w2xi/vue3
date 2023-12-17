export default {
  title: 'Vue3 源码解析',
  base: '/vue3/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: '首页', link: '/' }],
    sidebar: [
      {
        text: '前置知识',
        items: [
          { text: 'Proxy & Reflect', link: '/prerequisites/proxy-and-reflect' },
          { text: '使用VSCode调试源码', link: '/prerequisites/debug' }
        ]
      },
      {
        text: '响应式原理',
        items: [{ text: '副作用函数', link: '/reactivity/effect' }]
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/w2xi/vue3' }]
  }
}
