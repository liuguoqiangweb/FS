<template>
  <el-container>
    <!-- 表格顶部 -->
    <el-header>
      <table-search :search-config="searchConfig" :table-column="tableColumn" @on-event="handleClick" @on-search="handleSearch" />
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
import { deleteInfo } from './API'
export default {
  name: 'SeriesManagement',
  components: {
    OppoDialog
  },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {
        Code: 'CategoryNo',
        Name: 'CategoryName',
        Conditions: []// 把表格默认参数传过去
      },
      // 表格列
      tableColumn: [
        {
          prop: 'CategoryNo',
          label: this.$t('common.Code')
        },
        {
          prop: 'CategoryName',
          label: this.$t('common.SeriesName')
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
        url: '/ProductCategory/QueryList',
        Conditions: []
      },
      // 表格按钮
      tableButton: {
        operateWidth: 200, // 操作列宽度
        buttons: []
      },
      // 弹窗参数
      dialogConfig: {
        dialogVisible: false,
        title: '',
        type: '',
        row: {}
      },
      // 编码转名称集合
      formatterData: {
        userList: this.$store.state.common.userList || JSON.parse(localStorage.getItem('FsUserList'))
      }
    }
  },
  methods: {
    // 按钮点击事件
    handleClick(parmas) {
      switch (parmas.btnCode) {
        case 'BtnAdd':// 新增
          this.handleAdd()
          break
        case 'BtnUpdate':// 修改
          this.handleUpdate(parmas.row)
          break
        case 'BtnDelete':// 删除
          this.handleDelete(parmas.row)
          break
      }
    },
    // 新增
    handleAdd() {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.AddSeries')
      this.dialogConfig.type = 'add'
    },
    // 修改
    handleUpdate(row) {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.UpdateSeries')
      this.dialogConfig.row = row
      this.dialogConfig.type = 'update'
    },
    // 删除
    handleDelete(row) {
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(row.CategoryName), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { CategoryNo: row.CategoryNo }}).then(response => {
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
