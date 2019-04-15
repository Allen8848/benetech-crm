// pages/visit/edit/edit.js
import { $wuxCalendar, $wuxSelect } from '../../../dist/index'

//获取应用实例
const app = getApp()

/* 拜访目的 */
const optionPurpose = [{ "code": "01", "name": "要求生意" }, { "code": "02", "name": "评估生意" }, { "code": "03", "name": "邀请参会" }, { "code": "04", "name": "邀请主席" }, { "code": "05", "name": "邀请讲者" }, { "code": "06", "name": "邀请组织者" }, { "code": "07", "name": "传递观念" }]

const selectOptionPurpose = optionPurpose.map(option => {
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

/* 学术支持 */
const optionSupport = [{ "code": "01", "name": "邀请参会" }, { "code": "02", "name": "邀请主席" }, { "code": "03", "name": "邀请讲者" }, { "code": "04", "name": "邀请组织者" }]

const selectOptionSupport = optionSupport.map(option => {
  return { title: option.name, value: option.code }
})

const askingBusinessAgree = {
  /* 要求生意【达成】 */
  // businessPatient: '', // 每次门诊选择病人人数
  askingBusinessPatientNumber: '', // 要求生意同意后 每次门诊选择病人几例
  askingBusinessBox: '', // 每例处方__盒
  askingBusinessOutpatient: '', // 每月__次门诊
  askingBusinessSales: '', // 合计增加__销售
}

const askingBusinessDisagree = {
  /* 要求生意【未达成】 */
  askingBusinessDisapproval: '',// 不认可的产品观念
  askingBusinessLiterature: '', // 准备__文献（20问），下次再拜访
  askingBusinessSupport: '', // 资源（参会、讲者、主席、组织者） - 可不选
}

const estimateBusinessAgree = {
  /* 评估生意【达成】 */
  // businessPatient: '', // 每次门诊选择病人人数
  estimateBusinessPatientNumber: '', // 评估生意同意后 每次门诊选择病人几例
  estimateBusinessBox: '', // 每例处方__盒
  estimateBusinessOutpatient: '', // 每月__次门诊
  estimateBusinessSales: '', // 合计增加__销售
}

const estimateBusinessDisagree = {
  /* 评估生意【未达成】 */
  estimateBusinessDisapproval: '',// 不认可的产品观念
  estimateBusinessLiterature: '', // 准备__文献（20问），下次再拜访
  estimateBusinessSupport: '', // 资源（参会、讲者、主席、组织者） - 可不选
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStarted: false,
    isEnded: false,
    isFinished: false,

    purposeTitle: '',
    conferenceTypeTitle: '',
    isAskingBusiness: false,
    isAskingBusinessAgree: null,
    askingBusinessTitle: '请选择',
    askingBusinessResetValues: {
      ...askingBusinessAgree, // 要求生意【达成】
      ...askingBusinessDisagree, // 要求生意【未达成】
    },

    isEstimateBusiness: false,
    isEstimateBusinessAgree: null,
    estimateBusinessTitle: '请选择',
    estimateBusinessResetValues: {
      ...estimateBusinessAgree, // 评估生意【达成】
      ...estimateBusinessDisagree, // 评估生意【未达成】
    },

    /* 邀请参会 */
    isConference: false,
    conferenceResultTitle: '请选择',

    /* 邀请主席 */
    isChairman: false,
    chairmanResultTitle: '请选择',

    /* 邀请讲者 */
    isSpeaker: false,
    speakerResultTitle: '请选择',

    /* 邀请组织者 */
    isOrganizer: false,
    organizerResultTitle: '请选择',

    /* 传递观念 */
    isConveyIdeasVisible: false,
    isConveyIdeas: false,
    conveyIdeas: [],
    conveyIdeasTitle: '请选择',

    optionEvaluate: null,
    askingBusinessDisapprovalTitle: '0',
    askingBusinessSupportTitle: '0',

    formData: {
      id: null, // 拜访ID
      createId: '',
      type: 'update',
      userid: '',
      purpose: '',

      // startLatitude: null, // number 纬度，范围为 -90~90，负数表示南纬
      // startLongitude: null, //  number  经度，范围为 -180~180，负数表示西经
      // startSpeed: null, //  number  速度，单位 m/s
      // startAccuracy: null, // number  位置的精确度

      startItude: null,

      // endLatitude: null, // number 纬度，范围为 -90~90，负数表示南纬
      // endLongitude: null, //  number  经度，范围为 -180~180，负数表示西经
      // endSpeed: null, //  number  速度，单位 m/s
      // endAccuracy: null, // number  位置的精确度

      planStartTime: '',
      actualStartTime: '',
      actualEndtTime: '',
      finishTime: '',
      conferenceType: '',
      customerRelationship: '',
      userName: '',
      product: '',
      accept: '', // 同意观念
      negate: '', // 否定观念
      hospital: '',
      doctor: '',

      concludeText: null, // 达成情况
      consequenceText: null, // 结果及跟进情况

      askingBusiness: '', // 要求生意同意与否
      ...askingBusinessAgree, // 要求生意【达成】
      ...askingBusinessDisagree, // 要求生意【未达成】

      estimateBusiness: '', // 评估生意同意与否
      ...estimateBusinessAgree, // 评估生意【达成】
      ...estimateBusinessDisagree, // 评估生意【未达成】

      conferenceResult: '', // 邀请参会的结果
      chairmanResult: '', // 邀请主席
      speakerResult: '', // 邀请讲者
      organizerResult: '' // 邀请组织者
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const { userid, userName, BYNAME } = app.globalData.accuntInfo
    that.setData({
      formData: {
        ...this.data.formData,
        userid,
        createId: userid,
        userName,
        BYNAME,
        id: options.id
      }
    })
    that.getVisitInfo()
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
  computedData() {
    let { askingBusinessPatientNumber, askingBusinessBox, askingBusinessOutpatient, actualStartTime, actualEndtTime, finishTime, purpose, askingBusinessDisapproval, askingBusinessSupport, estimateBusinessDisapproval, estimateBusinessPatientNumber, estimateBusinessBox, estimateBusinessOutpatient, estimateBusinessSupport, estimateBusiness, askingBusiness, conferenceResult, chairmanResult, speakerResult, organizerResult } = this.data.formData

    let isStarted = actualStartTime !== null && actualStartTime !== undefined && actualStartTime !== ''
    let isEnded = actualEndtTime !== null && actualEndtTime !== undefined && actualEndtTime !== ''
    let isFinished = this.data.isFinished || (finishTime !== null && finishTime !== undefined && finishTime !== '')

    /* 要求生意 */
    let isAskingBusiness = purpose.split(',').indexOf('01') !== -1
    let {isAskingBusinessAgree} = this.data
    if (!(askingBusiness == '' || askingBusiness === null || askingBusiness == undefined)) {
      isAskingBusinessAgree = askingBusiness === '01'
    }

    let askingBusinessDisapprovalTitle = (askingBusinessDisapproval === '' ? [] : askingBusinessDisapproval.split(',')).length
    let askingBusinessSupportTitle = (askingBusinessSupport === '' ? [] : askingBusinessSupport.split(',')).length
    let askingBusinessSales = [askingBusinessPatientNumber, askingBusinessBox, askingBusinessOutpatient].reduce((total, current) => total * current, 1)
    /* 评估生意 */
    let isEstimateBusiness = purpose.split(',').indexOf('02') !== -1
    let { isEstimateBusinessAgree } = this.data
    if (!(estimateBusiness == '' || estimateBusiness === null || estimateBusiness == undefined)) {
      isEstimateBusinessAgree = estimateBusiness === '01'
    }



    let estimateBusinessTitle;
    try {
      estimateBusinessTitle = optionReach.filter(option => option.code === estimateBusiness)[0].name
    } catch(e) {
    }
    if (estimateBusinessTitle === undefined) {
      estimateBusinessTitle = this.data.estimateBusinessTitle
    }

    let estimateBusinessDisapprovalTitle = (estimateBusinessDisapproval === '' ? [] : estimateBusinessDisapproval.split(',')).length
    let estimateBusinessSupportTitle = (estimateBusinessSupport === '' ? [] : estimateBusinessSupport.split(',')).length
    let estimateBusinessSales = [estimateBusinessPatientNumber, estimateBusinessBox, estimateBusinessOutpatient].reduce((total, current) => total * current, 1)

    // 邀请参会同意与否
    let conferenceResultTitle
    try {
      conferenceResultTitle = optionAgreement.filter(option => option.code === conferenceResult)[0].name
    } catch(e) {

    }
    if (conferenceResultTitle === undefined) {
      conferenceResultTitle = this.data.conferenceResultTitle
    }

    // 邀请主席同意与否
    let chairmanResultTitle
    try {
      chairmanResultTitle = optionAgreement.filter(option => option.code === chairmanResult)[0].name
    } catch (e) {

    }
    if (chairmanResultTitle === undefined) {
      chairmanResultTitle = this.data.chairmanResultTitle
    }

    // 邀请讲者同意与否
    let speakerResultTitle
    try {
      speakerResultTitle = optionAgreement.filter(option => option.code === speakerResult)[0].name
    } catch (e) {

    }
    if (speakerResultTitle === undefined) {
      speakerResultTitle = this.data.speakerResultTitle
    }

    // 邀请组织者
    let organizerResultTitle
    try {
      organizerResultTitle = optionAgreement.filter(option => option.code === organizerResult)[0].name
    } catch (e) {

    }
    if (organizerResultTitle === undefined) {
      organizerResultTitle = this.data.organizerResultTitle
    }


    /* 拜访结果 */
    let concludeText = [] // 达成情况
    let consequenceText = [] // 结果及跟进情况
    let {
      // isAskingBusiness,
      // isAskingBusinessAgree,
      askingBusinessTitle,
      // isEstimateBusiness,
      // isEstimateBusinessAgree,
      isConference,
      isChairman,
      isSpeaker,
      isOrganizer,
      isConveyIdeas,
      conveyIdeas,
      conveyIdeasTitle,
      optionEvaluate,
      formData: {
        // askingBusiness, // 要求生意同意与否
        // estimateBusiness, // 评估生意同意与否
        // conferenceResult, // 邀请参会的结果
        // chairmanResult, // 邀请主席
        // speakerResult, // 邀请讲者
        // organizerResult, // 邀请组织者

        /* 要求生意【达成】 的情况 */
        // askingBusinessPatientNumber, // 要求生意同意后 每次门诊选择病人几例
        // askingBusinessBox, // 每例处方__盒
        // askingBusinessOutpatient, // 每月__次门诊
        // askingBusinessSales, // 合计增加__销售

        /* 要求生意【未达成】 的情况 */
        // askingBusinessDisapproval,// 不认可的产品观念
        askingBusinessLiterature, // 准备__文献（20问），下次再拜访
        // askingBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选

        /* 评估生意【达成】 的情况 */
        // estimateBusinessPatientNumber, // 评估生意同意后 每次门诊选择病人几例
        // estimateBusinessBox, // 每例处方__盒
        // estimateBusinessOutpatient, // 每月__次门诊
        // estimateBusinessSales, // 合计增加__销售

        /* 评估生意【未达成】 的情况 */
        // estimateBusinessDisapproval,// 不认可的产品观念
        // estimateBusinessLiterature, // 准备__文献（20问），下次再拜访
        // estimateBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选

        accept, // 同意观念
        negate, // 否定观念
      }
    } = this.data
    if (optionEvaluate === null) {
      optionEvaluate = []
    }
    /* 要求生意 */
    if (isAskingBusiness && isAskingBusinessAgree !== null) {
      concludeText.push(`要求生意【${askingBusinessTitle}】`)
      consequenceText.push('要求生意：')
      if (isAskingBusinessAgree) {
        if (askingBusinessPatientNumber > 0) {
          consequenceText.push(`  每次门诊选择病人${askingBusinessPatientNumber}例`)
        }
        if (askingBusinessBox > 0) {
          consequenceText.push(`  每例处方${askingBusinessBox}盒`)
        }
        if (askingBusinessOutpatient > 0) {
          consequenceText.push(`  每月门诊${askingBusinessOutpatient}次`)
        }
        if (askingBusinessSales > 0) {
          consequenceText.push(`  合计增加销售${askingBusinessSales}盒`)
        }
      } else {
        askingBusinessDisapproval = askingBusinessDisapproval.split(',').filter(value => value !== '' && value !== null)
        if (askingBusinessDisapproval.length > 0) {
          consequenceText.push(`  不认可的产品观念【${optionEvaluate.filter(option => askingBusinessDisapproval.indexOf(option.value) > -1).map(option => option.title).join('、')}】`)
        }

        askingBusinessSupport = askingBusinessSupport.split(',').filter(value => value !=='' && value !== null)
        if (askingBusinessSupport.length > 0) {
          consequenceText.push(`  学术支持【${optionSupport.filter(option => askingBusinessSupport.indexOf(option.code) > -1).map(option => option.name).join('、')}】`)
        }
      }
    }

    /* 评估生意 */
    if (isEstimateBusiness && isEstimateBusinessAgree !== null) {
      concludeText.push(`评估生意【${estimateBusinessTitle}】`)
      consequenceText.push('评估生意：')
      if (isEstimateBusinessAgree) {
        if (estimateBusinessPatientNumber > 0) {
          consequenceText.push(`  每次门诊选择病人${estimateBusinessPatientNumber}例`)
        }
        if (estimateBusinessBox > 0) {
          consequenceText.push(`  每例处方${estimateBusinessBox}盒`)
        }
        if (estimateBusinessOutpatient > 0) {
          consequenceText.push(`  每月门诊${estimateBusinessOutpatient}次`)
        }
        if (estimateBusinessSales > 0) {
          consequenceText.push(`  合计增加销售${estimateBusinessSales}盒`)
        }
      } else {
        estimateBusinessDisapproval = estimateBusinessDisapproval.split(',').filter(value => value !== '' && value !== null)
        if (estimateBusinessDisapproval.length > 0) {
          consequenceText.push(`  不认可的产品观念【${optionEvaluate.filter(option => estimateBusinessDisapproval.indexOf(option.value) > -1).map(option => option.title).join('、')}】`)
        }

        estimateBusinessSupport = estimateBusinessSupport.split(',').filter(value => value !== '' && value !== null)
        if (estimateBusinessSupport.length > 0) {
          consequenceText.push(`  学术支持【${optionSupport.filter(option => estimateBusinessSupport.indexOf(option.code) > -1).map(option => option.name).join('、')}】`)
        }
      }
    }

    /* 邀请参会 */
    if (isConference && conferenceResult) {
      concludeText.push(`邀请参会【${conferenceResultTitle}】`)
    }

    /* 邀请主席 */
    if (isChairman && chairmanResult) {
      concludeText.push(`邀请主席【${chairmanResultTitle}】`)
    }

    /* 邀请讲者 */
    if (isSpeaker && speakerResult) {
      concludeText.push(`邀请讲者【${speakerResultTitle}】`)
    }

    /* 邀请组织者 */
    if (isOrganizer && organizerResult) {
      concludeText.push(`邀请组织者【${organizerResultTitle}】`)
    }

    /* 传递观念 */
    if (isConveyIdeas && (accept || negate)) {

      accept = accept.split(',').filter(value => value !== '' && value !== null)
      if (accept.length > 0) {
        consequenceText.push(`  成功传递的的产品观念【${optionEvaluate.filter(option => accept.indexOf(option.value) > -1).map(option => option.title).join('、')}】`)
      }
      negate = negate.split(',').filter(value => value !== '' && value !== null)
      if (negate.length > 0) {
        consequenceText.push(`  未成功传递的的产品观念【${optionEvaluate.filter(option => negate.indexOf(option.value) > -1).map(option => option.title).join('、')}】`)
      }
      optionEvaluate.forEach((option, optionIndex) => {
        conveyIdeas[optionIndex] = accept.indexOf(option.value) > -1
      })
      if (conveyIdeas.length > 0) {
        conveyIdeasTitle = `成功传递${conveyIdeas.filter(value => value).length}项，未成功传递${conveyIdeas.filter(value => !value).length}项`
      }
    }

    this.setData({
      isStarted,
      isEnded,
      isFinished,
      isAskingBusiness,
      isAskingBusinessAgree,
      askingBusinessDisapprovalTitle,
      askingBusinessSupportTitle,
      askingBusinessSales,


      isEstimateBusiness,
      isEstimateBusinessAgree,
      estimateBusinessTitle,
      estimateBusinessDisapprovalTitle,
      estimateBusinessSupportTitle,
      estimateBusinessSales,

      conferenceResultTitle,
      chairmanResultTitle,
      speakerResultTitle,
      organizerResultTitle,
      conveyIdeas,
      conveyIdeasTitle,
      formData: {
        ...this.data.formData,
        concludeText: concludeText.join('\n'),
        consequenceText: consequenceText.join('\n')
      }
    })
    if(this.data.isFinished) {
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
          },2000)
        }
      })
    }
  },
  inputChange(e) {
    let { currentTarget: { dataset: {key}}, detail: {value}} = e
    this.setData({
      formData: {
        ...this.data.formData,
        [key]: value
      }
    })
    this.computedData()
  },
  getVisitInfo() {
    let that = this
    app.benetech.getVisitInfo(this.data.formData.id).then(res => {
      let data = res[0]
      let {
        bfmd: purpose,
        jhkssj: planStartTime,
        sjkssj: actualStartTime,
        sjjssj: actualEndtTime,
        hylx: conferenceType,
        kqgx: customerRelationship,

        // startLatitude, // number 纬度，范围为 -90~90，负数表示南纬
        // startLongitude, //  number  经度，范围为 -180~180，负数表示西经
        // startSpeed, //  number  速度，单位 m/s
        // startAccuracy, // number  位置的精确度

        startItude,

        // endLatitude, // number 纬度，范围为 -90~90，负数表示南纬
        // endLongitude, //  number  经度，范围为 -180~180，负数表示西经
        // endSpeed, //  number  速度，单位 m/s
        // endAccuracy, // number  位置的精确度

        cp: product,
        rkgn: accept,
        yy: hospital,
        ys : doctor,
        fdgn : negate,
        dcqk: conclude, // 达成情况
        gjqk: consequence, // 结果及跟进情况
      } = data
      if (!((conclude === '{}' || conclude === null) && (consequence === '{}' || consequence === null))) {
        that.setData({
          isFinished: true
        })
      }
      
      if (!conclude) {
        conclude = '{}'
      }
      if (!consequence) {
        consequence = '{}'
      }
      conclude = JSON.parse(conclude)
      let {
        askingBusiness, // 要求生意同意与否
        estimateBusiness, // 评估生意同意与否
        conferenceResult, // 邀请参会的结果
        chairmanResult, // 邀请主席
        speakerResult, // 邀请讲者
        organizerResult // 邀请组织者
      } = conclude


      consequence = JSON.parse(consequence)
      let {
        /* 要求生意【达成】 的情况 */
        askingBusinessPatientNumber, // 要求生意同意后 每次门诊选择病人几例
        askingBusinessBox, // 每例处方__盒
        askingBusinessOutpatient, // 每月__次门诊
        askingBusinessSales, // 合计增加__销售


        /* 要求生意【未达成】 的情况 */
        askingBusinessDisapproval,// 不认可的产品观念
        askingBusinessLiterature, // 准备__文献（20问），下次再拜访
        askingBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选

        /* 评估生意【达成】 的情况 */
        estimateBusinessPatientNumber, // 评估生意同意后 每次门诊选择病人几例
        estimateBusinessBox, // 每例处方__盒
        estimateBusinessOutpatient, // 每月__次门诊
        estimateBusinessSales, // 合计增加__销售

        /* 评估生意【未达成】 的情况 */
        estimateBusinessDisapproval,// 不认可的产品观念
        estimateBusinessLiterature, // 准备__文献（20问），下次再拜访
        estimateBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选
      } = consequence


      // 避免null出错的情况，重置为 空字符串
      let resFormData = {
        purpose,
        planStartTime,
        actualStartTime,
        actualEndtTime,
        conferenceType,
        customerRelationship,
        startItude,
        product,
        accept,
        hospital,
        doctor,
        negate,
        askingBusiness, // 要求生意同意与否
        estimateBusiness, // 评估生意同意与否
        conferenceResult, // 邀请参会的结果
        chairmanResult, // 邀请主席
        speakerResult, // 邀请讲者
        organizerResult, // 邀请组织者
        /* 要求生意【达成】 的情况 */
        askingBusinessPatientNumber, // 要求生意同意后 每次门诊选择病人几例
        askingBusinessBox, // 每例处方__盒
        askingBusinessOutpatient, // 每月__次门诊
        askingBusinessSales, // 合计增加__销售


        /* 要求生意【未达成】 的情况 */
        askingBusinessDisapproval,// 不认可的产品观念
        askingBusinessLiterature, // 准备__文献（20问），下次再拜访
        askingBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选

        /* 评估生意【达成】 的情况 */
        estimateBusinessPatientNumber, // 评估生意同意后 每次门诊选择病人几例
        estimateBusinessBox, // 每例处方__盒
        estimateBusinessOutpatient, // 每月__次门诊
        estimateBusinessSales, // 合计增加__销售

        /* 评估生意【未达成】 的情况 */
        estimateBusinessDisapproval,// 不认可的产品观念
        estimateBusinessLiterature, // 准备__文献（20问），下次再拜访
        estimateBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选
      }

      Object.keys(resFormData).forEach((key) => {
        if (!resFormData[key]) {
          resFormData[key] = ''
        }
      })


      let purposeTitle = (typeof purpose === 'string') && purpose !== '' ? purpose.split(',').length : 0


      let askingBusinessTitle = optionAgreement.filter(option => option.code === askingBusiness)
      if (askingBusinessTitle.length > 0) {
        askingBusinessTitle = askingBusinessTitle[0].name
      } else {
        askingBusinessTitle = that.data.askingBusinessTitle
      }

      let isConference = purpose.split(',').indexOf('03') !== -1
      let isChairman = purpose.split(',').indexOf('04') !== -1
      let isSpeaker = purpose.split(',').indexOf('05') !== -1
      let isOrganizer = purpose.split(',').indexOf('06') !== -1
      let isConveyIdeas = purpose.split(',').indexOf('07') !== -1

      let customerRelationshipTitle = optionCustomerRelationship.findIndex(option => option.code === customerRelationship) + 1 + ' 级'
      let conferenceTypeTitle = optionConferenceType.filter(option => option.code === conferenceType)
      if (conferenceTypeTitle.length > 0) {
        conferenceTypeTitle = conferenceTypeTitle[0].name
      } else {
        conferenceTypeTitle = that.data.conferenceTypeTitle
      }

      that.setData({
        purposeTitle,
        conferenceTypeTitle,
        askingBusinessTitle,
        isConference,
        isChairman,
        isSpeaker,
        isOrganizer,
        isConveyIdeas,
        customerRelationshipTitle,
        formData: {
          ...that.data.formData,
          ...resFormData
        }
      })
      if (!that.data.optionEvaluate && product !== '') {
        app.benetech.getEvaluate(product).then(res => {
          let {fouren} = res
          let optionEvaluate = []
          let conveyIdeas = []
          if (fouren.length > 0 && fouren[0] !== null) {
            conveyIdeas = new Array(fouren.length)
            optionEvaluate = fouren.map(data => {
              let { col_772: title, id: value } = data
              if (!value) {
                value = title
              }
              return {
                title,
                value: value.toString()
              }
            })
          }
          that.setData({
            optionEvaluate,
            conveyIdeas
          })
          that.computedData()
        })
      } else {
        this.computedData()
      }
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
        // cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionPurpose,
      onConfirm: (value, index, options) => {
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
        // cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionConferenceType,
      onConfirm: (value, index, options) => {
      }
    })
  },
  customerRelationshipSelect() {
    $wuxSelect('#customerRelationship').open({
      value: this.data.formData.customerRelationship,
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
  supportResultSelect(e) {
    let { currentTarget: { dataset: { key, title } } } = e
    let data = this.data.formData[key]

    data = data === '' ? [] : data.split(',')
    $wuxSelect('#support').open({
      value: data,
      multiple: true,
      toolbar: {
        title: '学术支持',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionSupport,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          let { formData } = this.data
          this.setData({
            [title]: value.length,
            formData: {
              ...formData,
              [key]: value.join(',')
            }
          })
        }
        this.computedData()
      }
    })
  },
  agreementSelect(e) {
    let { currentTarget: { dataset: { key, title, wuxselecttitle } } } = e

    let data = this.data.formData[key]
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
        if (index !== -1 && !this.data.isFinished) {
          this.setData({
            [title]: options[index].title,
            formData: {
              ...this.data.formData,
              [key]: value
            }
          })
        }
        this.computedData()
      },
    })
  },
  reachSelect(e) {
    let { currentTarget: { dataset: { key, title, values, flag, wuxselecttitle } } } = e

    let { formData: { [key]: data }, [values]: restValues} = this.data

    data = data === '' ? [] : data.split(',')
    $wuxSelect('#reach').open({
      value: data,
      toolbar: {
        title: wuxselecttitle,
        cancelText: '取消',
        confirmText: '确定',
      },
      options: selectOptionReach,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          let { formData } = this.data

          if(!this.data.isFinished) {
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
  /* 不认可的产品观念 */
  disapprovalSelect(e) {
    let { currentTarget: { dataset: { key, title } } } = e

    let data = this.data.formData[key]
    data = data === '' ? [] : data.split(',')
    $wuxSelect('#disapproval').open({
      value: data,
      multiple: true,
      toolbar: {
        title: '不认可的产品观念',
        cancelText: '取消',
        confirmText: '确定',
      },
      options: this.data.optionEvaluate,
      onConfirm: (value, index, options) => {
        this.setData({
          [title]: value.length,
          formData: {
            ...this.data.formData,
            [key]: value.join(',')
          }
        })
        this.computedData()
      },
    })
  },
  cancleEdit(e) {
    wx.navigateBack()
  },
  noticeAndStartVisit({ latitude, longitude, speed, accuracy}) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '开始拜访需要您在目的医院附近,确定开始拜访吗？',
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
          that.editVisit()
        } else if (res.cancel) {
        }
      }
    })
  },
  startVisit() {
    let that  = this
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
        that.noticeAndStartVisit({
          latitude,
          longitude,
          speed,
          accuracy
        })
      },
      fail(res) {
        console.log(res,that.route)
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
          that.noticeAndStartVisit({})
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
            that.noticeAndStartVisit({})
           }).catch(res => { 
           })
        })
        // wx.showModal({
        //   title: '提示',
        //   content: '需要开启手机定位才能开始拜访',
        //   success(res) {
        //     if (res.confirm) {
        //     } else if (res.cancel) {
        //     }
        //   }
        // })
      }
    })

  },
  endVisit() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '结束拜访后您需要在【2个小时内】完成这次拜访的结果录入,确定要结束拜访吗？',
      success(res) {
        if (res.confirm) {
          let actualEndtTime = app.utils.formatDate(new Date(), 'yyyy-MM-dd H:mm:ss')
          that.setData({
            formData: {
              ...that.data.formData,
              actualEndtTime
            }
          })
          that.editVisit()
        } else if (res.cancel) {
        }
      }
    })
  },
  finishVisit() {
    let that = this
    let { isAskingBusiness, isEstimateBusiness, isConference, isChairman, isSpeaker, isOrganizer, isConveyIdeas } = this.data
    let { askingBusiness, estimateBusiness, conferenceResult, chairmanResult, speakerResult, organizerResult, accept } = this.data.formData
    /* 判断是否是要求生意 */
    if (isAskingBusiness){
      /* 判断是否填写要求生意 */
      if (!askingBusiness) {
        wx.showToast({
          title: '请选择要求生意达成与否',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    /* 判断是否是评估生意 */
    if (isEstimateBusiness) {
      /* 判断是否填写评估生意 */
      if (!estimateBusiness) {
        wx.showToast({
          title: '请选择评估生意达成与否',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }      
    
    /* 判断是否是邀请参会 */
    if (isConference) {
      /* 判断是否填写邀请参会 */
      if (!conferenceResult) {
        wx.showToast({
          title: '请选择邀请参会同意与否',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }  
    
    /* 判断是否是邀请主席 */
    if (isChairman) {
      /* 判断是否填写邀请主席 */
      if (!chairmanResult) {
        wx.showToast({
          title: '请选择邀请主席同意与否',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }  

    /* 判断是否是邀请讲者 */
    if (isSpeaker) {
      /* 判断是否填写邀请讲者 */
      if (!speakerResult) {
        wx.showToast({
          title: '请选择邀请讲者同意与否',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }  

    /* 判断是否是邀请组织者 */
    if (isOrganizer) {
      /* 判断是否填写邀请组织者 */
      if (!organizerResult) {
        wx.showToast({
          title: '请选择邀请组织者同意与否',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }  

    /* 判断是否是传递观念 */
    if (isConveyIdeas) {
      /* 判断是否填写传递观念 */
      if (!accept) {
        wx.showToast({
          title: '请选择传递观念',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }

    wx.showModal({
      title: '提示',
      content: '完成拜访后将不能修改内容,确定要完成拜访吗？',
      success(res) {
        if (res.confirm) {
          let finishTime = app.utils.formatDate(new Date(), 'yyyy-MM-dd H:mm:ss')
          that.setData({
            formData: {
              ...that.data.formData,
              finishTime
            }
          })
          that.editVisit()
        } else if (res.cancel) {
        }
      }
    })
  },
  editVisit() {
    let that = this
    app.benetech.editVisit(this.data.formData).then(res => {
      that.getVisitInfo()
    })
  },
  openPopupConveyIdeas() {
    this.setData({
      isConveyIdeasVisible: true
    })
  },
  closePopupConveyIdeas() {
    let { conveyIdeas } = this.data
    for (let index = conveyIdeas.length; index--;){
      conveyIdeas[index] = !!conveyIdeas[index]
    }
    this.setData({
      conveyIdeas,
      isConveyIdeasVisible: false
    })
    this.setAcceptAndNegate()
  },
  setAcceptAndNegate() {
    let { conveyIdeas, optionEvaluate } = this.data
    let negate = []
    let accept = []
    conveyIdeas.forEach((conveyIdea, conveyIdeaIndex) => {
      if (conveyIdea) {
        accept.push(optionEvaluate[conveyIdeaIndex].value)
      } else {
        negate.push(optionEvaluate[conveyIdeaIndex].value)
      }
    })
    this.setData({
      formData: {
        ...this.data.formData,
        accept: accept.join(','),
        negate: negate.join(',')
      }
    })
    this.computedData()
  },
  conveyIdeasChange(e) {
    let { currentTarget: { dataset: { index } }, detail: { value } } = e
    let { conveyIdeas } = this.data
    conveyIdeas[index] = value

    this.setData({
      conveyIdeas
    })
    this.setAcceptAndNegate()
  }
})
