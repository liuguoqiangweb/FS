import Layout from '@/layout'

// 基础设置路由模块
const basicSettingsRouter = {
  path: '/basicSettings',
  component: Layout,
  redirect: 'noRedirect',
  name: 'BasicSettings',
  meta: {
    title: 'BasicSettings',
    icon: 'example'
  },
  children: [
    {
      // 公司管理
      path: '/CompanyManagement',
      component: () => import('@/views/BasicSettings/CompanyManagement/index'),
      name: 'CompanyManagement'
    },
    {
      // 用户管理
      path: '/UserManagement',
      component: () => import('@/views/BasicSettings/UserManagement/index'),
      name: 'UserManagement'
    },
    {
      // 角色管理
      path: '/RoleManagement',
      component: () => import('@/views/BasicSettings/RoleManagement/index'),
      name: 'RoleManagement'
    },
    {
      // 功能授权
      path: '/FunctionalAuthority',
      component: () => import('@/views/BasicSettings/FunctionalAuthority/index'),
      name: 'FunctionalAuthority'
    },
    {
      // 数据权限设置
      path: '/DataPermission',
      component: () => import('@/views/BasicSettings/DataPermission/index'),
      name: 'DataPermission'
    },
    {
      // 客户管理
      path: '/CustomerManagement',
      component: () => import('@/views/BasicSettings/CustomerManagement/index'),
      name: 'CustomerManagement'
    },
    {
      // 仓库管理
      path: '/StoreManagement',
      component: () => import('@/views/BasicSettings/StoreManagement/index'),
      name: 'StoreManagement'
    },
    {
      // 部门管理
      path: '/DeptManagement',
      component: () => import('@/views/BasicSettings/DeptManagement/index'),
      name: 'DeptManagement'
    },
    {
      // 地区管理
      path: '/RegionalManagement',
      component: () => import('@/views/BasicSettings/RegionalManagement/index'),
      name: 'RegionalManagement'
    },
    {
      // 系列管理
      path: '/SeriesManagement',
      component: () => import('@/views/BasicSettings/SeriesManagement/index'),
      name: 'SeriesManagement'
    },
    {
      // 商品管理
      path: '/GoodsManagement',
      component: () => import('@/views/BasicSettings/GoodsManagement/index'),
      name: 'GoodsManagement'
    },
    {
      // 财务科目
      path: '/FinancialSubject',
      component: () => import('@/views/BasicSettings/FinancialSubject/index'),
      name: 'FinancialSubject'
    },
    {
      // 数据字典
      path: '/DataDictionary',
      component: () => import('@/views/BasicSettings/DataDictionary/index'),
      name: 'DataDictionary'
    },
    {
      // 菜单管理
      path: '/MenuManagement',
      component: () => import('@/views/BasicSettings/MenuManagement/index'),
      name: 'MenuManagement'
    }
  ]
}

export default basicSettingsRouter
