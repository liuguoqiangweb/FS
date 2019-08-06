<template>
  <el-container>
    <!-- 顶部按钮 -->
    <el-header>
      <table-search :search-config="searchConfig" @on-event="handleClick" />
    </el-header>

    <el-container>
      <el-aside :style="{height: bodyHeight}">
        <!-- 左侧树形控件 -->
        <left-tree ref="tree" @on-event="handleTree" />
      </el-aside>

      <el-main :style="{height: bodyHeight}" style="border: 1px solid #ddd">
        <!-- 右侧表单 -->
        <right-form ref="form" @on-event="handleRefresh" />

        <!-- 搜索区域 -->
        <top-search :search-config="selectConfig" :table-column="tableColumn" class="table-main" style="text-align:right; margin-top:50px" @on-event="handleClick" @on-search="handleSearch" />

        <!-- 表格 -->
        <oppo-table ref="table" :table-column="tableColumn" :table-attr="tableAttr" :table-button="tableButton" class="table-main" @on-event="handleClick" />

      </el-main>
    </el-container>

    <!-- 穿梭框 -->
    <transfer v-if="dialogConfig.dialogVisible" ref="transfer" :dialog-config="dialogConfig" @on-save="handleSaveUser" />
  </el-container>
</template>

<script>
import LeftTree from './components/tree'
import RightForm from './components/form'
import TopSearch from './components/search'
import { deleteInfo, saveRoleUser, deleteRoleUser } from './API'
export default {
  name: 'RoleManagement',
  components: {
    LeftTree,
    RightForm,
    TopSearch
  },
  data() {
    return {
      searchConfig: {},
      selectNode: null,
      // 表格顶部搜索区域
      selectConfig: {
        isSearch: true,
        searchColumn: 'Account,Value',
        placeholder: this.$t('basicSettings.UserPlaceholder'),
        buttons: [],
        region: 'B190611006'// 如果页面头部和表格顶部公用一个组件，为了区分按钮位置，手动发送‘表格顶部’位置代码：B190611006
      },
      // 表格列
      tableColumn: [
        {
          prop: 'AreaName',
          label: this.$t('common.RegionName')
        },
        {
          prop: 'Account',
          label: this.$t('basicSettings.Telephone')
        },
        {
          prop: 'Value',
          label: this.$t('basicSettings.RealName')
        }
      ],
      // 表格属性
      tableAttr: {
        border: true,
        stripe: true,
        fit: true,
        height: '445px',
        url: '/Role/QueryUsersByRoleNo',
        Conditions: [{ Key: 'RoleNo', Value: '', Operator: 'Equal' }],
        isPage: false
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
        type: 'user',
        selectedList: []
      }
    }
  },
  computed: {
    bodyHeight() {
      return document.body.clientHeight - 84 - 36 - 30 + 'px'
    }
  },
  methods: {
    // 按钮点击事件
    handleClick(params) {
      switch (params.btnCode) {
        case 'BtnAdd':
          this.handleAdd()
          break
        case 'BtnUpdate':
          this.handleUpdate()
          break
        case 'BtnDelete':
          this.handleDelete()
          break
        case 'BtnSelectUser':
          this.handleSelect()
          break
        case 'BtnDeleteUser':
          this.handleDeleteUser(params.row)
          break
      }
    },
    // 新增
    handleAdd() {
      this.$refs.form.disabled = false
      this.$refs.form.formData = {}
      this.$refs.form.formData.IsAdd = 0
    },
    // 修改
    handleUpdate() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('basicSettings.PleaseSelectRole'))
        return
      }
      this.$refs.form.disabled = false
      this.$refs.form.formData = { ...this.selectNode }
      this.$refs.form.formData.IsAdd = 1
    },
    // 删除角色
    handleDelete() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('basicSettings.PleaseSelectRole'))
        return
      }
      // 如果该角色下有用户,则提示并return结束方法
      if (this.$refs.table.tableData.length > 0) {
        this.$message.warning(this.$t('basicSettings.RoleHasUser'))
        return
      }
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(this.selectNode.RoleName), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { RoleNo: this.selectNode.RoleNo }}).then(response => {
          if (response.data.MsgStatus === 1) {
            this.$message.success(this.$t('common.DeleteSuccess'))

            // 执行初始化树形控件数据方法
            this.$refs.tree.initTree()
            this.selectNode = null
            this.$refs.form.formData = {}
          } else {
            this.$message.success(response.data.Msg)
          }
        })
      }).catch(() => {
        this.$message.info(this.$t('common.CancelDeleted'))
      })
    },
    // 删除用户
    handleDeleteUser(row) {
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(row.Value), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteRoleUser({ Data: { User: { Key: row.Key, Value: row.Value }, Role: { RoleNo: this.selectNode.RoleNo }}}).then(response => {
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
    // 选择用户
    handleSelect() {
      // 首先判断是否选择了角色
      if (!this.selectNode) {
        this.$message.warning(this.$t('basicSettings.PleaseSelectRole'))
        return
      }
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.SelectUser')
      this.dialogConfig.selectedList = this.$refs.table.tableData
    },
    // 保存角色用户
    handleSaveUser(params) {
      saveRoleUser({ Data: { roleData: { RoleNo: this.selectNode.RoleNo }, addData: params.addDatas, removeData: params.delDatas }}).then(response => {
        if (response.data.MsgStatus === 1) {
          this.$message.success(this.$t('common.SaveSuccess'))

          // 刷新表格数据
          this.$refs.table.getList()
        } else {
          this.$message.error(response.data.Msg)
        }

        // 关闭弹窗
        this.dialogConfig.dialogVisible = false
      })
    },
    // 树形控件触发方法
    handleTree(params) {
      this.loading = true
      this.selectNode = params.selectNode
      this.$refs.form.disabled = true
      this.$refs.form.formData = { ...params.selectNode }

      // 把选中节点RoleNo值传入表格参数
      this.tableAttr.Conditions = [{ Key: 'RoleNo', Value: this.selectNode.RoleNo, Operator: 'Equal' }]
      this.$refs.table.getList()
      // 重置表单校验结果
      this.$refs.form.resetForm()
    },
    // 搜索
    handleSearch(conditions) {
      // 如果参数有值，说明是输入了搜索词再点击的查询按钮
      if (conditions[0].Value) {
        const tableData = conditions.reduce((prev, cur) => {
          // 从原数据里面查找，如果输入的搜索词存在对应Key所在的值中，则存储当前对象
          this.$refs.table.allDatas.forEach(item =>
            item[cur.Key].toUpperCase().indexOf(cur.Value.toUpperCase()) > -1 ? prev.push(item) : ''
          )
          return prev
        }, [])
        this.$refs.table.tableData = tableData
      } else {
        // 否则就是清空了搜索框，再点击查询按钮，重新获取所有数据
        this.$refs.table.getList()
      }
    },
    // 刷新树形控件
    handleRefresh() {
      this.selectNode = null
      this.$refs.tree.initTree()
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-main{
    width:83%;
    margin: 20px auto
  }
</style>
