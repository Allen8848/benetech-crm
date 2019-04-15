// pages/coVisit/list/list.js
import { $wuxCalendar, $wuxSelect } from '../../../dist/index'
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var initPageData;

//获取应用实例
const app = getApp()

/* 拜访目的 */
const optionPurpose = [{ "code": "01", "name": "要求生意" }, { "code": "02", "name": "评估生意" }, { "code": "03", "name": "邀请参会" }, { "code": "04", "name": "邀请主席" }, { "code": "05", "name": "邀请讲者" }, { "code": "06", "name": "邀请组织者" }, { "code": "07", "name": "传递观念" }]

const selectOptionPurpose = optionPurpose.map(purpose => {
  return { title: purpose.name, value: purpose.code }
})

/* 协访目的 */
const optionCoPurpose = [{ code: "01", name: "检查" }, { code: "02", name: "辅导" }, { code: "03", name: "解决问题" }]

const selectOptionCoPurpose = optionCoPurpose.map(purpose => {
  return { title: purpose.name, value: purpose.code }
})

/* 会议类型 */
const optionConferenceType = [{ "code": "01", "name": "小型沟通会" }, { "code": "02", "name": "科室会" }, { "code": "03", "name": "区域会" }, { "code": "04", "name": "城市会" }, { "code": "05", "name": "全国会" }]

const selectOptionConferenceType = optionConferenceType.map(conferenceType => {
  return { title: conferenceType.name, value: conferenceType.code }
})

/* 客情关系 */
const optionCustomerRelationship = [{ "code": "01", "name": "能够描述代表姓和产品名称" }, { "code": "02", "name": "认可产品某个观念，有试用经历" }, { "code": "03", "name": "对产品认可，对某一类患者能做到常规使用，能够拿到手机号、微信" }, { "code": "04", "name": "把我司产品作为首选处方" }, { "code": "05", "name": "不但自己常规处方，还能建议其他人处方" }]

const selectOptionCustomerRelationship = optionCustomerRelationship.map(customerRelationship => {
  return { title: customerRelationship.name, value: customerRelationship.code }
})

const newTargetVisitInfo = {
  purposeTitle: 0,
  customerRelationshipTitle: '',
  isConference: false,
  assistanceVisitPurposeTitle: 0,
}

const formDataInit = {
  assistanceVisitPurpose: '', 
  planStartTime: null,
  conferenceType: '',
  conferenceTypeTitle: '',
  // customerRelationship: null
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMoreDataVisit: true,
    hasMoreDataCoVisit: true,
    isRefreshing: false,
    isLoadingMoreData: false,
    loadMoreDebunce: true,
    isLoading: true,
    isAdding: false,

    accordionData: ['1'],
    accordionDataKey: '1',

    isVisible: false,
    userid: null,

    dateTimeOptions: null,
    dateTimeChosen: null,
    dateTimeShow: null,

    visitLists: [],
    visitPage: 1,
    visitPagesize: 10,
    visitFilterbarItems: [
      {
        type: 'text',
        label: '代表',
        value: 'daibiao'
      },
      {
        type: 'text',
        label: '医生',
        value: 'client'
      },
      {
        type: 'text',
        label: '医院',
        value: 'hospital'
      },
      {
        type: 'text',
        label: '产品',
        value: 'product'
      },
      {
        type: 'text',
        label: '计划开始时间',
        value: 'planStartTime'
      },
      // {
      //   type: 'text',
      //   label: '目前',
      //   value: 'currentDosage',
      //   groups: ['002']
      // },
      // {
      //   type: 'text',
      //   label: '目标',
      //   value: 'targetDosage',
      //   groups: ['003']
      // }
    ],

    coVisitPage: 1,
    coVisitPagesize: 10,
    coVisitLists: [],
    coVisitFilterbarItems: [
      {
        type: 'text',
        label: '医生',
        value: 'doctorName'
      },
      {
        type: 'text',
        label: '医院',
        value: 'hospital'
      },
      {
        type: 'text',
        label: '被协访者',
        value: 'subordinateName'
      },
      {
        type: 'text',
        label: '计划开始时间',
        value: 'planStartTime',
        groups: ['001'],
        checked: true,
        sort: -1
      },
      // {
      //   type: 'text',
      //   label: '目前',
      //   value: 'currentDosage',
      //   groups: ['002']
      // },
      // {
      //   type: 'text',
      //   label: '目标',
      //   value: 'targetDosage',
      //   groups: ['003']
      // }
    ],
    targetVistInfo: {
      ...newTargetVisitInfo,
    },
    formData: {
      // actualEndTime: '', // 实际结束时间
      // actualStartTime: '', // 实际开始时间
      // assistResult: '', // 辅助结果
      assistanceVisitName: '', // 协访人
      assistanceVisitPurpose: '', // 协访目的(多选)
      // checkUpFlag: '', // 检查（是否)
      // checkUpResult: '', // 检查(结果 用逗号隔开)
      // id: '', // 协访id
      planStartTime: '', // 计划开始时间
      // solveAgreeTryoutFlag: '', // 同意试用或增加用量
      solveOrganizationMeetingFlag: '', // 解决问题选帮忙组织会议 同意与否
      solveProductConceptResult: '', // 认可产品的__观念
      solveReportFlag: '', // 解决问题,打报告,同意与否
      solveReportResult: '', // 解决问题,打报告填写的内容
      userId: '', // 登录用户id
      userName: '', // 登录用户姓名
      visitId: '', // 拜访id号
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!initPageData) {
      initPageData = JSON.parse(JSON.stringify(this.data))
    }
    this.set2Data = app.utils.set2Data.bind(this)

    let currentYear = new Date().getFullYear()
    var obj = dateTimePicker.dateTimePicker(currentYear, currentYear+1);
    this.setData({
      dateTimeChosen: obj.dateTimeChosen,
      dateTimeOptions: obj.dateTimeOptions
    });

    const { userid, userName, BYNAME, deptid } = app.globalData.accuntInfo

    this.setData({
      userid,
      deptid,
      formData: {
        ...this.data.formData,
        userId: userid,
        userName,
        assistanceVisitName: userName
      }
    })

    this.getCoVisitList()
    this.getVisitList()
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
    if (this.data.hasHideOnce) {
      this.setData({
        hasHideOnce: false
      })
      this.getCoVisitList()
      this.getVisitList()
    }
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
    let { accordionDataKey, isRefreshing, isLoadingMoreData, hasMoreDataCoVisit, hasMoreDataVisit, loadMoreDebunce } = this.data
    if (!loadMoreDebunce || accordionDataKey === null || isRefreshing || isLoadingMoreData || (accordionDataKey === '0' && !hasMoreDataCoVisit) || (accordionDataKey === '1' && !hasMoreDataVisit)) {
      return
    }

    this.setData({
      isRefreshing: true,
      isLoadingMoreData: true,
      loadMoreDebunce: false
    })
    if (accordionDataKey === '0') {
      this.getCoVisitList()
    } else {
      this.getVisitList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getCoVisitList() {
    let that = this

    app.benetech.getCoVisitList(that.data.userid, that.data.coVisitPage, that.data.coVisitPagesize).then(res => {
      let coVisitLists = that.data.coVisitLists

      if (res.length > 0) {
        coVisitLists.push(...res)
      }
      if (res.length < that.data.coVisitPagesize) {
        this.setData({
          hasMoreDataCoVisit: true
        })
      }
      that.setData({
        coVisitLists,
        coVisitPage: that.data.coVisitPage + 1
      })
      that.hideLoadMore()
    }).catch( res => {
      that.hideLoadMore()
    })
  },
  go2EditCoVisit(e) {
    let that = this
    let { currentTarget: { dataset: { id } } } = e
    wx.navigateTo({
      url: '/pages/coVisit/edit/edit?id=' + id,
      success: () => {
        that.setData({
          hasHideOnce: true
        })
        setTimeout(() => {
          that.setData({
            accordionData: ['1'],
            coVisitPage: 1,
            coVisitLists: [],
            visitLists: [],
            visitPage: 1,
          })
        }, 300)
      }
    })
  },
  conferenceTypeSelect() {
    let conferenceType = this.data.targetVistInfo.conferenceType
    conferenceType = conferenceType === '' || conferenceType === undefined  ? [] : conferenceType.split(',')
    $wuxSelect('#conferenceType').open({
      value: conferenceType,
      toolbar: {
        title: '会议类型',
        // cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionConferenceType,
      onConfirm: (value, index, options) => {
      }
    })
  },
  getVisitList() {
    let that = this
    that.setData({
      isLoading: true
    })
    app.benetech.getVisitList(that.data.userid, that.data.deptid, that.data.visitPage, that.data.visitPagesize, 1).then(res => {
      let visitLists = that.data.visitLists

      if (res.length > 0) {
        visitLists.push(...res.map(data => {
          return {
            id: data.id,
            purpose: data.col_455,
            hospital: data.col_468, // 医院
            hospitalAlias: data.col_17, // 医院简称
            daibiao: data.col_466,//代表名字
            doctor: data.col_458, // 医生
            product: data.col_510, // 产品
            planStartTime: data.col_456, //
            conferenceType: data.col_459, // 会议类型
            currentDosage: data.col_830, // 目前用量
            targetDosage: data.col_831 // 目标用量
          }
        }))
      }
      if (res.length < that.data.visitPagesize) {
      }
      that.setData({
        isLoading: false,
        visitLists,
        visitPage: that.data.visitPage + 1
      })
      that.hideLoadMore()
    }).catch( res => {
      that.setData({
        isLoading: false
      })
      that.hideLoadMore()
    })
  },
  going2AddCoVisit(e) {
    let { currentTarget: { dataset: { visit } } } = e
    let { id, doctor, hospital, planStartTime, purpose, customerRelationship, conferenceType } = visit

    if (!purpose) {
      purpose = ''
    }
    let isConference = purpose.split(',').indexOf('03') !== -1
    let conferenceTypeTitle = ''
    if (isConference) {
      try{
        conferenceTypeTitle = optionConferenceType.filter(option => option.code === conferenceType)[0].name
      } catch(e) {
      }
    }


    let customerRelationshipTitle = optionCustomerRelationship.findIndex(option => option.code === customerRelationship) + 1 + ' 级'
    this.setData({

      targetVistInfo: {
        ...visit,
        ...newTargetVisitInfo,
        conferenceTypeTitle,
        purposeTitle: (typeof visit.purpose === 'string') && visit.purpose !== '' ? purpose.split(',').length : 0,
        isConference,
        customerRelationshipTitle
      },
      planStartTimeTitle: '请选择',
      formData: {
        ...this.data.formData,
        ...formDataInit,
        planStartTime,
        visitId: id
      }
    })
    this.getVisitInfo(id)

    this.setData({
      isVisible: true
    })
  },
  popupClose() {
    this.setData({
      isVisible: false
    })
  },
  purposeSelect() {
    let purpose = this.data.targetVistInfo.purpose
    purpose = purpose === '' || purpose === undefined ? [] : purpose.split(',')
    $wuxSelect('#purpose').open({
      value: purpose,
      multiple: true,
      toolbar: {
        title: '拜访目的',
        // cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionPurpose,
      onConfirm: (value, index, options) => {
      },
    })
  },
  coPurposeSelect() {
    let purpose = this.data.formData.assistanceVisitPurpose
    purpose = purpose === '' || purpose === undefined ? [] : purpose.split(',')
    $wuxSelect('#coPurpose').open({
      value: purpose,
      multiple: true,
      toolbar: {
        title: '协访目的',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionCoPurpose,
      onConfirm: (value, index, options) => {

        this.setData({
          targetVistInfo: {
            ...this.data.targetVistInfo,
            assistanceVisitPurposeTitle: value.length,
          },
          formData: {
            ...this.data.formData,
            assistanceVisitPurpose: value.join(',')
          }
        })
      },
    })
  },
  customerRelationshipSelect() {
    let customerRelationship = this.data.targetVistInfo.customerRelationship
    $wuxSelect('#customerRelationship').open({
      value: typeof customerRelationship == 'string' && customerRelationship !== '' ? customerRelationship: '',
      toolbar: {
        title: '客情关系',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionCustomerRelationship,
      onConfirm: (value, index, options) => {
      }
    })
  },

  addCoVisit() {
    let { assistanceVisitPurpose, planStartTime } = this.data.formData
    if (!assistanceVisitPurpose) {
      wx.showToast({
        title: '请选择协访目的',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (!planStartTime) {
      wx.showToast({
        title: '请选择计划开始时间',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      isAdding: true
    })
    app.benetech.editCoVisit(this.data.formData).then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        isAdding: false,
        isVisible: false,
        coVisitLists: [],
        coVisitPage: 1
      })
      this.getCoVisitList()
    }).catch(e => {
      this.setData({
        isAdding: false
      })
    })
  },

  accordionChange(e) {
    let { key } = e.detail
    let accordionData = []
    let accordionDataKey = null

    if(key !== undefined ) {
      accordionData.push(key)
      accordionDataKey = key
    }

    this.setData({
      accordionData,
      accordionDataKey
    })

  },
  hideLoadMore() {
    this.setData({
      isRefreshing:false,
      isLoadingMoreData: false,
      loadMoreDebunce: true
    })
  },
  // 时间拼接 （格式：2018-09-19 17:30:55）
  dataTimeChosen2Show() {
    let { dateTimeOptions: [years, months, days, hours, minutes, seconds], dateTimeChosen: [yearChosen, monthChosen, dayChosen, hourChosen, minuteChosen, secondChosen] } = this.data
    let planStartTime = `${years[yearChosen]}-${months[monthChosen]}-${days[dayChosen]} ${hours[hourChosen]}:${minutes[minuteChosen]}:${seconds[secondChosen]}`
    this.setData({
      planStartTimeTitle: planStartTime,
      formData: {
        ...this.data.formData,
        planStartTime
      }
    })
  },

  changeDateTime(e) {
    this.setData({
      dateTimeChosen: e.detail.value
    });
    this.dataTimeChosen2Show()
  },

  changeDateTimeColumn(e) {
    var arr = this.data.dateTimeChosen,
      dateArr = this.data.dateTimeOptions;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
  },
  getVisitInfo(visitId) {
    let that = this
    app.benetech.getVisitInfo(visitId).then(res => {
      let data = res[0]

      let {
        cp: product,
        bfmd: purpose,
        kqgx: customerRelationship
      } = data
      let purposeTitle = purpose.split(',').map(p => !!p).length
      let customerRelationshipTitle = optionCustomerRelationship.findIndex(option => option.code === customerRelationship) + 1 + ' 级'

      that.setData({
        targetVistInfo: {
          ...that.data.targetVistInfo,
          product,
          purpose,
          purposeTitle,
          customerRelationship,
          customerRelationshipTitle
        }
      })
    })
  }
})
