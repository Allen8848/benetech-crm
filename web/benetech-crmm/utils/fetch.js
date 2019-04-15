/**
 * 抓取远端API的结构
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
module.exports = function (api, path, params, method = 'GET') {
  return new Promise((resolve, reject) => {
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: `${api}/${path}`,
      data: Object.assign({}, params),
      method,
      header: { 'Content-Type': 'json' },
      success: res => {
        // console.log('res.status = ',res, res.statusCode)
        if(res.statusCode !== 200){
          // wx.showToast({
          //   title: res.data.message || '请求数据失败',
          //   icon: 'none',
          //   duration: 2000
          // })
          Promise.reject(new Error('error'))
          return reject(res)
        } else {
          resolve(res.data)
        }        
      },
      fail: () => {
        console.log(arguments)
        reject(arguments)
      },
      complete() {
        wx.hideLoading()
      }
    })
  })
}
