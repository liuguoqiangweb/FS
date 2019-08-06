import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementCnLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from './en'
import cnLocale from './cn'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  cn: {
    ...cnLocale,
    ...elementCnLocale
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'cn',
  messages
})

export default i18n
