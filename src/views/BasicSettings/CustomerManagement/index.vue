<template>
  <el-container>
    <!-- 表格顶部 -->
    <el-header>
      <table-search :search-config="searchConfig" :table-column="tableColumn" :formatter-data="formatterData" @on-event="handleClick" @on-search="handleSearch" />
    </el-header>
    <!-- 表格 -->
    <el-main>
      <oppo-table ref="table" :table-column="tableColumn" :table-attr="tableAttr" :table-button="tableButton" :formatter-data="formatterData" @on-event="handleClick" />
    </el-main>

    <!-- 弹窗 -->
    <oppo-dialog v-if="dialogConfig.dialogVisible" ref="dialog" :dialog-config="dialogConfig" @on-event="handleRefresh" />
  </el-container>
</template>

<script>
import OppoDialog from './components/dialog'
import { getRegionList, getCompanyList, dataDictionary } from './API'
export default {
  name: 'CustomerManagement',
  components: {
    OppoDialog
  },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {
        Code: 'Code',
        Name: 'Name',
        ChannelNo: 'ChannelNo',
        CompanyNo: 'CompanyNo',
        Category: 'CategoryNo',
        Conditions: [{ Value: 'B190531003', Key: 'TypeNo', Operator: 'Equal' }]// 把表格默认参数传过去
      },
      // 表格列
      tableColumn: [
        {
          prop: 'Code',
          label: this.$t('common.FinancialCode')
        },
        {
          prop: 'Name',
          label: this.$t('common.CustomName')
        },
        {
          prop: 'ChannelNo',
          label: this.$t('common.BelongArea'),
          key: 'regionList' // 编码转名称，必带
        },
        {
          prop: 'CompanyNo',
          label: this.$t('common.BelongCompany'),
          key: 'companyList' // 编码转名称，必带
        },
        {
          prop: 'CategoryNo',
          label: this.$t('common.Category'),
          key: 'categoryList' // 编码转名称，必带
        },
        {
          prop: 'CreateTime',
          label: this.$t('common.CreateTime')
        },
        {
          prop: 'CreateUser',
          label: this.$t('common.CreateUser'),
          key: 'userList' // 编码转名称，必带
        }
      ],
      // 表格属性
      tableAttr: {
        border: true,
        stripe: true,
        fit: true,
        url: '/BaseData/QueryList',
        Conditions: [{ Value: 'B190531003', Key: 'TypeNo', Operator: 'Equal' }]
      },
      // 表格按钮
      tableButton: {
        operateWidth: 0, // 操作列宽度
        buttons: []
      },
      // 弹窗参数
      dialogConfig: {
        dialogVisible: false,
        title: ''
      },
      // 编码转名称集合
      formatterData: {
        regionList: null,
        companyList: null,
        categoryList: null,
        userList: this.$store.state.common.userList || JSON.parse(localStorage.getItem('FsUserList'))
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getRegionList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.formatterData.regionList = response.data.Data
        }
      })

      getCompanyList({ Data: {}}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.formatterData.companyList = response.data.Data
        }
      })

      dataDictionary({ Data: { ParentNo: 'B190611002' }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.formatterData.categoryList = response.data.Data
        }
      })
    },
    // 按钮点击事件
    handleClick(params) {
      switch (params.btnCode) {
        case 'BtnImport':// 导入
          this.handleImport()
          break
      }
    },
    // 导入
    handleImport() {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.ImportCustom')
      this.dialogConfig.companyList = this.formatterData.companyList
    },
    // 刷新表格
    handleRefresh() {
      this.$refs.table.getList()
    },
    // 查询
    handleSearch(conditions) {
      this.tableAttr.Conditions = conditions
      this.$refs.table.getList()
    }
  }
}
</script>
