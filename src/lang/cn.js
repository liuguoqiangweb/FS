export default {
  settings: {
    Title: '财务数据分析系统'
  },
  // 路由
  route: {
    Dashboard: '首页',
    BasicSettings: '基础设置',
    CompanyManagement: '公司管理',
    UserManagement: '用户管理',
    RoleManagement: '角色管理',
    FunctionalAuthority: '功能授权',
    DataPermission: '数据权限设置',
    CustomerManagement: '客户管理',
    StoreManagement: '仓库管理',
    DeptManagement: '部门管理',
    RegionalManagement: '地区管理',
    GoodsManagement: '商品管理',
    FinancialSubject: '财务科目',
    DataDictionary: '数据字典',
    ImportData: '数据导入',
    SalesGrossProfitSummary: '销售毛利汇总表导入',
    InventorySheet: '库存表导入',
    AccountBalanceSheet: '科目余额表导入',
    DataAccounting: '数据核算',
    ReportAnalysis: '报表分析',
    BalanceSheet: '资产负债表',
    DeptIncomeStatement: '部门损益表',
    SeriesManagement: '系列管理',
    MenuManagement: '菜单管理',
    ProfitLossSheet: '损益表',
    CostAnalysisSheet: '费用分析表',
    CapitalOccupationSheet: '资金占用表',
    OtherBusinessInCome: '其他业务收支表',
    CoreCostIndicatorsSheet: '核心费用指标表',
    DeptExpensesSheet: '部门费用表',
    SalesGrossProfitSheet: '销售毛利表',
    InventoryAnalysisSheet: '库存分析表',
    ScaleAnalysisSheet: '比例分析表',
    BudgetFollowUpSheet: '预算跟进表',
    ProfitAnalysisSheet: '利润分析表',
    UnsalableAnalysisSheet: '滞销机分析表'
  },
  // 通用
  common: {
    PleaseSelect: '请选择',
    PleaseInput: '请输入',
    RegionName: '地区名称',
    CompanyName: '公司名称',
    Operation: '操作',
    NotData: '暂无数据',
    AccountTime: '会计期间',
    GoodsId: '商品编码',
    GoodsName: '商品名称',
    ImportTime: '导入时间',
    ImportUser: '导入人',
    SearchMenu: '菜单检索',
    SwitchLanguage: '选择语言',
    GlobalSize: '全局尺寸',
    Status: '状态',
    LogoutMessage: '您已退出，可以取消此页面或者重新登录！',
    Code: '编码',
    ParentCode: '上级编码',
    ParentName: '上级名称',
    AutoGenerate: '自动生成',
    AutoGet: '自动获取',
    InputFilterKeyword: '输入关键字进行过滤',
    PleaseSelectNode: '请选择节点！',
    SortId: '排序',
    SaveSuccess: '保存成功',
    DeleteSuccess: '删除成功',
    DeleteFailed: '删除失败',
    UpdateSuccess: '修改成功',
    ResetSuccess: '重置成功',
    ModifyPassword: '修改密码',
    LoginFailed: '登录失败，账号或者密码错误！',
    UnlockSuccess: '解锁成功',
    UpdateFailed: '修改失败,旧密码错误！',
    ReUpdateSuccess: '修改成功，请重新登录',
    Name: '名称',
    Description: '描述',
    MustInputNodeName: '请输入节点名称',
    NotNull: '不能为空',
    IsRootNode: '根节点不允许修改/删除',
    BelongArea: '所属地区',
    CreateTime: '创建时间',
    CreateUser: '创建人',
    DeleteFormat: '此操作将删除【{0}】，是否继续？',
    Prompt: '提示',
    CancelDeleted: '已取消删除',
    CustomName: '客户名称',
    BelongCompany: '所属公司',
    UploadTip: '只能上传.xls/.xlsx文件(<em>仅一个</em>)，且不超过20MB',
    UploadText: '将文件拖到此处，或<em>点击上传</em>',
    StoreName: '仓库名称',
    ImportSuccess: '导入成功',
    ImportFailed: '导入失败',
    SwitchSizeSuccess: '设置尺寸成功',
    SelectUploadFile: '请选择需要导入的文件！',
    DepartmentName: '部门名称',
    SeriesCode: '系列编码',
    SeriesName: '系列名称',
    ParentSubject: '上级科目',
    Category: '类别',
    FinancialCode: '财务代码',
    SelectDate: '选择日期',
    SelectLeftData: '未选数据',
    SelectRightData: '已选数据',
    FinancialSubject: '科目名称',
    Region: '区域',
    Store: '仓库',
    ReLogin: '重新登录'
  },
  // 按钮
  buttons: {
    BtnLogin: '登录',
    BtnSearch: '查询',
    BtnAdd: '新增',
    BtnExport: '导出',
    BtnImport: '导入',
    BtnDelete: '删除',
    BtnUpdate: '修改',
    BtnSave: '保存',
    BtnCancel: '取消',
    BtnConfirm: '确认',
    BtnEnable: '启用',
    BtnDisable: '停用',
    BtnReset: '重置密码',
    BtnUnlock: '解锁',
    BtnLogout: '退出登录',
    BtnReLogin: '重新登录',
    BtnPassword: '修改密码',
    BtnDefine: '确定',
    BtnSelectUser: '选择用户',
    BtnAddButton: '添加按钮',
    BtnRefresh: '刷新',
    BtnClose: '关闭',
    BtnCloseOthers: '关闭其他',
    BtnCloseAll: '关闭所有',
    BtnDeleteUser: '删除',
    BtnUpdateButton: '修改',
    BtnDeleteButton: '删除',
    BtnDownload: '模板下载'
  },
  // 基础设置
  basicSettings: {
    UserPlaceholder: '搜索姓名、联系方式',
    UserName: '登录账号',
    Telephone: '联系方式',
    RealName: '用户姓名',
    AddUser: '新增用户',
    UpdateUser: '修改用户信息',
    UserEnable: '可正常使用',
    UserDisable: '账号已停用',
    UserUnlock: '账号已被锁',
    UserNameFormat: '请输入姓名首字母+身份证后8位',
    TelephoneFormat: '请输入11位手机号码',
    RealNameFormat: '请输入用户姓名',
    PleaseSelectRegion: '请选择地区',
    ResetPassword: '重置密码',
    PleaseInputPassword: '请输入密码',
    InputOldPassword: '请输入旧密码',
    InputNewPassword: '请输入新密码',
    InputPasswordAgain: '请再次输入新密码',
    OldPassword: '旧密码',
    NewPassword: '新密码',
    NewPassword2: '再次输入新密码',
    AddCompany: '新增公司',
    UpdateCompany: '修改公司',
    CompanyPlaceholder: '搜索公司名称，所属地区',
    ImportCustom: '导入客户资料',
    AddSeries: '新增系列',
    UpdateSeries: '修改系列',
    SeriesPlaceholder: '搜索编码、系列名称',
    SubjectName: '科目名称',
    SubjectCategory: '科目类别',
    RootNode: '根节点',
    ImportDepartment: '导入部门资料',
    ImportStore: '导入仓库资料',
    GoodsCategory: '商品系列',
    SlowSalesTime: '滞销时间',
    RoleName: '角色名称',
    SelectUser: '选择用户',
    PleaseSelectRole: '请先选择角色',
    AddGoods: '新增商品',
    UpdateGoods: '修改商品信息',
    ReParentNo: '编码不能与上级编码相同',
    ReRegionName: '此地区已存在，请重新输入',
    ReCompanyCode: '此编码已存在，请重新输入',
    ChineseName: '中文名称',
    EnglishName: '英文名称',
    URL: '路由地址',
    IsCache: '是否缓存',
    IsHidden: '是否显示',
    ICON: '图标',
    ActiveMenu: '菜单绑定',
    Breadcrumb: '面包屑导航',
    FixedTagsView: '标签栏固定',
    RootMenu: '根菜单',
    AddButton: '新增按钮',
    UpdateButton: '修改按钮',
    BortherNodeNo: '此编码在同级节点已存在',
    PleaseSelectMenu: '请先选择菜单',
    PleaseSelectUser: '请先选择用户',
    SelectRegionFilter: '选择地区过滤',
    SelectRole: '选择角色',
    PermissionSettings: '权限设置',
    RoleHasUser: '该角色下有用户，禁止删除',
    ButtonType: '类型',
    ButtonColor: '颜色',
    CustomerPlaceholder: '搜索地区、客户、所属公司',
    StorePlaceholder: '搜索地区、仓库、所属公司',
    DeptPlaceholder: '搜索地区、部门、所属公司',
    GoodsPlaceholder: '搜索系列、名称、状态',
    PleaseInputUserName: '请输入用户名',
    PleaseInputVerifyCode: '请输入手机验证码',
    SendCode: '发送验证码',
    CountdownSecond: '{0}后重新发送',
    FirstLoginTip: '请修改初始密码！',
    PasswordAgainError: '两次密码输入不一致，请重新输入',
    InputNewPasswordReg: '请输入8-18位包含数字、字母、特殊符号的密码'
  },
  // 数据导入
  importData: {
    SaleAmount: '销售数量',
    SalePrice: '销售单价',
    SaleIncome: '销售收入',
    OutAmount: '出库数量',
    UnitCost: '单位成本',
    SaleCost: '销售成本',
    SaleProfit: '销售毛利',
    SaleProfitPercent: '销售毛利率',
    AccountCode: '科目代码',
    SubjectName: '科目名称',
    Name: '名称',
    EndingDebitBalance: '期末借方余额',
    FinalCreditBalance: '期末贷方余额',
    EndingBalance: '期末余额',
    CurrentBalanceUnit: '本期结存单位',
    CurrentBalancePrice: '本期结存单价',
    CurrentBalanceCount: '本期结存数量',
    CurrentBalanceAmount: '本期结存金额',
    ProjectCode: '项目代码',
    ProjectName: '项目名称'
  },
  // 报表分析
  reportAnalysis: {
    AccountingDate: '会计期间',
    PleaseSearchExcel: '请先查询数据再导出',
    FiscalYear: '财年'
  },
  SearchName: {
    CompanyManagement: '公司名称',
    UserManagement: '用户姓名',
    CustomerManagement: '代码/名称',
    StoreManagement: '代码/名称',
    DeptManagement: '代码/名称',
    SeriesManagement: '系列名称',
    GoodsManagement: '商品名称'
  }
}