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
        <top-search :search-config="selectConfig" class="table-main" style="text-align:right; margin-top:50px" @on-event="handleClick" />

        <!-- 表格 -->
        <oppo-table ref="table" :table-column="tableColumn" :table-attr="tableAttr" :table-button="tableButton" class="table-main" @on-event="handleClick">
          <template slot="BtnIcon" slot-scope="scope">
            <i :class="scope.row.BtnIcon" />
            <span>{{ scope.row.BtnIcon }}</span>
          </template>
          <template slot="BtnType" slot-scope="scope">
            <el-button :type="scope.row.BtnType" />
          </template>
        </oppo-table>

      </el-main>
    </el-container>

    <!-- 弹窗 -->
    <oppo-dialog v-if="dialogConfig.dialogVisible" ref="dialog" :dialog-config="dialogConfig" @on-save="handleSaveButton" />
  </el-container>
</template>

<script>
import LeftTree from './components/tree'
import RightForm from './components/form'
import OppoDialog from './components/dialog'
import TopSearch from './components/search'
import { deleteInfo, deleteBtn } from './API'
export default {
  name: 'MenuManagement',
  components: {
    LeftTree,
    RightForm,
    OppoDialog,
    TopSearch
  },
  data() {
    return {
      searchConfig: {},
      selectNode: null,
      selectData: null,
      // 表格顶部搜索区域
      selectConfig: {
        isSearch: false,
        buttons: [],
        region: 'B190611006'// 如果页面头部和表格顶部公用一个组件，为了区分按钮位置，手动发送‘表格顶部’位置代码：B190611006
      },
      // 表格列
      tableColumn: [
        {
          prop: 'BtnNo',
          label: this.$t('common.Code')
        },
        {
          prop: 'BtnName',
          label: this.$t('common.Name')
        },
        {
          prop: 'BtnIcon',
          label: this.$t('basicSettings.ICON')
        },
        {
          prop: 'BtnType',
          label: this.$t('basicSettings.ButtonColor')
        },
        {
          prop: 'Region',
          label: this.$t('common.Region'),
          formatter: function(val) {
            return {
              'B190612001': '页面头部',
              'B190611006': '表格顶部',
              'B190611007': '表格列'
            }[val]
          }
        },
        {
          prop: 'SortCode',
          label: this.$t('common.SortId')
        }
      ],
      // 表格属性
      tableAttr: {
        border: true,
        stripe: true,
        fit: true,
        height: '400px',
        url: '/Menu/QueryButtonsByMenu',
        Conditions: [{ Key: 'MenuNo', Value: '', Operator: 'Equal' }],
        isPage: false
      },
      // 表格按钮
      tableButton: {
        operateWidth: 170, // 操作列宽度
        btnShowEvent: this.BtnShowEvent,
        buttons: []
      },
      // 弹窗参数
      dialogConfig: {
        dialogVisible: false,
        title: '',
        type: '',
        MenuNo: '',
        row: null
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
        case 'BtnAdd':// 新增
          this.handleAdd()
          break
        case 'BtnUpdate':// 修改
          this.handleUpdate()
          break
        case 'BtnDelete':// 删除
          this.handleDelete()
          break
        case 'BtnSave':// 保存
          this.handleSave()
          break
        case 'BtnAddButton':// 新增按钮
          this.handleAddButton()
          break
        case 'BtnUpdateButton':// 修改按钮
          this.handleUpdateButton(params.row)
          break
        case 'BtnDeleteButton':// 删除按钮
          this.handleDeleteButton(params.row)
          break
      }
    },
    // 新增菜单
    handleAdd() {
      // 如果未选择节点，则表示添加根目录
      if (!this.selectNode) {
        this.$refs.form.formData.ParentNo = this.$refs.tree.treeData[0].MenuNo
        this.$refs.form.formData.ParentName = this.$refs.tree.treeData[0].MenuName
      } else {
        this.$refs.form.formData.ParentNo = this.selectNode.MenuNo
        this.$refs.form.formData.ParentName = this.selectNode.MenuName
      }
      this.$refs.form.formData.MenuNo = ''
      this.$refs.form.formData.MenuName = ''
      this.$refs.form.formData.EnName = ''
      this.$refs.form.formData.MenuUrl = ''
      this.$refs.form.formData.MenuIcon = ''
      this.$refs.form.formData.ActiveUrl = ''
      this.$refs.form.formData.SortCode = ''
      this.$refs.form.formData.EnabledMark = true
      this.$refs.form.formData.IsCache = true
      this.$refs.form.formData.IsBreadcrumb = true
      this.$refs.form.formData.FixedTagsView = false
      this.$refs.form.disabled = false
    },
    // 修改菜单
    handleUpdate() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode || this.selectNode.MenuNo === 'Root') {
        this.$message.warning(this.$t('basicSettings.PleaseSelectRole'))
        return
      }
      this.$refs.form.disabled = false
      this.$refs.form.formData = { ...this.selectNode }
    },
    // 删除菜单
    handleDelete() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('basicSettings.PleaseSelectRole'))
        return
      }
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(this.selectNode.MenuName), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { MenuNo: this.selectNode.MenuNo }}).then(response => {
          if (response.data.MsgStatus === 1) {
            this.$message.success(this.$t('common.DeleteSuccess'))

            // 执行初始化树形控件数据方法
            this.$refs.tree.initTree()
            this.selectNode = null
          } else {
            this.$message.success(response.data.Msg)
          }
        })
      }).catch(() => {
        this.$message.info(this.$t('common.CancelDeleted'))
      })
    },
    // 新增按钮
    handleAddButton() {
      // 首先判断是否选择了菜单
      if (!this.selectNode || this.selectNode.MenuNo === 'Root') {
        this.$message.warning(this.$t('basicSettings.PleaseSelectMenu'))
        return
      }
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.AddButton')
      this.dialogConfig.type = 'add'
      this.dialogConfig.MenuNo = this.selectNode.MenuNo
    },
    // 修改按钮
    handleUpdateButton(row) {
      this.dialogConfig.dialogVisible = true
      this.dialogConfig.title = this.$t('basicSettings.UpdateButton')
      this.dialogConfig.type = 'update'
      this.dialogConfig.row = row
      this.dialogConfig.MenuNo = this.selectNode.MenuNo
    },
    // 删除按钮
    handleDeleteButton(row) {
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(row.BtnName), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteBtn({ Data: { BtnID: row.BtnID }}).then(response => {
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
    // 保存按钮
    handleSaveButton() {
      // 刷新表格数据
      this.$refs.table.getList()
    },
    // 树形控件触发方法
    handleTree(params) {
      this.selectNode = params.selectNode
      this.selectData = params.selectData
      this.$refs.form.disabled = true
      this.$refs.form.formData = { ...params.selectNode }

      // 把选中菜单的MenuNo值传入表格参数
      this.tableAttr.Conditions = [{ Key: 'MenuNo', Value: this.selectNode.MenuNo, Operator: 'Equal' }]
      this.$refs.table.getList()

      // 重置表单校验结果
      this.$refs.form.resetForm()
    },
    // 刷新树形控件
    handleRefresh() {
      this.$refs.tree.initTree()
    },
    // 判断按钮显示
    BtnShowEvent(btnCode, row) {
      switch (btnCode) {
        case 'BtnEnable':
          if (row.EnabledMark) {
            return false
          }
          break
        case 'BtnDisable':
          if (!row.EnabledMark) {
            return false
          }
          break
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-main{
    width:90%;
    margin: 20px auto
  }
</style>
