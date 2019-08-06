<template>
  <div>
    <el-container>
      <!-- 表格顶部 -->
      <el-header>
        <form-header ref="form" @on-button="handleClick" />
      </el-header>
      <!-- 表格 -->
      <el-main>
        <oppo-table ref="table" :table-column="tableColumn" :table-attr="tableAttr" :table-button="tableButton" @on-event="handleClick" />
      </el-main>
    </el-container>
    <!-- 弹窗 -->
    <oppo-dialog v-if="dialogConfig.dialogVisible" ref="dialog" :dialog-config="dialogConfig" @on-event="handleRefresh" />
  </div>
</template>

<script>
import OppoDialog from './components/dialog'
import FormHeader from './components/form'
import { deleteInfo } from './API'
export default {
  name: 'InventorySheet',
  components: {
    OppoDialog,
    FormHeader
  },
  data() {
    return {
      // 表格列
      tableColumn: [
        {
          prop: 'Efftime',
          label: this.$t('common.AccountTime')
        },
        {
          prop: 'ChannelName',
          label: this.$t('common.RegionName')
        },
        {
          prop: 'CompanyName',
          label: this.$t('common.CompanyName')
        },
        {
          prop: 'StockName',
          label: this.$t('common.StoreName')
        },
        {
          prop: 'ProductNo',
          label: this.$t('common.GoodsId')
        },
        {
          prop: 'ProductName',
          label: this.$t('common.GoodsName')
        },
        {
          prop: 'BalancePrice',
          label: this.$t('importData.CurrentBalancePrice'),
          minWidth: 120,
          isSummary: true
        },
        {
          prop: 'BalanceCount',
          label: this.$t('importData.CurrentBalanceCount'),
          minWidth: 120,
          isSummary: true
        },
        {
          prop: 'BalanceMoney',
          label: this.$t('importData.CurrentBalanceAmount'),
          minWidth: 120,
          isSummary: true
        },
        {
          prop: 'CreateDate',
          label: this.$t('common.ImportTime')
        },
        {
          prop: 'UserName',
          label: this.$t('common.ImportUser')
        }
      ],
      // 表格属性
      tableAttr: {
        border: true,
        stripe: true,
        fit: true,
        showSummary: false,
        url: '/ImpStock/QueryList',
        Conditions: []
      },
      // 表格按钮
      tableButton: {
        operateWidth: 100, // 操作列宽度
        buttons: []
      },
      // 弹窗参数
      dialogConfig: {
        dialogVisible: false,
        title: this.$t('route.InventorySheet')
      }
    }
  },
  methods: {
    // 按钮点击事件
    handleClick(parmas) {
      switch (parmas.btnCode) {
        case 'BtnSearch':
          this.handleSearch(parmas.data)
          break
        case 'BtnImport':// 导入
          this.handleImport()
          break
        case 'BtnDelete':// 删除
          this.handleDelete(parmas.row)
          break
      }
    },
    // 查询
    handleSearch(params) {
      // Object.keys(obj),查找目标对象的所有key值并返回一个数组
      const keys = Object.keys(params)
      // 遍历key值数组，如果有值且字段名为‘商品名称’则push进新数组，类型为Like，否则为Equal
      const Conditions = keys.reduce((pre, cur) => {
        params[cur] ? pre.push({ Key: cur, Value: params[cur], Operator: cur === 'ProductName' ? 'Like' : 'Equal' }) : ''
        return pre
      }, [])

      // 把查询条件赋值给列表参数
      this.tableAttr.Conditions = Conditions

      // 执行列表数据方法
      this.$refs.table.getList()
    },
    // 导入
    handleImport() {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.companyList = this.$refs.form.companyList
    },
    // 删除
    handleDelete(row) {
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(row.StockName), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { ID: row.Id }}).then(response => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  height: 80px !important;
}
</style>
