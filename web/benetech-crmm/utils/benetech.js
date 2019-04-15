// const URI = 'https://benetech.f3322.net:9095/customer'
// const URI = 'https://172.21.150.109:8080/customer'
const URI = 'https://172.21.200.70:8080/customer'
// const URI = 'https://172.21.200.65:8080/customer'
const fetch = require('./fetch')
const utils = require('./util.js')
/**
 * 抓取豆瓣电影特定类型的API
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi(type, params, method) {
  return fetch(URI, type, params, method)
}

/**
 * 获取列表类型的数据
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       包含抓取任务的Promise
 */
function find(type, page = 1, count = 20, search = '') {
  const params = { start: (page - 1) * count, count: count, city: getApp().data.currentCity }
  return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
    .then(res => res.data)
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     电影ID
 * @return {Promise}       包含抓取任务的Promise
 */
function login(byname, imei, userid) {
  return fetchApi('boot/second/?' + utils.encodeParams({ byname, imei, userid}))
    .then(res => res)
}

function register({ account, psw, ...otherParam }) {
  return fetchApi('boot/register/', { account, psw, ...otherParam})
    .then(res => {
      if (res.length === 0 && account) {
        wx.showToast({
          title: '账号不存在，\n请检查后重试',
          icon: 'none',
          duration: 2000
        })
        return Promise.reject(new Error('error'))
      } else {
        return res
      }
    })
}

function decodeUserInfo(userid, encryptedData, iv, code, model, platform, IMEI) {
  return fetchApi('boot/decodeUserInfo/?' + utils.encodeParams({ userid, encryptedData, iv, code, model, platform, IMEI }), null, 'POST')
    .then(res => {
      if(res.status === 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        return Promise.reject(new Error(res.msg))
      }
      return res
    })
}

function getClient(userid, deptid, page, pagesize, sort, order, filter) {
  /*
  {
    "col_87":"上海市松江区方塔中医医院",
    "col_420":"依叶",
    "col_830":"ceshi", // 目前用量
    "col_831":"ceshi", // 目标用量
    "id":3705, 客户ID
    "col_417":"272", 潜力
    "col_418":"中医内科",科室
    "col_67":"茅靖" 客户姓名
  }
   */

  return fetchApi('watch/client?' + utils.encodeParams({ userid, deptid, page, pagesize, sort, order, filter}))
    .then(res => res)
}

function getVisitList(userid, deptid, page, pagesize, isCoVisit) {
  return fetchApi('boot/watch?' + utils.encodeParams({ userid: userid, deptid, page, pagesize, isCoVisit }))
    .then(res => res)
}

function editVisit(
  {
    id, // 拜访ID
    createId,
    type,
    userid,
    purpose,

    // startLatitude, // number 纬度，范围为 -90~90，负数表示南纬
    // startLongitude, // number  经度，范围为 -180~180，负数表示西经
    // startSpeed, // number  速度，单位 m/s
    // startAccuracy, //  number  位置的精确度
    startItude,
    // endLatitude, // number 纬度，范围为 -90~90，负数表示南纬
    // endLongitude, //  number  经度，范围为 -180~180，负数表示西经
    // endSpeed, //  number  速度，单位 m/s
    // endAccuracy, // number  位置的精确度

    planStartTime,
    actualStartTime,
    actualEndtTime,
    conferenceType,
    customerRelationship,
    userName,
    product,
    productId,
    accept,
    concludeText,
    consequenceText,
    hospital,
    doctor,
    negate, // 否定

    clientId,


    askingBusiness, // 要求生意同意与否


    // 要求生意【达成】
    askingBusinessPatientNumber, // 要求生意同意后 每次门诊选择病人几例
    askingBusinessBox, // 每例处方__盒
    askingBusinessOutpatient, // 每月__次门诊
    askingBusinessSales, // 合计增加__销售


    // 要求生意【未达成】
    askingBusinessDisapproval,// 不认可的产品观念
    askingBusinessLiterature, // 准备__文献（20问），下次再拜访
    askingBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选




    estimateBusiness, // 评估生意同意与否
    /* 评估生意【达成】 */
    estimateBusinessPatientNumber, // 评估生意同意后 每次门诊选择病人几例
    estimateBusinessBox, // 每例处方__盒
    estimateBusinessOutpatient, // 每月__次门诊
    estimateBusinessSales, // 合计增加__销售

    /* 评估生意【未达成】 */
    estimateBusinessDisapproval,// 不认可的产品观念
    estimateBusinessLiterature, // 准备__文献（20问），下次再拜访
    estimateBusinessSupport, // 资源（参会、讲者、主席、组织者） - 可不选




    conferenceResult, // 邀请参会的结果
    chairmanResult, // 邀请主席
    speakerResult, // 邀请讲者
    organizerResult // 邀请组织者
  }) {
  let conclude = {
    askingBusiness, // 要求生意同意与否
    estimateBusiness, // 评估生意同意与否
    conferenceResult, // 邀请参会的结果
    chairmanResult, // 邀请主席
    speakerResult, // 邀请讲者
    organizerResult // 邀请组织者
  }
  let consequence = {
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
  let concludeFlag = true
  Object.keys(conclude).forEach(key => {
    let value = conclude[key]
    if (!(value === null || value === undefined || value === '')) {
      concludeFlag = false
    }
  })

  if (concludeFlag) {
    conclude = {}
  }

  let consequenceFlag = true
  Object.keys(consequence).forEach(key => {
    let value = consequence[key]
    if (!(value === null || value === undefined || value === '')) {
      consequenceFlag = false
    }
  })
  if (consequenceFlag) {
    consequence = {}
  }



  return fetchApi('watch/insertAll?' + utils.encodeParams({
    id, // 拜访ID
    createId,
    type,
    userid,
    purpose,

    // startLatitude, // number 纬度，范围为 -90~90，负数表示南纬
    // startLongitude, // number  经度，范围为 -180~180，负数表示西经
    // startSpeed, // number  速度，单位 m/s
    // startAccuracy, //  number  位置的精确度

    startItude,
    // endLatitude, // number 纬度，范围为 -90~90，负数表示南纬
    // endLongitude, //  number  经度，范围为 -180~180，负数表示西经
    // endSpeed, //  number  速度，单位 m/s
    // endAccuracy, // number  位置的精确度

    planStartTime,
    actualStartTime,
    actualEndtTime,
    conferenceType,
    customerRelationship,
    userName,
    product,
    productId,
    accept,
    concludeText,
    consequenceText,
    hospital,
    doctor,
    negate, // 否定
    conclude: JSON.stringify(conclude),
    consequence: JSON.stringify(consequence),

    clientId,

  }), null, 'POST')
    .then(res => res)
}


function getVisitInfo(watchid) {
  return fetchApi('watch/particulars?' + utils.encodeParams({watchid}))
    .then(res => res)
}


function getEvaluate(evaluate) {
  return fetchApi('watch/getEvaluate?' + utils.encodeParams({ evaluate }))
    .then(res => res)
}

function getCoVisitList(userId, page, pageSize) {
  return fetchApi('assistanceVisit/assistanceVisitList?' + utils.encodeParams({ page, pageSize,userId}), null, 'POST')
    .then(res => res.data)
}

function editCoVisit(
  {
    startItude,
    actualEndTime, // 实际结束时间
    actualStartTime, // 实际开始时间
    assistResult, // 辅助结果
    assistanceVisitName, // 协访人
    assistanceVisitPurpose, // 协访目的(多选)
    checkUpFlag, // 检查（是否)
    checkUpResult, // 检查(结果 用逗号隔开)
    id, // 协访id
    planStartTime, // 计划开始时间
    solveAgreeTryoutFlag, // 同意试用或增加用量
    solveOrganizationMeetingFlag, // 解决问题选帮忙组织会议 同意与否
    solveProductConceptResult, // 认可产品的__观念
    solveReportFlag, // 解决问题,打报告,同意与否
    solveReportResult, // 解决问题,打报告填写的内容
    userId, // 登录用户id
    userName, // 登录用户姓名
    visitId // 拜访id号
    
  }) {
  return fetchApi('assistanceVisit/addOrUpdateAssistanceVisit?' + utils.encodeParams({
    startItude,
    actualEndTime, // 实际结束时间
    actualStartTime, // 实际开始时间
    assistResult, // 辅助结果
    assistanceVisitName, // 协访人
    assistanceVisitPurpose, // 协访目的(多选)
    checkUpFlag, // 检查（是否)
    checkUpResult, // 检查(结果 用逗号隔开)
    id, // 协访id
    planStartTime, // 计划开始时间
    solveAgreeTryoutFlag, // 同意试用或增加用量
    solveOrganizationMeetingFlag, // 解决问题选帮忙组织会议 同意与否
    solveProductConceptResult, // 认可产品的__观念
    solveReportFlag, // 解决问题,打报告,同意与否
    solveReportResult, // 解决问题,打报告填写的内容
    userId, // 登录用户id
    userName, // 登录用户姓名
    visitId // 拜访id号
  }), null, 'POST')
    .then(res => res.data)
}

function getCoVisitInfo(id) {
  return fetchApi('assistanceVisit/queryAssistanceVisit?' + utils.encodeParams({ id }), { id }, 'POST')
    .then(res => res.data)
}

module.exports = { find, login, register, decodeUserInfo, getVisitList, getClient, editVisit, getVisitInfo, getEvaluate, getCoVisitList, editCoVisit, getCoVisitInfo }
