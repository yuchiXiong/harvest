export default {
  pages: [
    'pages/index/index',
    'pages/mine/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: '้ฆ้กต',
      },
      {
        pagePath: 'pages/mine/index',
        text: 'ๆ็',
      }
    ]
  }
}
