<template>
  <div>
    <el-container>
      <!-- 表格顶部 -->
      <el-header>
        <table-search :search-config="searchConfig" :table-column="tableColumn" :formatter-data="formatterData" @on-event="handleClick" @on-search="handleSearch" />
      </el-header>
      <!-- 表格 -->
      <el-main>
        <oppo-table ref="table" :table-column="tableColumn" :table-attr="tableAttr" :table-button="tableButton" :formatter-data="formatterData" @on-event="handleClick" />
      </el-main>
    </el-container>
    <!-- 弹窗 -->
    <oppo-dialog v-if="dialogConfig.dialogVisible" ref="dialog" :dialog-config="dialogConfig" @on-event="handleRefresh" />
  </div>
</template>

<script>
import OppoDialog from './components/dialog'
// 引入封装好的请求
import { changeUserStatus, deleteUser, resetPassword, unlockUser, getRegionList } from './API'
export default {
  name: 'UserManagement',
  components: { OppoDialog },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {
        Code: 'LoginAccount',
        Name: 'UserName',
        Telphone: 'TelPhone',
        ChannelNo: 'ChannelNo',
        Status: 'EnabledMark',
        Conditions: []// 把表格默认参数传过去
      },
      // 表格列
      tableColumn: [
        {
          prop: 'LoginAccount',
          label: this.$t('basicSettings.UserName')
        },
        {
          prop: 'UserName',
          label: this.$t('basicSettings.RealName')
        },
        {
          prop: 'TelPhone',
          label: this.$t('basicSettings.Telephone')
        },
        {
          prop: 'ChannelNo',
          label: this.$t('common.BelongArea'),
          key: 'regionList' // 编码转名称，必带
        },
        {
          prop: 'EnabledMark',
          label: this.$t('common.Status'),
          formatter: function(val) {
            return {
              true: '可正常使用',
              false: '账号已停用',
              2: '账号已被锁'
            }[val]
          }// 状态码转名称
        }
      ],
      // 表格属性
      tableAttr: {
        border: true,
        stripe: true,
        fit: true,
        url: '/User/QueryList',
        Conditions: []
      },
      // 表格按钮
      tableButton: {
        operateWidth: 360, // 操作列宽度
        btnShowEvent: this.BtnShowEvent,
        buttons: []
      },
      // 弹窗参数
      dialogConfig: {
        dialogVisible: false,
        title: '',
        type: '',
        row: ''
      },
      // 编码转名称集合
      formatterData: {
        statusList: [{ Key: '1', Value: '可正常使用' }, { Key: '0', Value: '账号已停用' }],
        regionList: null
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
    },
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
        case 'BtnEnable':// 启用
          this.handleChangeStatus(parmas.row)
          break
        case 'BtnDisable':// 停用
          this.handleChangeStatus(parmas.row)
          break
        case 'BtnReset':// 重置密码
          this.handleResetPassword(parmas.row)
          break
        case 'BtnUnlock':// 解锁
          this.handleUnlock(parmas.row)
          break
      }
    },
    // 新增
    handleAdd() {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.AddUser')
      this.dialogConfig.type = 'add'
      this.dialogConfig.regionList = this.formatterData.regionList
    },
    // 修改
    handleUpdate(row) {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.UpdateUser')
      this.dialogConfig.type = 'update'
      this.dialogConfig.row = row
      this.dialogConfig.regionList = this.formatterData.regionList
    },
    // 改变账号状态
    handleChangeStatus(row) {
      changeUserStatus({ Data: { EnabledMark: row.EnabledMark, UserNo: row.UserNo }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.UpdateSuccess'))
          // 刷新表格数据
          this.$refs.table.getList()
        }
      })
    },
    // 解锁账号
    handleUnlock(row) {
      unlockUser({ Data: { UserNo: row.UserNo }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.UnlockSuccess'))
          // 刷新表格数据
          this.$refs.table.getList()
        }
      })
    },
    // 删除
    handleDelete(row) {
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(row.LoginAccount), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteUser({ Data: { UserNo: row.UserNo }}).then(response => {
          if (response.data.MsgStatus === 1) {
            this.$message.success(this.$t('common.DeleteSuccess'))
            // 刷新表格数据
            this.$refs.table.getList()
          }
        })
      }).catch(() => {
        this.$message.info(this.$t('common.CancelDeleted'))
      })
    },
    // 重置密码
    handleResetPassword(row) {
      resetPassword({ Data: { UserNo: row.UserNo }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.ResetSuccess'))
          // 刷新表格数据
          this.$refs.table.getList()
        }
      })
    },
    // 刷新表格
    handleRefresh() {
      this.$refs.table.getList()
    },
    // 判断按钮显示
    BtnShowEvent(btnCode, row) {
      switch (btnCode) {
        case 'BtnEnable':
          if (row.EnabledMark) return false
          break
        case 'BtnDisable':
          if (!row.EnabledMark || row.PassErrorCount === 3) return false
          break
        case 'BtnUnlock':
          if (row.PassErrorCount !== 3) {
            return false
          } else {
            row.EnabledMark = 2
          }
          break
      }
      return true
    },
    // 查询
    handleSearch(conditions) {
      this.tableAttr.Conditions = conditions
      this.$refs.table.getList()
    }
  }
}
</script>
