// pages/visit/list/list.js
import { $wuxCalendar, $wuxSelect } from '../../../dist/index'
var dateTimePicker = require('../../../utils/dateTimePicker.js');

var initPageData;
//获取应用实例
const app = getApp()

/* 拜访目的 */
const optionPurpose = [{ "code": "01", "name": "要求生意" }, { "code": "02", "name": "评估生意" }, { "code": "03", "name": "邀请参会" }, { "code": "04", "name": "邀请主席" }, { "code": "05", "name": "邀请讲者" }, { "code": "07", "name": "传递观念" }]

const selectOptionPurpose = optionPurpose.map(purpose => {
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

const newVisitData = {
  purposeTitle: '请选择',
  isConferenceType: false,
  conferenceTypeTitle: '请选择',
  customerRelationshipTitle: '请选择',
  planStartTimeTitle: '选择时间'
}

const formDataInit = {
  purpose: '',
  planStartTime: null,
  conferenceType: '',
  customerRelationship: null
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMoreDataClient: true,
    hasMoreDataVisit: true,
    isRefreshing: false,
    isLoading: true,
    isLoadingMoreData: false,
    loadMoreDebunce: true,
    isAdding: false,

    clientFilter: '',
    accordionData: ['1'],
    accordionDataKey: '1',
    userid: null,
    deptid: null,
    userName: null,
    dateTimeOptions: null,
    dateTimeChosen: null,
    dateTimeShow: null,
    BYNAME: null,
    clientPage: 1,
    clientPagesize: 10,
    visitPage: 1,
    isVisible: false,
    visitPagesize: 10,
    sort: 'potential',
    order: 'desc',
    ...newVisitData,
    newVisitData,
    clientLists: [],
    visitLists: [],
    clientFilterbarItems: [
      {
        type: 'text',
        label: '医生',
        value: 'doctor'
      },
      {
        type: 'text',
        label: '医院',
        value: 'hospital'
      },
      {
        type: 'text',
        label: '产品',
        value: 'department'
      },
      {
        type: 'sort',
        label: '潜力',
        value: 'potential',
        groups: ['001'],
        checked: true,
        sort: -1
      },
      {
        type: 'sort',
        label: '目前用量',
        value: 'currentDosage',
        groups: ['002']
      },
      {
        type: 'sort',
        label: '目标用量',
        value: 'targetDosage',
        groups: ['003']
      },
      // {
      //   type: 'sort',
      //   label: '计划日期',
      //   value: 'targetDosage',
      //   groups: ['003']
      // }
    ],
    visitFilterbarItems: [
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
    formData: {
      createId: null,
      type: 'add',
      userid: null,
      purpose: '',
      planStartTime: null,
      actualStartTime: null,
      actualEndtTime: null,
      clientId: null,
      conferenceType: '',
      customerRelationship: null,
      userName: null,
      product: null,
      accept: null,
      hospital: null,
      potential: null,
      doctor: null,
      negate: null, // 否定
      conclude: null,
      consequence: null
    },

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
    var obj = dateTimePicker.dateTimePicker(currentYear, currentYear + 1);
    this.setData({
      dateTimeChosen: obj.dateTimeChosen,
      dateTimeOptions: obj.dateTimeOptions
    });
    // this.dataTimeChosen2Show()

    const { userid, userName, BYNAME, deptid } = app.globalData.accuntInfo
    this.set2Data('formData', {
      ...this.data.formData,
      userid,
      createId: userid,
      userName,
      BYNAME
    })

    this.setData({
      formData: {
        ...this.data.formData,
        // actualStartTime
      }
    })

    this.setData({
      userid,
      deptid,
      userName,
      BYNAME,
      ...newVisitData
    })
    this.getVisitList()
    this.getClient()
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
      this.getVisitList()
      this.getClient()
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
    let { accordionDataKey, isRefreshing, isLoadingMoreData, hasMoreDataVisit, hasMoreDataClient, loadMoreDebunce } = this.data
    if (!loadMoreDebunce || accordionDataKey === null || isRefreshing || isLoadingMoreData || (accordionDataKey === '0' && !hasMoreDataVisit) || (accordionDataKey === '1' && !hasMoreDataClient)) {
      return
    }

    this.setData({
      isRefreshing: true,
      isLoadingMoreData: true,
      loadMoreDebunce: false
    })
    if (accordionDataKey === '0') {
      this.getVisitList()
    } else {
      this.getClient()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getVisitList() {
    let that = this
    app.benetech.getVisitList(that.data.userid, that.data.deptid, that.data.visitPage, that.data.visitPagesize).then(res => {
      let visitLists = that.data.visitLists

      if (res.length > 0) {
        visitLists.push(...res.map(data => {
          return {
            id: data.id,
            hospital: data.col_468, // 医院
            hospitalAlias: data.col_17, // 医院简称
            doctor: data.col_458, // 医生
            product: data.col_510, // 产品
            planStartTime: data.col_456, //
            currentDosage: data.col_830, // 目前用量
            targetDosage: data.col_831 // 目标用量
          }
        }))
      }
      if (res.length < that.data.visitPagesize) {
        setTimeout(() => {
          that.setData({
            hasMoreDataVisit: false
          })
        }, 500)
      }
      that.setData({
        visitLists,
        visitPage: that.data.visitPage + 1
      })
      that.hideLoadMore()
    }).catch( res => {
      that.hideLoadMore()
    })
  },
  getClient() {
    let that = this
    that.setData({
      isLoading: true
    })
    app.benetech.getClient(that.data.userid, that.data.deptid, that.data.clientPage, that.data.clientPagesize, that.data.sort, that.data.order, that.data.clientFilter).then(res => {
      let clientLists = that.data.clientLists
      if (res.length > 0) {
        clientLists.push(...res.map(data => {
          return {
            hospital: data.col_87,
            hospitalAlias: data.col_17, // 医院简称
            hospitalId: data.col_87, // 医院

            doctor: data.col_67,
            doctorId: data.col_67,

            product: data.col_420,
            productId: data.id, // 产品

            clientId: data.id, // 客户ID

            potential: data.col_417, // 潜力

            department: data.col_418, // 科室
            departmentId: data.col_418, // 科室

            currentDosage: data.col_830, // 目前用量

            targetDosage: data.col_831 // 目标用量
          }
        }))
      }
      if (res.length < that.data.clientPagesize) {
        /* 数据加载完成 */
        setTimeout(() => {
          that.setData({
            hasMoreDataClient: false
          })
        }, 500)
      }
      that.setData({
        isLoading: false,
        clientLists,
        clientPage: that.data.clientPage + 1
      })
      that.hideLoadMore()
    }).catch(res => {
      that.setData({
        isLoading: false
      })
      that.hideLoadMore()
    })
  },
  filterbarChange(e) {
    const { checkedItems: [checkedItems], items } = e.detail
    const params = {}
    let sort = checkedItems.value
    let order = checkedItems.sort === 1 ? 'asc' : 'desc'
    this.setData({
      sort,
      order,
      clientPage: 1,
      clientLists: []
    })
    this.getClient()
  },
  go2EditVisit(e) {
    let { currentTarget: {dataset: {id}} } = e
    let that = this
    wx.navigateTo({
      url: '/pages/visit/edit/edit?id=' + id,
      success() {
        that.setData({
          hasHideOnce: true
        })
        setTimeout(() => {
          that.setData({
            accordionData: ['1'],
            visitPage: 1,
            isLoading: true,
            visitLists: [],
            clientPage: 1,
            clientLists: []
          })
        }, 300)
      }
    })
  },
  going2AddVisit(e) {

    let { currentTarget: { dataset: { client: { clientId, doctor, hospital, product, potential, currentDosage, targetDosage, productId} } } } = e
    let {formData} = this.data
    this.setData({
      ...newVisitData,
      formData: {
        ...formData,
        ...formDataInit,
        clientId, doctor, hospital, product, potential, currentDosage, targetDosage, productId
      }
    })


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
    let purpose = this.data.formData.purpose
    purpose = purpose === '' ? [] : purpose.split(',')
    $wuxSelect('#purpose').open({
      value: purpose,
      multiple: true,
      toolbar: {
        title: '拜访目的',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionPurpose,
      onConfirm: (value, index, options) => {
        let {formData} = this.data
        this.setData({
          purposeTitle: '共 ' + value.length + ' 项',
          isConferenceType: value.indexOf('03') !== -1,
          formData: {
            ...formData,
            purpose: value.join(',')
          }
        })
      },
    })
  },
  conferenceTypeSelect() {
    let conferenceType = this.data.formData.conferenceType
    conferenceType = conferenceType === '' ? [] : conferenceType.split(',')
    $wuxSelect('#conferenceType').open({
      value: conferenceType,
      toolbar: {
        title: '会议类型',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionConferenceType,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          let { formData } = this.data
          this.setData({
            conferenceTypeTitle: options[index].title,
            formData: {
              ...formData,
              conferenceType: value
            }
          })
        }
      }
    })
  },
  customerRelationshipSelect() {
    $wuxSelect('#customerRelationship').open({
      value: this.data.formData.customerRelationship,
      toolbar: {
        title: '客情关系',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionCustomerRelationship,
      onChange: () => {
        // let $select = $wuxSelect('#customerRelationship')
        // let { setData, fns: { onConfirm }, data: { multiple, value, index, options } } = $select
        // if(!multiple) {
        //   $select.setData({
        //     visible: false
        //   })
        //   onConfirm(value, index, options)
        // }
      },
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          let { formData } = this.data
          this.setData({
            customerRelationshipTitle: index + 1 + ' 级',
            formData: {
              ...formData,
              customerRelationship: value
            }
          })
        }
      }
    })
  },
  addVisit() {
    let { purpose, conferenceType, customerRelationship, planStartTime } = this.data.formData
    if (!purpose) {
      wx.showToast({
        title: '请选择拜访目的',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.isConferenceType && !conferenceType) {
      wx.showToast({
        title: '请选会议类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!customerRelationship) {
      wx.showToast({
        title: '请选择客情关系',
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
    app.benetech.editVisit(this.data.formData).then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      this.set2Data('isVisible', false)
      this.setData({
        isAdding: false,
        visitPage: 1,
        hasMoreDataVisit: true,
        visitLists: []
      })
      this.getVisitList()
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
  setClientFilter(e) {
    let { value: clientFilter } = e.detail
    clientFilter = clientFilter.replace(/[\s%]*/g, '')
    this.setData({
      clientFilter
    })
  },
  searchClear(e) {
    this.setData({
      clientFilter: ' '
    })
  },
  searchCancel(e) {
    this.searchClear()
    this.searchRequest()
  },
  searchConfirm(e) {
    this.setClientFilter(e)
    this.searchRequest()
  },
  searchRequest() {
    this.setData({
      clientLists: [],
      clientPage: 1,
      hasMoreDataClient: true
    })
    this.getClient()
  },
  searchChange(e) {
    this.setClientFilter(e)
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

  }
})
