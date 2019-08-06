import Vue from 'vue'
import md5 from 'js-md5'
import CryptoJS from 'crypto-js'

// 自定义国际化插值
// eslint-disable-next-line no-extend-native
String.prototype.formatI18n = function(args) {
  var result = this
  if (arguments.length > 0) {
    if (arguments.length === 1 && typeof (args) === 'object') {
      for (var key in args) {
        if (args[key] !== undefined) {
          const reg = new RegExp('({' + key + '})', 'g')
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) {
          const reg = new RegExp('({)' + i + '(})', 'g')
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}

// 移除对象
Vue.prototype.removeObj = function(datas, val) {
  const index = datas.indexOf(val)
  if (index > -1) {
    datas.splice(index, 1)
  }
}

/**
 * 格式化时间
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 获取url参数
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

// MD5加密
export function paramsMd5(obj) {
  const newArr = Object.keys(obj)
  newArr.sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : -1)
  var md5Str = ''
  for (const i in newArr) {
    if (newArr.hasOwnProperty(i)) {
      var ks = newArr[i]
      md5Str += ('&' + ks + '_' + obj[ks])
    }
  }
  return md5(md5Str.substring(1))
}

// AES加密
export function encrypt(word, keyStr) {
  keyStr = keyStr || 'hnoppo1820'
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrpyted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrpyted.toString()
}

// AES解密
export function decrypt(word, keyStr) {
  keyStr = keyStr || 'hnoppo1820'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

/**
 * 函数防抖
 * @param {*} func 传入的函数
 * @param {*} wait 防止传入函数重复触发的时间间距
 * @param {*} immediate 是否立即触发
 */
export function debounce(func, wait, immediate) {
  let timeout

  return function() {
    const context = this
    const args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * 函数节流
 * @param {*} func 传入的函数
 * @param {*} wait 函数触发的时间间距
 */
export function throttle(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
