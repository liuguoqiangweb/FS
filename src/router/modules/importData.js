import Layout from '@/layout'

// 数据导入模块路由
const importDataRouter = {
  path: '/importData',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ImportData',
  meta: {
    title: 'ImportData',
    icon: 'nested'
  },
  children: [
    {
      // 销售毛利汇总表导入
      path: '/SalesGrossProfitSummary',
      component: () => import('@/views/ImportData/SalesGrossProfitSummary/index'),
      name: 'SalesGrossProfitSummary'
    },
    {
      // 库存表导入
      path: '/InventorySheet',
      component: () => import('@/views/ImportData/InventorySheet/index'),
      name: 'InventorySheet'
    },
    {
      // 科目余额表导入
      path: '/AccountBalanceSheet',
      component: () => import('@/views/ImportData/AccountBalanceSheet/index'),
      name: 'AccountBalanceSheet'
    }
  ]
}

export default importDataRouter
