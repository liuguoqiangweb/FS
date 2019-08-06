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
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import LeftTree from './components/tree'
import RightForm from './components/form'
import { deleteInfo } from './API'
export default {
  name: 'FinancialSubject',
  components: {
    LeftTree,
    RightForm
  },
  data() {
    return {
      // 表格顶部搜索区域
      searchConfig: {},
      selectNode: null, // 树形控件选中节点
      selectData: null // 树形控件选中数据
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
          this.handleAdd()
          break
        case 'BtnUpdate':
          this.handleUpdate()
          break
        case 'BtnDelete':
          this.handleDelete()
          break
        case 'BtnSave':
          this.handleSave()
          break
      }
    },
    // 新增
    handleAdd() {
      // 如果未选择节点，则表示添加根目录
      if (!this.selectNode) {
        this.$refs.form.formData.ParentNo = 'Root'
        this.$refs.form.formData.ParentName = this.$t('basicSettings.RootNode')
      } else {
        this.$refs.form.formData.ParentNo = this.selectNode.AccountNo
        this.$refs.form.formData.ParentName = this.selectNode.AccountName
      }
      this.$refs.form.disabled = false
      this.$refs.form.visibled = false
      this.$refs.form.formData.IsAdd = 0
      this.$refs.form.formData.CategoryNo = ''
      this.$refs.form.formData.AccountNo = ''
      this.$refs.form.formData.AccountName = ''
    },
    // 修改
    handleUpdate() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('common.PleaseSelectNode'))
        return
      }
      this.$refs.form.disabled = false
      this.$refs.form.visibled = true
      this.$refs.form.formData.IsAdd = 1
      this.$refs.form.formData = { ...this.selectNode }
      this.$refs.form.formData.ParentName = JSON.parse(JSON.stringify(this.$t('basicSettings.RootNode')))
    },
    // 删除
    handleDelete() {
      // 如果未选择节点，则提示并return结束方法
      if (!this.selectNode) {
        this.$message.warning(this.$t('common.PleaseSelectNode'))
        return
      }
      // 如果选中的是根节点，不允许修改、删除
      if (this.selectNode.ParentNo === 'Root') {
        this.$message.warning(this.$t('common.IsRootNode'))
        return
      }
      // MessageBox弹框，询问是否进行删除操作
      // 用法详见：https://element.eleme.cn/2.7/#/zh-CN/component/message-box
      this.$confirm(this.$t('common.DeleteFormat').formatI18n(this.selectNode.AccountName), this.$t('common.Prompt'), {
        confirmButtonText: this.$t('buttons.BtnDefine'),
        cancelButtonText: this.$t('buttons.BtnCancel'),
        type: 'warning'
      }).then(() => {
        deleteInfo({ Data: { AccountNo: this.selectNode.AccountNo }}).then(response => {
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
    handleTree(params) {
      // 重置表单校验结果
      this.$refs.form.resetForm()

      this.selectNode = params.selectNode
      this.selectData = params.selectData
      this.$refs.form.selectData = this.selectData
      this.$refs.form.disabled = true
      this.$refs.form.visibled = true
      this.$refs.form.formData = { ...params.selectNode }
      this.$refs.form.formData.ParentName = params.selectNode.ParentNo === 'Root' ? this.$t('basicSettings.RootNode') : params.selectData.parent.data.AccountName
    },
    // 刷新树形控件
    handleRefresh() {
      this.selectNode = null
      this.$refs.tree.initTree()
    }
  }
}
</script>
