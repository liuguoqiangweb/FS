import { login, logout } from '@/views/login/API'
import { getToken, setToken, removeToken, setUserInfo, removeUserInfo, setSecretKey } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { UserName, Password, DynamicPassword } = userInfo
    return new Promise((resolve, reject) => {
      login({ Data: { UserName: UserName.trim(), Password: Password, DynamicPassword: DynamicPassword }}).then(response => {
        if (response.data.MsgStatus === 1) {
          // 存Token到Cookies、Vuex
          commit('SET_TOKEN', response.data.Data.Token)
          setToken(response.data.Data.Token)

          // 存UserName、UserNo到Cookies、Vuex
          commit('SET_USER_INFO', { UserNo: response.data.Data.UserNo, UserName: UserName, RealName: response.data.Data.UserName, FirstLogin: Password === '1234567a' })
          setUserInfo({ UserNo: response.data.Data.UserNo, UserName: UserName, RealName: response.data.Data.UserName, FirstLogin: Password === '1234567a' })

          // 存秘钥到Cookies
          setSecretKey(response.data.Data.SignTag)
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ Data: { UserNo: state.UserNo }}).then(() => {
        // 清除Vuex、Cookies数据
        commit('SET_TOKEN', '')
        commit('SET_USER_INFO', {})
        removeToken()
        removeUserInfo()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', {})
      removeToken()
      removeUserInfo()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
