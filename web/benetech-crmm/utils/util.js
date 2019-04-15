const formatDate = (source, format) => {
  const o = {
    'M+': source.getMonth() + 1, // 月份
    'd+': source.getDate(), // 日
    'H+': source.getHours(), // 小时
    'm+': source.getMinutes(), // 分
    's+': source.getSeconds(), // 秒
    'q+': Math.floor((source.getMonth() + 3) / 3), // 季度
    'f+': source.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (source.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const set2Data = function(key, value) {
  this && this.setData && this.setData({
    [key]: value
  })
}

const inputChange = function(e) {
  let { detail: { value }, target: { dataset: { key } } } = e
  this && this.setData && this.setData({
    [key]: value
  })
}


const encodeParams = function(obj) {
  const params = []

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined' || value === null) {
      value = ''
    } else if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='))
  })

  return params.join('&')
}

module.exports = {
  formatDate: formatDate,
  set2Data,
  inputChange,
  encodeParams
}
