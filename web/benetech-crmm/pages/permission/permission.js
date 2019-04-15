const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    isShow: false,
    // getPermissionFailed: null,
    getPermissionSucessed: null,
    permissionList: {
      'scope.userInfo': {value: false, info: '使用您的基本信息'},
      'scope.userLocation': { value: false, info: '使用您的地理位置', authorize: true }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading()
    this.appGetSettingCallback()
    wx.getSetting({
      success: res => {
        if (this.settingReadyCallback) {
          this.settingReadyCallback(res)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getUserInfo: function (e) {
    let { detail: { errMsg } } = e
    if (errMsg === 'getUserInfo:ok') {
      this.validatePermission()
    } else {
      this.setData({
        hasUserInfo: false
      })
    }
  },
  appGetSettingCallback() {
    let that = this
    if (app.globalData.accuntInfo) {
      this.setData({
        userInfo: app.globalData.accuntInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {

    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          that.getUserInfo(res)
        }
      })
    }
  },
  setPermissionList(res) {
    let that = this
    let { authSetting } = res
    if (!authSetting['scope.userInfo']) {
      that.setData({
        hasUserInfo: false,
        getPermissionSucessed: null
      })
      return
    } else {
      that.setData({
        hasUserInfo: true
      })
    }
    let { permissionList } = that.data

    let getPermissionSucessed = true
    Object.keys(permissionList).forEach(scope => {

      let scopeValue = authSetting[scope]
      permissionList[scope].value = scopeValue
      getPermissionSucessed = getPermissionSucessed && scopeValue
      if (!scopeValue ) {
        getPermissionSucessed = false
        if (permissionList[scope].authorize) {
          wx.authorize({
            scope,
            success(r) {
              that.validatePermission()
            },
            fail(r) {
              that.setData({
                getPermissionSucessed: false
              })
            },
          })

        }
      }
    })
    that.setData({
      permissionList,
      getPermissionSucessed
    })
    if (getPermissionSucessed) {
      that.reLaunchLogin()
    } else {
      this.setData({
        isShow: true
      })
    }
  },
  validatePermission() {
    let that = this
    app.wechat.getSetting().then(res => {
      that.setPermissionList(res)
    })
  },
  reLaunchLogin() {
    wx.reLaunch({
      url: '/pages/login/login',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  settingReadyCallback(res) {
    if (res.authSetting['scope.userInfo']) {
      this.setData({
        // isShow: true,
        hasUserInfo: true
      })

      // 已经授权，验证其它权限是否通过
      this.setPermissionList(res)
    } else {
      this.setData({
        isShow: true,
        hasUserInfo: false
      })
    }
  }
})
