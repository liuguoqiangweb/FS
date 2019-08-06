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
import { deleteInfo, getRegionList, getCompanyList, dataDictionary } from './API'
export default {
  name: 'StoreManagement',
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
        Conditions: [{ Value: 'B190531004', Key: 'TypeNo', Operator: 'Equal' }]// 把表格默认参数传过去
      },
      // 表格列
      tableColumn: [
        {
          prop: 'Code',
          label: this.$t('common.FinancialCode')
        },
        {
          prop: 'Name',
          label: this.$t('common.StoreName')
        },
        {
          prop: 'ChannelNo',
          label: this.$t('common.RegionName'),
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
        Conditions: [{ Value: 'B190531004', Key: 'TypeNo', Operator: 'Equal' }]
      },
      // 表格按钮
      tableButton: {
        operateWidth: 100, // 操作列宽度
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

      dataDictionary({ Data: { ParentNo: 'B190626001' }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.formatterData.categoryList = response.data.Data
        }
      })
    },
    // 按钮点击事件
    handleClick(parmas) {
      switch (parmas.btnCode) {
        case 'BtnImport':// 导入
          this.handleImport()
          break
        case 'BtnDelete':// 删除
          this.handleDelete(parmas.row)
          break
      }
    },
    // 导入
    handleImport() {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.ImportStore')
      this.dialogConfig.companyList = this.formatterData.companyList
    },
    // 删除
    handleDelete(row) {
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(row.Name), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { Id: row.Id }}).then(response => {
          if (response.data.MsgStatus === 1) {
            this.$message.success(this.$t('common.DeleteSuccess'))
            // 刷新表格数据
            this.$refs.table.getList()
          } else {
            this.$message.error(this.$t('common.DeleteFailed'))
          }
        })
      }).catch(() => {
        this.$message.info(this.$t('common.CancelDeleted'))
      })
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
