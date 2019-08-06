import Vue from 'vue'
import ElementUI from 'element-ui'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/element-variables.scss'
import '@/styles/index.scss' // global css
import i18n from './lang'
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import '@/utils/extend' // 扩展方法
import '@/utils/directives'

import settings from './settings'
Vue.prototype.$settings = settings

// 注册ElementUI组件库
Vue.use(ElementUI, {
  size: 'mini',
  i18n: (key, value) => i18n.t(key, value)
})

// 全局注册表格、表格顶部搜索组件、穿梭框
import Table from '@/components/Table/index'
import TableSearch from '@/components/TableSearch/index'
import Transfer from '@/components/Transfer/index'
Vue.component('oppo-table', Table)
Vue.component('table-search', TableSearch)
Vue.component('transfer', Transfer)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
