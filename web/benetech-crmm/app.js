/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 */
const wechat = require('./utils/wechat.js')

/**
 * Java Benetech API 模块
 * @type {Object}
 */
const benetech = require('./utils/benetech.js')

/**
 * PHP crm 接口 API API 模块
 * @type {Object}
 */
const phpCrmApi = require('./utils/phpCrmApi.js')

const utils = require('./utils/util.js')

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  globalData: {
    ['scope.userInfo']: null,
    userInfo: null,
    model: null,
    platform: null,
    accuntInfo: null
  },

  /**
   * WeChat API
   */
  wechat,

  /**
   * Java benetech API
   */
  benetech,

  /**
   * PHP crm 接口 API
   */
  phpCrmApi,

  utils,
  stringify() {
    return JSON.stringify(this.data)
  },
  onLaunch: function () {
    wx.showLoading({
      title: '启动中',
    })

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    let that = this
    
    wx.getSystemInfo({
      success(res) {
        // console.log(res)
        let { model, platform } = res
        that.globalData.model = model
        that.globalData.platform = platform
      }
    })
  }
})