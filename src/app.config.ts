export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/create/index',
    'pages/mine/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    "color": "#afafaf",
    "selectedColor": "#1296db",
    "backgroundColor": "#F7F8F8",
    list: [
      {
        text: "首页",
        pagePath: 'pages/index/index',
        iconPath: './assets/icon/icon_home_0.png',
        selectedIconPath: './assets/icon/icon_home_1.png',
      },
      {
        text: '创作',
        pagePath: 'pages/create/index',
        iconPath: './assets/icon/icon_create_0.png',
        selectedIconPath: './assets/icon/icon_create_1.png'
      },
      {
        text: '我的',
        pagePath: 'pages/mine/index',
        iconPath: './assets/icon/icon_mine_0.png',
        selectedIconPath: './assets/icon/icon_mine_1.png'
      }
    ]
  },
  navigationBarTitleText: ''
})
