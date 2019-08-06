import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getUserInfo, getSecretKey } from '@/utils/auth'
import defaultSettings from '@/settings'
import { paramsMd5 } from '@/utils/extend'

// 创建axios实例
const service = axios.create({
  baseURL: defaultSettings.url + process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 60000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    /*
    // 请求之前操作
    if (store.getters.token) {
      // 如果有token，则每次请求带上令牌
      // ['X-Token'] is a custom headers key
      config.headers['Token'] = getToken()
    } */
    const RequestTime = new Date().getTime()
    const Token = getToken() === undefined ? 'OPPOTEST' : getToken()
    const UserNo = getUserInfo() === undefined ? 'admin' : JSON.parse(getUserInfo()).UserNo
    const SystemNo = 'OPPOFinanceSystem'
    const SignTag = getSecretKey() === undefined ? 'OPPOFinanceSystem' : getSecretKey()

    config.data.RequestTime = RequestTime
    config.data.Token = Token
    config.data.UserNo = UserNo
    config.data.SystemNo = SystemNo
    let signObj = {}
    if (config.url === '/User/Login') {
      signObj = { RequestTime: RequestTime, Token: Token, UserNo: UserNo, SystemNo: SystemNo, SignTag: SignTag }
    } else {
      const Hash = JSON.stringify(config.data.Data) === '{}' ? '1' : JSON.stringify(config.data.Data)
      signObj = { RequestTime: RequestTime, Token: Token, UserNo: UserNo, SystemNo: SystemNo, SignTag: SignTag, Hash: Hash }
    }
    config.data.Sign = paramsMd5(signObj)
    config.data.IsMobileLogin = false
    return config
  },
  error => {
    // 错误操作
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 如果返回码不是200，则判断为错误
    if (response.status !== 200) {
      Message({
        message: response.statusText || 'error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法令牌; 50012: 其他客户登录; 50014: 令牌已过期;
      if (response.code === 50008 || response.code === 50012 || response.code === 50014) {
        // 提示：您已退出，可以取消此页面或者重新登录
        MessageBox.confirm(this.$t('common.LogoutMessage'), this.$t('buttons.BtnLogout'), {
          confirmButtonText: this.$t('buttons.BtnReLogin'),
          cancelButtonText: this.$t('buttons.BtnCancel'),
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(response.statusText || 'error')
    } else {
      return response
    }
  },
  error => {
    const errorMsg = error.response === undefined ? error.message : error.response.data.Message
    if (errorMsg.indexOf('timeout') > -1) {
      Message({
        message: '请求超时，请稍候再试！',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (errorMsg.indexOf('Network Error') > -1) {
      MessageBox.alert('向服务器发起请求时出错，请检查网络或者联系管理员检查服务器运行状况！！', '提示', {
        confirmButtonText: '退出登录',
        type: 'error'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (errorMsg.indexOf('其它地方登陆') > -1) {
      MessageBox.alert('您的账号在其它地方登录，若不是本人操作，请注意账号安全！', '提示', {
        confirmButtonText: '重新登录',
        type: 'error'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else if (errorMsg.indexOf('登录超时') > -1 || errorMsg.indexOf('非法请求')) {
      MessageBox.alert('登录超时，请重新登录！', '提示', {
        confirmButtonText: '重新登录',
        type: 'error'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    } else {
      Message({
        message: errorMsg,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
