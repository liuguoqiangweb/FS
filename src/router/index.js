import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import basicSettingsRouter from './modules/basicSettings'
import importDataRouter from './modules/importData'
import reportAnalysisRouter from './modules/reportAnalysis'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },

  {
    path: '/404',
    component: () => import('@/views/404')
  },

  {
    path: '/',
    component: Layout,
    redirect: '/Dashboard',
    children: [{
      path: 'Dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  basicSettingsRouter,
  importDataRouter,
  reportAnalysisRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
