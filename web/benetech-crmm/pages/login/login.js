// pages/login/login.js

// 获取全局应用程序实例对象
const app = getApp()

let page;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginError: false,
    hasUserInfo: false,
    loginFail: false,
    logging: false, // 是否是登录中
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    account: '',
    psw: '',
    IMEI: null,
    resultIcon: {
      type: 'warn',
      color: '#ef473a',
    },
    resultButtons: [
      {
        type: 'balanced',
        block: true,
        text: '确定',
      },
      {
        type: 'light',
        block: true,
        text: '返回',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.inputChange = app.utils.inputChange.bind(this)
    console.log('test', app.utils.inputChange.bind(this))
    // this.resetStorage()
    let that = this
    app.wechat.getStorage('accuntInfo').then(res => {
      let data = JSON.parse(res.data)
      let { userid, USER_ID, userName, USER_NAME, BYNAME, POST_PRIV, IMEI, deptid } = data
      that.setData({
        IMEI: data.IMEI
      })
      app.globalData.accuntInfo = { userid, USER_ID, userName, USER_NAME, BYNAME, POST_PRIV, IMEI, deptid }
      app.benetech.login(BYNAME, IMEI, userid).then(res => {
        if(res.length === 0) {
          wx.showToast({
            title: BYNAME,
            icon: 'none',
            duration: 2000
          })
          if (BYNAME === 'experienceAccount' || BYNAME === 'wangshijun') {
            that.resetStorage()
            that.setData({
              IMEI: null,
              loginFail: true
            })
          } else {
            that.setData({
              loginFail: true,
              loginError: true
            })
          }
        } else {
          let userData 
          if (res.list) {
            userData = res.list
          } else {
            userData = res[0]
          }
          let { POST_PRIV, DEPT_ID: deptid } = userData
          let { power } = res
          if (typeof power === 'number') {
            POST_PRIV = power
          }
          app.globalData.accuntInfo = {
            ...app.globalData.accuntInfo,
            POST_PRIV,
            deptid
          }
          that.reLaunchToindex()
        }
      }).catch(res => {
        that.setData({
          loginFail: true
        })
      })
      // that.reLaunchToindex()
    }).catch(res => {
      that.setData({
        loginFail: true
      })
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
  resultBack() {
    this.setData({
      loginError: false
    })
  },
  login(e) {
    this.setData({
      logging: true
    })
    wx.login({
      success(res) {
      }
    })
  },
  validateAccount(str) {
    return /^([a-zA-Z]{1}([a-zA-Z0-9]|[._@]){3,19})|(((13[0-9])|(14[5,7,9])|(15[0-3,5-9])|(17[0,1,3,5-8])|(18[0-9])|166|198|199|(147))\d{8})$/.test(str)
  },
  getUserInfo(userinfo) {
    let that = this
    let {account, psw } = this.data
    if(!this.validateAccount(account)) {
      wx.showToast({
        title: '请输入正确的账号',
        icon: 'none',
        duration: 2000
      })
    } else {
      that.setData({
        logging: true
      })
      let { detail: {encryptedData, iv} } = userinfo
      let code
      let userid
      let IMEI = this.data.IMEI
      app.wechat.login().then(res => {
        code = res.code
        // 验证账号是否存在
        app.benetech.register({account, psw}).then(res => {
          userid = res[0].USER_ID
          // 后台解密微信uuid
          let { model, platform } = app.globalData

          that.decodeUserInfo(userid, encryptedData, iv, code, model, platform, IMEI)
        }).catch(e => {
          wx.showToast({
            title: '登录失败，请稍后再试',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            logging: false
          })
        })
      }).catch(res => {
        wx.showToast({
          title: '登录失败，请稍后再试',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          logging: false
        })
      })
    }
  },
  decodeUserInfo(userid, encryptedData, iv, code, model, platform, IMEI) {
    let that = this
    app.benetech.decodeUserInfo(userid, encryptedData, iv, code, model, platform, IMEI).then(res => {
      if (res.error == 0/* || res.uid.length == 0*/) {
        that.setData({
          loginFail: true,
          loginError: true
        })
      } else if(res.imei){
        IMEI = res.imei
        let { USER_ID: userid, USER_ID, USER_NAME: userName, USER_NAME, BYNAME, POST_PRIV, DEPT_ID: deptid } = res.userlist[0]
        let {power} = res
        if(typeof power === 'number') {
          POST_PRIV = power
        }
        let user = { userid, USER_ID, userName, USER_NAME, BYNAME, POST_PRIV, deptid}

        user.IMEI = res.imei
        app.globalData.accuntInfo = user
        app.wechat.setStorage('accuntInfo', JSON.stringify(user))
        that.reLaunchToindex()
      } else {
      }
      that.setData({
        logging: false
      })
    }).catch(res => {
      that.setData({
        logging: false
      })
    })
  },
  reLaunchToindex() {
    // wx.navigateTo({
    //   url: '/pages/coVisit/edit/edit?id=26'
    // })

    // wx.navigateTo({
    //   url: '/pages/visit/edit/edit?id=187'
    // })
    // wx.navigateTo({
    //   url: '/pages/coVisit/list/list'
    // })
    wx.reLaunch({
      url: '/pages/index/index',
      fail(e) {
      }
    })
  },
  resetStorage() {
    wx.removeStorage({
      key: 'IMEI',
      success(res) {
      }
    })
    wx.removeStorage({
      key: 'accuntInfo',
      success(res) {
      }
    })
  }
})
