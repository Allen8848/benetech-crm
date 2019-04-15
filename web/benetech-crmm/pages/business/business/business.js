//获取应用实例
const app = getApp()


Page({
  data: {
    selected: true,
    selected1: false,

    customerRate: true, // 客情评级
    showviewTotal: false,
    showviewTotaltwo: false,
    showviewTotalthree: false,
    nin: false,
    PotentialQuantity: 0,
    AskQuantity: 0,
    CRRating: 0,
    EvalBizQuantity: 0,
    IsAskBiz: 0,
    IsEvalBiz: 0,
    IsNew: 0,
    verdicts: 0,
    lead: 0,


    showview: true,
    nin: true,
    sales: 0,
    gap: 0,
    PotentialQuantity: 0,
    schedule: 0,

    tip1:false
   
  },
  /**
 * 初始化
 */
  
  init2: function (options) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })

    let accuntInfo = app.globalData.accuntInfo
    let userid = accuntInfo.userid
    let deptid = accuntInfo.deptid
    // console.log("userid", accuntInfo)
    app.phpCrmApi.Until({
      uid: userid,
      dept_id: deptid
    }).then(res => {
      // 隐藏加载状态
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();

      res.schedule = Number(res.schedule * 100).toFixed(2)
      console.log('sched3ule', res.schedule)
      // res.schedule =200
      //  大于100% 优秀
      if (res.schedule < 100) {
        that.setData({
          showview: false,
        })
      } else {
        that.setData({
          showview: true,
        })
      }

      if (res.lead == 1) {
        that.setData({
          nin: true
        })
      } else {
        that.setData({
          nin: false
        })
      }

      that.setData({
        sales: res.sales, // 销量
        gap: res.gap, // 差距
        PotentialQuantity: res.PotentialQuantity, // 潜力
        schedule: res.schedule, // 
        lead: res.lead
      })

      res = res.Potential
      // 隐藏加载状态
      // wx.hideNavigationBarLoading()
      // wx.stopPullDownRefresh();
      for (let i in res) {
        if (i != 'concept' && i != 'lead' && i != 'IsNew') {
          res[i] = Number(res[i] * 100).toFixed(2);
        }
      }
      if (res.CRRating < 60) {
        that.setData({
          customerRate: false
        })
      } else {
        that.setData({
          customerRate: true
        })
      }
      if (res.lead == 1) {
        that.setData({
          nin: true
        })
      } else {
        that.setData({
          nin: false
        })
      }


      if (res.IsNew > 0) {
        that.setData({
          showviewTotal: true,
          showviewTotaltwo: false,
          showviewTotalthree: false
        })
      } else {


        if (res.verdicts < 60) {
          that.setData({
            showviewTotal: false,
            showviewTotaltwo: false,
            showviewTotalthree: true
          })
        } else {
          that.setData({
            showviewTotal: false,
            showviewTotaltwo: true,
            showviewTotalthree: false
          })
        }
      }
      console.log('今日+__', res)
      that.setData({
        AskQuantity: res.AskQuantity,
        CRRating: res.CRRating,
        EvalBizQuantity: res.EvalBizQuantity,
        IsAskBiz: res.IsAskBiz,
        IsEvalBiz: res.IsEvalBiz,
        IsNew: res.IsNew,
        PotentialQuantity: res.PotentialQuantity,
        verdicts: res.verdicts,
        lead: res.lead
      })


    }).catch(res => {
      console.log('今日失败', res)
    })





  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    // this.init()
    this.init2()
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init2()
  },
})