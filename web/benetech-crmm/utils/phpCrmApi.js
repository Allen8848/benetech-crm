// const URI = 'https://benetech.f3322.net:9095/phpCrmApi'
const URI = 'http://172.21.200.70:8081/tp5'
  // / public / index.php / index / index / index
const fetch = require('./fetch')
const utils = require('./util.js')

function fetchApi(type, params, method) {
  return fetch(URI, type, params, method)
}

/**
 * 今日销售分析
 */

// function sendAnalyze(params) {
//   return fetchApi('public/index.php/commerce/Commerce/Until', params,'get')
//     .then(res => res)
// }

/**
 * 截止今日销售分析
 */

function Until(params) {
  return fetchApi('public/index.php/commerce/Commerce/Until', params, 'get')
    .then(res => res)
}

/**
 * 记录小程序日志
 * @param  {[String]} options.page    记录日志的页面
 * @param  {[String]} options.userId  登录人的id
 * @param  {[String]} options.method  页面的方法
 * @param  {[String]} options.wxApi   wxApi
 * @param  {[String]} options.content 日志内容
 * @return {[String]}                 [description]
 */
function addLog({
  page,
  userId,
  method,
  wxApi,
  content
}) {
  //  代码块
  console.log(this, {
    page,
    userId,
    method,
    wxApi,
    content
    })
  return fetchApi('log/create', {
    page,
    userId,
    method,
    wxApi,
    content
  }, 'POST')
    .then(res => res)
}

module.exports = {
  addLog, Until
}