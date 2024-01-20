export default {
  title: 'Vue3 Analysis',
  base: '/vue3-analysis/',
  themeConfig: {
    outline: [2, 3],
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: '首页', link: '/' }],
    sidebar: [
      {
        text: '前置知识',
        items: [
          { text: 'Proxy & Reflect', link: '/prerequisites/proxy-and-reflect' },
          {
            text: '使用VSCode调试源码',
            link: '/prerequisites/debug-with-vscode'
          }
        ]
      },
      {
        text: '响应式系统'
        // items: [{ text: '副作用函数', link: '/reactivity/effect' }]
      }
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/w2xi/vue3' }]
  }
}
