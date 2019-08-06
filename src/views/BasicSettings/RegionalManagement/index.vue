<template>
  <el-container>
    <!-- 顶部按钮 -->
    <el-header>
      <table-search :search-config="searchConfig" @on-event="handleClick" />
    </el-header>
    <el-container>
      <el-aside :style="{height: bodyHeight}">
        <!-- 左侧树形控件 -->
        <left-tree ref="tree" @on-event="handleEvent" />
      </el-aside>

      <el-main :style="{height: bodyHeight}" style="border: 1px solid #ddd">
        <!-- 右侧表单 -->
        <right-form ref="form" @on-event="handleRefresh" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftTree from './components/tree'
import RightForm from './components/form'
import { deleteInfo } from './API'
export default {
  name: 'RegionalManagement',
  components: {
    LeftTree,
    RightForm
  },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {},
      selectNode: null,
      selectData: null
    }
  },
  computed: {
    bodyHeight() {
      return document.body.clientHeight - 84 - 36 - 30 + 'px'
    }
  },
  methods: {
    // 按钮点击事件
    handleClick(parmas) {
      switch (parmas.btnCode) {
        case 'BtnAdd':
          this.handleAddUpdate('add')
          break
        case 'BtnUpdate':
          this.handleAddUpdate('update')
          break
        case 'BtnDelete':
          this.handleDelete()
          break
        case 'BtnSave':
          this.handleSave()
          break
      }
    },
    // 新增、修改
    handleAddUpdate(status) {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('common.PleaseSelectNode'))
        return
      }
      // 通过参数判断是新增还是修改，做相应的赋值
      if (status === 'add') {
        this.$refs.form.formData.isAdd = 0
        this.$refs.form.formData.ParentCode = this.selectNode.Code
        this.$refs.form.formData.ParentName = this.selectNode.Name
        this.$refs.form.formData.Code = ''
        this.$refs.form.formData.Name = ''
        this.$refs.form.formData.SortCode = 0
        this.$refs.form.disabled = false
      } else if (status === 'update') {
        this.$refs.form.formData = { ...this.selectNode }
        this.$refs.form.formData.isAdd = 1
        this.$refs.form.formData.ParentName = this.selectData.parent.data.Name
        this.$refs.form.disabled = false
      }
    },
    // 删除
    handleDelete() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('common.PleaseSelectNode'))
        return
      }
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(this.selectNode.Name), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { Code: this.selectNode.Code }}).then(response => {
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
    handleEvent(params) {
      this.selectNode = params.selectNode
      this.selectData = params.selectData
      this.$refs.form.disabled = true
      this.$refs.form.formData = { ...params.selectNode }
      this.$refs.form.formData.ParentName = params.selectData.parent.data.Name
      // 重置表单校验结果
      this.$refs.form.resetForm()
    },
    // 刷新树形控件
    handleRefresh() {
      // 清空选中节点数据
      this.selectNode = null
      this.$refs.tree.initTree()
    }
  }
}
</script>
