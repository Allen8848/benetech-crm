// pages/business/todayRanking/todayRanking.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topThree:[],
    concept:[],
    tipPM:false

  },
  init: function (options){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let accuntInfo = app.globalData.accuntInfo
    let userid = accuntInfo.userid
    let deptid = accuntInfo.deptid
    app.phpCrmApi.Until({
      uid: userid,
      dept_id: deptid
    }).then(res => {
      // 隐藏加载状态
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh();

      res = res.Potential
      let arr = res.concept


      //创建数组元素arr
      // let arr = concept
      //创建每次循环存储最大值得变量
      let max;
      //遍历数组，默认arr中的某一个元素为最大值，进行逐一比较
      for (let i = 0; i < arr.length; i++) {
        //外层循环一次，就拿arr[i] 和 内层循环arr.legend次的 arr[j] 做对比
        for (let j = i; j < arr.length; j++) {
          if (arr[i].summat < arr[j].summat) {
            //如果arr[j]大就把此时的值赋值给最大值变量max
            max = arr[j];
            arr[j] = arr[i];
            arr[i] = max;
          }
        }
      }

      let concept = arr;

      for (let i = 0; i < concept.length; i++) {
        //  concept[i].summat = summat * 100
        concept[i].summat = Number(concept[i].summat * 100).toFixed(2);
      }

      let topThree = concept.slice(0, 3);
      concept = concept.slice(3, concept.length);
      that.setData({
        concept,
        topThree
      })


      }).catch(res => {
      
// tipPM
        that.setData({
          tipPM:true
         
        })

      })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();


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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.init();



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

  }
})