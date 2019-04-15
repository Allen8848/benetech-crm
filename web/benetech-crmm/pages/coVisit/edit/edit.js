// pages/coVisit/edit/edit.js
import { $wuxCalendar, $wuxSelect } from '../../../dist/index'

//获取应用实例
const app = getApp()

/* 拜访目的 */
const optionPurpose = [{ "code": "01", "name": "要求生意" }, { "code": "02", "name": "评估生意" }, { "code": "03", "name": "邀请参会" }, { "code": "04", "name": "邀请主席" }, { "code": "05", "name": "邀请讲者" }, { "code": "06", "name": "邀请组织者" }, { "code": "07", "name": "传递观念" }]

const selectOptionPurpose = optionPurpose.map(option => {
  return { title: option.name, value: option.code }
})

/* 协访目的 */
const optionCoPurpose = [{ code: "01", name: "检查" }, { code: "02", name: "辅导" }, { code: "03", name: "解决问题" }]

const selectOptionCoPurpose = optionCoPurpose.map(option => {
  return { title: option.name, value: option.code }
})

/* 会议类型 */
const optionConferenceType = [{ "code": "01", "name": "小型沟通会" }, { "code": "02", "name": "科室会" }, { "code": "03", "name": "区域会" }, { "code": "04", "name": "城市会" }, { "code": "05", "name": "全国会" }]

const selectOptionConferenceType = optionConferenceType.map(option => {
  return { title: option.name, value: option.code }
})

/* 客情关系 */
const optionCustomerRelationship = [{ "code": "01", "name": "能够描述代表姓和产品名称" }, { "code": "02", "name": "认可产品某个观念，有试用经历" }, { "code": "03", "name": "对产品认可，对某一类患者能做到常规使用，能够拿到手机号、微信" }, { "code": "04", "name": "把我司产品作为首选处方" }, { "code": "05", "name": "不但自己常规处方，还能建议其他人处方" }]

const selectOptionCustomerRelationship = optionCustomerRelationship.map(option => {
  return { title: option.name, value: option.code }
})

/* 是否 */
const optionYesOrNo = [{ code: "01", name: "是" }, { code: "02", name: "否" }]

const selectOptionYesOrNo = optionYesOrNo.map(option => {
  return { title: option.name, value: option.code }
})


/* 同意与否 */
const optionAgreement = [{ "code": "01", "name": "同意" }, { "code": "02", "name": "不同意" }]

const selectOptionAgreement = optionAgreement.map(option => {
  return { title: option.name, value: option.code }
})

/* 达成与否 */
const optionReach = [{ "code": "01", "name": "达成" }, { "code": "02", "name": "未达成" }]

const selectOptionReach = optionReach.map(option => {
  return { title: option.name, value: option.code }
})

/* 检查结果(结果 用逗号隔开) */
const optionCheckUpResult = [{ "code": "01", "name": "之前产品信息传递是否正确" }, { "code": "02", "name": "之前客户基本信息是否正确" }, { "code": "03", "name": "之前客户潜力评估是否正确" }, { "code": "04", "name": "之前政策传递是否正确" }, { "code": "05", "name": "之前是否谈成病例管理" }, { "code": "06", "name": "之前是否达标" }]


const selectOptionCheckUpResult = optionCheckUpResult.map(option => {
  return { title: option.name, value: option.code }
})


/* 协访目的-辅导-选项 */
const optionAssistResult = [{ "code": "01", "name": "专业知识" }, { "code": "02", "name": "销售技巧" }, { "code": "03", "name": "区域生意规划" }, { "code": "04", "name": "资源合理使用" }]


const selectOptionAssistResult = optionAssistResult.map(option => {
  return { title: option.name, value: option.code }
})

/* 解决问题 */
const optionSolveReport = [{ "code": "01", "name": "要求生意" }, { "code": "02", "name": "评估生意" }, { "code": "03", "name": "邀请参会" }, { "code": "04", "name": "邀请主席" }, { "code": "05", "name": "邀请讲者" }, { "code": "06", "name": "协助开发" }, { "code": "07", "name": "解决停控药" }]


const selectOptionSolveReport = optionSolveReport.map(option => {
  return { title: option.name, value: option.code }
})
const solveReportFlagResetValues = {
  solveReportResult: null,
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStarted: false,
    isEnded: false,
    isFinished: false,

    checkUpResultChosen: [],
    isCheckUpFlag: false,
    isCheckUpFlagAgree: null,
    optionCheckUpResult,

    isAssistResult: false,

    isSolveReportFlag: null,
    isSolveReportFlagAgree: null,
    solveReportFlagTitle: '请选择',
    solveReportFlagResetValues,
    solveReportResultTitle: '请选择',
    solveOrganizationMeetingFlagTitle: '请选择',
    solveOrganizationMeetingFlagResetValues: {},

    targetVistInfo: {
      purposeTitle: 0,
      customerRelationshipTitle: '',
      checkUpFlagTitle: '请选择',
      isConference: false,
      conferenceTypeTitle: '请选择',
      assistanceVisitPurposeTitle: 0,
      checkUpResultTitle: 0,
      assistResultTitle: '请选择',
      solveProductConceptResultTitle: '请选择',
    },
    formData: {
      startItude: null,
      actualEndTime: '', // 实际结束时间
      actualStartTime: '', // 实际开始时间
      assistResult: '', // 辅助结果
      assistanceVisitName: '', // 协访人
      assistanceVisitPurpose: '', // 协访目的(多选)
      checkUpFlag: '', // 检查（是否)
      checkUpResult: '', // 检查(结果 用逗号隔开)
      id: '', // 协访id
      planStartTime: '', // 计划开始时间
      solveAgreeTryoutFlag: '', // 同意试用或增加用量
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
    let that = this
    const { userid, userName, BYNAME } = app.globalData.accuntInfo
    let checkUpResultChosen = new Array(optionCheckUpResult.length).fill(false)
    that.setData({
      checkUpResultChosen,
      formData: {
        ...this.data.formData,
        userId: userid,
        userName,
        assistanceVisitName: userName,
        id: options.id
      }
    })
    that.getCoVisitInfo()
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
  getCoVisitInfo() {
    let that = this
    app.benetech.getCoVisitInfo(this.data.formData.id).then(res => {
      ;['planStartTime', 'actualStartTime', 'actualEndTime'].forEach( key => {
        let value = res[key]
        if(value && value !== '') {
          res[key] = app.utils.formatDate(new Date(value), 'yyyy-MM-dd H:mm:ss')
        }
      })

      let { checkUpFlag } = res
      let { checkUpResultChosen } = that.data
      if (checkUpFlag) {
        checkUpFlag = checkUpFlag.split(',')
        checkUpResultChosen = optionCheckUpResult.map(option => checkUpFlag.indexOf(option.code) > -1)
      }
      that.setData({
        checkUpResultChosen,
        formData: {
          ...that.data.formData,
          ...res
        }
      })

      if (res.visitId) {
        app.benetech.getVisitInfo(res.visitId).then(res => {
          let data = res[0]
          let {
            bfmd: purpose,
            jhkssj: planStartTime,
            sjkssj: actualStartTime,
            sjjssj: actualEndTime,
            hylx: conferenceType,
            kqgx: customerRelationship,
            cp: product,
            yy: hospital,
            ys: doctor,

          } = data

          that.setData({
            targetVistInfo: {
              ...that.data.targetVistInfo,
              purpose,
              planStartTime,
              actualStartTime,
              actualEndTime,
              conferenceType,
              customerRelationship,
              product,
              hospital,
              doctor,
            }
          })

          that.computedData()
        })
      }
      that.computedData()
    })
  },
  computedData() {
    let { targetVistInfo: visit, formData: { assistanceVisitPurpose, assistResult, actualStartTime, actualEndTime, finishTime, checkUpResult, solveReportFlag, checkUpFlag, solveOrganizationMeetingFlag, solveProductConceptResult } } = this.data

    let { id, doctor, hospital, planStartTime, purpose, customerRelationship, conferenceType } = visit

    /* 检查 */
    let isCheckUpFlag = assistanceVisitPurpose.split(',').indexOf('01') !== -1

    /* 辅导 */
    let isAssistResult = assistanceVisitPurpose.split(',').indexOf('02') !== -1

    /* 解决问题 */
    let isSolveReportFlag = assistanceVisitPurpose.split(',').indexOf('03') !== -1

    let isStarted = actualStartTime !== null && actualStartTime !== undefined && actualStartTime !== ''
    let isEnded = actualEndTime !== null && actualEndTime !== undefined && actualEndTime !== ''
    let isFinished = this.data.isFinished || (finishTime !== null && finishTime !== undefined && finishTime !== '')

    let solveProductConceptResultTitle = this.data.targetVistInfo.solveProductConceptResultTitle
    if (isSolveReportFlag && solveProductConceptResult){
      solveProductConceptResultTitle = solveProductConceptResult.split(',').length + ' 项'
    }
    let isSolveReportFlagAgree = solveReportFlag === '01'
    let solveReportFlagTitle = optionAgreement.filter(option => option.code === solveReportFlag)
    if (solveReportFlagTitle.length > 0) {
      solveReportFlagTitle = solveReportFlagTitle[0].name
    } else {
      solveReportFlagTitle = '请选择'
    }

    let isCheckUpFlagAgree = checkUpFlag === '02'

    let checkUpFlagTitle = optionYesOrNo.filter(option => option.code === checkUpFlag)

    if (checkUpFlagTitle.length > 0) {
      checkUpFlagTitle = checkUpFlagTitle[0].name
    } else {
      checkUpFlagTitle = '请选择'
    }

    let solveOrganizationMeetingFlagTitle = optionAgreement.filter(option => option.code === solveOrganizationMeetingFlag)

    if (solveOrganizationMeetingFlagTitle.length > 0) {
      solveOrganizationMeetingFlagTitle = solveOrganizationMeetingFlagTitle[0].name
    } else {
      solveOrganizationMeetingFlagTitle = '请选择'
    }

    if (!purpose) {
      purpose = ''
    }
    let isConference = purpose.split(',').indexOf('03') !== -1
    // let conferenceTypeTitle = conferenceType
    let conferenceTypeTitle = optionConferenceType.filter(option => option.code === conferenceType)

    if (conferenceTypeTitle.length > 0) {
      conferenceTypeTitle = conferenceTypeTitle[0].name
    } else {
      conferenceTypeTitle = '请选择'
    }

    let customerRelationshipTitle = optionCustomerRelationship.findIndex(option => option.code === customerRelationship) + 1 + ' 级'

    let assistanceVisitPurposeTitle = (typeof assistanceVisitPurpose === 'string') && assistanceVisitPurpose !== '' ? assistanceVisitPurpose.split(',').length : 0

    let checkUpResultTitle = (typeof checkUpResult === 'string') && checkUpResult !== '' ? checkUpResult.split(',').length : 0

    this.setData({
      isStarted,
      isEnded,
      isFinished,

      isCheckUpFlag,
      isAssistResult,

      isCheckUpFlagAgree,
      isSolveReportFlag,
      isSolveReportFlagAgree,

      solveReportFlagTitle,

      solveOrganizationMeetingFlagTitle,

      targetVistInfo: {
        ...visit,
        checkUpFlagTitle,
        assistResultTitle: (typeof assistResult === 'string') && assistResult !== '' ? assistResult.split(',').length : 0,
        purposeTitle: (typeof visit.purpose === 'string') && visit.purpose !== '' ? purpose.split(',').length : 0,
        isConference,
        conferenceTypeTitle,
        customerRelationshipTitle,
        assistanceVisitPurposeTitle,
        checkUpResultTitle,
        solveProductConceptResultTitle
      },
      formData: {
        ...this.data.formData,
      }
    })
    if (this.data.isFinished) {
      wx.hideToast()
      wx.showToast({
        title: '已完成',
        icon: 'success',
        duration: 2000,
        complete: () => {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      })
    }
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
  customerRelationshipSelect() {
    let customerRelationship = this.data.targetVistInfo.customerRelationship
    $wuxSelect('#customerRelationship').open({
      value: typeof customerRelationship == 'string' && customerRelationship !== '' ? customerRelationship : '',
      toolbar: {
        title: '客情关系',
        // cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionCustomerRelationship,
      onConfirm: (value, index, options) => {
      }
    })
  },
  checkUpFlagSelect() {
    let data = this.data.formData.checkUpFlag
    $wuxSelect('#checkUpFlag').open({
      value: typeof data == 'string' && data !== '' ? data : '',
      toolbar: {
        title: '检查结果',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionYesOrNo,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            isCheckUpFlagAgree: value === '02',
            targetVistInfo: {
              ...this.data.targetVistInfo,
              checkUpFlagTitle: options[index].title
            },
            formData: {
              ...this.data.formData,
              checkUpFlag: value,
              checkUpResult: ''
            },

          })
        }
      }
    })
  },
  conferenceTypeSelect() {
    let { conferenceType } = this.data.targetVistInfo
    conferenceType = conferenceType === '' || conferenceType === undefined ? [] : conferenceType.split(',')
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
  coPurposeSelect() {
    let data = this.data.formData.assistanceVisitPurpose

    data = data === '' || data === undefined ? [] : data.split(',')
    $wuxSelect('#coPurpose').open({
      value: data,
      multiple: true,
      toolbar: {
        title: '协访目的',
        // cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionCoPurpose,
      onConfirm: (value, index, options) => {
      },
    })
  },
  checkUpResultSelect() {
    let data = this.data.formData.checkUpResult

    data = data === '' || data === undefined ? [] : data.split(',')
    $wuxSelect('#checkUpResult').open({
      value: data,
      multiple: true,
      toolbar: {
        title: '辅导内容',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionCheckUpResult,
      onConfirm: (value, index, options) => {
        this.setData({
          targetVistInfo: {
            ...this.data.targetVistInfo,
            checkUpResultTitle: value.length
          },
          formData: {
            ...this.data.formData,
            checkUpResult: value.join(',')
          },

        })
      },
    })
  },
  assistResultSelect() {
    let data = this.data.formData.assistResult

    data = data === '' || data === undefined ? [] : data.split(',')
    $wuxSelect('#assistResult').open({
      value: data,
      multiple: true,
      toolbar: {
        title: '辅导内容',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionAssistResult,
      onConfirm: (value, index, options) => {
        this.setData({
          targetVistInfo: {
            ...this.data.targetVistInfo,
            assistResultTitle: value.length
          },
          formData: {
            ...this.data.formData,
            assistResult: value.join(',')
          },
        })
      },
    })
  },
  solveReportSelect() {
    let data = this.data.formData.solveProductConceptResult

    data = data === '' || data === undefined ? [] : data.split(',')
    $wuxSelect('#solveProductConceptResult').open({
      value: data,
      multiple: true,
      toolbar: {
        title: '解决问题',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionSolveReport,
      onConfirm: (value, index, options) => {
        this.setData({
          targetVistInfo: {
            ...this.data.targetVistInfo,
            solveProductConceptResultTitle: value.length + ' 项'
          },
          formData: {
            ...this.data.formData,
            solveProductConceptResult: value.join(',')
          },
        })
      },
    })
  },
  agreementSelect(e) {
    let { currentTarget: { dataset: { key, title, values, flag, wuxselecttitle } } } = e

    let { formData: { [key]: data }, [values]: restValues } = this.data
    data = data === '' ? [] : data.split(',')
    $wuxSelect('#agreement').open({
      value: data,
      toolbar: {
        title: wuxselecttitle,
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionAgreement,
      onConfirm: (value, index, options) => {
        let { formData } = this.data

        if (index !== -1 && !this.data.isFinished) {
          this.setData({
            [title]: options[index].title,
            [flag]: value === '01',
            formData: {
              ...formData,
              ...restValues,
              [key]: value
            }
          })
        }
      },
    })
  },
  reachSelect(e) {
    let { currentTarget: { dataset: { key, title, values, flag, wuxselecttitle } } } = e

    let { formData: { [key]: data }, [values]: restValues } = this.data

    data = data === '' ? [] : data.split(',')
    $wuxSelect('#reach').open({
      value: data,
      toolbar: {
        title: wuxselecttitle,
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionAgreement,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          let { formData } = this.data

          if (!this.data.isFinished) {
            formData = {
              ...formData,
              ...restValues
            }
          }
          this.setData({
            [title]: options[index].title,
            [flag]: value === '01',
            formData: {
              ...formData,
              [key]: value
            }
          })
        }
        this.computedData()
      }
    })
  },
  noticeAndStartCovisit({ latitude, longitude, speed, accuracy }) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '开始协访需要您在目的医院附近,确定开始协访吗？',
      success(res) {
        if (res.confirm) {
          let actualStartTime = app.utils.formatDate(new Date(), 'yyyy-MM-dd H:mm:ss')
          that.setData({
            formData: {
              ...that.data.formData,
              actualStartTime,
              // startLatitude: latitude,
              // startLongitude: longitude,
              startItude: [latitude, longitude].filter(value => value).join(','),
              startSpeed: speed,
              startAccuracy: accuracy
            }
          })
          that.editCoVisit()
        } else if (res.cancel) {
        }
      }
    })
  },
  startCoVisit() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        /*
        latitude  number  纬度，范围为 -90~90，负数表示南纬
        longitude number  经度，范围为 -180~180，负数表示西经
        speed number  速度，单位 m/s
        accuracy  number  位置的精确度
        altitude  number  高度，单位 m 1.2.0
        verticalAccuracy  number  垂直精度，单位 m（Android 无法获取，返回 0）  1.2.0
        horizontalAccuracy  number  水平精度，单位 m 1.2.0
         */
        that.noticeAndStartCovisit({
          latitude,
          longitude,
          speed,
          accuracy
        })

      },
      fail(res) {
        console.log(res, that.route)
        let page = that.route
        let userId = that.data.formData.userid
        let method = 'startVisit'
        let wxApi = 'wx.getLocation'
        let content = JSON.stringify(res)
        app.phpCrmApi.addLog({
          page,
          userId,
          method,
          wxApi,
          content
        }).then(res => {
          console.log(res)
          that.noticeAndStartCovisit({})
        }).catch(res => {
          // PHP 接口未接入时使用Java接口储存日志，
          console.log(res)
          app.benetech.register({
            page,
            userId,
            method,
            wxApi,
            content
          }).then(res => {
            that.noticeAndStartCovisit({})
          }).catch(res => {
          })
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '需要开启手机定位才能开始协访',
        //   success(res) {
        //     if (res.confirm) {
        //     } else if (res.cancel) {
        //     }
        //   }
        // })
      }
    })
  },
  endCoVisit() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '结束协访后您需要在【2个小时内】完成这次协访的结果录入,确定要结束协访吗？',
      success(res) {
        if (res.confirm) {
          let actualEndTime = app.utils.formatDate(new Date(), 'yyyy-MM-dd H:mm:ss')
          that.setData({
            formData: {
              ...that.data.formData,
              actualEndTime
            }
          })
          that.editCoVisit()
        } else if (res.cancel) {
        }
      }
    })
  },
  editCoVisit() {
    let {formData} = this.data
    app.benetech.editCoVisit(formData).then(res => {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      this.computedData()
    })
  },
  finishCoVisit() {
    let that = this
    let { isCheckUpFlag, isAssistResult, isSolveReportFlag } = this.data
    let { checkUpFlag, assistResult, solveProductConceptResult} = this.data.formData
    /* 判断是否是检查 */
    if (isCheckUpFlag) {
      /* 判断是否填写检查内容 */
      if (!checkUpFlag) {
        wx.showToast({
          title: '请选择检查结果内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    /* 判断是否是辅导 */
    if (isAssistResult) {
      /* 判断是否填写辅导内容 */
      if (!assistResult) {
        wx.showToast({
          title: '请选择辅导内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    /* 判断是否是解决问题 */
    if (isSolveReportFlag) {
      /* 判断是否填写解决问题内容 */
      if (!solveProductConceptResult) {
        wx.showToast({
          title: '请选择解决问题内容',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    wx.showModal({
      title: '提示',
      content: '完成协访后将不能修改内容,确定要完成协访吗？',
      success(res) {
        if (res.confirm) {
          let finishTime = app.utils.formatDate(new Date(), 'yyyy-MM-dd H:mm:ss')
          that.setData({
            formData: {
              ...that.data.formData,
              finishTime
            }
          })
          that.editCoVisit()
        } else if (res.cancel) {
        }
      }
    })
  },
  cancleEdit(e) {
    wx.navigateBack()
  },
  checkUpResultChange(e) {
    let { currentTarget: { dataset: { index, code } }, detail: { value } } = e
    let { checkUpResultChosen } = this.data
    checkUpResultChosen[index] = value

    let checkUpFlag = []
    let checkUpResult = []
    checkUpResultChosen.forEach((value, valueIndex) => {
      if (value) {
        checkUpFlag.push(optionCheckUpResult[valueIndex].code)
      } else {
        checkUpResult.push(optionCheckUpResult[valueIndex].code)
      }
    })

    this.setData({
      checkUpResultChosen,
      formData: {
        ...this.data.formData,
        checkUpFlag: checkUpFlag.join(','),
        checkUpResult: checkUpResult.join(',')
      }
    })
  }
})
