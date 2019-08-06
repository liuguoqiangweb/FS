import { getToken, getUserInfo, getSecretKey } from '@/utils/auth'
import { paramsMd5 } from '@/utils/extend'

const common = {
  state: {
    // 用户下拉集合
    userList: null,
    // 菜单树集合
    menuTree: null,
    // 按钮集合
    buttons: null,
    // 请求默认参数
    defaultParams: {
      UserNo: '',
      SystemNo: 'OPPOFinanceSystem',
      Token: '',
      RequestTime: new Date().getTime(),
      Sign: '',
      SignTag: '',
      IsMobileLogin: false
    },
    // ElementUI图标集合
    elIcons: [
      'el-icon-upload',
      'el-icon-delete',
      'el-icon-search',
      'el-icon-edit',
      'el-icon-refresh',
      'el-icon-circle-plus',
      'el-icon-circle-check',
      'el-icon-download'
    ],
    // SVG图标集合
    svgIcons: [
      'bug',
      'setting',
      'chart',
      'component',
      'documentation',
      'education',
      'example',
      'excel',
      'form',
      'upload',
      'guide',
      'international',
      'list',
      'lock',
      'qq',
      'search',
      'shopping',
      'star',
      'tab',
      'table',
      'tree',
      'wechat'
    ]
  },

  mutations: {
    SET_DEFAULT_PARAMS: (state, data) => {
      const RequestTime = new Date().getTime()
      const Token = getToken() === undefined ? 'OPPOTEST' : getToken()
      const UserNo = getUserInfo() === undefined ? 'admin' : JSON.parse(getUserInfo()).UserNo
      const SignTag = getSecretKey() === undefined ? 'OPPOFinanceSystem' : getSecretKey()
      state.defaultParams.UserNo = UserNo
      state.defaultParams.Token = Token
      state.defaultParams.RequestTime = RequestTime

      let signObj = {}
      const Hash = JSON.stringify(data)
      signObj = { RequestTime: RequestTime, Token: Token, UserNo: UserNo, SystemNo: state.defaultParams.SystemNo, SignTag: SignTag, Hash: Hash }
      state.defaultParams.Sign = paramsMd5(signObj)
      state.defaultParams = Object.assign(state.defaultParams, { Data: data })
    },
    SET_BUTTONS: (state, data) => {
      state.buttons = data
    },
    SET_USER_LIST: (state, data) => {
      state.userList = data
    }
  },

  actions: {
    setDefaultParams: ({ commit }) => {
      commit('SET_DEFAULT_PARAMS')
    },
    setButtons: ({ commit }) => {
      commit('SET_BUTTONS')
    },
    setUserList: ({ commit }) => {
      commit('SET_USER_LIST')
    }
  }
}

export default common
