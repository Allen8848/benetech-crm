//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    POST_PRIV: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    links: [
      {
        icon: "list",
        url: "/pages/visit/list/list",
        title: "拜访"
      },
      {
        icon: "list",
        url: "/pages/coVisit/list/list",
        title: "协访"
      },
      {
        icon: "list",
        url: "/pages/business/business/business",
        title: "销售分析"
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let { POST_PRIV } = app.globalData.accuntInfo
    this.setData({
      POST_PRIV
    })
  }
})
