export default {
  title: 'Vue3 源码解析',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: '首页', link: '/prerequisites/debug' }],

    sidebar: [
      {
        text: '前置知识',
        items: [{ text: '使用VSCode调试源码', link: '/prerequisites/debug' }]
      },
      {
        text: '响应式原理',
        items: [{ text: '', link: '/markdown-examples' }]
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
