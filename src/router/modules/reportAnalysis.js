import Layout from '@/layout'

// 报表分析模块路由
const reportAnalysisRouter = {
  path: '/reportAnalysis',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ReportAnalysis',
  meta: {
    title: 'ReportAnalysis',
    icon: 'table'
  },
  children: [
    {
      // 资产负债表
      path: '/BalanceSheet',
      component: () => import('@/views/ReportAnalysis/BalanceSheet/index'),
      name: 'BalanceSheet'
    },
    {
      // 部门损益表
      path: '/DeptIncomeStatement',
      component: () => import('@/views/ReportAnalysis/DeptIncomeStatement/index'),
      name: 'DeptIncomeStatement'
    },
    {
      // 损益表
      path: '/ProfitLossSheet',
      component: () => import('@/views/ReportAnalysis/ProfitLossSheet/index'),
      name: 'ProfitLossSheet'
    },
    {
      // 费用分析表
      path: '/CostAnalysisSheet',
      component: () => import('@/views/ReportAnalysis/CostAnalysisSheet/index'),
      name: 'CostAnalysisSheet'
    },
    {
      // 资金占用表
      path: '/CapitalOccupationSheet',
      component: () => import('@/views/ReportAnalysis/CapitalOccupationSheet/index'),
      name: 'CapitalOccupationSheet'
    },
    {
      // 其他业务收支表
      path: '/OtherBusinessInCome',
      component: () => import('@/views/ReportAnalysis/OtherBusinessInCome/index'),
      name: 'OtherBusinessInCome'
    },
    {
      // 核心费用指标表
      path: '/CoreCostIndicatorsSheet',
      component: () => import('@/views/ReportAnalysis/CoreCostIndicatorsSheet/index'),
      name: 'CoreCostIndicatorsSheet'
    },
    {
      // 部门费用表
      path: '/DeptExpensesSheet',
      component: () => import('@/views/ReportAnalysis/DeptExpensesSheet/index'),
      name: 'DeptExpensesSheet'
    },
    {
      // 销售毛利表
      path: '/SalesGrossProfitSheet',
      component: () => import('@/views/ReportAnalysis/SalesGrossProfitSheet/index'),
      name: 'SalesGrossProfitSheet'
    },
    {
      // 库存分析表
      path: '/InventoryAnalysisSheet',
      component: () => import('@/views/ReportAnalysis/InventoryAnalysisSheet/index'),
      name: 'InventoryAnalysisSheet'
    },
    {
      // 比例分析表
      path: '/ScaleAnalysisSheet',
      component: () => import('@/views/ReportAnalysis/ScaleAnalysisSheet/index'),
      name: 'ScaleAnalysisSheet'
    },
    {
      // 预算跟进表
      path: '/BudgetFollowUpSheet',
      component: () => import('@/views/ReportAnalysis/BudgetFollowUpSheet/index'),
      name: 'BudgetFollowUpSheet'
    },
    {
      // 利润分析表
      path: '/ProfitAnalysisSheet',
      component: () => import('@/views/ReportAnalysis/ProfitAnalysisSheet/index'),
      name: 'ProfitAnalysisSheet'
    },
    {
      // 滞销机分析表
      path: '/UnsalableAnalysisSheet',
      component: () => import('@/views/ReportAnalysis/UnsalableAnalysisSheet/index'),
      name: 'UnsalableAnalysisSheet'
    }
  ]
}

export default reportAnalysisRouter
